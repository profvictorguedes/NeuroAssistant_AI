import { useEffect, useMemo, useState } from "react";
import {
  downloadWordFile,
  exportSessionToBlob,
  importSessionFromBlob,
  listBlobSessions,
  transformContent,
} from "../lib/api";
import type {
  AssistantMode,
  AssistantResult,
  Preferences,
} from "../types/api";

const defaultPreferences: Preferences = {
  output_style: "balanced",
  visual_chunking: true,
  bullet_steps: true,
  calming_tone: true,
  deadline_aware: false,
  beginner_friendly: true,
};

const STORAGE_KEYS = {
  blobContainer: "naai_blobContainer",
  blobFolder: "naai_blobFolder",
  blobFiles: "naai_blobFiles",
  blobTreeVisible: "naai_blobTreeVisible",
  expandedFolders: "naai_expandedFolders",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40) || "neuroassistant-session";
}

function inferTopicFromInput(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return "neuroassistant-session";
  const firstChunk = cleaned.split(/[.!?\n]/)[0].slice(0, 60);
  return slugify(firstChunk);
}

function buildExportFilename(container: string): string {
  const safeContainer = slugify(container);
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${safeContainer}-${randomNumber}`;
}

function readSessionStorage<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeSessionStorage<T>(key: string, value: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore browser storage failures
  }
}

export type TreeNode = {
  name: string;
  fullPath: string;
  type: "folder" | "file";
  children?: TreeNode[];
};

function insertPath(nodes: TreeNode[], parts: string[], parentPath = ""): void {
  if (parts.length === 0) return;

  const [head, ...rest] = parts;
  const fullPath = parentPath ? `${parentPath}/${head}` : head;
  const isFile = rest.length === 0;

  let node = nodes.find(
    (item) => item.name === head && item.type === (isFile ? "file" : "folder")
  );

  if (!node) {
    node = {
      name: head,
      fullPath,
      type: isFile ? "file" : "folder",
      children: isFile ? undefined : [],
    };
    nodes.push(node);
  }

  if (!isFile) {
    if (!node.children) node.children = [];
    insertPath(node.children, rest, fullPath);
  }
}

function sortTree(nodes: TreeNode[]): TreeNode[] {
  return [...nodes]
    .map((node) => ({
      ...node,
      children: node.children ? sortTree(node.children) : undefined,
    }))
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
}

function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const path of paths) {
    const parts = path.split("/").filter(Boolean);
    insertPath(root, parts);
  }

  return sortTree(root);
}

export function useAssistant() {
  const [mode, setMode] = useState<AssistantMode>("simplify");
  const [text, setText] = useState("");
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [result, setResult] = useState<AssistantResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [blobContainer, setBlobContainer] = useState<string>(() =>
    readSessionStorage<string>(STORAGE_KEYS.blobContainer, "neuroassistant-session")
  );
  const [blobFolder, setBlobFolder] = useState<string>(() =>
    readSessionStorage<string>(STORAGE_KEYS.blobFolder, "simplify")
  );
  const [blobFiles, setBlobFiles] = useState<string[]>(() =>
    readSessionStorage<string[]>(STORAGE_KEYS.blobFiles, [])
  );
  const [blobTreeVisible, setBlobTreeVisible] = useState<boolean>(() =>
    readSessionStorage<boolean>(STORAGE_KEYS.blobTreeVisible, false)
  );
  const [exportSuccess, setExportSuccess] = useState("");
  const [lastExportSignature, setLastExportSignature] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(
    () => readSessionStorage<Record<string, boolean>>(STORAGE_KEYS.expandedFolders, {})
  );
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    setBlobFolder(mode);
  }, [mode]);

  useEffect(() => {
    writeSessionStorage(STORAGE_KEYS.blobContainer, blobContainer);
  }, [blobContainer]);

  useEffect(() => {
    writeSessionStorage(STORAGE_KEYS.blobFolder, blobFolder);
  }, [blobFolder]);

  useEffect(() => {
    writeSessionStorage(STORAGE_KEYS.blobFiles, blobFiles);
  }, [blobFiles]);

  useEffect(() => {
    writeSessionStorage(STORAGE_KEYS.blobTreeVisible, blobTreeVisible);
  }, [blobTreeVisible]);

  useEffect(() => {
    writeSessionStorage(STORAGE_KEYS.expandedFolders, expandedFolders);
  }, [expandedFolders]);

  const exportSignature = useMemo(
    () =>
      JSON.stringify({
        input: text,
        output: result?.transformed_text || "",
        mode,
        preferences,
      }),
    [text, result?.transformed_text, mode, preferences]
  );

  useEffect(() => {
    if (lastExportSignature && exportSignature !== lastExportSignature) {
      setExportSuccess("");
    }
  }, [exportSignature, lastExportSignature]);

  const canExportToAzure = !!result && exportSignature !== lastExportSignature;

  const blobTree = useMemo(() => buildTree(blobFiles), [blobFiles]);

  async function runTransform() {
    setLoading(true);
    setError("");
    try {
      const response = await transformContent({
        mode,
        text,
        preferences,
      });
      setResult(response.result);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function runBlobExport() {
    if (!result || !canExportToAzure) return;

    const exportContainer = inferTopicFromInput(text);
    const exportFolder = mode;
    const exportFilename = buildExportFilename(exportContainer);

    const response = await exportSessionToBlob({
      container: exportContainer,
      folder: exportFolder,
      filename: exportFilename,
      input_text: text,
      output_text: result.transformed_text,
      mode,
      preferences,
    });

    setBlobContainer(exportContainer);
    setBlobFolder(exportFolder);
    setLastExportSignature(exportSignature);
    setExportSuccess(`Exported successfully to ${exportContainer}/${exportFolder}`);

    const fullBlobPath = `${exportFolder}/${exportFilename}.json`;
    setBlobFiles((prev) => {
      const next = prev.includes(fullBlobPath) ? prev : [...prev, fullBlobPath];
      return [...next].sort((a, b) => a.localeCompare(b));
    });

    setBlobTreeVisible(true);
    setExpandedFolders((prev) => ({
      ...prev,
      [exportFolder]: true,
    }));

    return response;
  }

  async function runBlobListToggle() {
    if (blobTreeVisible) {
      setBlobTreeVisible(false);
      return;
    }

    setBlobTreeVisible(true);

    if (blobFiles.length > 0) {
      return;
    }

    try {
      setListLoading(true);
      const response = await listBlobSessions({
        container: blobContainer,
      });

      const sorted = [...(response.blobs || [])].sort((a, b) =>
        a.localeCompare(b)
      );

      setBlobFiles(sorted);
      return response;
    } finally {
      setListLoading(false);
    }
  }

  async function runBlobImport(blobName: string) {
    const response = await importSessionFromBlob({
      container: blobContainer,
      blob_name: blobName,
    });

    const payload = response.payload;
    setText(payload.input_text || "");
    setMode((payload.mode || "simplify") as AssistantMode);
    setPreferences(payload.preferences || defaultPreferences);

    if (payload.output_text) {
      setResult({
        title: "Imported Session",
        summary: "Restored from Azure Blob Storage.",
        transformed_text: payload.output_text,
        next_actions: ["Review restored session", "Generate again if needed"],
        why_this_output: ["Imported from prior saved session"],
        safety_passed: true,
        grounded_sources: [],
        used_services: ["Azure Blob Storage"],
      });
    }

    return response;
  }

  async function runWordExport() {
    if (!result) return;

    const blob = await downloadWordFile({
      filename: `neuroassistant-session-${Date.now()}.docx`,
      input_text: text,
      output_text: result.transformed_text,
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neuroassistant-session-${Date.now()}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  function toggleFolder(path: string) {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  }

  return {
    mode,
    setMode,
    text,
    setText,
    preferences,
    setPreferences,
    result,
    loading,
    error,
    runTransform,
    runBlobExport,
    runBlobListToggle,
    runBlobImport,
    runWordExport,
    blobContainer,
    blobFolder,
    blobFiles,
    blobTree,
    blobTreeVisible,
    exportSuccess,
    canExportToAzure,
    expandedFolders,
    toggleFolder,
    setBlobContainer,
    listLoading,
  };
}
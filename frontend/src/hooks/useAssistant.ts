import { useState } from "react";
import { exportMarkdown, transformContent } from "../lib/api";
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
  deadline_aware: true,
  beginner_friendly: true,
};

export function useAssistant() {
  const [mode, setMode] = useState<AssistantMode>("simplify");
  const [text, setText] = useState("");
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [result, setResult] = useState<AssistantResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState("");

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
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr?.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function runExport() {
    if (!result) return;
    setExportError("");
    setExportSuccess(false);
    try {
      await exportMarkdown(
        "neuroassistant-output",
        `# ${result.title}\n\n${result.transformed_text}`
      );
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch {
      setExportError("Export failed. Please try again.");
    }
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
    exportSuccess,
    exportError,
    runTransform,
    runExport,
  };
}
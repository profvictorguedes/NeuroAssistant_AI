import { Wand2, Upload, FolderTree, FileText, ChevronRight, ChevronDown, Folder, File } from "lucide-react";
import { useAssistant } from "../../hooks/useAssistant";
import { Button } from "../ui/Button";
import { InputPanel } from "./InputPanel";
import { PreferencePanel } from "./PreferencePanel";
import { ModeSelector } from "./ModeSelector";
import { OutputPanel } from "./OutputPanel";
import { ExplainabilityPanel } from "./ExplainabilityPanel";

const modeHelp: Record<string, string> = {
  simplify: "Turns dense text into clearer, easier language.",
  prioritize: "Reorders work into what matters most first.",
  study: "Creates summary, key points, quiz prompts, and next study step.",
  focus: "Reduces noise and gives one concrete next action.",
  calm: "Uses a gentler, lower-pressure tone and manageable steps.",
  task_breakdown: "Splits a complex goal into smaller sequential actions.",
};

type TreeNode = {
  name: string;
  fullPath: string;
  type: "folder" | "file";
  children?: TreeNode[];
};

function BlobTree({
  nodes,
  expandedFolders,
  toggleFolder,
  onImport,
}: {
  nodes: TreeNode[];
  expandedFolders: Record<string, boolean>;
  toggleFolder: (path: string) => void;
  onImport: (path: string) => void;
}) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => {
        if (node.type === "folder") {
          const isOpen = !!expandedFolders[node.fullPath];
          return (
            <div key={node.fullPath}>
              <button
                type="button"
                onClick={() => toggleFolder(node.fullPath)}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Folder className="h-4 w-4 text-cyan-300" />
                <span>{node.name}</span>
              </button>

              {isOpen && node.children && node.children.length > 0 && (
                <div className="ml-5 border-l border-white/10 pl-3">
                  <BlobTree
                    nodes={node.children}
                    expandedFolders={expandedFolders}
                    toggleFolder={toggleFolder}
                    onImport={onImport}
                  />
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={node.fullPath}
            type="button"
            onClick={() => onImport(node.fullPath)}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <File className="h-4 w-4 text-violet-300" />
            <span>{node.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Workspace() {
  const {
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
    blobTree,
    blobTreeVisible,
    exportSuccess,
    canExportToAzure,
    expandedFolders,
    toggleFolder,
  } = useAssistant();

  return (
    <section id="demo" className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Interactive Demo
          </div>
          <h2 className="mt-2 text-3xl font-black text-white">Adaptive Workspace</h2>
          <p className="mt-2 text-slate-400">
            Select a support mode, paste cognitively heavy content, and generate a calmer output.
          </p>
        </div>

        <div className="mb-4 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
          <div className="text-sm font-semibold text-cyan-200">
            Current mode: <span className="capitalize">{mode.replace("_", " ")}</span>
          </div>
          <p className="mt-1 text-sm text-slate-200">{modeHelp[mode]}</p>
        </div>

        <div className="mb-6">
          <ModeSelector value={mode} onChange={setMode} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <InputPanel text={text} onChange={setText} />
            <OutputPanel
              result={result}
              loading={loading}
              error={error}
              onExport={runWordExport}
            />
            <ExplainabilityPanel result={result} />
          </div>

          <div className="space-y-6">
            <PreferencePanel value={preferences} onChange={setPreferences} />

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-violet-400/10 p-5">
              <div className="mb-2 flex items-center gap-2 text-cyan-200">
                <Wand2 className="h-5 w-5" />
                <span className="font-semibold">Run transformation</span>
              </div>
              <p className="text-sm text-slate-300">
                This calls the backend and generates mode-specific output.
              </p>
              <Button
                className="mt-4 w-full"
                onClick={runTransform}
                disabled={loading || text.trim().length < 10}
              >
                Generate Supportive Output
              </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Azure Blob Storage</div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Container</div>
                  <div className="mt-1 text-sm text-slate-100">{blobContainer}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Folder Prefix</div>
                  <div className="mt-1 text-sm capitalize text-slate-100">{blobFolder}</div>
                </div>

                <Button variant="secondary" onClick={runBlobExport} disabled={!canExportToAzure}>
                  <Upload className="mr-2 h-4 w-4" />
                  Export Session to Azure
                </Button>

                {exportSuccess && (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                    {exportSuccess}
                  </div>
                )}

                <Button variant="secondary" onClick={runBlobListToggle}>
                  <FolderTree className="mr-2 h-4 w-4" />
                  Load Sessions List
                </Button>

                {blobTreeVisible && (
                  <div className="rounded-2xl bg-slate-900/60 p-3">
                    <div className="mb-2 text-sm font-semibold text-slate-200">Available files</div>
                    {blobTree.length === 0 ? (
                      <div className="text-xs text-slate-500">No exported sessions found.</div>
                    ) : (
                      <BlobTree
                        nodes={blobTree}
                        expandedFolders={expandedFolders}
                        toggleFolder={toggleFolder}
                        onImport={runBlobImport}
                      />
                    )}
                  </div>
                )}

                <Button variant="secondary" onClick={runWordExport} disabled={!result}>
                  <FileText className="mr-2 h-4 w-4" />
                  Save to Word File
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
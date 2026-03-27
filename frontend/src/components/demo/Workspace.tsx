import { Wand2 } from "lucide-react";
import { useAssistant } from "../../hooks/useAssistant";
import { Button } from "../ui/Button";
import { InputPanel } from "./InputPanel";
import { PreferencePanel } from "./PreferencePanel";
import { ModeSelector } from "./ModeSelector";
import { OutputPanel } from "./OutputPanel";
import { ExplainabilityPanel } from "./ExplainabilityPanel";

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
    runExport,
  } = useAssistant();

  return (
    <section id="demo" className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white">Demo Workspace</h2>
          <p className="mt-2 text-slate-400">
            Paste something dense. Get back something calmer, clearer, and more actionable.
          </p>
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
              onExport={runExport}
            />
            <ExplainabilityPanel result={result} />
          </div>

          <div className="space-y-6">
            <PreferencePanel value={preferences} onChange={setPreferences} />
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-violet-400/10 p-5">
              <div className="mb-2 flex items-center gap-2 text-cyan-200">
                <Wand2 className="h-5 w-5" />
                <span className="font-semibold">Run adaptive transformation</span>
              </div>
              <p className="text-sm text-slate-300">
                The assistant will restructure the content according to your selected mode and preferences.
              </p>
              <Button
                className="mt-4 w-full"
                onClick={runTransform}
                disabled={loading || text.trim().length < 10}
              >
                Generate Supportive Output
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
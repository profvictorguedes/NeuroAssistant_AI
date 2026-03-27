import { Download, Sparkles } from "lucide-react";
import type { AssistantResult } from "../../types/api";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { LoadingDots } from "../ui/LoadingDots";

type Props = {
  result: AssistantResult | null;
  loading: boolean;
  error: string;
  onExport: () => void;
};

export function OutputPanel({ result, loading, error, onExport }: Props) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Output</h3>
          <p className="text-sm text-slate-400">
            Adaptive AI transformation designed to reduce overload.
          </p>
        </div>
        {result && (
          <Button variant="secondary" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </div>

      {loading && <LoadingDots />}
      {error && <div className="rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}

      {!loading && !result && !error && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-slate-400">
          Run the assistant to see transformed output.
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-cyan-400/10 p-4 ring-1 ring-cyan-300/20">
            <div className="mb-2 flex items-center gap-2 text-cyan-200">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">{result.title}</span>
            </div>
            <p className="text-sm text-slate-200">{result.summary}</p>
          </div>

          <pre className="whitespace-pre-wrap rounded-2xl bg-slate-950/70 p-4 text-sm leading-7 text-slate-100">
            {result.transformed_text}
          </pre>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <div className="mb-2 font-semibold text-white">Next Actions</div>
              <ul className="space-y-2 text-sm text-slate-300">
                {result.next_actions.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-900/60 p-4">
              <div className="mb-2 font-semibold text-white">Services Used</div>
              <ul className="space-y-2 text-sm text-slate-300">
                {result.used_services.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
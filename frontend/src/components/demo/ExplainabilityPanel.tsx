import type { AssistantResult } from "../../types/api";
import { Card } from "../ui/Card";

type Props = {
  result: AssistantResult | null;
};

export function ExplainabilityPanel({ result }: Props) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-white">Explainability</h3>
      <p className="mb-4 text-sm text-slate-400">
        Why the assistant shaped the answer this way.
      </p>

      {!result ? (
        <div className="text-sm text-slate-500">No output yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-900/60 p-4">
            <div className="mb-2 font-semibold text-white">Why this output</div>
            <ul className="space-y-2 text-sm text-slate-300">
              {result.why_this_output.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-900/60 p-4">
            <div className="mb-2 font-semibold text-white">Grounding signals</div>
            <ul className="space-y-2 text-sm text-slate-300">
              {result.grounded_sources.map((item, i) => (
                <li key={i}>• {item.length > 120 ? `${item.slice(0, 120)}…` : item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}
import type { AssistantMode } from "../../types/api";

const modes: { label: string; value: AssistantMode }[] = [
  { label: "Simplify", value: "simplify" },
  { label: "Prioritize", value: "prioritize" },
  { label: "Study", value: "study" },
  { label: "Focus", value: "focus" },
  { label: "Calm", value: "calm" },
  { label: "Task Breakdown", value: "task_breakdown" },
];

type Props = {
  value: AssistantMode;
  onChange: (value: AssistantMode) => void;
};

export function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
            value === mode.value
              ? "border-cyan-300 bg-cyan-400/15 text-cyan-200"
              : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-cyan-400/30"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
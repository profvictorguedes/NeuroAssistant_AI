import { sampleInputs } from "../../data/sampleInputs";
import { Card } from "../ui/Card";

type Props = {
  text: string;
  onChange: (value: string) => void;
};

export function InputPanel({ text, onChange }: Props) {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Input</h3>
        <p className="text-sm text-slate-400">
          Paste dense notes, instructions, tasks, or study material.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste something cognitively heavy here..."
        maxLength={12000}
        aria-label="Input text"
        className="min-h-[220px] w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-slate-100 outline-none ring-0 placeholder:text-slate-500"
      />
      <div className="mt-1 text-right text-xs text-slate-500">
        {text.length.toLocaleString()} / 12,000
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {sampleInputs.map((sample) => (
          <button
            key={sample.label}
            onClick={() => onChange(sample.text)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:border-cyan-400/30 hover:text-white"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
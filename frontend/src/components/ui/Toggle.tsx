type Props = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export function Toggle({ label, checked, onChange }: Props) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
      <span className="text-sm text-slate-200">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-cyan-400"
      />
    </label>
  );
}
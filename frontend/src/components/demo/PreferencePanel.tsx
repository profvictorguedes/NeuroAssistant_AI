import type { Preferences } from "../../types/api";
import { Card } from "../ui/Card";
import { Toggle } from "../ui/Toggle";

type Props = {
  value: Preferences;
  onChange: (value: Preferences) => void;
};

export function PreferencePanel({ value, onChange }: Props) {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Support Preferences</h3>
        <p className="text-sm text-slate-400">
          Adjust how the assistant structures the response.
        </p>
      </div>

      <div className="grid gap-3">
        <select
          value={value.output_style}
          onChange={(e) =>
            onChange({ ...value, output_style: e.target.value as Preferences["output_style"] })
          }
          className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100"
        >
          <option value="concise">Concise</option>
          <option value="balanced">Balanced</option>
          <option value="detailed">Detailed</option>
        </select>

        <Toggle
          label="Visual chunking"
          checked={value.visual_chunking}
          onChange={(checked) => onChange({ ...value, visual_chunking: checked })}
        />
        <Toggle
          label="Bullet steps"
          checked={value.bullet_steps}
          onChange={(checked) => onChange({ ...value, bullet_steps: checked })}
        />
        <Toggle
          label="Calming tone"
          checked={value.calming_tone}
          onChange={(checked) => onChange({ ...value, calming_tone: checked })}
        />
        <Toggle
          label="Deadline-aware"
          checked={value.deadline_aware}
          onChange={(checked) => onChange({ ...value, deadline_aware: checked })}
        />
        <Toggle
          label="Beginner-friendly"
          checked={value.beginner_friendly}
          onChange={(checked) => onChange({ ...value, beginner_friendly: checked })}
        />
      </div>
    </Card>
  );
}
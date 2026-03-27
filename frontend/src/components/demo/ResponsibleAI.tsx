import { Card } from "../ui/Card";

export function ResponsibleAI() {
  return (
    <section id="responsible-ai" className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Card>
          <h2 className="text-2xl font-black text-white">Responsible AI</h2>
          <p className="mt-2 max-w-3xl text-slate-300">
            NeuroAssistant AI is assistive, not authoritative. It helps reduce
            cognitive load through adaptation, structure, and clarity, while
            preserving human oversight and informed judgment.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <div className="font-semibold text-white">Transparency</div>
              <p className="mt-2 text-sm text-slate-400">
                The app explains why it transformed the content in a specific way.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <div className="font-semibold text-white">Human-in-the-loop</div>
              <p className="mt-2 text-sm text-slate-400">
                Users review and decide whether to accept suggestions.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <div className="font-semibold text-white">Safety</div>
              <p className="mt-2 text-sm text-slate-400">
                Content moderation can be enforced with Azure AI Content Safety.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <div className="font-semibold text-white">Accessibility</div>
              <p className="mt-2 text-sm text-slate-400">
                Calm layout, strong contrast, keyboard-friendly controls, and structured outputs.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
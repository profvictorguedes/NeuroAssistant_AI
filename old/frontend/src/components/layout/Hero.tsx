import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <Badge>Hackathon PoC • Azure-Ready • Neurodiversity-Focused</Badge>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-6xl">
            Reduce overwhelm.
            <span className="block bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
              Support focus.
            </span>
            Adapt intelligently.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            NeuroAssistant AI transforms dense information into calmer,
            clearer, more actionable support for work and learning.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}>
              Try the Demo
            </Button>
            <Button variant="secondary" onClick={() => document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" })}>
              See Azure Architecture
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid gap-4">
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <div className="text-sm text-slate-400">Input</div>
              <div className="mt-2 text-slate-200">
                “I have too many tasks, unclear priorities, and dense notes.”
              </div>
            </div>
            <div className="rounded-2xl bg-cyan-400/10 p-4 ring-1 ring-cyan-300/20">
              <div className="text-sm text-cyan-200">Adaptive Output</div>
              <div className="mt-2 text-white">
                1. Start with one urgent task.
                <br />
                2. Ignore low-value work for now.
                <br />
                3. Use a 15-minute focus block.
              </div>
            </div>
            <div className="flex gap-3 text-xs text-slate-400">
              <span>Responsible AI</span>
              <span>•</span>
              <span>Azure OpenAI</span>
              <span>•</span>
              <span>Calm UX</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
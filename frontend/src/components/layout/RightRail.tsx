const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Demo", href: "#demo" },
  { label: "Responsible AI", href: "#responsible-ai" },
  { label: "Azure Architecture", href: "#architecture" },
];

export function RightRail() {
  return (
    <aside className="fixed right-6 top-1/2 z-40 hidden w-48 -translate-y-1/2 xl:block">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Navigation
        </div>

        <nav className="space-y-2">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
          <div className="text-sm font-semibold text-violet-200">
            NeuroAssistant AI
          </div>
          <p className="mt-2 text-xs leading-6 text-slate-300">
            Adaptive AI support for neurodiverse work and learning, powered by Azure-ready services.
          </p>
        </div>
      </div>
    </aside>
  );
}
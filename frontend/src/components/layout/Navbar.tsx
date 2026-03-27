export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <div className="text-lg font-bold tracking-tight text-white">
            NeuroAssistant <span className="text-cyan-300">AI</span>
          </div>
          <div className="text-xs text-slate-400">
            Cognitive Load Reduction Assistant
          </div>
        </div>

        <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
          <a href="#home" className="hover:text-white">Home</a>
          <a href="#demo" className="hover:text-white">Demo</a>
          <a href="#responsible-ai" className="hover:text-white">Responsible AI</a>
          <a href="#architecture" className="hover:text-white">Architecture</a>
        </nav>
      </div>
    </header>
  );
}
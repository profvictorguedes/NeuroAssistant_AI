export function MetricsStrip() {
  const items = [
    { label: "Modes", value: "6" },
    { label: "Azure services", value: "4+" },
    { label: "Accessibility-first", value: "Yes" },
    { label: "PoC latency target", value: "< 3s" },
  ];

  return (
    <section className="px-6 py-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md"
          >
            <div className="text-2xl font-black text-white">{item.value}</div>
            <div className="mt-1 text-sm text-slate-400">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
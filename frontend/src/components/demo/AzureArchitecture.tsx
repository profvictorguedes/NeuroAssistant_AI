import { Card } from "../ui/Card";

const services = [
  {
    name: "Azure OpenAI",
    description: "Adaptive simplification, prioritization, study support, and reasoning.",
  },
  {
    name: "Azure AI Search",
    description: "Grounds answers with trusted support content and retrieval patterns.",
  },
  {
    name: "Azure Blob Storage",
    description: "Stores exports, uploaded files, and reusable session artifacts.",
  },
  {
    name: "Azure AI Content Safety",
    description: "Screens harmful content for a safer and more responsible experience.",
  },
];

export function AzureArchitecture() {
  return (
    <section id="architecture" className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Card>
          <h2 className="text-2xl font-black text-white">Azure Architecture</h2>
          <p className="mt-2 max-w-3xl text-slate-300">
            The proof of concept is designed for real Azure integration from day one.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4"
              >
                <div className="font-semibold text-cyan-200">{service.name}</div>
                <p className="mt-2 text-sm text-slate-300">{service.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
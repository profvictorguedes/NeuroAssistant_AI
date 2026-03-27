import { AzureArchitecture } from "../components/demo/AzureArchitecture";
import { MetricsStrip } from "../components/demo/MetricsStrip";
import { ResponsibleAI } from "../components/demo/ResponsibleAI";
import { Workspace } from "../components/demo/Workspace";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/layout/Hero";
import { Navbar } from "../components/layout/Navbar";

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <MetricsStrip />
      <Workspace />
      <ResponsibleAI />
      <AzureArchitecture />
      <Footer />
    </div>
  );
}
import { PageShell } from "../components/PageShell";
import { PredictionForm } from "../components/PredictionForm";

export function HomePage() {
  return (
    <PageShell
      eyebrow="Property Valuation Desk"
      title="What's your property worth?"
      subtitle="Enter the details below and we'll estimate a fair market price from comparable listings."
    >
      <PredictionForm />
    </PageShell>
  );
}

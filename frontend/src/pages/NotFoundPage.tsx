import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";

export function NotFoundPage() {
  return (
    <PageShell eyebrow="Property Valuation Desk" title="Page not found">
      <p style={{ textAlign: "center", color: "var(--color-ink-muted)", marginBottom: "1.6rem" }}>
        There's nothing filed under this address.
      </p>
      <div style={{ textAlign: "center" }}>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.7rem 1.4rem",
            fontWeight: 600,
            color: "var(--color-paper)",
            background: "var(--color-oxblood)",
            borderRadius: "var(--radius-sm)",
            textDecoration: "none",
          }}
        >
          Back to the valuation desk
        </Link>
      </div>
    </PageShell>
  );
}

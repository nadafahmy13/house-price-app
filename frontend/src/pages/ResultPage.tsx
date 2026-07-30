import { Link, Navigate, useLocation } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { ValuationStamp } from "../components/ValuationStamp";
import { formatIndianPrice } from "../utils/formatPrice";
import type { PredictionRequest, PredictionResponse } from "../types/prediction";
import "./ResultPage.css";

interface ResultLocationState {
  prediction: PredictionResponse;
  form: PredictionRequest;
}

function formatLocationLabel(slug: string): string {
  if (slug === "other") return "Other";
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ResultPage() {
  const location = useLocation();
  const state = location.state as ResultLocationState | null;

  // Guard against someone landing on /result directly (no prediction in hand)
  if (!state?.prediction || !state?.form) {
    return <Navigate to="/" replace />;
  }

  const { prediction, form } = state;

  const summaryItems: [string, string][] = [
    ["Location", formatLocationLabel(form.location)],
    ["Carpet area", `${form.carpet_area_sqft.toLocaleString("en-IN")} sqft`],
    ["Floor", form.floor_num === 0 ? "Ground" : form.floor_num === -1 ? "Basement" : String(form.floor_num)],
    ["Bathrooms", String(form.bathroom)],
    ["Balconies", String(form.balcony)],
    ["Car parking", String(form.car_parking)],
    ["Furnishing", form.furnishing],
    ["Transaction", form.transaction],
    ["Facing", form.facing],
  ];

  return (
    <PageShell eyebrow="Property Valuation Desk" title="Appraisal complete">
      <div className="result">
        <ValuationStamp formattedPrice={formatIndianPrice(prediction.predicted_price)} />

        <dl className="result__summary">
          {summaryItems.map(([label, value]) => (
            <div className="result__row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <Link className="result__again" to="/">
          Estimate another property
        </Link>
      </div>
    </PageShell>
  );
}

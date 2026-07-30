import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, predictPrice } from "../api/predictionClient";
import type { Facing, Furnishing, PredictionRequest, Transaction } from "../types/prediction";
import locations from "../data/locations.json";
import "./PredictionForm.css";

const FURNISHING_OPTIONS: Furnishing[] = ["Unfurnished", "Semi-Furnished", "Furnished"];
const TRANSACTION_OPTIONS: Transaction[] = ["Resale", "New Property", "Rent/Lease", "Other"];
const FACING_OPTIONS: Facing[] = [
  "East",
  "North",
  "North - East",
  "North - West",
  "South",
  "South - East",
  "South -West",
  "West",
];

// Fixed default: every listing in the training data was "Ready to Move", so this
// isn't exposed as a form control — it's just sent along with every request.
const CONSTRUCTION_STATUS = "Ready to Move";

function formatLocationLabel(slug: string): string {
  if (slug === "other") return "Other / not listed";
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type FormState = {
  location: string;
  carpet_area_sqft: string;
  floor_num: string;
  bathroom: string;
  balcony: string;
  car_parking: string;
  furnishing: Furnishing | "";
  transaction: Transaction | "";
  facing: Facing | "";
};

const INITIAL_STATE: FormState = {
  location: "",
  carpet_area_sqft: "",
  floor_num: "0",
  bathroom: "1",
  balcony: "0",
  car_parking: "0",
  furnishing: "",
  transaction: "",
  facing: "",
};

export function PredictionForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): { valid: boolean; errors: Partial<Record<keyof FormState, string>> } {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (!form.location) errors.location = "Choose a location.";
    if (!form.furnishing) errors.furnishing = "Choose a furnishing status.";
    if (!form.transaction) errors.transaction = "Choose a transaction type.";
    if (!form.facing) errors.facing = "Choose which way the property faces.";

    const area = Number(form.carpet_area_sqft);
    if (!form.carpet_area_sqft || Number.isNaN(area) || area <= 0) {
      errors.carpet_area_sqft = "Enter an area greater than 0.";
    }

    for (const key of ["floor_num", "bathroom", "balcony", "car_parking"] as const) {
      const value = Number(form[key]);
      if (form[key] === "" || Number.isNaN(value)) {
        errors[key] = "Enter a number.";
      } else if (key !== "floor_num" && value < 0) {
        errors[key] = "Enter a number 0 or greater.";
      } else if (key === "floor_num" && value < -1) {
        errors[key] = "Use -1 for basement, 0 for ground floor.";
      }
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    const { valid, errors } = validate();
    setFieldErrors(errors);
    if (!valid) return;

    const payload: PredictionRequest = {
      location: form.location,
      carpet_area_sqft: Number(form.carpet_area_sqft),
      floor_num: Number(form.floor_num),
      bathroom: Number(form.bathroom),
      balcony: Number(form.balcony),
      car_parking: Number(form.car_parking),
      furnishing: form.furnishing,
      transaction: form.transaction,
      status: CONSTRUCTION_STATUS,
      facing: form.facing,
    };

    setIsSubmitting(true);
    try {
      const result = await predictPrice(payload);
      navigate("/result", { state: { prediction: result, form: payload } });
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(
          typeof error.detail === "string" ? error.detail : "Something went wrong while estimating the price."
        );
      } else {
        setSubmitError("Something went wrong while estimating the price.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="pform" onSubmit={handleSubmit} noValidate>
      <div className="pform__grid">
        <label className="pform__field pform__field--span2">
          <span className="pform__label">Location</span>
          <select
            className="pform__control"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            aria-invalid={Boolean(fieldErrors.location)}
          >
            <option value="" disabled>
              Select a city
            </option>
            {(locations as string[]).map((slug) => (
              <option key={slug} value={slug}>
                {formatLocationLabel(slug)}
              </option>
            ))}
          </select>
          {fieldErrors.location && <span className="pform__error">{fieldErrors.location}</span>}
        </label>

        <label className="pform__field pform__field--span2">
          <span className="pform__label">Carpet area (sqft)</span>
          <input
            className="pform__control pform__control--mono"
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 950"
            value={form.carpet_area_sqft}
            onChange={(e) => updateField("carpet_area_sqft", e.target.value)}
            aria-invalid={Boolean(fieldErrors.carpet_area_sqft)}
          />
          {fieldErrors.carpet_area_sqft && <span className="pform__error">{fieldErrors.carpet_area_sqft}</span>}
        </label>

        <label className="pform__field">
          <span className="pform__label">Floor</span>
          <input
            className="pform__control pform__control--mono"
            type="number"
            step={1}
            placeholder="0 = ground"
            value={form.floor_num}
            onChange={(e) => updateField("floor_num", e.target.value)}
            aria-invalid={Boolean(fieldErrors.floor_num)}
          />
          {fieldErrors.floor_num && <span className="pform__error">{fieldErrors.floor_num}</span>}
        </label>

        <label className="pform__field">
          <span className="pform__label">Bathrooms</span>
          <input
            className="pform__control pform__control--mono"
            type="number"
            min={0}
            step={1}
            value={form.bathroom}
            onChange={(e) => updateField("bathroom", e.target.value)}
            aria-invalid={Boolean(fieldErrors.bathroom)}
          />
          {fieldErrors.bathroom && <span className="pform__error">{fieldErrors.bathroom}</span>}
        </label>

        <label className="pform__field">
          <span className="pform__label">Balconies</span>
          <input
            className="pform__control pform__control--mono"
            type="number"
            min={0}
            step={1}
            value={form.balcony}
            onChange={(e) => updateField("balcony", e.target.value)}
            aria-invalid={Boolean(fieldErrors.balcony)}
          />
          {fieldErrors.balcony && <span className="pform__error">{fieldErrors.balcony}</span>}
        </label>

        <label className="pform__field">
          <span className="pform__label">Car parking</span>
          <input
            className="pform__control pform__control--mono"
            type="number"
            min={0}
            step={1}
            value={form.car_parking}
            onChange={(e) => updateField("car_parking", e.target.value)}
            aria-invalid={Boolean(fieldErrors.car_parking)}
          />
          {fieldErrors.car_parking && <span className="pform__error">{fieldErrors.car_parking}</span>}
        </label>

        <label className="pform__field">
          <span className="pform__label">Furnishing</span>
          <select
            className="pform__control"
            value={form.furnishing}
            onChange={(e) => updateField("furnishing", e.target.value as Furnishing)}
            aria-invalid={Boolean(fieldErrors.furnishing)}
          >
            <option value="" disabled>
              Select furnishing
            </option>
            {FURNISHING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.furnishing && <span className="pform__error">{fieldErrors.furnishing}</span>}
        </label>

        <label className="pform__field">
          <span className="pform__label">Transaction</span>
          <select
            className="pform__control"
            value={form.transaction}
            onChange={(e) => updateField("transaction", e.target.value as Transaction)}
            aria-invalid={Boolean(fieldErrors.transaction)}
          >
            <option value="" disabled>
              Select transaction type
            </option>
            {TRANSACTION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.transaction && <span className="pform__error">{fieldErrors.transaction}</span>}
        </label>

        <label className="pform__field pform__field--span2">
          <span className="pform__label">Facing</span>
          <select
            className="pform__control"
            value={form.facing}
            onChange={(e) => updateField("facing", e.target.value as Facing)}
            aria-invalid={Boolean(fieldErrors.facing)}
          >
            <option value="" disabled>
              Select facing direction
            </option>
            {FACING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.facing && <span className="pform__error">{fieldErrors.facing}</span>}
        </label>
      </div>

      {submitError && (
        <div className="pform__banner" role="alert">
          {submitError}
        </div>
      )}

      <button className="pform__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Appraising…" : "Estimate value"}
      </button>
    </form>
  );
}

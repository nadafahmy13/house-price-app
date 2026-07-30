import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown) {
    super(typeof detail === "string" ? detail : "The prediction request failed.");
    this.status = status;
    this.detail = detail;
  }
}

export async function predictPrice(payload: PredictionRequest): Promise<PredictionResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(0, "Couldn't reach the valuation service. Check your connection and try again.");
  }

  if (!response.ok) {
    let detail: unknown = "The valuation service returned an error. Please try again.";
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {
      // response body wasn't JSON — keep the default message
    }
    throw new ApiError(response.status, detail);
  }

  return (await response.json()) as PredictionResponse;
}

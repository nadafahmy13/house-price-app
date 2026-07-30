// Mirrors backend/app/schemas/prediction.py

export type Furnishing = "Furnished" | "Semi-Furnished" | "Unfurnished";
export type Transaction = "New Property" | "Resale" | "Rent/Lease" | "Other";
export type Facing =
  | "East"
  | "North"
  | "North - East"
  | "North - West"
  | "South"
  | "South - East"
  | "South -West"
  | "West";

export interface PredictionRequest {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  car_parking: number;
  furnishing: Furnishing | "";
  transaction: Transaction | "";
  status: string;
  facing: Facing | "";
}

export interface PredictionResponse {
  predicted_price: number;
}

export interface HealthResponse {
  status: string;
}

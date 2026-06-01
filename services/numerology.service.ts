import { API_BASE, type ApiResponse } from "@/services/api";
import type {
  NumerologyGridCell,
  NumerologyInsight,
  NumerologyMetric,
} from "@/app/User/Numerology/numerologyData";

export type NameBreakdownLetter = {
  letter: string;
  value: number;
  type: string;
};

export type NumerologyResult = {
  metrics: NumerologyMetric[];
  grid: NumerologyGridCell[];
  insights: NumerologyInsight[];
  name_breakdown?: NameBreakdownLetter[];
  driver_number?: number;
  conductor_number?: number;
  life_path_number?: number;
  destiny_number?: number;
};

export async function calculateNumerology(
  fullName: string,
  birthDate: string,
): Promise<NumerologyResult> {
  const response = await fetch(`${API_BASE}/numerology/calculate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ full_name: fullName, birth_date: birthDate }),
    cache: "no-store",
  });

  const payload = (await response.json()) as ApiResponse<NumerologyResult>;
  if (!response.ok) {
    throw new Error(payload?.message || "Unable to calculate numerology.");
  }
  if (!payload.data) {
    throw new Error("Numerology API returned an empty response.");
  }
  return payload.data;
}

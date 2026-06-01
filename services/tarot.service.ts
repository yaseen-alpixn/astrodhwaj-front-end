import { API_BASE, type ApiResponse } from "@/services/api";

export interface TarotCard {
  id: string;
  index: number;
  name: string;
  orientation: "upright" | "reversed";
  meaning: string;
  image: string;
  position: string;
}

export interface TarotShuffleResponse {
  status: number;
  category: string;
  cards: TarotCard[];
  interpretation: string;
}

export type TarotCategory = "love" | "career" | "health";

export async function fetchTarotReading(
  category: TarotCategory = "career",
  count: number = 3,
  spread: string = "three"
): Promise<TarotShuffleResponse> {
  const url = new URL(`${API_BASE}/tarot/shuffle`);
  url.searchParams.set("count", String(count));
  url.searchParams.set("spread", spread);
  url.searchParams.set("category", category);
  url.searchParams.set("shuffle_type", "both");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      if (body?.detail) detail = String(body.detail);
    } catch {
      /* ignore */
    }
    throw new Error(`Tarot API error: ${detail}`);
  }

  const payload = (await response.json()) as ApiResponse<TarotShuffleResponse>;
  if (!payload.data) {
    throw new Error("Tarot API returned an empty response.");
  }
  return payload.data;
}

// ─────────────────────────────────────────────────────────────────────────────
//  tarot.service.ts
//  Calls the FastAPI tarot API at /tarot/shuffle
// ─────────────────────────────────────────────────────────────────────────────

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

const TAROT_API_BASE =
  process.env.NEXT_PUBLIC_TAROT_API_URL || "https://tarot-api-jc4y.onrender.com";

const TAROT_API_KEY =
  process.env.NEXT_PUBLIC_TAROT_API_KEY || "supersecret123";

export type TarotCategory = "love" | "career" | "health";

export async function fetchTarotReading(
  category: TarotCategory = "career",
  count: number = 3,
  spread: string = "three"
): Promise<TarotShuffleResponse> {
  const url = new URL(`${TAROT_API_BASE}/tarot/shuffle`);
  url.searchParams.set("count", String(count));
  url.searchParams.set("spread", spread);
  url.searchParams.set("category", category);
  url.searchParams.set("shuffle_type", "both");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-key": TAROT_API_KEY,
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

  return response.json() as Promise<TarotShuffleResponse>;
}

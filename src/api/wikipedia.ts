// src/api/wikipedia.ts
import axios from "axios";

export type WikipediaPageInfo = {
  title: string;
  extract: string;
  pageUrl: string;
  thumbnail?: string;
};

/**
 * Fetch summary info for a book or author from Wikipedia.
 * Returns first matching page extract, thumbnail, and URL.
 */
export async function getWikipediaSummary(query: string): Promise<WikipediaPageInfo | null> {
  if (!query || query.trim().length === 0) return null;

  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages|info&inprop=url&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=300&titles=${encoded}`;
    
    const res = await axios.get(url);
    const pages = res.data.query?.pages as Record<string, unknown> | undefined;
    if (!pages) return null;

    const page = Object.values(pages)[0] as Record<string, unknown> | undefined;
    if (!page) return null;

    // If the page is missing, the API includes a `missing` property
    if (typeof page.missing !== "undefined") return null;

    const getString = (v: unknown) => (typeof v === "string" ? v : undefined);

    const title = getString(page.title);
    const extract = getString(page.extract);
    const pageUrl = getString(page.fullurl);

    let thumbnail: string | undefined;
    const thumbObj = page.thumbnail as Record<string, unknown> | undefined;
    if (thumbObj) thumbnail = getString(thumbObj.source);

    if (!title || !extract || !pageUrl) return null;

    return {
      title,
      extract,
      pageUrl,
      thumbnail,
    };
  } catch (error) {
    console.error("Wikipedia fetch error:", error);
    return null;
  }
}

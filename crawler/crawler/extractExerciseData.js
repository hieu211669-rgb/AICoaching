import { logger } from "../utils/index.js";

/**
 * Try to parse exercise data from intercepted RSC/API responses.
 */
export function parseInterceptedData(responses) {
  for (const body of responses) {
    try {
      const data = typeof body === "string" ? JSON.parse(body) : body;
      if (data && (data.instructions || data.muscles || data.difficulty || data.name)) {
        return normalizeApiData(data);
      }
    } catch {
      // Try to find JSON within RSC text
      const jsonMatches = body.match(/\{[^{}]*"(instructions|muscles|difficulty|equipment)"[^{}]*\}/g);
      if (jsonMatches) {
        for (const match of jsonMatches) {
          try {
            const parsed = JSON.parse(match);
            if (parsed.instructions || parsed.muscles || parsed.difficulty) {
              return normalizeApiData(parsed);
            }
          } catch { /* skip */ }
        }
      }
    }
  }
  return null;
}

function normalizeApiData(data) {
  return {
    title: data.name || data.title || "",
    description: data.description || "",
    difficulty: data.difficulty || "",
    exercise_type: data.exercise_type || data.type || "",
    primary_muscles: toArray(data.primary_muscles || data.muscles),
    secondary_muscles: toArray(data.secondary_muscles),
    equipments: toArray(data.equipments || data.equipment),
    instructions: toArray(data.instructions),
    tips: toArray(data.tips),
    images: toArray(data.images),
    gif_url: data.gif_url || data.gif || "",
    thumbnail_url: data.thumbnail_url || data.thumbnail || "",
    calories_burn: data.calories_burn || 0,
    category: data.category || "",
  };
}

/**
 * DOM fallback: extract exercise data from rendered page.
 * Based on observed MuscleWiki DOM structure:
 * - H1 = exercise title (e.g. "Stationary Bike")
 * - Numbered instructions as text
 * - "Primary", "Secondary", "Tertiary" muscle labels
 * - Difficulty label (e.g. "Novice")
 * - Force, Grips, Mechanic metadata
 * - Images from media.musclewiki.com
 */
export async function extractFromDOM(page) {
  return page.evaluate(() => {
    const body = document.body.innerText;
    const lines = body.split("\n").map(l => l.trim()).filter(Boolean);

    // Title - the exercise name appears after nav items, before difficulty
    // Skip common nav items to find the actual exercise title
    const navItems = ["Home", "Workouts", "Routines", "Tools", "Articles", "Login", "Register",
      "Get MuscleWiki Premium", "Generator", "Try it out now", "English", "Search", "Open user menu"];
    let title = "";
    for (const line of lines) {
      if (navItems.includes(line)) continue;
      // First non-nav line is the exercise title
      title = line;
      break;
    }

    // Difficulty - look for known values
    const difficulties = ["Novice", "Beginner", "Intermediate", "Advanced", "Expert"];
    const difficulty = lines.find(l => difficulties.includes(l)) || "";

    // Instructions - numbered lines (1, 2, 3...)
    const instructions = [];
    let collectingInstructions = false;
    for (let i = 0; i < lines.length; i++) {
      if (/^\d+$/.test(lines[i]) && i + 1 < lines.length && !/^\d+$/.test(lines[i + 1])) {
        instructions.push(lines[i + 1]);
        collectingInstructions = true;
      }
    }

    // Muscles - look for "Exercise" suffix pattern (e.g. "Quad Exercise", "Glutes Exercise")
    const muscleLines = lines.filter(l => l.endsWith("Exercise"));
    const primary_muscles = [...new Set(muscleLines.map(l => l.replace(" Exercise", "")))];

    // Look for Primary/Secondary/Tertiary sections
    const primaryIdx = lines.indexOf("Primary");
    const secondaryIdx = lines.indexOf("Secondary");
    const tertiaryIdx = lines.indexOf("Tertiary");

    // Force, Grips, Mechanic
    const forceIdx = lines.indexOf("Force");
    const force = forceIdx > -1 ? lines[forceIdx + 1] || "" : "";

    const mechanicIdx = lines.indexOf("Mechanic");
    const mechanic = mechanicIdx > -1 ? lines[mechanicIdx + 1] || "" : "";

    // Images from media.musclewiki.com
    const images = [...document.querySelectorAll("img")]
      .map(img => img.src || img.getAttribute("src") || "")
      .filter(src => src.includes("media.musclewiki.com"))
      .map(src => {
        // Extract original URL from Next.js image proxy
        try {
          if (src.includes("/_next/image")) {
            const u = new URL(src);
            return decodeURIComponent(u.searchParams.get("url") || src);
          }
          return src;
        } catch { return src; }
      });

    // GIF - look for .gif or video
    const gifEl = document.querySelector('img[src*=".gif"], video source[src*=".mp4"], video[src*=".mp4"]');
    const gif_url = gifEl?.src || gifEl?.getAttribute("src") || "";

    // Category/exercise type from metadata
    const difficultyIdx = lines.indexOf("Difficulty");
    const category = force ? `${force} - ${mechanic}` : "";

    return {
      title,
      description: document.querySelector('meta[name="description"]')?.content || "",
      difficulty,
      exercise_type: mechanic || "",
      primary_muscles,
      secondary_muscles: [],
      equipments: [],
      instructions,
      tips: [],
      images,
      gif_url,
      thumbnail_url: images[0] || "",
      calories_burn: 0,
      category,
    };
  });
}

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(v => (typeof v === "string" ? v.trim() : v)).filter(Boolean);
  if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

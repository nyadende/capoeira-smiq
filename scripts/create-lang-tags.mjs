/**
 * Creates the four language tags in Kit and prints the env var lines
 * to paste into Vercel / .env.local.
 *
 * Usage:
 *   KIT_API_KEY=<your_key> node scripts/create-lang-tags.mjs
 */

const KIT_API = "https://api.kit.com/v4";

const TAGS = [
  { lang: "en", envVar: "KIT_TAG_ID_LANG_EN", name: "lang:en" },
  { lang: "pt", envVar: "KIT_TAG_ID_LANG_PT", name: "lang:pt" },
  { lang: "es", envVar: "KIT_TAG_ID_LANG_ES", name: "lang:es" },
  { lang: "fr", envVar: "KIT_TAG_ID_LANG_FR", name: "lang:fr" },
];

const apiKey = process.env.KIT_API_KEY;
if (!apiKey) {
  console.error("Error: KIT_API_KEY env var is not set.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "X-Kit-Api-Key": apiKey,
};

console.log("Creating language tags in Kit...\n");

const results = await Promise.all(
  TAGS.map(async ({ lang, envVar, name }) => {
    const res = await fetch(`${KIT_API}/tags`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name }),
    });

    const body = await res.json();

    if (!res.ok) {
      console.error(`  ✗ ${name} — ${res.status}: ${JSON.stringify(body)}`);
      return null;
    }

    const id = body.tag?.id ?? body.id;
    console.log(`  ✓ ${name}  →  id ${id}`);
    return { envVar, id };
  })
);

console.log("\nAdd these to Vercel / .env.local:\n");
for (const result of results) {
  if (result) console.log(`${result.envVar}=${result.id}`);
}

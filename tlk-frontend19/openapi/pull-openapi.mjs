import fs from "node:fs";
import path from "node:path";

const url = process.env.OPENAPI_URL ?? "https://the-lion-king.mnga3x4jwz5xc.eu-central-1.cs.amazonlightsail.com/v3/api-docs.yaml";
const outPath = path.resolve("openapi/openapi.yaml");

console.log(`Downloading OpenAPI spec from: ${url}`);
const res = await fetch(url);

if (!res.ok) {
  console.error(`Failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const text = await res.text();
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, text, "utf8");

console.log(`Saved to: ${outPath} (overwritten)`);

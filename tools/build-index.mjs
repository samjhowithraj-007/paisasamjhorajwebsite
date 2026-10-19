// Saves the Ask Raj search index as site-index.json. Run before each push:  node tools/build-index.mjs
// It opens index.html#site-index in headless Chrome (the page builds the index from its own lessons and calculators)
// and writes the JSON next to index.html. Format: { site, built, items: [{ id, type, title, url, text, checked? }] }.
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync);
if (!chrome) throw new Error("Chrome or Edge not found");
const url = pathToFileURL(join(root, "index.html")).href + "#site-index";
const html = execFileSync(chrome, ["--headless=new", "--disable-gpu", "--virtual-time-budget=4000", "--dump-dom", url], { encoding: "utf8", maxBuffer: 64 << 20 });
const m = html.match(/<pre id="site-index">([\s\S]*?)<\/pre>/);
if (!m || !m[1].trim()) throw new Error("index not found in the page");
const text = m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const idx = JSON.parse(text);
if (!idx.items || idx.items.length < 20) throw new Error("index looks too small: " + (idx.items || []).length);
writeFileSync(join(root, "site-index.json"), JSON.stringify(idx, null, 1) + "\n");
console.log(`site-index.json: ${idx.items.length} items, built ${idx.built}`);

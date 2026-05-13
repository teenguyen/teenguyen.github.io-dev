/**
 * Copies published static files from @teenguyen/nook-phone into public/nook-phone/.
 * Mirrors the npm package "files" list.
 */
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "node_modules", "@teenguyen", "nook-phone");
const dest = path.join(root, "public", "nook-phone");
const entries = ["index.html", "css", "js", "assets"];

if (!existsSync(src)) {
  console.warn(
    "[sync-nook-phone] @teenguyen/nook-phone not found in node_modules; skip",
  );
  process.exit(0);
}

await mkdir(dest, { recursive: true });

for (const name of entries) {
  const from = path.join(src, name);
  if (!existsSync(from)) continue;
  const to = path.join(dest, name);
  await cp(from, to, { recursive: true });
}

const basePath = "/nook-phone/";

const indexPath = path.join(dest, "index.html");
if (existsSync(indexPath)) {
  let html = await readFile(indexPath, "utf8");
  if (!/<base\s+/i.test(html)) {
    html = html.replace(
      /<head(\s[^>]*)?>/i,
      (m) => `${m}\n    <base href="${basePath}" />`,
    );
    await writeFile(indexPath, html);
  }
}

const mainJsPath = path.join(dest, "js", "main.js");
if (existsSync(mainJsPath)) {
  let mainJs = await readFile(mainJsPath, "utf8");
  const before = mainJs;
  mainJs = mainJs.replaceAll(
    "new URL(srcAttr, window.location.href).href",
    "new URL(srcAttr, document.baseURI).href",
  );
  if (mainJs !== before) {
    await writeFile(mainJsPath, mainJs);
  }
}

console.log("[sync-nook-phone] synced → public/nook-phone/");

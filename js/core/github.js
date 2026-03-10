// js/core/github.js
//
// GitHub content ingestion layer.
// Handles:
//  - repository file access
//  - AM context loading
//  - tactic vault crawling

import { G } from "./state.js";

import { bootLog, updateVaultDisplay } from "../ui/boot.js";

/* ============================================================
   LOW LEVEL API
   ============================================================ */

export async function ghGet(path = "") {

  const headers = {
    Accept: "application/vnd.github.v3+json"
  };

  if (G.token) {
    headers["Authorization"] = `Bearer ${G.token}`;
  }

  const encodedPath = path
    .split("/")
    .map(seg => encodeURIComponent(seg))
    .join("/");

  const r = await fetch(
    `https://api.github.com/repos/${G.repo}/contents/${encodedPath}`,
    { headers }
  );

  if (!r.ok) {
    throw new Error(`${r.status} — ${path}`);
  }

  return r.json();
}

export async function ghFileText(path) {

  const raw = await ghGet(path);

  if (raw.encoding === "base64") {
    return atob(raw.content.replace(/\n/g, ""));
  }

  return raw.content || "";
}

/* ============================================================
   AM CONTEXT LOADER
   ============================================================ */

export async function fetchAMContext() {

  for (const p of G.CONTEXT_PATHS) {

    try {

      if (p.endsWith(".md")) {

        const content = await ghFileText(p);

        G.amContextDocs.push({
          title: p,
          content: content.slice(0, 3000)
        });

        bootLog(`  ✓ Context: ${p} (${content.length} chars)`);

      }
      else {

        const items = await ghGet(p);

        for (const item of items.filter(
          i => i.type === "file" && /\.md$/i.test(i.name)
        )) {

          const content = await ghFileText(item.path);

          G.amContextDocs.push({
            title: item.name,
            content: content.slice(0, 2000)
          });

        }

        bootLog(`  ✓ Context folder: ${p}`);

      }

    }
    catch (e) {

      bootLog(`  ⚠ Context skipped: ${p}`);

    }

  }

}

/* ============================================================
   VAULT CRAWLER
   ============================================================ */

export async function crawlVault() {

  let root;

  try {

    root = await ghGet("");

  }
  catch (e) {

    throw new Error("Cannot read repo root: " + e.message);

  }

  const allowed = root.filter(
    i => i.type === "dir" && G.INGEST_DIRS.includes(i.name)
  );

  bootLog(
    `  Ingesting ${allowed.length} dirs: ${allowed.map(d => d.name).join(" · ")}`
  );

  for (const dir of allowed) {

    bootLog(`  ▸ ${dir.name}...`);

    await crawlDir(dir.path, dir.name);

    bootLog(`    → ${G.vault.allTactics.length} tactics`);

  }

}

/* ============================================================
   RECURSIVE DIRECTORY CRAWLER
   ============================================================ */

async function crawlDir(dirPath, cat, sub = "") {

  let items;

  try {

    items = await ghGet(dirPath);

  }
  catch (e) {

    return;

  }

  for (const f of items.filter(
    i => i.type === "file" && /\.(md|txt)$/i.test(i.name)
  )) {

    try {

      const content = await ghFileText(f.path);

      const title = f.name
        .replace(/\.(md|txt)$/i, "")
        .replace(/[-_]/g, " ");

      const tactic = {

        path: f.path,
        title,
        content: content.slice(0, 2500),
        category: cat,
        subcategory: sub

      };

      G.vault.allTactics.push(tactic);

      if (!G.vault.categories[cat]) {
        G.vault.categories[cat] = {};
      }

      if (!G.vault.categories[cat][sub || "_"]) {
        G.vault.categories[cat][sub || "_"] = [];
      }

      G.vault.categories[cat][sub || "_"].push(tactic);

      G.vault.fileCount++;

      updateVaultDisplay();

    }
    catch (e) {}

  }

  for (const d of items.filter(i => i.type === "dir")) {

    await crawlDir(d.path, cat, d.name);

  }

}
// js/ui/relationships.js

import { G } from "../core/state.js";

/* ============================================================
   RELATIONSHIP GRAPH RENDER
   ============================================================ */

const SIM_IDS = ["TED","ELLEN","NIMDOK","GORRISTER","BENNY"];

export function renderRelationships() {

  const panel = document.getElementById("relationships-body");
  if (!panel) return;

  panel.innerHTML = "";

  for (const a of SIM_IDS) {

    for (const b of SIM_IDS) {

      if (a >= b) continue;

      const val = G.sims[a].relationships?.[b] ?? 0;

      const row = document.createElement("div");
      row.className = "rel-row";

      let color = "#333";

      if (val > 0.4) color = "#3fbf6a";
      else if (val > 0.15) color = "#6c9";
      else if (val < -0.4) color = "#ff3a3a";
      else if (val < -0.15) color = "#ff7a7a";

      row.innerHTML =
        `<span class="rel-a">${a}</span>` +
        `<span class="rel-line" style="color:${color}">` +
        ` ${val.toFixed(2)} ` +
        `</span>` +
        `<span class="rel-b">${b}</span>`;

      panel.appendChild(row);

    }

  }

}
// js/engine/analysis/relationshipMatrix.js

import { G } from "../../core/state.js";
import { SIM_IDS } from "../../core/constants.js";

/* ============================================================
   RELATIONSHIP MATRIX DEBUG VIEW

   Prints the entire social trust network as a matrix.
   Useful for spotting alliances, distrust clusters,
   and asymmetric relationships.
============================================================ */

export function printRelationshipMatrix() {

    const matrix = {};

    for (const a of SIM_IDS) {

        matrix[a] = {};

        for (const b of SIM_IDS) {

            if (a === b) {

                matrix[a][b] = "—";
                continue;

            }

            const rel =
                G.sims[a]?.relationships?.[b] ?? 0;

            /* ------------------------------------------------------------
              VISUAL HINTS
              Strong trust and hostility stand out in console
           ------------------------------------------------------------ */

            if (rel > 0.3) {
                matrix[a][b] = `+${rel.toFixed(2)}`;
            }
            else if (rel < -0.3) {
                matrix[a][b] = `${rel.toFixed(2)}`;
            }
            else {
                matrix[a][b] = rel.toFixed(2);
            }

        }

    }

    console.group(
        `%cRELATIONSHIP MATRIX // CYCLE ${G.cycle}`,
        "color:#7fd;font-weight:bold"
    );

    console.table(matrix);

    console.groupEnd();

}
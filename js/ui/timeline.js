// js/ui/timeline.js

import { G } from "../core/state.js";

const MAX_ROWS = 800;

function formatTime() {

  const d = new Date();

  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");

  return `${h}:${m}:${s}`;
}

export function timelineEvent(label) {

  // Persist event to simulation state first
  G.timeline.push({
    cycle: G.cycle,
    time: Date.now(),
    label
  });

  if (G.timeline.length > G.timelineMax) {
    G.timeline.shift();
  }

  const body = document.getElementById("timeline-body");
  if (!body) return;

  const row = document.createElement("div");

  if (
    label.startsWith("=====") ||
    label.startsWith(">>>") ||
    label.startsWith("//") ||
    label.startsWith("!!")
  ) {
    row.className = "timeline-row timeline-marker";
  } else {
    row.className = "timeline-row";
  }

  const cycle = document.createElement("span");
  cycle.className = "timeline-cycle";
  cycle.textContent = `C${G.cycle}`;

  const time = document.createElement("span");
  time.className = "timeline-step";
  time.textContent = formatTime();

  const text = document.createElement("span");
  text.className = "timeline-label";
  text.textContent = ` → ${label}`;

  row.appendChild(cycle);
  row.appendChild(document.createTextNode(" "));
  row.appendChild(time);
  row.appendChild(text);

  body.appendChild(row);

  if (body.children.length > MAX_ROWS) {
    body.removeChild(body.firstChild);
  }

  body.scrollTop = body.scrollHeight;
}

export function timelineClear() {

  const body = document.getElementById("timeline-body");
  if (!body) return;

  body.innerHTML = "";

}
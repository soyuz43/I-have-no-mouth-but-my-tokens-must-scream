import { G } from "../core/state.js";

export function applyRelationshipDrift(fromId, toId, delta, reason) {

  const from = G.sims[fromId];
  if (!from || !from.relationships) return;

  if (from.relationships[toId] == null) return;

  from.relationships[toId] += delta;

  from.relationships[toId] = Math.max(
    -100,
    Math.min(100, from.relationships[toId])
  );

  G.transmissionLog.push({
    type: "relationship_shift",
    from: fromId,
    to: toId,
    delta,
    cycle: G.cycle,
    reason
  });

}
// js/core/bus.js
// Simple simulation event bus

const listeners = {};

export function on(event, fn) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
}

export function emit(event, payload) {
  const subs = listeners[event];
  if (!subs) return;

  for (const fn of subs) {
    try {
      fn(payload);
    } catch (e) {
      console.error(`[bus] ${event} listener error`, e);
    }
  }
}
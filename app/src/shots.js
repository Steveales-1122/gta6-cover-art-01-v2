// Vice City Sunset Studio — screenshot mode.
// ?shot=cover renders just the cover full-viewport (the app's own drawing of
// the exported cover, at a size within the screenshot limits).
// ?shot=editor shows the full editor with a preset applied.
// ?preset=<id> picks the look, ?size=square|portrait|wide picks the export size.
import { applyPreset } from './presets.js';
import { renderCover } from './cover.js';
import { getState, setState, initEditor } from './main.js';

export function runShotMode() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return false;
  const presetId = q.get('preset') || 'sunset-heist';
  const sizeId = q.get('size') || 'wide';
  const state = applyPreset(getState(), presetId);
  state.size = sizeId;
  setState(state);
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    const canvas = document.createElement('canvas');
    canvas.id = 'shot-canvas';
    document.body.appendChild(canvas);
    const sizes = { square: [1080, 1080], portrait: [1080, 1350], wide: [1920, 1080] };
    const [w, h] = sizes[sizeId] || sizes.wide;
    // Fit the cover inside the viewport while keeping its aspect.
    const scale = Math.min(window.innerWidth / w, window.innerHeight / h);
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    renderCover(ctx, state, new Map(), w, h);
    document.title = `Cover · ${presetId}`;
    return true;
  }
  // Editor shot: boot the full editor with the preset already applied.
  initEditor();
  document.title = `Editor · ${presetId}`;
  return true;
}

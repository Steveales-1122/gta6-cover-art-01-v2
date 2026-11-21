// Vice City Sunset Studio — editor wiring.
// Owns the app state, the control panels, photo uploads (read on the user's
// own machine, never uploaded anywhere), panel drag-to-pan, and PNG export.
import { SIZES, LAYOUTS, GRADES, FONTS, PRESETS, defaultState, applyPreset, applyLayout } from './presets.js';
import { SCENES, sceneThumbnail } from './scenes.js';
import { renderCover } from './cover.js';

const $ = (id) => document.getElementById(id);
const photos = new Map(); // id -> HTMLImageElement (uploaded photos)
let photoSeq = 0;
let state = defaultState();
let previewScale = 1;

export function getState() { return state; }
export function setState(next) { state = next; }
export function getPhotos() { return photos; }

function sizeOf() {
  return SIZES.find((s) => s.id === state.size) || SIZES[0];
}

function render() {
  const canvas = $('preview');
  const size = sizeOf();
  const box = $('preview-wrap');
  const availW = Math.max(320, box.clientWidth - 8);
  const availH = Math.max(320, box.clientHeight - 8);
  const scale = Math.min(availW / size.w, availH / size.h, 1);
  previewScale = scale;
  canvas.width = Math.round(size.w * scale);
  canvas.height = Math.round(size.h * scale);
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  renderCover(ctx, state, photos, size.w, size.h);
  $('size-label').textContent = `${size.label} · preview ${canvas.width}×${canvas.height}`;
}

function refreshPanels() {
  const layout = LAYOUTS[state.layout];
  const list = $('panel-list');
  list.innerHTML = '';
  layout.panels.forEach((_, i) => {
    const p = state.panels[i];
    const btn = document.createElement('button');
    btn.className = `panel-chip${i === state.selected ? ' selected' : ''}`;
    btn.type = 'button';
    btn.textContent = `Panel ${i + 1} · ${p.kind === 'photo' ? 'photo' : SCENES[p.ref]?.label || p.ref}`;
    btn.addEventListener('click', () => {
      state.selected = i;
      syncControls();
      render();
    });
    list.appendChild(btn);
  });
  // Filmstrip: scenes + uploaded photos.
  const strip = $('filmstrip');
  strip.innerHTML = '';
  Object.entries(SCENES).forEach(([name, scene]) => {
    const thumb = document.createElement('button');
    thumb.className = 'thumb';
    thumb.type = 'button';
    thumb.title = scene.label;
    const img = document.createElement('img');
    img.src = sceneThumbnail(name);
    img.alt = scene.label;
    thumb.appendChild(img);
    const cap = document.createElement('span');
    cap.textContent = scene.label;
    thumb.appendChild(cap);
    thumb.addEventListener('click', () => assignScene(name));
    strip.appendChild(thumb);
  });
  photos.forEach((img, id) => {
    const thumb = document.createElement('button');
    thumb.className = 'thumb';
    thumb.type = 'button';
    thumb.title = `Uploaded photo ${id}`;
    const im = document.createElement('img');
    im.src = img.src;
    im.alt = 'Uploaded photo';
    thumb.appendChild(im);
    const cap = document.createElement('span');
    cap.textContent = 'Your photo';
    thumb.appendChild(cap);
    thumb.addEventListener('click', () => assignPhoto(id));
    strip.appendChild(thumb);
  });
}

function assignScene(name) {
  const p = state.panels[state.selected];
  if (!p) return;
  p.kind = 'scene';
  p.ref = name;
  p.zoom = 1;
  p.panX = 0;
  p.panY = 0;
  syncControls();
  render();
}

function assignPhoto(id) {
  const p = state.panels[state.selected];
  if (!p) return;
  p.kind = 'photo';
  p.ref = id;
  p.zoom = 1;
  p.panX = 0;
  p.panY = 0;
  syncControls();
  render();
}

function syncControls() {
  $('layout-select').value = state.layout;
  $('grade-select').value = state.grade;
  $('font-select').value = state.font;
  $('size-select').value = state.size;
  $('title-input').value = state.title;
  $('subtitle-input').value = state.subtitle;
  $('tagline-input').value = state.tagline;
  $('title-size').value = String(state.titleSize);
  $('title-tilt').value = String(state.titleTilt);
  $('caption-pos').value = state.captionPos;
  $('glow-check').checked = state.glow;
  $('outline-check').checked = state.outline;
  const p = state.panels[state.selected] || { zoom: 1, panX: 0, panY: 0, flip: false };
  $('zoom-range').value = String(p.zoom);
  $('panx-range').value = String(p.panX);
  $('pany-range').value = String(p.panY);
  $('flip-check').checked = !!p.flip;
  Object.keys(state.effects).forEach((key) => {
    const el = $(`fx-${key}`);
    if (el) el.checked = !!state.effects[key];
  });
  $('selected-label').textContent = `Panel ${state.selected + 1} of ${state.panels.length}`;
  refreshPanels();
}

function bindControls() {
  $('layout-select').addEventListener('change', (e) => {
    state = applyLayout(state, e.target.value);
    syncControls();
    render();
  });
  $('grade-select').addEventListener('change', (e) => { state.grade = e.target.value; render(); });
  $('font-select').addEventListener('change', (e) => { state.font = e.target.value; render(); });
  $('size-select').addEventListener('change', (e) => { state.size = e.target.value; render(); });
  $('title-input').addEventListener('input', (e) => { state.title = e.target.value; render(); });
  $('subtitle-input').addEventListener('input', (e) => { state.subtitle = e.target.value; render(); });
  $('tagline-input').addEventListener('input', (e) => { state.tagline = e.target.value; render(); });
  $('title-size').addEventListener('input', (e) => { state.titleSize = Number(e.target.value); render(); });
  $('title-tilt').addEventListener('input', (e) => { state.titleTilt = Number(e.target.value); render(); });
  $('caption-pos').addEventListener('change', (e) => { state.captionPos = e.target.value; render(); });
  $('glow-check').addEventListener('change', (e) => { state.glow = e.target.checked; render(); });
  $('outline-check').addEventListener('change', (e) => { state.outline = e.target.checked; render(); });
  $('zoom-range').addEventListener('input', (e) => { panel().zoom = Number(e.target.value); render(); });
  $('panx-range').addEventListener('input', (e) => { panel().panX = Number(e.target.value); render(); });
  $('pany-range').addEventListener('input', (e) => { panel().panY = Number(e.target.value); render(); });
  $('flip-check').addEventListener('change', (e) => { panel().flip = e.target.checked; render(); });
  Object.keys(state.effects).forEach((key) => {
    $(`fx-${key}`).addEventListener('change', (e) => { state.effects[key] = e.target.checked; render(); });
  });
  $('reset-panel').addEventListener('click', () => {
    const p = panel();
    p.zoom = 1; p.panX = 0; p.panY = 0; p.flip = false;
    syncControls();
    render();
  });
  $('upload').addEventListener('change', (e) => addFiles(e.target.files));
  $('dropzone').addEventListener('click', () => $('upload').click());
  $('dropzone').addEventListener('dragover', (e) => { e.preventDefault(); $('dropzone').classList.add('over'); });
  $('dropzone').addEventListener('dragleave', () => $('dropzone').classList.remove('over'));
  $('dropzone').addEventListener('drop', (e) => {
    e.preventDefault();
    $('dropzone').classList.remove('over');
    addFiles(e.dataTransfer.files);
  });
  $('export-btn').addEventListener('click', exportCover);
  $('random-btn').addEventListener('click', () => {
    const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    state = applyPreset(state, preset.id);
    syncControls();
    render();
  });
  // Preset buttons.
  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state = applyPreset(state, btn.dataset.preset);
      syncControls();
      render();
    });
  });
  // Panel picking + drag-to-pan on the preview canvas.
  const canvas = $('preview');
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const layout = LAYOUTS[state.layout];
    const hit = layout.panels.findIndex((p) => x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h);
    if (hit >= 0) state.selected = hit;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    syncControls();
    render();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const p = panel();
    p.panX += ((e.clientX - lastX) / canvas.clientWidth) * 2;
    p.panY += ((e.clientY - lastY) / canvas.clientHeight) * 2;
    p.panX = Math.max(-1, Math.min(1, p.panX));
    p.panY = Math.max(-1, Math.min(1, p.panY));
    lastX = e.clientX;
    lastY = e.clientY;
    render();
  });
  canvas.addEventListener('pointerup', () => { dragging = false; syncControls(); });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const p = panel();
    p.zoom = Math.max(0.6, Math.min(3, p.zoom * (e.deltaY < 0 ? 1.08 : 0.93)));
    $('zoom-range').value = String(p.zoom);
    render();
  }, { passive: false });
  window.addEventListener('resize', render);
}

function panel() {
  return state.panels[state.selected] || state.panels[0];
}

function addFiles(files) {
  if (!files) return;
  const jobs = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    jobs.push(new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          photoSeq += 1;
          const id = `photo-${photoSeq}`;
          photos.set(id, img);
          // Fill the selected panel with the first new photo.
          if (jobs.length === 1 || state.panels[state.selected].kind === 'scene') assignPhoto(id);
          resolve();
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    }));
  }
  Promise.all(jobs).then(() => { syncControls(); render(); });
}

function exportCover() {
  const size = sizeOf();
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  renderCover(off.getContext('2d'), state, photos, size.w, size.h);
  off.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vice-city-cover-${size.w}x${size.h}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    $('export-note').textContent = `Exported ${size.w} × ${size.h} PNG · ${Math.round(blob.size / 1024)} KiB`;
  }, 'image/png');
}

function fillSelects() {
  const layout = $('layout-select');
  Object.entries(LAYOUTS).forEach(([id, l]) => {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = l.label;
    layout.appendChild(o);
  });
  const grade = $('grade-select');
  Object.entries(GRADES).forEach(([id, g]) => {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = g.label;
    grade.appendChild(o);
  });
  const font = $('font-select');
  Object.entries(FONTS).forEach(([id, f]) => {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = f.label;
    font.appendChild(o);
  });
  const size = $('size-select');
  SIZES.forEach((s) => {
    const o = document.createElement('option');
    o.value = s.id;
    o.textContent = s.label;
    size.appendChild(o);
  });
  const presets = $('preset-row');
  PRESETS.forEach((p) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'preset-btn';
    b.dataset.preset = p.id;
    b.textContent = p.label;
    presets.appendChild(b);
  });
}

export function initEditor() {
  fillSelects();
  bindControls();
  syncControls();
  render();
}

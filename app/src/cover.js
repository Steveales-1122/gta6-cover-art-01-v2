// Vice City Sunset Studio — cover renderer.
// Draws the multi-panel poster onto any canvas: panels (photo or procedural
// scene, cover-fit with pan/zoom/flip), the Vice City grade wash, poster
// effects, and the bold caption. Pure canvas 2D, no network, no fonts to load.
import { LAYOUTS, GRADES, FONTS } from './presets.js';
import { paintScene } from './scenes.js';

function drawPhotoCover(ctx, img, panel, px, py, pw, ph) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(pw / iw, ph / ih) * (panel.zoom || 1);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = px + (pw - dw) / 2 + (panel.panX || 0) * pw * 0.2;
  const dy = py + (ph - dh) / 2 + (panel.panY || 0) * ph * 0.2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();
  if (panel.flip) {
    ctx.translate(px + pw, py);
    ctx.scale(-1, 1);
    ctx.drawImage(img, dx - px, dy, dw, dh);
  } else {
    ctx.drawImage(img, dx, dy, dw, dh);
  }
  ctx.restore();
}

function drawSceneCover(ctx, name, panel, px, py, pw, ph) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();
  const zoom = panel.zoom || 1;
  const sw = pw * zoom;
  const sh = ph * zoom;
  const sx = px + (pw - sw) / 2 + (panel.panX || 0) * pw * 0.2;
  const sy = py + (ph - sh) / 2 + (panel.panY || 0) * ph * 0.2;
  const off = document.createElement('canvas');
  off.width = Math.max(2, Math.round(pw));
  off.height = Math.max(2, Math.round(ph));
  paintScene(off.getContext('2d'), name, off.width, off.height);
  if (panel.flip) {
    ctx.translate(px + pw, py);
    ctx.scale(-1, 1);
    ctx.drawImage(off, sx - px, sy, sw, sh);
  } else {
    ctx.drawImage(off, sx, sy, sw, sh);
  }
  ctx.restore();
}

function gradeWash(ctx, w, h, grade) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  grade.sky.forEach((c, i) => g.addColorStop(i / (grade.sky.length - 1), c));
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
  ctx.fillStyle = grade.wash;
  ctx.fillRect(0, 0, w, h);
}

function halftone(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  const step = Math.max(7, w / 130);
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const r = step * 0.16 * (0.5 + 0.5 * Math.sin((x + y) / step));
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function grain(ctx, w, h) {
  ctx.save();
  const n = Math.floor((w * h) / 2600);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < n; i += 1) {
    const x = ((i * 7919) % w);
    const y = ((i * 104729) % h);
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  for (let i = 0; i < n; i += 1) {
    const x = ((i * 104729) % w);
    const y = ((i * 7919) % h);
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.restore();
}

function vignette(ctx, w, h) {
  const g = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.42,
    w / 2, h / 2, Math.max(w, h) * 0.75,
  );
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(10, 4, 20, 0.5)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function scanlines(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
  for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 2);
  ctx.restore();
}

function lightLeak(ctx, w, h) {
  const g = ctx.createRadialGradient(w * 0.88, h * 0.08, 0, w * 0.88, h * 0.08, w * 0.55);
  g.addColorStop(0, 'rgba(255, 190, 120, 0.34)');
  g.addColorStop(1, 'rgba(255, 190, 120, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function duotone(ctx, w, h, grade) {
  ctx.save();
  ctx.globalCompositeOperation = 'color';
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, grade.sky[0]);
  g.addColorStop(1, grade.sky[grade.sky.length - 1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function palmSilhouette(ctx, w, h, color) {
  // Two palm silhouettes framing the bottom corners, drawn from arcs and lines.
  function one(x, y, s, lean) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(lean);
    ctx.scale(s, s);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, -70, -8, -130);
    ctx.stroke();
    for (let i = 0; i < 7; i += 1) {
      const a = -Math.PI * (0.08 + i * 0.13);
      const len = 62 - Math.abs(i - 3) * 8;
      ctx.beginPath();
      ctx.moveTo(-8, -130);
      ctx.quadraticCurveTo(
        -8 + Math.cos(a) * len * 0.6,
        -130 + Math.sin(a) * len * 0.6 - 16,
        -8 + Math.cos(a) * len,
        -130 + Math.sin(a) * len + 18,
      );
      ctx.lineWidth = 6;
      ctx.stroke();
    }
    ctx.restore();
  }
  const s = Math.min(w, h) / 380;
  one(w * 0.06, h * 1.02, s, 0.1);
  one(w * 0.94, h * 1.02, s * 0.85, -0.12);
}

function sunOverlay(ctx, w, h, grade) {
  // Warm glow only — the scenes already paint their own sun discs, so a
  // second disc here read as a double sun. The glow adds atmosphere.
  const cx = w * 0.72;
  const cy = h * 0.22;
  const r = Math.min(w, h) * 0.16;
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.4);
  glow.addColorStop(0, grade.sun);
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = glow;
  ctx.fillRect(cx - r * 2.4, cy - r * 2.4, r * 4.8, r * 4.8);
  ctx.restore();
}

function inkFor(grade) {
  // The caption band is dark, so a dark grade ink (pastel) would vanish.
  // Switch to a light ink when the grade's ink is dark.
  const hex = grade.ink.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum < 128 ? '#fff7e6' : grade.ink;
}

function drawCaption(ctx, state, w, h) {
  const grade = GRADES[state.grade];
  const font = FONTS[state.font];
  const ink = inkFor(grade);
  const bandH = h * 0.26;
  const top = state.captionPos === 'top';
  const bandY = top ? 0 : h - bandH;
  // Caption band: dark gradient so lettering always reads.
  const bg = ctx.createLinearGradient(0, bandY, 0, bandY + bandH);
  if (top) {
    bg.addColorStop(0, 'rgba(12, 4, 24, 0.72)');
    bg.addColorStop(1, 'rgba(12, 4, 24, 0)');
  } else {
    bg.addColorStop(0, 'rgba(12, 4, 24, 0)');
    bg.addColorStop(1, 'rgba(12, 4, 24, 0.78)');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, bandY, w, bandH);

  const subSize = Math.max(13, w * 0.022);
  const tagSize = Math.max(12, w * 0.018);
  const cx = w / 2;
  // Script lettering keeps its own case; the rest shout in capitals.
  const titleText = state.font === 'script'
    ? (state.title || 'Vice City')
    : (state.title || 'VICE CITY').toUpperCase();
  // Vertical stack, top to bottom: title block, tagline, subtitle (bottom
  // captions) — mirrored for top captions: title, subtitle, tagline.
  const pad = bandH * 0.05;
  let titleTop;
  let titleBottom;
  let subY;
  let tagY;
  if (top) {
    titleTop = bandY + pad;
    titleBottom = bandY + bandH * 0.6;
    subY = bandY + bandH * 0.76;
    tagY = bandY + bandH * 0.9;
  } else {
    subY = h - bandH * 0.07;
    tagY = subY - (subSize + tagSize) * 0.95;
    titleTop = bandY + pad;
    titleBottom = tagY - tagSize;
  }
  // Fit the title into its block: shrink until the wrapped lines fit the
  // height and the widest line fits the width.
  const titleAvailW = w * 0.92;
  const titleAvailH = Math.max(20, titleBottom - titleTop);
  let titleSize = Math.min(w * 0.115, h * 0.16) * (state.titleSize || 1);
  const measure = () => {
    ctx.font = `${font.weight} ${titleSize}px ${font.stack}`;
    const lines = wrapTitle(ctx, titleText, titleAvailW, font, titleSize);
    const widest = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
    return { lines, widest };
  };
  let { lines, widest } = measure();
  while (titleSize > 18 && (lines.length * titleSize * 1.04 > titleAvailH || widest > titleAvailW)) {
    titleSize *= 0.9;
    ({ lines, widest } = measure());
  }
  const lineH = titleSize * 1.04;
  const titleCenterY = (titleTop + titleBottom) / 2;
  const startY = titleCenterY - ((lines.length - 1) * lineH) / 2;
  ctx.save();
  ctx.translate(cx, titleCenterY);
  ctx.rotate(((state.titleTilt || 0) * Math.PI) / 180);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, i) => {
    const y = startY - titleCenterY + i * lineH;
    if (state.glow) {
      ctx.shadowColor = grade.glow;
      ctx.shadowBlur = titleSize * 0.35;
    }
    if (state.outline) {
      ctx.lineWidth = Math.max(2, titleSize * 0.09);
      ctx.strokeStyle = 'rgba(20, 6, 32, 0.9)';
      ctx.strokeText(line, 0, y);
    }
    ctx.fillStyle = ink;
    ctx.fillText(line, 0, y);
    ctx.shadowBlur = 0;
  });
  ctx.restore();

  // Subtitle and tagline.
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${subSize}px 'Trebuchet MS', 'Segoe UI', sans-serif`;
  ctx.fillStyle = grade.sun;
  if (state.subtitle) ctx.fillText(track(state.subtitle.toUpperCase(), 0.28), cx, subY);
  ctx.font = `italic 600 ${tagSize}px Georgia, 'Times New Roman', serif`;
  ctx.fillStyle = 'rgba(255, 247, 230, 0.92)';
  if (state.tagline) ctx.fillText(state.tagline, cx, tagY);
  ctx.restore();
}

function track(text, em) {
  // Fake letter tracking by inserting thin spaces.
  return text.split('').join('\u2009'.repeat(Math.max(1, Math.round(em * 4))));
}

function wrapTitle(ctx, title, maxW, font, size) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    ctx.font = `${font.weight} ${size}px ${font.stack}`;
    if (ctx.measureText(test).width <= maxW || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Render the whole cover onto ctx at pixel size w x h.
// photos: Map of photo id -> HTMLImageElement (uploaded photos only).
export function renderCover(ctx, state, photos, w, h) {
  const layout = LAYOUTS[state.layout] || LAYOUTS.hero;
  const grade = GRADES[state.grade] || GRADES.sunset;
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#12081f';
  ctx.fillRect(0, 0, w, h);
  // Panels with white gutters, GTA poster style.
  const gutter = Math.max(3, Math.round(w * 0.008));
  layout.panels.forEach((panel, i) => {
    const px = panel.x * w + (panel.x > 0 ? gutter / 2 : 0);
    const py = panel.y * h + (panel.y > 0 ? gutter / 2 : 0);
    const pw = panel.w * w - (panel.x > 0 ? gutter / 2 : 0) - (panel.x + panel.w < 1 ? gutter / 2 : 0);
    const ph = panel.h * h - (panel.y > 0 ? gutter / 2 : 0) - (panel.y + panel.h < 1 ? gutter / 2 : 0);
    const p = state.panels[i] || { kind: 'scene', ref: 'beach', zoom: 1, panX: 0, panY: 0, flip: false };
    if (p.kind === 'photo' && photos.get(p.ref)) {
      drawPhotoCover(ctx, photos.get(p.ref), p, px, py, pw, ph);
    } else {
      drawSceneCover(ctx, p.ref || 'beach', p, px, py, pw, ph);
    }
    // Panel frame.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = Math.max(2, w * 0.004);
    ctx.strokeRect(px, py, pw, ph);
  });
  gradeWash(ctx, w, h, grade);
  const fx = state.effects || {};
  if (fx.sun) sunOverlay(ctx, w, h, grade);
  if (fx.palms) palmSilhouette(ctx, w, h, 'rgba(18, 8, 31, 0.85)');
  if (fx.duotone) duotone(ctx, w, h, grade);
  if (fx.halftone) halftone(ctx, w, h);
  if (fx.scanlines) scanlines(ctx, w, h);
  if (fx.leak) lightLeak(ctx, w, h);
  if (fx.grain) grain(ctx, w, h);
  if (fx.vignette) vignette(ctx, w, h);
  drawCaption(ctx, state, w, h);
  ctx.restore();
}

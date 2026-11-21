// Vice City Sunset Studio — procedural sample scenes.
// Every "photo" the app ships is painted here in code: gradient skies, a sun disc,
// sea, sand, streets and palm silhouettes drawn from scratch. No image files,
// no Rockstar artwork, no photo of a real person.

function sky(ctx, w, h, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  stops.forEach(([at, color]) => g.addColorStop(at, color));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function sunDisc(ctx, w, h, color, r) {
  const cx = w * 0.5;
  const cy = h * 0.42;
  const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 2.2);
  glow.addColorStop(0, color);
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - r * 2.2, cy - r * 2.2, r * 4.4, r * 4.4);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function sunStripes(ctx, w, h, color, cy, r) {
  // Retro sun with horizontal cuts.
  ctx.save();
  ctx.beginPath();
  ctx.arc(w * 0.5, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.0)';
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 5; i += 1) {
    const y = cy + r * 0.1 + i * r * 0.22;
    ctx.fillRect(0, y, w, r * 0.07 + i * r * 0.02);
  }
  ctx.restore();
}

function palm(ctx, x, y, s, lean, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean);
  ctx.scale(s, s);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(6, -60, -6, -110);
  ctx.stroke();
  // Fronds.
  for (let i = 0; i < 7; i += 1) {
    const a = -Math.PI * (0.08 + i * 0.13);
    const len = 52 - Math.abs(i - 3) * 7;
    ctx.beginPath();
    ctx.moveTo(-6, -110);
    ctx.quadraticCurveTo(
      -6 + Math.cos(a) * len * 0.6,
      -110 + Math.sin(a) * len * 0.6 - 14,
      -6 + Math.cos(a) * len,
      -110 + Math.sin(a) * len + 16,
    );
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  // Coconuts.
  ctx.beginPath();
  ctx.arc(-2, -104, 6, 0, Math.PI * 2);
  ctx.arc(-12, -100, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function sea(ctx, w, h, top, colors) {
  const g = ctx.createLinearGradient(0, top, 0, h);
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, top, w, h - top);
  // Sun glitter on the water.
  ctx.fillStyle = 'rgba(255, 220, 130, 0.5)';
  for (let i = 0; i < 26; i += 1) {
    const y = top + 8 + ((i * 37) % (h - top - 16));
    const ww = 20 + ((i * 53) % 90);
    ctx.fillRect(w * 0.5 - ww / 2 + ((i % 2 === 0 ? 1 : -1) * (i % 5) * 12), y, ww, 3);
  }
}

function sand(ctx, w, h, top, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, top + h * 0.04);
  ctx.quadraticCurveTo(w * 0.5, top - h * 0.03, w, top + h * 0.03);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();
}

function skyline(ctx, w, h, base, color, seed) {
  ctx.fillStyle = color;
  let x = 0;
  let n = 0;
  while (x < w) {
    const bw = w * (0.05 + ((seed + n * 37) % 40) / 400);
    const bh = h * (0.12 + ((seed + n * 61) % 100) / 400);
    ctx.fillRect(x, base - bh, bw, bh);
    // Lit windows.
    ctx.fillStyle = 'rgba(255, 214, 120, 0.85)';
    for (let wy = base - bh + 8; wy < base - 10; wy += 16) {
      for (let wx = x + 6; wx < x + bw - 6; wx += 14) {
        if ((wx * 7 + wy * 13 + seed) % 5 === 0) ctx.fillRect(wx, wy, 5, 7);
      }
    }
    ctx.fillStyle = color;
    x += bw + w * 0.012;
    n += 1;
  }
}

function street(ctx, w, h, top) {
  ctx.fillStyle = '#1b1b26';
  ctx.fillRect(0, top, w, h - top);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = Math.max(3, h * 0.006);
  ctx.setLineDash([26, 22]);
  ctx.beginPath();
  ctx.moveTo(0, top + (h - top) * 0.5);
  ctx.lineTo(w, top + (h - top) * 0.5);
  ctx.stroke();
  ctx.setLineDash([]);
  // Sidewalk edges.
  ctx.fillStyle = '#2c2c3a';
  ctx.fillRect(0, top, w, 6);
  ctx.fillRect(0, h - 8, w, 8);
}

function neonSign(ctx, x, y, text, color, size) {
  ctx.save();
  ctx.font = `900 ${size}px 'Arial Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.5;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.shadowBlur = size * 0.16;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, x, y);
  ctx.restore();
}

export const SCENES = {
  beach: {
    label: 'Sunset Beach',
    paint(ctx, w, h) {
      sky(ctx, w, h, [[0, '#ff9a3d'], [0.55, '#ff5e62'], [1, '#7b2ff7']]);
      sunStripes(ctx, w, h, '#ffd166', h * 0.42, Math.min(w, h) * 0.16);
      sea(ctx, w, h, h * 0.62, ['#e2628b', '#4a2a7d']);
      sand(ctx, w, h, h * 0.84, '#e8b48a');
      palm(ctx, w * 0.12, h * 0.86, Math.min(w, h) / 420, 0.08, '#241631');
      palm(ctx, w * 0.88, h * 0.88, Math.min(w, h) / 520, -0.1, '#1d1226');
    },
  },
  street: {
    label: 'Neon Street',
    paint(ctx, w, h) {
      sky(ctx, w, h, [[0, '#1a0b2e'], [0.6, '#4a1042'], [1, '#ff2e88']]);
      sunDisc(ctx, w, h, '#ff9de2', Math.min(w, h) * 0.09);
      skyline(ctx, w, h, h * 0.72, '#12081f', 7);
      street(ctx, w, h, h * 0.72);
      neonSign(ctx, w * 0.24, h * 0.3, 'VICE', '#00e5ff', Math.min(w, h) * 0.11);
      neonSign(ctx, w * 0.76, h * 0.44, '24H', '#ff2e88', Math.min(w, h) * 0.09);
      // Wet-road reflections.
      ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
      ctx.fillRect(w * 0.18, h * 0.76, w * 0.12, h * 0.2);
      ctx.fillStyle = 'rgba(255, 46, 136, 0.25)';
      ctx.fillRect(w * 0.7, h * 0.76, w * 0.12, h * 0.2);
    },
  },
  boulevard: {
    label: 'Palm Boulevard',
    paint(ctx, w, h) {
      sky(ctx, w, h, [[0, '#ffd6a5'], [0.5, '#ff9fb2'], [1, '#c084fc']]);
      sunDisc(ctx, w, h, '#fff3b0', Math.min(w, h) * 0.13);
      skyline(ctx, w, h, h * 0.66, '#6d4a7a', 21);
      street(ctx, w, h, h * 0.66);
      palm(ctx, w * 0.08, h * 0.68, Math.min(w, h) / 380, 0.05, '#3d2c4d');
      palm(ctx, w * 0.5, h * 0.68, Math.min(w, h) / 430, -0.04, '#3d2c4d');
      palm(ctx, w * 0.92, h * 0.68, Math.min(w, h) / 380, 0.1, '#3d2c4d');
      neonSign(ctx, w * 0.5, h * 0.22, 'OCEAN DR', '#ffffff', Math.min(w, h) * 0.07);
    },
  },
  skyline: {
    label: 'Skyline Dusk',
    paint(ctx, w, h) {
      sky(ctx, w, h, [[0, '#f7b733'], [0.45, '#fc4a1a'], [1, '#3b1d5e']]);
      sunDisc(ctx, w, h, '#ffe259', Math.min(w, h) * 0.15);
      skyline(ctx, w, h, h * 0.78, '#241631', 3);
      skyline(ctx, w, h, h * 0.86, '#160d20', 11);
      sea(ctx, w, h, h * 0.86, ['#5b2a86', '#1c0f33']);
      palm(ctx, w * 0.06, h * 0.9, Math.min(w, h) / 460, 0.12, '#0d0714');
    },
  },
};

export function paintScene(ctx, name, w, h) {
  const scene = SCENES[name] || SCENES.beach;
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  scene.paint(ctx, w, h);
  ctx.restore();
}

export function sceneThumbnail(name, w = 160, h = 100) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  paintScene(c.getContext('2d'), name, w, h);
  return c.toDataURL('image/png');
}

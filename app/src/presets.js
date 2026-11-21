// Vice City Sunset Studio — presets: layouts, colour grades, lettering and one-click looks.
// Everything here is original data authored for this entry: no Rockstar artwork, logo or font.

export const SIZES = [
  { id: 'square', label: 'Square · 1080 × 1080', w: 1080, h: 1080 },
  { id: 'portrait', label: 'Portrait · 1080 × 1350', w: 1080, h: 1350 },
  { id: 'wide', label: 'Wide · 1920 × 1080', w: 1920, h: 1080 },
];

// Multi-panel poster layouts. Each layout is a list of panels in unit coordinates
// (x, y, w, h as fractions of the cover) plus a caption band position.
export const LAYOUTS = {
  hero: {
    label: 'Hero · one big panel',
    caption: 'bottom',
    panels: [{ x: 0, y: 0, w: 1, h: 1 }],
  },
  split: {
    label: 'Split · two panels',
    caption: 'bottom',
    panels: [
      { x: 0, y: 0, w: 0.5, h: 1 },
      { x: 0.5, y: 0, w: 0.5, h: 1 },
    ],
  },
  triptych: {
    label: 'Triptych · three panels',
    caption: 'bottom',
    panels: [
      { x: 0, y: 0, w: 0.34, h: 1 },
      { x: 0.34, y: 0, w: 0.32, h: 1 },
      { x: 0.66, y: 0, w: 0.34, h: 1 },
    ],
  },
  grid: {
    label: 'Grid · four panels',
    caption: 'bottom',
    panels: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  comic: {
    label: 'Comic · wide + three',
    caption: 'top',
    panels: [
      { x: 0, y: 0, w: 1, h: 0.55 },
      { x: 0, y: 0.55, w: 0.34, h: 0.45 },
      { x: 0.34, y: 0.55, w: 0.32, h: 0.45 },
      { x: 0.66, y: 0.55, w: 0.34, h: 0.45 },
    ],
  },
};

// Vice City colour grades. sky is the top-to-bottom gradient of the grade wash,
// sun is the sun-disc colour, ink is the caption colour, glow is the neon halo.
export const GRADES = {
  sunset: {
    label: 'Sunset',
    sky: ['#ff9a3d', '#ff5e62', '#b537f2'],
    sun: '#ffd166',
    ink: '#fff7e6',
    glow: '#ff5e62',
    wash: 'rgba(255, 94, 98, 0.16)',
  },
  neon: {
    label: 'Neon Nights',
    sky: ['#ff2e88', '#7b2ff7', '#00e5ff'],
    sun: '#ff9de2',
    ink: '#eafcff',
    glow: '#00e5ff',
    wash: 'rgba(0, 229, 255, 0.14)',
  },
  pastel: {
    label: 'Pastel Vice',
    sky: ['#ffd6a5', '#ff9fb2', '#b8c0ff'],
    sun: '#fff3b0',
    ink: '#3d2c4d',
    glow: '#ff9fb2',
    wash: 'rgba(255, 159, 178, 0.14)',
  },
  noir: {
    label: 'Noir',
    sky: ['#0f2027', '#203a43', '#2c5364'],
    sun: '#e0e6e8',
    ink: '#f2f5f6',
    glow: '#7fd4c1',
    wash: 'rgba(20, 40, 48, 0.22)',
  },
  dusk: {
    label: 'Palm Dusk',
    sky: ['#f7b733', '#fc4a1a', '#5b2a86'],
    sun: '#ffe259',
    ink: '#fff3d6',
    glow: '#fc4a1a',
    wash: 'rgba(252, 74, 26, 0.16)',
  },
  hotpink: {
    label: 'Hot Pink',
    sky: ['#ff7a18', '#ff007f', '#7b2ff7'],
    sun: '#ffb3d9',
    ink: '#ffffff',
    glow: '#ff007f',
    wash: 'rgba(255, 0, 127, 0.16)',
  },
};

// Caption lettering styles. All use system font stacks only — no font files,
// so the app ships nothing taken from any game.
export const FONTS = {
  block: {
    label: 'Block',
    stack: "'Arial Black', 'Archivo Black', 'Helvetica Neue', sans-serif",
    weight: 900,
    spacing: 0.01,
    slant: 0,
  },
  condensed: {
    label: 'Condensed',
    stack: "'Impact', 'Haettenschmidt', 'Arial Narrow', sans-serif",
    weight: 400,
    spacing: 0.04,
    slant: 0,
  },
  neon: {
    label: 'Neon',
    stack: "'Trebuchet MS', 'Segoe UI', sans-serif",
    weight: 800,
    spacing: 0.08,
    slant: 0,
  },
  typewriter: {
    label: 'Typewriter',
    stack: "'Courier New', Courier, monospace",
    weight: 700,
    spacing: 0.02,
    slant: 0,
  },
  script: {
    label: 'Script',
    stack: "'Brush Script MT', 'Segoe Script', cursive",
    weight: 700,
    spacing: 0.01,
    slant: -0.06,
  },
};

// One-click looks: layout + grade + font + caption + sample scenes per panel.
export const PRESETS = [
  {
    id: 'sunset-heist',
    label: 'Sunset Heist',
    layout: 'hero',
    grade: 'sunset',
    font: 'block',
    title: 'SUNSET HEIST',
    subtitle: 'VICE CITY · 2026',
    tagline: 'One last score under a burning sky.',
    scenes: ['beach'],
    effects: { halftone: false, grain: true, vignette: true, sun: true, palms: true, scanlines: false, leak: false, duotone: false },
  },
  {
    id: 'boulevard-queen',
    label: 'Boulevard Queen',
    layout: 'triptych',
    grade: 'pastel',
    font: 'script',
    title: 'Boulevard Queen',
    subtitle: 'OCEAN DRIVE',
    tagline: 'She owns every mile of it.',
    scenes: ['boulevard', 'beach', 'skyline'],
    effects: { halftone: false, grain: true, vignette: true, sun: true, palms: false, scanlines: false, leak: true, duotone: false },
  },
  {
    id: 'neon-nights',
    label: 'Neon Nights',
    layout: 'split',
    grade: 'neon',
    font: 'neon',
    title: 'NEON NIGHTS',
    subtitle: 'DOWNTOWN VICE',
    tagline: 'The city never sleeps. Neither do we.',
    scenes: ['street', 'skyline'],
    effects: { halftone: true, grain: true, vignette: true, sun: false, palms: false, scanlines: true, leak: false, duotone: false },
  },
  {
    id: 'vice-nights',
    label: 'Vice Nights',
    layout: 'grid',
    grade: 'dusk',
    font: 'condensed',
    title: 'VICE NIGHTS',
    subtitle: 'FOUR CORNERS OF THE CITY',
    tagline: 'Every panel a different story.',
    scenes: ['beach', 'street', 'boulevard', 'skyline'],
    effects: { halftone: false, grain: true, vignette: true, sun: true, palms: true, scanlines: false, leak: false, duotone: true },
  },
  {
    id: 'ocean-drive',
    label: 'Ocean Drive',
    layout: 'comic',
    grade: 'noir',
    font: 'typewriter',
    title: 'OCEAN DRIVE',
    subtitle: 'A VICE CITY STORY',
    tagline: 'Chapter one: the long way home.',
    scenes: ['skyline', 'beach', 'street', 'boulevard'],
    effects: { halftone: true, grain: true, vignette: true, sun: false, palms: true, scanlines: false, leak: true, duotone: false },
  },
];

export function defaultState() {
  const preset = PRESETS[0];
  return {
    layout: preset.layout,
    grade: preset.grade,
    font: preset.font,
    title: preset.title,
    subtitle: preset.subtitle,
    tagline: preset.tagline,
    size: 'square',
    captionPos: LAYOUTS[preset.layout].caption,
    titleSize: 1.0,
    titleTilt: -2,
    glow: true,
    outline: true,
    effects: { ...preset.effects },
    // One panel entry per layout panel: { kind: 'scene'|'photo', ref, zoom, panX, panY, flip }
    panels: LAYOUTS[preset.layout].panels.map((_, i) => ({
      kind: 'scene',
      ref: preset.scenes[i % preset.scenes.length],
      zoom: 1,
      panX: 0,
      panY: 0,
      flip: false,
    })),
    selected: 0,
  };
}

export function applyPreset(state, presetId) {
  const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0];
  const layout = LAYOUTS[preset.layout];
  return {
    ...state,
    layout: preset.layout,
    grade: preset.grade,
    font: preset.font,
    title: preset.title,
    subtitle: preset.subtitle,
    tagline: preset.tagline,
    captionPos: layout.caption,
    effects: { ...preset.effects },
    panels: layout.panels.map((_, i) => ({
      kind: 'scene',
      ref: preset.scenes[i % preset.scenes.length],
      zoom: 1,
      panX: 0,
      panY: 0,
      flip: false,
    })),
    selected: 0,
  };
}

export function applyLayout(state, layoutId) {
  const layout = LAYOUTS[layoutId] || LAYOUTS.hero;
  const old = state.panels;
  return {
    ...state,
    layout: layoutId,
    captionPos: layout.caption,
    panels: layout.panels.map((_, i) => old[i] || {
      kind: 'scene',
      ref: 'beach',
      zoom: 1,
      panX: 0,
      panY: 0,
      flip: false,
    }),
    selected: Math.min(state.selected, layout.panels.length - 1),
  };
}

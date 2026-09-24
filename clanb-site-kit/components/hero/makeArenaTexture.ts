import * as THREE from "three";

export function makeArenaTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1152;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Dark page background #030706
  ctx.fillStyle = "#030706";
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle radial glow on the right side
  const glow = ctx.createRadialGradient(
    width * 0.7,
    height * 0.4,
    50,
    width * 0.7,
    height * 0.4,
    height * 0.85
  );
  glow.addColorStop(0, "rgba(92, 241, 17, 0.18)");
  glow.addColorStop(0.4, "rgba(6, 182, 212, 0.12)");
  glow.addColorStop(1, "rgba(3, 7, 6, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // 3. Grid of pixel tiles (45-unit logo motif)
  // Tile size ~42px, gap 3px
  const tileSize = 42;
  const gap = 3;
  const step = tileSize + gap;
  const cols = Math.ceil(width / step);
  const rows = Math.ceil(height / step);

  function drawRoundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx!.beginPath();
    ctx!.moveTo(x + r, y);
    ctx!.arcTo(x + w, y, x + w, y + h, r);
    ctx!.arcTo(x + w, y + h, x, y + h, r);
    ctx!.arcTo(x, y + h, x, y, r);
    ctx!.arcTo(x, y, x + w, y, r);
    ctx!.closePath();
    ctx!.fill();
  }

  // Deterministic pseudo-random based on coordinate
  function pseudoRandom(x: number, y: number): number {
    const val = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return val - Math.floor(val);
  }

  // Draw base tiles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * step;
      const y = r * step;

      const normX = x / width;
      // Left 38% is dark/sparse to avoid obstructing copy
      if (normX < 0.38) {
        continue;
      }

      const rand = pseudoRandom(c, r);

      // Base unlit tile #0b1512
      ctx.fillStyle = "rgba(11, 21, 18, 0.65)";
      drawRoundedRect(x, y, tileSize, tileSize, 4);

      // 9% lime tiles, 3% cyan tiles on right 60%
      if (rand < 0.09) {
        const alpha = 0.6 + rand * 4.4 * 0.4; // 0.6 to 1.0
        ctx.fillStyle = `rgba(92, 241, 17, ${alpha})`;
        drawRoundedRect(x, y, tileSize, tileSize, 4);
      } else if (rand < 0.12) {
        ctx.fillStyle = "rgba(6, 182, 212, 0.85)";
        drawRoundedRect(x, y, tileSize, tileSize, 4);
      }
    }
  }

  // 4. Oversized faint "b" glyph built from lit tiles at (68%, 52%)
  const centerX = Math.floor((cols * 0.68));
  const centerY = Math.floor((rows * 0.52));

  // "b" pixel tile coordinates relative to center
  const bTiles = [
    // Stem
    [0, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3],
    // Bowl
    [1, 0], [2, 0], [3, 0],
    [3, 1], [3, 2],
    [1, 3], [2, 3],
    // Accent dot
    [1, -4],
  ];

  for (const [dx, dy] of bTiles) {
    const c = centerX + dx;
    const r = centerY + dy;
    if (c >= 0 && c < cols && r >= 0 && r < rows) {
      const x = c * step;
      const y = r * step;
      ctx.fillStyle = "rgba(92, 241, 17, 0.95)";
      drawRoundedRect(x, y, tileSize, tileSize, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  return texture;
}

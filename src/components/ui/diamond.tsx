import { useEffect, useRef } from "react";

const N = 8; // girdle facet count

function buildGeometry() {
  const verts: [number, number, number][] = [
    [0, -0.6, 0], // crown tip
    [0, 1.15, 0], // culet (bottom tip)
  ];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    verts.push([Math.cos(a), 0, Math.sin(a)]);
  }

  const edges: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const cur = 2 + i;
    const next = 2 + ((i + 1) % N);
    edges.push([0, cur], [1, cur], [cur, next]);
  }

  return { verts, edges };
}

const { verts, edges } = buildGeometry();

interface DiamondProps {
  size?: number;
  speed?: number;
}

export function Diamond({ size = 200, speed = 0.008 }: DiamondProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Capture as non-nullable so TypeScript doesn't complain inside closures
    const cvs: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    const dpr = window.devicePixelRatio ?? 1;
    cvs.width = size * dpr;
    cvs.height = size * dpr;
    cvs.style.width = `${size}px`;
    cvs.style.height = `${size}px`;
    c.scale(dpr, dpr);

    const tiltX = Math.PI / 7;
    let rotY = 0;
    let rafId: number;

    function transformVert(v: [number, number, number], ry: number) {
      const [x, y, z] = v;
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const rx = x * cy - z * sy;
      const rz = x * sy + z * cy;
      const cx = Math.cos(tiltX);
      const sx = Math.sin(tiltX);
      return { x: rx, y: y * cx - rz * sx, z: y * sx + rz * cx };
    }

    function project(x: number, y: number, z: number) {
      const fov = 3.5;
      const s = (size * 0.46 * fov) / (z + fov);
      return { sx: x * s + size / 2, sy: y * s + size / 2 };
    }

    function draw() {
      c.clearRect(0, 0, size, size);

      const color = getComputedStyle(cvs).color;
      const tv = verts.map((v) => transformVert(v, rotY));
      const pv = tv.map(({ x, y, z }) => ({ ...project(x, y, z), z }));

      // Back-to-front so nearer edges paint over farther ones
      const sorted = [...edges].sort(
        ([a0, a1], [b0, b1]) => (tv[a0].z + tv[a1].z) / 2 - (tv[b0].z + tv[b1].z) / 2,
      );

      c.lineCap = "round";
      for (const [a, b] of sorted) {
        const avgZ = (tv[a].z + tv[b].z) / 2;
        // t: 0 = furthest back, 1 = closest front
        const t = Math.max(0, Math.min(1, (avgZ + 1.5) / 3));
        c.globalAlpha = 0.12 + 0.88 * t;
        c.lineWidth = 0.4 + 1.6 * t;
        c.strokeStyle = color;
        c.beginPath();
        c.moveTo(pv[a].sx, pv[a].sy);
        c.lineTo(pv[b].sx, pv[b].sy);
        c.stroke();
      }

      c.globalAlpha = 1;
      rotY += speed;
      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [size, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block"
      style={{ color: "var(--primary)" }}
    />
  );
}

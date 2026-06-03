'use client';

import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface NetworkConnectorProps {
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// BOLT: Hoist static animation constants to module level to avoid redundant allocations and property lookups
const NUM_NODES = 70;
const MAX_DISTANCE = 150;
const MAX_DISTANCE_SQ = MAX_DISTANCE * MAX_DISTANCE;
const NODE_COLOR = 'rgba(0, 245, 255, 0.5)';

export default function NetworkConnector({ className }: NetworkConnectorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Combine refs for the canvas element
  const setRefs = (node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    inViewRef(node);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion || !inView) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;

    let nodes: Node[] = [];
    // BOLT: Reuse bucket arrays to minimize garbage collection (GC) during the 60fps animation loop
    const buckets: number[][] = [[], [], [], [], [], []];

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < NUM_NODES; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // BOLT: Replace forEach with for-loop and batch arc drawing into a single fill() call
      ctx.fillStyle = NODE_COLOR;
      ctx.beginPath();
      for (let i = 0; i < NUM_NODES; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.moveTo(node.x + 2, node.y);
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
      }
      ctx.fill();

      // BOLT: Opacity bucketing system reduces stroke() calls from O(E) to O(1) (max 6 buckets).
      // Connections are grouped by proximity and drawn in batches, significantly lowering draw call overhead.
      for (let b = 0; b < 6; b++) buckets[b].length = 0;

      for (let i = 0; i < NUM_NODES; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < NUM_NODES; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < MAX_DISTANCE_SQ) {
            const distance = Math.sqrt(distanceSq);
            const opacity = (1 - distance / MAX_DISTANCE) * 0.3;
            // Map opacity to bucket index (0-5)
            const bucketIdx = Math.min(5, Math.floor(opacity / 0.05));
            buckets[bucketIdx].push(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
          }
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#00F5FF';
      for (let b = 0; b < 6; b++) {
        const coords = buckets[b];
        const len = coords.length;
        if (len === 0) continue;

        ctx.globalAlpha = (b + 1) * 0.05;
        ctx.beginPath();
        for (let k = 0; k < len; k += 4) {
          ctx.moveTo(coords[k], coords[k + 1]);
          ctx.lineTo(coords[k + 2], coords[k + 3]);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion, inView]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={setRefs}
      className={`absolute inset-0 pointer-events-none z-0 ${className || ''}`}
    />
  );
}

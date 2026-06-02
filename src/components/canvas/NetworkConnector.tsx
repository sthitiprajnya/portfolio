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

      // BOLT: Use globalAlpha for connection opacity and squared distance thresholding to avoid Math.sqrt() in the 60fps loop.
      // String template allocations for colors are eliminated.
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#00F5FF';
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
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
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

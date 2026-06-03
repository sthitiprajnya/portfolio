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
  phase: number;
}

// BOLT: Hoist static animation constants to module level to avoid redundant allocations and property lookups
const DEFAULT_NUM_NODES = 70;
const MOBILE_NUM_NODES = 35;
const MAX_DISTANCE = 150;
const MAX_DISTANCE_SQ = MAX_DISTANCE * MAX_DISTANCE;
const NODE_COLOR = 'rgba(0, 245, 255, 0.5)';

export default function NetworkConnector({ className }: NetworkConnectorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0 });
  const mouseRef = useRef({ x: 0, y: 0, active: false });
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
    let numNodes = DEFAULT_NUM_NODES;

    let nodes: Node[] = [];

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      numNodes = window.innerWidth < 768 ? MOBILE_NUM_NODES : DEFAULT_NUM_NODES;
      initNodes();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // BOLT: Replace forEach with for-loop and batch arc drawing into a single fill() call
      ctx.fillStyle = NODE_COLOR;
      ctx.beginPath();
      const now = Date.now();
      for (let i = 0; i < numNodes; i++) {
        const node = nodes[i];

        // Day 7: Mouse repulsion
        if (mouseRef.current.active) {
          const dx = node.x - mouseRef.current.x;
          const dy = node.y - mouseRef.current.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400) { // 120 * 120
            const dist = Math.sqrt(distSq);
            const force = 0.8 * (1 - dist / 120);
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }

        // Day 7: Cap speed to 3px/frame
        const speedSq = node.vx * node.vx + node.vy * node.vy;
        if (speedSq > 9) {
          const speed = Math.sqrt(speedSq);
          node.vx = (node.vx / speed) * 3;
          node.vy = (node.vy / speed) * 3;
        }

        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Day 11: Dynamic pulsing radius
        const radius = 2 + 1.5 * Math.sin(now * 0.002 + node.phase);

        ctx.moveTo(node.x + radius, node.y);
        ctx.arc(node.x, node.y, Math.max(0.1, radius), 0, Math.PI * 2);
      }
      ctx.fill();

      // BOLT: Use globalAlpha for connection opacity and squared distance thresholding to avoid Math.sqrt() in the 60fps loop.
      // String template allocations for colors are eliminated.
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#00F5FF';
      for (let i = 0; i < numNodes; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < numNodes; j++) {
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
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

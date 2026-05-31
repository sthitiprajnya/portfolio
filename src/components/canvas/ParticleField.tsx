"use client";
import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export default function ParticleField() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useInView({ threshold: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !inView || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particlesArray: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null };

    // BOLT: Cache bounding rect to avoid layout thrashing in mousemove handler
    let canvasRect = canvas.getBoundingClientRect();

    // Resize canvas to fill window
    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvasRect = canvas.getBoundingClientRect(); // BOLT: Update cached rect
      init();
    }

    // Initial size setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', resizeCanvas);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX - canvasRect.left;
      mouse.y = event.clientY - canvasRect.top;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    // Particle Class
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      // Draw dot
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      // Move particles and bounce off edges
      update() {
        if (!canvas) return;
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Create particle network
    function init() {
      if (!canvas) return;
      particlesArray = [];
      // Adjust for density to get roughly 50-80 dots
      // Assuming a standard screen is roughly 1920x1080 (~2M pixels)
      // 2M / 25000 is ~80 dots.
      const numberOfParticles = Math.floor((canvas.height * canvas.width) / 25000);

      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 1.5) + 0.5; // 0.5px to 2px
        const x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        const y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        const directionX = (Math.random() * 1) - 0.5; // Speed
        const directionY = (Math.random() * 1) - 0.5; // Speed
        const color = '#ffffff'; // White dots

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // BOLT: Hoist connection distance and squared comparison to avoid redundant math
    const MAX_DISTANCE = 150;
    const CONNECTION_DISTANCE_SQ = MAX_DISTANCE * MAX_DISTANCE;

    // Draw connecting lines
    function connect() {
      if (!ctx || !canvas) return;

      const particleCount = particlesArray.length;
      const mX = mouse.x;
      const mY = mouse.y;
      const hasMouse = mX !== null && mY !== null;

      for (let a = 0; a < particleCount; a++) {
        const pA = particlesArray[a];
        const pAx = pA.x;
        const pAy = pA.y;

        // BOLT: Start inner loop at a + 1 to avoid self-comparison and drawing redundant lines
        for (let b = a + 1; b < particleCount; b++) {
          const pB = particlesArray[b];
          const dx = pAx - pB.x;
          const dy = pAy - pB.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < CONNECTION_DISTANCE_SQ) {
            const opacity = 1 - (distanceSq / CONNECTION_DISTANCE_SQ);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pAx, pAy);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (hasMouse) {
          const dx = pAx - mX;
          const dy = pAy - mY;
          const mouseDistSq = dx * dx + dy * dy;

          if (mouseDistSq < CONNECTION_DISTANCE_SQ) {
            const opacity = 1 - (mouseDistSq / CONNECTION_DISTANCE_SQ);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pAx, pAy);
            ctx.lineTo(mX, mY);
            ctx.stroke();
          }
        }
      }
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return;
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion, inView]);

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--color-border-glow)_0%,_transparent_70%)] opacity-30 animate-pulse pointer-events-none" />
    );
  }

  return (
    <div ref={ref} className="absolute inset-0 z-0 pointer-events-none fade-in" style={{ animation: 'fadeIn 1.2s ease-in-out forwards' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ backgroundColor: 'transparent' }} // Let hero gradient show through, or set to '#111111' if strictly required, but hero uses a gradient background.
      />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in { opacity: 0; }
      `}</style>
    </div>
  );
}

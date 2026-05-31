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

    // Resize canvas to fill window
    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    }

    // Initial size setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', resizeCanvas);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
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

    // Draw connecting lines
    function connect() {
      if (!ctx || !canvas) return;
      let opacityValue = 1;
      const connectionDistance = 150 * 150; // 150px squared for distance check

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                       + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

          if (distance < connectionDistance) {
            opacityValue = 1 - (distance / connectionDistance);
            ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue * 0.5 + ')'; // Slightly lower opacity for lines
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const mouseDistance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x))
                            + ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
          if (mouseDistance < connectionDistance) {
            opacityValue = 1 - (mouseDistance / connectionDistance);
            ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue * 0.8 + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
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

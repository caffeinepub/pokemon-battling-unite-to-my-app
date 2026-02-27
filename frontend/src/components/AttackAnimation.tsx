import React, { useEffect, useRef } from 'react';

interface AttackAnimationProps {
  element: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  onComplete: () => void;
  missed?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

const ELEMENT_COLORS: Record<string, { primary: string; secondary: string; glow: string }> = {
  fire:      { primary: '#ff6a00', secondary: '#ff3d00', glow: '#ffaa44' },
  water:     { primary: '#00b4ff', secondary: '#0077cc', glow: '#88ddff' },
  earth:     { primary: '#8b5e3c', secondary: '#5a3e28', glow: '#c8a96e' },
  wind:      { primary: '#a8e6cf', secondary: '#56c596', glow: '#d4f5e9' },
  lightning: { primary: '#ffe600', secondary: '#ffaa00', glow: '#fff176' },
  shadow:    { primary: '#7c3aed', secondary: '#4c1d95', glow: '#c084fc' },
};

const AttackAnimation: React.FC<AttackAnimationProps> = ({
  element,
  fromX,
  fromY,
  toX,
  toY,
  onComplete,
  missed = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.fire;
    const particles: Particle[] = [];

    // Miss offset
    const missOffsetX = missed ? (toX > fromX ? -60 : 60) : 0;
    const missOffsetY = missed ? -40 : 0;
    const finalToX = toX + missOffsetX;
    const finalToY = toY + missOffsetY;

    // Duration by element
    const durations: Record<string, number> = {
      lightning: 220,
      fire: 520,
      wind: 500,
      water: 700,
      earth: 700,
      shadow: 600,
    };
    const totalDuration = durations[element] || 500;

    // ── Lightning: instant SVG-style bolt drawn on canvas ──────────────────
    if (element === 'lightning') {
      const drawLightning = (alpha: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dx = finalToX - fromX;
        const dy = finalToY - fromY;
        const segments = 8;
        const points: { x: number; y: number }[] = [{ x: fromX, y: fromY }];
        for (let i = 1; i < segments; i++) {
          const t = i / segments;
          const bx = fromX + dx * t + (Math.random() - 0.5) * 60;
          const by = fromY + dy * t + (Math.random() - 0.5) * 30;
          points.push({ x: bx, y: by });
        }
        points.push({ x: finalToX, y: finalToY });

        // Glow pass
        ctx.save();
        ctx.globalAlpha = alpha * 0.5;
        ctx.strokeStyle = colors.glow;
        ctx.lineWidth = 12;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
        ctx.restore();

        // Core bolt
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
        ctx.restore();

        // Branch bolt
        const branchStart = points[Math.floor(segments / 2)];
        const branchPoints: { x: number; y: number }[] = [branchStart];
        for (let i = 0; i < 3; i++) {
          branchPoints.push({
            x: branchStart.x + (Math.random() - 0.5) * 80 + dx * 0.1 * (i + 1),
            y: branchStart.y + (Math.random() - 0.5) * 40 + dy * 0.1 * (i + 1),
          });
        }
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(branchPoints[0].x, branchPoints[0].y);
        for (let i = 1; i < branchPoints.length; i++) ctx.lineTo(branchPoints[i].x, branchPoints[i].y);
        ctx.stroke();
        ctx.restore();

        // Impact sparks at target
        if (alpha > 0.3) {
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const len = 20 + Math.random() * 20;
            ctx.save();
            ctx.globalAlpha = alpha * 0.9;
            ctx.strokeStyle = colors.glow;
            ctx.lineWidth = 2;
            ctx.shadowColor = colors.primary;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(finalToX, finalToY);
            ctx.lineTo(finalToX + Math.cos(angle) * len, finalToY + Math.sin(angle) * len);
            ctx.stroke();
            ctx.restore();
          }
        }
      };

      let boltDrawn = false;
      const animate = (ts: number) => {
        if (!startTimeRef.current) startTimeRef.current = ts;
        const elapsed = ts - startTimeRef.current;
        const progress = Math.min(elapsed / totalDuration, 1);

        if (!boltDrawn || elapsed < 80) {
          drawLightning(1);
          boltDrawn = true;
        } else {
          const fadeAlpha = 1 - (elapsed - 80) / (totalDuration - 80);
          drawLightning(Math.max(0, fadeAlpha));
        }

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          onComplete();
        }
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(rafRef.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
    }

    // ── Projectile-based animations ────────────────────────────────────────
    const spawnTrailParticle = (px: number, py: number) => {
      const count = element === 'fire' ? 5 : element === 'shadow' ? 4 : 3;
      for (let i = 0; i < count; i++) {
        const spread = 18;
        particles.push({
          x: px + (Math.random() - 0.5) * spread,
          y: py + (Math.random() - 0.5) * spread,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - (element === 'fire' ? 1.5 : 0),
          life: 1,
          maxLife: 0.4 + Math.random() * 0.4,
          size: 3 + Math.random() * 5,
          color: Math.random() > 0.5 ? colors.primary : colors.secondary,
          alpha: 0.8,
        });
      }
    };

    const spawnImpactParticles = (px: number, py: number) => {
      const count = 20;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const speed = 3 + Math.random() * 5;
        particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.4,
          size: 4 + Math.random() * 8,
          color: Math.random() > 0.3 ? colors.primary : colors.glow,
          alpha: 1,
        });
      }
    };

    const drawFireball = (px: number, py: number, scale: number) => {
      // Outer glow
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 28 * scale);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, colors.primary);
      grad.addColorStop(0.7, colors.secondary);
      grad.addColorStop(1, 'rgba(255,60,0,0)');
      ctx.save();
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 30;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 28 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawWaterDrop = (px: number, py: number, scale: number, t: number) => {
      // Ripple rings
      for (let r = 0; r < 2; r++) {
        const rippleR = (10 + r * 14) * scale * (0.5 + t * 0.5);
        ctx.save();
        ctx.globalAlpha = 0.3 * (1 - t);
        ctx.strokeStyle = colors.glow;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, rippleR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      // Core drop
      const grad = ctx.createRadialGradient(px - 5, py - 5, 0, px, py, 22 * scale);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, colors.glow);
      grad.addColorStop(1, colors.primary);
      ctx.save();
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 20;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 22 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawRock = (px: number, py: number, scale: number, rotation: number) => {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rotation);
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 15;
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      const sides = 6;
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2;
        const r = (18 + (i % 2 === 0 ? 6 : -4)) * scale;
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(-4, -4, 6 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawWindBlade = (px: number, py: number, scale: number, rotation: number) => {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rotation);
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 20;
      // Crescent arc
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 5 * scale;
      ctx.beginPath();
      ctx.arc(0, 0, 22 * scale, -Math.PI * 0.7, Math.PI * 0.7);
      ctx.stroke();
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 2 * scale;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(0, 0, 28 * scale, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();
      ctx.restore();
    };

    const drawShadowOrb = (px: number, py: number, scale: number, t: number) => {
      // Wispy tendrils
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + t * 3;
        const len = 20 + Math.sin(t * 5 + i) * 10;
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 3;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(angle) * len * scale, py + Math.sin(angle) * len * scale);
        ctx.stroke();
        ctx.restore();
      }
      // Core orb
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 24 * scale);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, colors.glow);
      grad.addColorStop(0.7, colors.primary);
      grad.addColorStop(1, 'rgba(76,29,149,0)');
      ctx.save();
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 30;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 24 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let impactSpawned = false;
    let lastTrailX = fromX;
    let lastTrailY = fromY;

    const animate = (ts: number) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const travelDuration = totalDuration * 0.65;
      const impactDuration = totalDuration * 0.35;
      const travelProgress = Math.min(elapsed / travelDuration, 1);
      const overallProgress = Math.min(elapsed / totalDuration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Arc trajectory
      const arcHeight = -80;
      const t = travelProgress;
      const px = fromX + (finalToX - fromX) * t;
      const py = fromY + (finalToY - fromY) * t + arcHeight * Math.sin(t * Math.PI);

      // Spawn trail particles
      const distFromLast = Math.hypot(px - lastTrailX, py - lastTrailY);
      if (travelProgress < 1 && distFromLast > 8) {
        spawnTrailParticle(px, py);
        lastTrailX = px;
        lastTrailY = py;
      }

      // Impact particles
      if (travelProgress >= 1 && !impactSpawned) {
        spawnImpactParticles(finalToX, finalToY);
        impactSpawned = true;
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.life -= 0.04;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const lifeRatio = p.life / 1;
        ctx.save();
        ctx.globalAlpha = lifeRatio * p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw projectile during travel
      if (travelProgress < 1) {
        const scale = 0.7 + 0.3 * Math.sin(t * Math.PI);
        const rotation = elapsed * 0.01;
        switch (element) {
          case 'fire':   drawFireball(px, py, scale); break;
          case 'water':  drawWaterDrop(px, py, scale, t); break;
          case 'earth':  drawRock(px, py, scale, rotation); break;
          case 'wind':   drawWindBlade(px, py, scale, rotation * 3); break;
          case 'shadow': drawShadowOrb(px, py, scale, t); break;
        }
      }

      // Impact flash ring
      if (impactSpawned) {
        const impactT = (elapsed - travelDuration) / impactDuration;
        const ringR = impactT * 60;
        const ringAlpha = 1 - impactT;
        ctx.save();
        ctx.globalAlpha = ringAlpha * 0.8;
        ctx.strokeStyle = colors.glow;
        ctx.lineWidth = 4;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(finalToX, finalToY, ringR, 0, Math.PI * 2);
        ctx.stroke();
        // Second ring
        ctx.globalAlpha = ringAlpha * 0.4;
        ctx.beginPath();
        ctx.arc(finalToX, finalToY, ringR * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Water splash extra rings
        if (element === 'water') {
          for (let r = 0; r < 3; r++) {
            const sr = (impactT * 50 + r * 15);
            ctx.save();
            ctx.globalAlpha = (1 - impactT) * 0.5;
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(finalToX, finalToY, sr, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Earth ground crack
        if (element === 'earth') {
          for (let c = 0; c < 6; c++) {
            const angle = (c / 6) * Math.PI * 2;
            const crackLen = impactT * 50;
            ctx.save();
            ctx.globalAlpha = (1 - impactT) * 0.7;
            ctx.strokeStyle = colors.secondary;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(finalToX, finalToY);
            ctx.lineTo(
              finalToX + Math.cos(angle) * crackLen,
              finalToY + Math.sin(angle) * crackLen
            );
            ctx.stroke();
            ctx.restore();
          }
        }

        // Shadow dark explosion
        if (element === 'shadow') {
          const darkGrad = ctx.createRadialGradient(finalToX, finalToY, 0, finalToX, finalToY, ringR * 1.2);
          darkGrad.addColorStop(0, `rgba(124,58,237,${ringAlpha * 0.6})`);
          darkGrad.addColorStop(1, 'rgba(76,29,149,0)');
          ctx.save();
          ctx.fillStyle = darkGrad;
          ctx.beginPath();
          ctx.arc(finalToX, finalToY, ringR * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (overallProgress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onComplete();
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [element, fromX, fromY, toX, toY, onComplete, missed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 50 }}
    />
  );
};

export default AttackAnimation;

import React, { useEffect, useState, useRef } from 'react';

interface Bolt {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mx: number;
  my: number;
  opacity: number;
}

function randomBolt(id: number): Bolt {
  const angle = Math.random() * Math.PI * 2;
  const r1 = 60 + Math.random() * 20;
  const r2 = 90 + Math.random() * 40;
  return {
    id,
    x1: 150 + Math.cos(angle) * r1,
    y1: 150 + Math.sin(angle) * r1,
    x2: 150 + Math.cos(angle + (Math.random() - 0.5) * 0.8) * r2,
    y2: 150 + Math.sin(angle + (Math.random() - 0.5) * 0.8) * r2,
    mx: 150 + Math.cos(angle) * ((r1 + r2) / 2) + (Math.random() - 0.5) * 30,
    my: 150 + Math.sin(angle) * ((r1 + r2) / 2) + (Math.random() - 0.5) * 30,
    opacity: 0.4 + Math.random() * 0.6,
  };
}

export default function ElectricityEffect() {
  const [bolts, setBolts] = useState<Bolt[]>(() => Array.from({ length: 6 }, (_, i) => randomBolt(i)));
  const isMobileRef = useRef(false);

  useEffect(() => {
    isMobileRef.current = window.matchMedia('(max-width: 767px)').matches;
    // Slower interval on mobile to reduce CPU load
    const interval = isMobileRef.current ? 300 : 120;
    const boltCount = isMobileRef.current ? 3 : 6;

    const timer = setInterval(() => {
      setBolts(Array.from({ length: boltCount }, (_, i) => randomBolt(i)));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 300 300"
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* Electric aura rings */}
        <circle cx="150" cy="150" r="75" fill="none" stroke="#facc15" strokeWidth="1.5" opacity="0.15" className="animate-electric-aura" />
        <circle cx="150" cy="150" r="85" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.1" className="animate-electric-aura" style={{ animationDelay: '0.3s' }} />

        {/* Lightning bolts */}
        {bolts.map((bolt) => (
          <path
            key={bolt.id}
            d={`M ${bolt.x1} ${bolt.y1} Q ${bolt.mx} ${bolt.my} ${bolt.x2} ${bolt.y2}`}
            stroke="#facc15"
            strokeWidth="1.5"
            fill="none"
            opacity={bolt.opacity}
            className="animate-bolt-flicker"
          />
        ))}
      </svg>

      {/* Corner sparks — fewer on mobile */}
      <div className="absolute top-0 left-0 text-yellow-400 text-lg animate-corner-spark opacity-70">⚡</div>
      <div className="absolute top-0 right-0 text-yellow-400 text-lg animate-corner-spark opacity-70" style={{ animationDelay: '0.4s' }}>⚡</div>
      <div className="absolute bottom-0 left-0 text-yellow-400 text-lg animate-corner-spark opacity-70 hidden sm:block" style={{ animationDelay: '0.8s' }}>⚡</div>
      <div className="absolute bottom-0 right-0 text-yellow-400 text-lg animate-corner-spark opacity-70 hidden sm:block" style={{ animationDelay: '1.2s' }}>⚡</div>
    </div>
  );
}

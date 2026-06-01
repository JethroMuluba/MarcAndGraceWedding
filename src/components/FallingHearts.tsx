import React, { useEffect, useRef } from 'react';

const HEARTS = ['💛', '🖤', '🧡', '🤍', '🤎'];
const HEART_COUNT = 18;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const FallingHearts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const hearts: HTMLSpanElement[] = [];

    for (let i = 0; i < HEART_COUNT; i++) {
      const heart = document.createElement('span');
      heart.innerText = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      heart.style.position = 'absolute';
      heart.style.left = `${randomBetween(0, 100)}vw`;
      heart.style.top = `-${randomBetween(2, 10)}vh`;
      heart.style.fontSize = `${randomBetween(18, 28)}px`;
      heart.style.opacity = String(randomBetween(0.2, 0.2));
      heart.style.pointerEvents = 'none';
      heart.style.animation = `fall-heart ${randomBetween(3.5, 7.5)}s linear infinite`;
      heart.style.animationDelay = `${randomBetween(0, 1)}s`;
      hearts.push(heart);
      container.appendChild(heart);
    }
    return () => {
      hearts.forEach(h => container.removeChild(h));
    };
  }, []);

  return (
    <div
    className=' animate-pulse'
      ref={containerRef}
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 30,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
};

export default FallingHearts;

// Animation CSS à ajouter dans le global.css :
// @keyframes fall-heart {
//   0% { transform: translateY(0) rotate(-10deg); }
//   100% { transform: translateY(100vh) rotate(20deg); }
// } 
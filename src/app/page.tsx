'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalRotation, setFinalRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const prizes = [
    "🎁 Hediye 1",
    "🎮 Hediye 2",
    "📱 Hediye 3",
    "💻 Hediye 4",
    "🎧 Hediye 5",
    "📚 Hediye 6",
    "🎨 Hediye 7",
    "🎭 Hediye 8"
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const rotations = 5; // Tam tur sayısı
    const degrees = 360; // Bir turdaki derece
    const sliceDegrees = degrees / prizes.length; // Her dilimin derecesi
    
    // Rastgele bir dilim seç
    const randomSlice = Math.floor(Math.random() * prizes.length);
    const randomDegreeOffset = Math.random() * sliceDegrees;
    const finalDegree = (rotations * degrees) + (randomSlice * sliceDegrees) + randomDegreeOffset;
    
    if (wheelRef.current) {
      wheelRef.current.style.setProperty('--final-rotation', `${finalDegree}deg`);
    }
    
    setFinalRotation(finalDegree);

    // Animasyon bitiminde state'i resetle
    setTimeout(() => {
      setIsSpinning(false);
    }, 8000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 dark:bg-gray-900">
      <div className="relative w-96 h-96">
        <div
          ref={wheelRef}
          className={`absolute w-full h-full rounded-full border-4 border-yellow-400 
            ${isSpinning ? 'animate-spin-decelerate' : ''}`}
          style={{
            background: 'conic-gradient(from 0deg, #f87171, #60a5fa, #34d399, #fbbf24, #a78bfa, #f472b6, #fb923c, #4ade80)'
          }}
        >
          {prizes.map((prize, index) => {
            const rotation = (360 / prizes.length) * index;
            return (
              <div
                key={index}
                className="absolute w-full h-full flex items-center justify-center text-white font-bold"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                <div className="relative -mt-20 transform -rotate-90 text-center w-full">
                  {prize}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute top-0 left-1/2 -ml-4 w-8 h-8 bg-red-500 clip-triangle"></div>
      </div>
      
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`mt-8 px-6 py-3 text-lg font-semibold rounded-lg 
          ${isSpinning 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'} 
          text-white transition-colors`}
      >
        {isSpinning ? 'Çevriliyor...' : 'Çarkı Çevir'}
      </button>
    </main>
  );
} 
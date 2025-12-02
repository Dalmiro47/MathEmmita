
"use client";

import { useEffect, type FC } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Award, Gift } from 'lucide-react';

interface MedalOverlayProps {
  show: boolean;
  type?: 'superacion' | 'premio';
  prize?: string;
}

const triggerConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#FFD700', '#FFB74D', '#FFFFFF'] });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#FFD700', '#FFB74D', '#FFFFFF'] });
    }, 250);
};


export const MedalOverlay: FC<MedalOverlayProps> = ({ show, type = 'superacion', prize }) => {

  useEffect(() => {
    if (show) {
      triggerConfetti();
    }
  }, [show]);
  
  if (!show) {
    return null;
  }
  
  const isPrize = type === 'premio';

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <motion.div
            initial={{ scale: 0, y: 50, rotate: -15 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="flex flex-col items-center justify-center text-center"
        >
            <div className="relative">
                {isPrize ? 
                    <Gift className="w-48 h-48 sm:w-64 sm:h-64 text-pink-400 filter drop-shadow-lg" strokeWidth={1} /> :
                    <Award className="w-48 h-48 sm:w-64 sm:h-64 text-amber-400 filter drop-shadow-lg" strokeWidth={1} />
                }
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <span className="text-5xl sm:text-7xl">{isPrize ? '🎁' : '🏆'}</span>
                </motion.div>
            </div>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={cn(
                    "font-headline font-bold text-4xl sm:text-6xl mt-6",
                    isPrize ? "text-pink-600" : "text-amber-600"
                )}
            >
                {isPrize ? "¡PREMIO DESBLOQUEADO!" : "¡SUPERACIÓN!"}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-lg sm:text-2xl text-muted-foreground mt-2"
            >
                {isPrize ? prize : "¡Acertaste una difícil!"}
            </motion.p>
        </motion.div>
    </div>
  );
};

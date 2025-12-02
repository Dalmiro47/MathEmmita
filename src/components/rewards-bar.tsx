'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Lock, Award, Star } from 'lucide-react';
import { type RewardsConfig } from '@/lib/progress-service';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RewardsBarProps {
  currentPoints: number;
  config: RewardsConfig | null;
}

const maxPoints = 3000;

const milestones = [
  { points: 1000, level: 'level1' as keyof RewardsConfig, icon: '🥉' },
  { points: 2000, level: 'level2' as keyof RewardsConfig, icon: '🥈' },
  { points: 3000, level: 'level3' as keyof RewardsConfig, icon: '🥇' },
];

export const RewardsBar: FC<RewardsBarProps> = ({ currentPoints, config }) => {
  // Asegurar que no pase del 100% visualmente
  const progressPercentage = Math.min((currentPoints / maxPoints) * 100, 100);

  if (!config) {
    return <div className="h-16 w-full bg-muted/20 rounded-xl animate-pulse" />;
  }

  // Calcular siguiente meta para motivar
  const nextMilestone = milestones.find(m => m.points > currentPoints);
  const pointsToNext = nextMilestone ? nextMilestone.points - currentPoints : 0;

  return (
    <TooltipProvider>
      <div className="w-full max-w-lg mx-auto mb-6">
        
        {/* Header de Puntos */}
        <div className="flex justify-between items-end mb-2 px-2">
            <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-muted-foreground">Tus Puntos</span>
                <span className="text-2xl font-black text-primary font-mono leading-none">
                    {currentPoints} <span className="text-sm text-muted-foreground font-sans">/ {maxPoints}</span>
                </span>
            </div>
            {nextMilestone && (
                <div className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-lg border border-sky-100">
                    ¡Faltan {pointsToNext} para premio! 🚀
                </div>
            )}
        </div>

        {/* Barra Contenedora */}
        <div className="relative h-4 bg-slate-100 rounded-full w-full mt-6 mb-8">
            
          {/* Fondo de la barra */}
          <div className="absolute inset-0 bg-slate-200 rounded-full border border-slate-300 shadow-inner" />

          {/* Relleno Animado */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Hitos (Milestones) posicionados matemáticamente */}
          {milestones.map((milestone) => {
            const isUnlocked = currentPoints >= milestone.points;
            const prizeName = config[milestone.level];
            const positionPercent = (milestone.points / maxPoints) * 100;

            return (
              <div 
                key={milestone.level}
                className="absolute top-1/2 -translate-y-1/2 z-10 flex flex-col items-center group"
                style={{ 
                    left: `${positionPercent}%`, 
                    transform: 'translate(-50%, -50%)' // Centrar el icono exactamente en el punto
                }}
              >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: isUnlocked ? 1.2 : 1 }}
                            whileHover={{ scale: 1.3 }}
                            className={cn(
                                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 shadow-sm transition-colors duration-300 bg-white cursor-pointer",
                                isUnlocked
                                ? "border-amber-500 text-amber-600 shadow-amber-200"
                                : "border-slate-300 text-slate-300"
                            )}
                        >
                            {isUnlocked ? <Award className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} /> : <Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </motion.div>
                    </TooltipTrigger>
                    
                    {/* Etiqueta Flotante siempre visible (para móvil/tablet) */}
                    <div className={cn(
                        "absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md border shadow-sm transition-all pointer-events-none",
                         isUnlocked ? "bg-amber-100 text-amber-800 border-amber-200 scale-100" : "bg-slate-100 text-slate-400 border-slate-200 scale-90"
                    )}>
                        {isUnlocked ? milestone.icon : `${milestone.points}`}
                    </div>

                    <TooltipContent>
                         <p className="font-bold">{isUnlocked ? "¡Conseguido!" : `Meta: ${milestone.points} pts`}</p>
                         <p className="text-xs">{prizeName || "Premio sorpresa"}</p>
                    </TooltipContent>
                </Tooltip>
                
                {/* Línea de marca en la barra */}
                <div className={cn(
                    "absolute top-8 w-0.5 h-3 mt-1",
                    isUnlocked ? "bg-amber-400" : "bg-slate-300"
                )} />
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

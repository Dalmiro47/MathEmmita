
'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Lock, Award } from 'lucide-react';
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

const milestones = [
  { points: 1000, level: 'level1' as keyof RewardsConfig, icon: '🥉' },
  { points: 2000, level: 'level2' as keyof RewardsConfig, icon: '🥈' },
  { points: 3000, level: 'level3' as keyof RewardsConfig, icon: '🥇' },
];

export const RewardsBar: FC<RewardsBarProps> = ({ currentPoints, config }) => {
  const progressPercentage = Math.min((currentPoints / 3000) * 100, 100);

  if (!config) {
    return <div className="h-12 w-full bg-muted rounded-full animate-pulse" />;
  }

  return (
    <TooltipProvider>
      <div className="relative w-full">
        {/* Background Bar */}
        <div className="h-10 bg-muted rounded-full overflow-hidden shadow-inner">
          {/* Progress Fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-amber-300 to-primary rounded-full origin-left"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>

        {/* Milestones */}
        <div className="absolute inset-0 flex justify-around items-center px-2">
          {milestones.map((milestone) => {
            const isUnlocked = currentPoints >= milestone.points;
            const prizeName = config[milestone.level];

            return (
              <Tooltip key={milestone.level}>
                <TooltipTrigger asChild>
                  <motion.div
                    className="flex flex-col items-center z-10"
                    initial={{ scale: 0.8, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-4 transition-all duration-300",
                        isUnlocked
                          ? "bg-green-100 border-green-400 text-green-700"
                          : "bg-slate-200 border-slate-300 text-slate-500"
                      )}
                    >
                      {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                    </div>
                    {isUnlocked ? (
                         <div className="mt-1.5 text-xs font-bold text-foreground bg-background/70 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                            {milestone.icon} {prizeName || `Premio ${milestone.points}`}
                        </div>
                    ) : (
                        <div className="mt-1.5 text-xs font-bold text-muted-foreground">
                            {milestone.points} pts
                        </div>
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-background/80 backdrop-blur-sm border-primary">
                  <p className="font-bold">{milestone.icon} {isUnlocked ? "¡Desbloqueado!" : "Bloqueado"}</p>
                  <p className="text-sm text-muted-foreground">{prizeName || `Premio de ${milestone.points} pts`}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

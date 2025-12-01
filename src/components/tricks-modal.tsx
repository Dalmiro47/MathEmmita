
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { type FC, useEffect, useState } from 'react';
import { speak, stopSpeech, type Problem } from '@/lib/math-engine';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plus, Volume2, Square, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HandsIllustration: FC<{ fingerDown: number }> = ({ fingerDown }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const fingers = Array.from({ length: 10 }, (_, i) => i + 1);
  const tens = fingerDown - 1;
  const ones = 10 - fingerDown;
  const nailColors = [
    'bg-pink-300', 'bg-sky-300', 'bg-teal-300', 'bg-lime-300', 'bg-amber-300',
    'bg-purple-300', 'bg-indigo-300', 'bg-cyan-300', 'bg-emerald-300', 'bg-rose-300'
  ];

  useEffect(() => {
    // Reset when the finger number changes
    setShowAnswer(false);
  }, [fingerDown]);

  return (
    <div className="flex flex-col items-center p-2 sm:p-4 rounded-lg bg-orange-50 w-full overflow-hidden">
      {/* Hands */}
      <div className="flex justify-center items-end w-full gap-2 sm:gap-4">
        {fingers.map((finger) => {
          const isDown = finger === fingerDown;

          return (
            <div key={finger} className={cn(
              "flex flex-col items-center gap-2",
              finger === 5 && "mr-8 sm:mr-12" // large gap between hands
            )}>
              <motion.div
                animate={{ height: isDown ? "2rem" : "6rem" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "w-8 sm:w-10 rounded-t-xl relative",
                  isDown ? "bg-slate-300" : "bg-orange-100 border-2 border-orange-200"
                )}
              >
                {!isDown && (
                  <div className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-4 rounded-t-md",
                    nailColors[finger - 1]
                  )}></div>
                )}
              </motion.div>
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                {finger}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Panels */}
      <div className="flex justify-center items-center w-full mt-8 gap-2 sm:gap-4">
        {/* Tens */}
        <div className="flex-1 bg-amber-100 rounded-2xl p-4 text-center">
          <p className="text-sm sm:text-lg text-amber-800">Dedos a la izquierda</p>
          <p className="text-4xl sm:text-6xl font-bold text-amber-900">{tens}</p>
          <p className="text-sm sm:text-base font-bold text-amber-900/70">(Decenas)</p>
        </div>

        <Plus className="w-8 h-8 text-slate-400 shrink-0" />

        {/* Ones */}
        <div className="flex-1 bg-sky-100 rounded-2xl p-4 text-center">
          <p className="text-sm sm:text-lg text-sky-800">Dedos a la derecha</p>
          <p className="text-4xl sm:text-6xl font-bold text-sky-900">{ones}</p>
          <p className="text-sm sm:text-base font-bold text-sky-900/70">(Unidades)</p>
        </div>
      </div>

      {/* Final Answer */}
       <div className="mt-6 w-full">
         <div 
           className="bg-green-500 text-white rounded-2xl py-3 px-6 text-center shadow-lg transition-all duration-300 cursor-pointer"
           onClick={() => setShowAnswer(true)}
          >
           {showAnswer ? (
             <>
              <p className="text-lg font-medium">¡La respuesta es...</p>
              <p className="text-6xl font-extrabold tracking-tight">{tens}{ones}</p>
             </>
           ) : (
             <p className="text-lg font-medium py-10">Toca aquí para ver la respuesta</p>
           )}
         </div>
       </div>
    </div>
  );
};

const MultiplicationTrick: FC<{ operand1: number; operand2: number }> = ({ operand1, operand2 }) => {
  if ((operand1 === 9 || operand2 === 9) && (operand1 > 0 && operand1 < 11) && (operand2 > 0 && operand2 < 11)) {
    const nonNine = operand1 === 9 ? operand2 : operand1;
    return (
      <div className="space-y-4 text-center">
        <h3 className="font-bold text-xl">¡Emmita, el truco del 9! ✨</h3>
        <p>Para multiplicar <span className="font-bold">{nonNine} × 9</span>, ¡baja tu dedo número <span className="font-bold">{nonNine}</span>!</p>
        <div className="my-4">
          <HandsIllustration fingerDown={nonNine} />
        </div>
      </div>
    )
  }

  const rows = Math.min(operand1, operand2);
  const cols = Math.max(operand1, operand2);
  const totalPoints = rows * cols;
  
  const [filledCount, setFilledCount] = useState(0);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const isComplete = filledCount === totalPoints;

  useEffect(() => {
    setFilledCount(0);
    setErrorIndex(null);
  }, [operand1, operand2]);

  const handleDotClick = (index: number) => {
    if (index === filledCount) {
      setFilledCount(prev => prev + 1);
      setErrorIndex(null);
    } else {
      setErrorIndex(filledCount);
      setTimeout(() => setErrorIndex(null), 500); // Shake animation duration
    }
  };

  const handleFillAll = () => {
    setFilledCount(totalPoints);
  };
  
  const handleReset = () => {
    setFilledCount(0);
  };
  
  const getDotShakeClass = (index: number) => {
    if (errorIndex !== index) return "";
    return "animate-[shake_0.5s_ease-in-out]";
  };

  return (
    <div className="space-y-4 text-center">
      <h3 className="font-bold text-xl">¡A dibujar para resolver! ✏️</h3>
      
      {!isComplete ? (
        <p className="text-muted-foreground">
          ¡Toca el punto que parpadea! Vamos a dibujar <span className="font-bold text-primary">{rows} filas</span> de <span className="font-bold text-primary">{cols} puntos</span> en orden.
        </p>
      ) : (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
          <CheckCircle2 className="h-5 w-5" />
          <p>¡Excelente! Ahora cuenta todos los puntos que dibujaste.</p>
        </div>
      )}

      <div className="flex flex-col items-center p-4 rounded-2xl bg-orange-50/50">
        {/* Column Headers */}
        <div className="grid w-full" style={{ gridTemplateColumns: `auto repeat(${cols}, minmax(0, 1fr))` }}>
            <div /> {/* Empty cell for alignment */}
            {Array.from({ length: cols }).map((_, i) => (
                <div key={`col-label-${i}`} className="flex items-center justify-center h-10 w-10 text-lg font-mono text-muted-foreground">
                    {i + 1}
                </div>
            ))}
        </div>

        {/* Main Grid: Row labels + Dots */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <>
                    {/* Row Label */}
                    <div key={`row-label-${rowIndex}`} className="flex items-center justify-center h-10 w-10 pr-2 text-lg font-mono text-muted-foreground">
                        {rowIndex + 1}
                    </div>
                    
                    {/* Dots for the row */}
                    {Array.from({ length: cols }).map((_, colIndex) => {
                        const i = rowIndex * cols + colIndex;
                        const isFilled = i < filledCount;
                        const isNext = i === filledCount;
                        
                        return (
                          <motion.button
                            key={i}
                            onClick={() => handleDotClick(i)}
                            className={cn(
                              "w-10 h-10 rounded-full transition-all duration-150 border-2",
                              isFilled
                                ? "bg-orange-500 border-orange-600 shadow-sm" 
                                : "bg-slate-200/70 border-slate-300",
                              isNext && !isComplete && "animate-pulse ring-2 ring-primary ring-offset-2",
                              getDotShakeClass(i)
                            )}
                            aria-label={`Punto ${i + 1}`}
                            disabled={isComplete}
                          />
                        )
                    })}
                </>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="text-left">
          <p className="font-bold text-2xl">{filledCount} puntos</p>
          <p className="text-sm text-muted-foreground">dibujados</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={filledCount === 0}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reiniciar
            </Button>
            <Button variant="secondary" size="sm" onClick={handleFillAll} disabled={isComplete}>
                Dibujar todo
            </Button>
        </div>
      </div>
    </div>
  )
}

const DivisionTrick: FC<{ operand1: number; operand2: number }> = ({ operand1, operand2 }) => {
    if (operand2 === 1) {
        return (
            <div className="space-y-4 text-center">
                 <h3 className="font-bold text-xl">¡Dividir por 1 es fácil! 🪞</h3>
                 <p>Emmita, cualquier número dividido por 1 es... ¡el mismo número! Así que {operand1} ÷ 1 = {operand1}.</p>
            </div>
        )
    }
    
    const groups = operand2;
    const itemsPerGroup = operand1 / operand2;

    return (
        <div className="space-y-4 text-center">
            <h3 className="font-bold text-xl">Repartir en partes iguales 🎁</h3>
            <p className="text-muted-foreground">Repartimos <span className="font-bold text-sky-700">{operand1}</span> galletas 🍪 en <span className="font-bold text-sky-700">{groups}</span> cajas...</p>
            <div className="p-4 rounded-2xl bg-white">
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(groups, 4)}, 1fr)`}}>
                    {Array.from({ length: groups }).map((_, groupIndex) => (
                        <div key={groupIndex} className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-sky-300 bg-white">
                            <p className="font-bold text-sky-800">Caja {groupIndex + 1}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {Array.from({ length: itemsPerGroup }).map((_, itemIndex) => (
                                    <motion.div
                                        key={itemIndex}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: (groupIndex * itemsPerGroup + itemIndex) * 0.08, type: "spring", stiffness: 300, damping: 15 }}
                                        className="w-5 h-5 bg-sky-500 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-lg">En cada caja hay <span className="font-bold">{itemsPerGroup}</span> galletas. ¡Esa es la respuesta!</p>
        </div>
    )
}


export const TricksModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    problem: Problem | null;
}> = ({ isOpen, onClose, problem }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const handleSpeak = async () => {
    if (!problem) return;

    let textToSpeak = '';
    if (problem.operator === '×') {
      const { operand1, operand2 } = problem;
      if ((operand1 === 9 || operand2 === 9) && (operand1 > 0 && operand1 < 11) && (operand2 > 0 && operand2 < 11)) {
        const nonNine = operand1 === 9 ? operand2 : operand1;
        textToSpeak = `¡Emmita, el truco del 9!. Para multiplicar ${nonNine} por 9, ¡baja tu dedo número ${nonNine}!. Los dedos a la izquierda del que bajaste son las decenas, y los de la derecha son las unidades. ¡Inténtalo!`;
      } else {
        textToSpeak = `¡A dibujar para resolver! Emmita, para resolver ${problem.question}, tienes que dibujar una cuadrícula con ${Math.min(problem.operand1, problem.operand2)} filas y ${Math.max(problem.operand1, problem.operand2)} columnas. ¡Rellena todos los puntos y luego cuéntalos!`;
      }
    } else {
      const { operand1, operand2 } = problem;
      if (operand2 === 1) {
        textToSpeak = `¡Dividir por 1 es fácil!. Emmita, cualquier número dividido por 1 es... ¡el mismo número! Así que ${operand1} dividido por 1 es igual a ${operand1}.`;
      } else {
        textToSpeak = `¡Repartir en partes iguales! Emmita, dividir ${operand1} entre ${operand2} es como repartir ${operand1} galletas en ${operand2} cajas. ¿Cuántas galletas hay en cada caja?`;
      }
    }
    
    setIsSpeaking(true);
    await speak(textToSpeak);
    setIsSpeaking(false);
  };
  
  if (!problem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-background/95 backdrop-blur-sm border-primary">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">💡 ¡Emmita, aquí tienes un truco! 💡</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            A veces, ¡solo necesitamos una pequeña pista!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-lg">
          {problem.operator === '×' ? 
            <MultiplicationTrick operand1={problem.operand1} operand2={problem.operand2} /> :
            <DivisionTrick operand1={problem.operand1} operand2={problem.operand2} />
          }
        </div>
         <div className="flex justify-center items-center mt-4">
          {isSpeaking ? (
            <Button variant="destructive" onClick={() => { stopSpeech(); setIsSpeaking(false); }}>
              <Square className="mr-2 h-4 w-4" /> Detener
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleSpeak}>
              <Volume2 className="mr-2 h-4 w-4" /> Leer en voz alta
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { type FC, useEffect, useState, Fragment } from 'react';
import { speak, stopSpeech, type Problem } from '@/lib/math-engine';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plus, Volume2, Square, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HandsIllustration: FC<{ fingerDown: number }> = ({ fingerDown }) => {
  const fingers = Array.from({ length: 10 }, (_, i) => i + 1);
  const tens = fingerDown - 1;
  const ones = 10 - fingerDown;
  const nailColors = [
    'bg-pink-300', 'bg-sky-300', 'bg-teal-300', 'bg-lime-300', 'bg-amber-300',
    'bg-purple-300', 'bg-indigo-300', 'bg-cyan-300', 'bg-emerald-300', 'bg-rose-300'
  ];

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
    </div>
  );
};

const DoubleDoubleTrick: FC<{ num: number }> = ({ num }) => {
  const double = num * 2;
  const doubleDouble = double * 2;
  
  return (
    <div className="space-y-6 text-center py-4">
      <h3 className="font-bold text-xl text-amber-700">El Doble del Doble (x4) ✌️✌️</h3>
      <p className="text-muted-foreground">Multiplicar por 4 es calcular el doble... ¡y luego el doble otra vez!</p>
      
      <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Paso 1 */}
        <div className="flex items-center gap-4">
            <div className="bg-white border-2 border-amber-200 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm">
                {num}
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-amber-500">El Doble</span>
                <span className="text-2xl text-amber-400">➡️</span>
            </div>
            <div className="bg-amber-100 border-2 border-amber-300 w-20 h-20 rounded-xl flex items-center justify-center text-3xl font-bold shadow-md">
                {double}
            </div>
        </div>

        {/* Flecha conectora vertical */}
        <div className="h-8 w-1 bg-amber-200/50 rounded-full my-1"></div>

        {/* Paso 2 */}
        <div className="flex items-center gap-4">
             <div className="bg-amber-100 border-2 border-amber-300 w-20 h-20 rounded-xl flex items-center justify-center text-3xl font-bold shadow-md opacity-50">
                {double}
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-amber-600">El Doble (otra vez)</span>
                <span className="text-2xl text-amber-500">➡️</span>
            </div>
            <div className="bg-green-100 border-4 border-green-400 w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-green-700 shadow-lg scale-110">
                {doubleDouble}
            </div>
        </div>

      </div>
    </div>
  );
};

const HalfTrick: FC<{ total: number }> = ({ total }) => {
    const half = total / 2;
    
    return (
        <div className="space-y-6 text-center py-4">
             <h3 className="font-bold text-xl text-sky-700">La Mitad Exacta (÷2) 🌗</h3>
             <p className="text-muted-foreground">Dividir por 2 es partir en dos partes iguales. ¡Una para ti, una para mí!</p>

             <div className="flex justify-center items-center gap-8 py-6">
                
                {/* Visualización de Reparto */}
                <div className="relative w-32 h-32 rounded-full border-4 border-slate-300 flex items-center justify-center overflow-hidden shadow-inner bg-slate-100">
                    {/* Mitad Izquierda */}
                    <div className="absolute inset-y-0 left-0 w-1/2 bg-sky-100 flex items-center justify-center">
                         <span className="font-bold text-2xl text-sky-700">{half}</span>
                    </div>
                    {/* Mitad Derecha */}
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-indigo-100 flex items-center justify-center">
                         <span className="font-bold text-2xl text-indigo-700">{half}</span>
                    </div>
                    {/* Línea divisoria */}
                    <div className="absolute inset-y-0 left-1/2 -ml-0.5 w-1 bg-white/50 border-r-2 border-dashed border-slate-400"></div>
                </div>

                <div className="flex flex-col gap-2 text-left">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-sky-200 rounded-full flex items-center justify-center text-sky-800">👤</div>
                        <span className="font-bold text-sky-800">{half} para mí</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800">👤</div>
                         <span className="font-bold text-indigo-800">{half} para ti</span>
                    </div>
                </div>

             </div>
        </div>
    );
};

const MultiplicationTrick: FC<{ operand1: number; operand2: number }> = ({ operand1, operand2 }) => {
  // Truco del 9 (más específico)
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

  // Truco del 4 (Doble Doble)
  const hasFour = operand1 === 4 || operand2 === 4;
  if (hasFour) {
      const otherNum = operand1 === 4 ? operand2 : operand1;
      return <DoubleDoubleTrick num={otherNum} />;
  }

  // Estrategia genérica de la cuadrícula
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

      <div className="flex justify-center p-4 rounded-2xl bg-orange-50/50">
        
        <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(${cols}, minmax(0, 1fr))` }}>
            
            {/* 1. Empty Corner Cell + Column Headers */}
            <div /> 
            {Array.from({ length: cols }).map((_, i) => (
                <div key={`col-label-${i}`} className="flex items-center justify-center h-10 w-10 text-lg font-mono text-muted-foreground">
                    {i + 1}
                </div>
            ))}

            {/* 3. Rows (Label + Dots) */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <Fragment key={`row-${rowIndex}`}>
                    {/* Row Label */}
                    <div className="flex items-center justify-center h-10 w-10 pr-2 text-lg font-mono text-muted-foreground">
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
                </Fragment>
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
            <div className="space-y-6 text-center">
                 <h3 className="font-bold text-xl">¡El truco del Espejo! 🪞</h3>
                 
                 <p className="text-lg text-muted-foreground">
                    Dividir por 1 es como mirarse al espejo...
                 </p>

                 <div className="flex items-center justify-center gap-6 py-4">
                    {/* El Número Original */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-6xl font-bold text-sky-600">{operand1}</span>
                        <span className="text-sm font-medium text-sky-400">Soy yo</span>
                    </motion.div>

                    {/* Acción de mirar */}
                    <div className="text-4xl animate-pulse">👀 ➡️</div>

                    {/* El Espejo */}
                    <div className="relative">
                        <div className="text-9xl filter drop-shadow-lg">🪞</div>
                        {/* El Reflejo (Aparece después) */}
                         <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, type: "spring" }}
                            className="absolute inset-0 flex items-center justify-center pt-6 pl-1"
                        >
                            <span className="text-4xl font-bold text-sky-600/90">{operand1}</span>
                        </motion.div>
                    </div>
                 </div>
            </div>
        )
    }

    if (operand2 === 2) {
      return <HalfTrick total={operand1} />;
    }

    // --- LÓGICA DEL JUEGO ---
    const totalCookies = operand1;
    const targetGroups = operand2;
    
    // Estados
    const [currentBoxes, setCurrentBoxes] = useState(0); // Fase 1: Cuántas cajas ha puesto
    const [distributedCount, setDistributedCount] = useState(0); // Fase 2: Cuántas galletas repartió
    
    // Fases
    const isSetupPhase = currentBoxes < targetGroups;
    const isDistributionComplete = distributedCount === totalCookies;

    // Lógica de Reparto
    // Qué caja le toca recibir la galleta (0 a targetGroups - 1)
    const nextBoxIndex = distributedCount % targetGroups;

    // Helpers
    const handleAddBox = () => {
        if (currentBoxes < targetGroups) {
            setCurrentBoxes(prev => prev + 1);
        }
    };

    const handleBoxClick = (index: number) => {
        // Solo permitir click si ya estamos en fase de reparto Y es la caja correcta
        if (!isSetupPhase && !isDistributionComplete && index === nextBoxIndex) {
            setDistributedCount(prev => prev + 1);
        }
    };

    const handleReset = () => {
        setCurrentBoxes(0);
        setDistributedCount(0);
    };

    // Calcular items por caja para renderizar
    const getItemsInBox = (index: number) => {
        const fullRounds = Math.floor(distributedCount / targetGroups);
        const extra = index < (distributedCount % targetGroups) ? 1 : 0;
        return fullRounds + extra;
    };

    return (
        <div className="space-y-6 text-center">
            <h3 className="font-bold text-xl">
                {isSetupPhase ? "Paso 1: Pon las cajas 📦" : "Paso 2: ¡A repartir! 🍪"}
            </h3>

            {/* Instrucciones Dinámicas */}
            <p className="text-muted-foreground text-lg min-h-[3rem]">
                {isSetupPhase 
                    ? <span>Necesitamos dividir entre <span className="font-bold text-sky-600">{targetGroups}</span>. ¡Pon {targetGroups} cajas en la mesa!</span>
                    : !isDistributionComplete 
                        ? <span>Toca la <strong>caja resaltada</strong> para guardar una galleta.</span>
                        : <span className="text-green-600 font-bold flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/> ¡Reparto terminado!</span>
                }
            </p>

            {/* ZONA DE JUEGO */}
            <div className="p-4 rounded-3xl bg-sky-50 border-2 border-sky-100 min-h-[16rem] flex flex-col justify-center">
                
                {/* Visualización de Cajas */}
                <div className="flex flex-wrap justify-center gap-4">
                    {Array.from({ length: currentBoxes }).map((_, index) => {
                        const isNextTarget = !isSetupPhase && !isDistributionComplete && index === nextBoxIndex;
                        const items = getItemsInBox(index);

                        return (
                            <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ 
                                    scale: 1,
                                    borderColor: isNextTarget ? "#0ea5e9" : "#bae6fd", // sky-500 vs sky-200
                                    borderWidth: isNextTarget ? "4px" : "4px",
                                    boxShadow: isNextTarget ? "0 0 15px rgba(14, 165, 233, 0.3)" : "none"
                                }}
                                whileTap={isNextTarget ? { scale: 0.9 } : {}}
                                onClick={() => handleBoxClick(index)}
                                className={cn(
                                    "relative w-20 h-24 bg-white rounded-2xl flex items-center justify-center cursor-pointer transition-colors",
                                    !isNextTarget && !isSetupPhase && !isDistributionComplete && "opacity-60 grayscale-[0.3]" // Apagar las que no tocan
                                )}
                            >
                                {/* Grid de Galletas dentro de la caja */}
                                <div className="grid grid-cols-2 gap-1 p-1">
                                    {Array.from({ length: items }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-3 h-3 bg-sky-500 rounded-full"
                                        />
                                    ))}
                                </div>
                                
                                {/* Etiqueta de cantidad (Opcional, ayuda a subitizar) */}
                                {items > 0 && (
                                    <div className="absolute -bottom-3 bg-sky-100 text-sky-800 text-xs px-2 py-0.5 rounded-full font-bold">
                                        {items}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Botón Fase 1: Agregar Caja */}
                {isSetupPhase && (
                    <div className="mt-8">
                        <Button 
                            size="lg" 
                            onClick={handleAddBox}
                            className="bg-sky-500 hover:bg-sky-600 text-white text-lg rounded-full px-8 shadow-lg"
                        >
                            <Plus className="mr-2 h-5 w-5" /> Agregar Caja ({currentBoxes}/{targetGroups})
                        </Button>
                    </div>
                )}
            </div>

            {/* CONTADORES Y RESULTADO */}
            {!isSetupPhase && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-sm font-mono text-muted-foreground">
                        Galletas repartidas: {distributedCount} / {totalCookies}
                    </div>

                    {isDistributionComplete && (
                        <div className="bg-green-100 p-4 rounded-xl border border-green-200">
                             <p className="text-lg text-green-800 font-medium">
                                ¡Bien hecho! Ahora cuenta cuántas hay en <strong>UNA sola caja</strong>.
                                <br />
                                ¡Esa es la respuesta!
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="pt-4">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Empezar de cero
                </Button>
            </div>
        </div>
    );
};


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
    const { operand1, operand2 } = problem;

    if (problem.operator === '×') {
      const isNineTrick = (operand1 === 9 || operand2 === 9) && (operand1 > 0 && operand1 < 11) && (operand2 > 0 && operand2 < 11);
      const isFourTrick = operand1 === 4 || operand2 === 4;

      if (isNineTrick) {
        const nonNine = operand1 === 9 ? operand2 : operand1;
        textToSpeak = `¡Emmita, el truco del 9!. Para multiplicar ${nonNine} por 9, ¡baja tu dedo número ${nonNine}!. Los dedos a la izquierda del que bajaste son las decenas, y los de la derecha son las unidades. ¡Inténtalo!`;
      } else if (isFourTrick) {
        const otherNum = operand1 === 4 ? operand2 : operand1;
        textToSpeak = `¡El truco del Doble Doble! Emmita, multiplicar por 4 es lo mismo que calcular el doble, y luego, ¡calcular el doble otra vez! El doble de ${otherNum} es ${otherNum * 2}, y el doble de eso es ${otherNum * 4}.`;
      } else {
        textToSpeak = `¡A dibujar para resolver! Emmita, para resolver ${problem.question}, tienes que dibujar una cuadrícula con ${Math.min(operand1, operand2)} filas y ${Math.max(operand1, operand2)} columnas. ¡Rellena todos los puntos y luego cuéntalos!`;
      }
    } else { // Division
      if (operand2 === 1) {
        textToSpeak = `¡Dividir por 1 es fácil!. Emmita, cualquier número dividido por 1 es... ¡el mismo número! Así que ${operand1} dividido por 1 es igual a ${operand1}.`;
      } else if (operand2 === 2) {
        textToSpeak = `¡La mitad exacta! Emmita, dividir ${operand1} entre 2 es como partirlo en dos partes iguales. ¡La mitad de ${operand1} es ${operand1 / 2}!`;
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

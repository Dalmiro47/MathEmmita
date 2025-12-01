"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { type FC, useEffect } from 'react';
import { speak, type Problem } from '@/lib/math-engine';
import { cn } from "@/lib/utils";

const HandsIllustration: FC<{ fingerDown: number }> = ({ fingerDown }) => {
  const fingers = Array.from({ length: 10 }, (_, i) => i + 1);
  const tens = fingerDown - 1;
  const ones = 10 - fingerDown;

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-4 text-4xl">
        {/* Left Hand */}
        <div className="flex -scale-x-100">
          {fingers.slice(0, 5).map((finger) => (
            <div
              key={finger}
              className={cn(
                "transition-transform duration-300 ease-in-out origin-bottom",
                finger === fingerDown && "-rotate-12",
                finger > fingerDown && "opacity-50",
              )}
              style={{ transform: `rotate(${ (6 - finger) * 15 - 45}deg)` }}
            >
              <div className={cn(
                "w-6 h-16 bg-orange-200 border-2 border-orange-300 rounded-t-full",
                finger === fingerDown ? "bg-primary" : ""
              )}></div>
            </div>
          ))}
        </div>
        {/* Right Hand */}
        <div className="flex">
          {fingers.slice(5, 10).map((finger) => (
             <div
              key={finger}
              className={cn(
                "transition-transform duration-300 ease-in-out origin-bottom",
                finger === fingerDown && "rotate-12",
                finger < fingerDown && "opacity-50",
              )}
              style={{ transform: `rotate(${ (finger - 5) * 15 - 30}deg)` }}
            >
              <div className={cn(
                "w-6 h-16 bg-orange-200 border-2 border-orange-300 rounded-t-full",
                 finger === fingerDown ? "bg-primary" : ""
              )}></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-around w-full mt-4 text-center">
        <div>
          <p className="text-lg">Decenas</p>
          <p className="text-4xl font-bold text-primary">{tens}</p>
        </div>
        <div>
          <p className="text-lg">Unidades</p>
          <p className="text-4xl font-bold text-primary">{ones}</p>
        </div>
      </div>
    </div>
  );
};


const MultiplicationTrick: FC<{ operand1: number; operand2: number }> = ({ operand1, operand2 }) => {
    // Implement the 9s trick
    if (operand1 === 9 || operand2 === 9) {
        const nonNine = operand1 === 9 ? operand2 : operand1;
        const tens = Math.floor(nonNine - 1);
        const ones = 9 - tens;

        return (
            <div className="space-y-4 text-center">
                <h3 className="font-bold text-xl">¡Emmita, el truco del 9! ✨</h3>
                <p>Emmita, imagina que tienes 10 dedos. Para multiplicar {nonNine} por 9, ¡baja tu dedo número {nonNine}!</p>
                <div className="my-4 p-4 bg-accent/50 rounded-lg">
                  <HandsIllustration fingerDown={nonNine} />
                </div>
                <p>Los dedos a la izquierda son las decenas: <span className="font-bold text-2xl">{tens}</span>.</p>
                <p>Los dedos a la derecha son las unidades: <span className="font-bold text-2xl">{ones}</span>.</p>
                <p>¡Así que la respuesta es <span className="font-bold text-3xl">{tens}{ones}</span>!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 text-center">
             <h3 className="font-bold text-xl">Sumar en grupos ➕</h3>
             <p>Emmita, ¡multiplicar <span className="font-bold">{operand1} × {operand2}</span> es como sumar el número <span className="font-bold">{operand1}</span>, <span className="font-bold">{operand2}</span> veces!</p>
             <p className="text-4xl mt-4">🍎...🍎...🍎</p>
             <p>¡Tú puedes contarlos!</p>
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
    
    return (
        <div className="space-y-4 text-center">
            <h3 className="font-bold text-xl">Repartir en partes iguales 🎁</h3>
            <p>Emmita, dividir <span className="font-bold">{operand1}</span> entre <span className="font-bold">{operand2}</span> es buscar cuántos grupos de <span className="font-bold">{operand2}</span> puedes hacer.</p>
            <p>Si tienes {operand1} galletas 🍪 y las repartes entre {operand2} amigos, ¿cuántas le tocan a cada uno?</p>
        </div>
    )
}


export const TricksModal: FC<TricksModalProps> = ({ isOpen, onClose, problem }) => {
  useEffect(() => {
    if (isOpen && problem) {
      let textToSpeak = '';
      if (problem.operator === '×') {
        const { operand1, operand2 } = problem;
        if (operand1 === 9 || operand2 === 9) {
          const nonNine = operand1 === 9 ? operand2 : operand1;
          const tens = Math.floor(nonNine - 1);
          const ones = 9 - tens;
          textToSpeak = `¡Emmita, el truco del 9!. Emmita, imagina que tienes 10 dedos. Para multiplicar ${nonNine} por 9, ¡baja tu dedo número ${nonNine}!. Los dedos a la izquierda son las decenas: ${tens}. Los dedos a la derecha son las unidades: ${ones}. ¡Así que la respuesta es ${tens}${ones}!`;
        } else {
          textToSpeak = `Sumar en grupos. Emmita, ¡multiplicar ${operand1} por ${operand2} es como sumar el número ${operand1}, ${operand2} veces! ¡Tú puedes contarlos!`;
        }
      } else {
        const { operand1, operand2 } = problem;
        if (operand2 === 1) {
          textToSpeak = `¡Dividir por 1 es fácil!. Emmita, cualquier número dividido por 1 es... ¡el mismo número! Así que ${operand1} dividido por 1 es igual a ${operand1}.`;
        } else {
          textToSpeak = `Repartir en partes iguales. Emmita, dividir ${operand1} entre ${operand2} es buscar cuántos grupos de ${operand2} puedes hacer. Si tienes ${operand1} galletas y las repartes entre ${operand2} amigos, ¿cuántas le tocan a cada uno?`;
        }
      }
      speak(textToSpeak);
    }
  }, [isOpen, problem]);
  
  if (!problem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-sm border-primary">
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
      </DialogContent>
    </Dialog>
  );
};

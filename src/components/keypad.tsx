"use client";

import { Button } from "@/components/ui/button";
import { Delete, CornerDownLeft } from "lucide-react";
import type { FC } from 'react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
}

export const Keypad: FC<KeypadProps> = ({ onKeyPress }) => {
  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'backspace', '0', 'enter'
  ];

  const handleButtonClick = (key: string) => {
    onKeyPress(key);
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xs mx-auto">
      {keys.map((key) => {
        let content;
        let ariaLabel;

        if (key === 'backspace') {
          content = <Delete className="w-8 h-8 sm:w-10 sm:h-10" />;
          ariaLabel = 'Borrar';
        } else if (key === 'enter') {
          content = <CornerDownLeft className="w-8 h-8 sm:w-10 sm:h-10" />;
          ariaLabel = 'Confirmar respuesta';
        } else {
          content = key;
          ariaLabel = `Número ${key}`;
        }

        return (
          <Button
            key={key}
            onClick={() => handleButtonClick(key)}
            variant="default"
            size="lg"
            className="h-20 sm:h-24 text-3xl sm:text-4xl font-bold rounded-xl shadow-md transition-transform transform hover:scale-105 active:scale-95"
            aria-label={ariaLabel}
          >
            {content}
          </Button>
        );
      })}
    </div>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { Delete, CornerDownLeft } from "lucide-react";
import type { FC } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const keypadButtonVariants = cva(
  "h-20 sm:h-24 text-3xl sm:text-4xl font-bold rounded-xl shadow-md transition-transform transform hover:scale-105 active:scale-95",
  {
    variants: {
      theme: {
        orange: "",
        blue: "",
      },
      isAction: {
        true: "",
        false: "",
      }
    },
    compoundVariants: [
      {
        theme: 'orange',
        isAction: false,
        className: "bg-primary text-primary-foreground hover:bg-primary/90"
      },
      {
        theme: 'orange',
        isAction: true,
        className: "bg-amber-300 text-amber-900 hover:bg-amber-400"
      },
       {
        theme: 'blue',
        isAction: false,
        className: "bg-sky-500 text-white hover:bg-sky-600"
      },
      {
        theme: 'blue',
        isAction: true,
        className: "bg-sky-300 text-sky-900 hover:bg-sky-400"
      }
    ],
    defaultVariants: {
      theme: "orange",
      isAction: false,
    },
  }
);

interface KeypadProps extends VariantProps<typeof keypadButtonVariants> {
  onKeyPress: (key: string) => void;
  theme?: 'orange' | 'blue';
}

export const Keypad: FC<KeypadProps> = ({ onKeyPress, theme = 'orange' }) => {
  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'backspace', '0', 'enter'
  ];

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, key: string) => {
    e.stopPropagation();
    onKeyPress(key);
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xs mx-auto">
      {keys.map((key) => {
        const isActionKey = key === 'backspace' || key === 'enter';
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
            onClick={(e) => handleButtonClick(e, key)}
            variant="default"
            size="lg"
            className={cn(keypadButtonVariants({ theme, isAction: isActionKey }))}
            aria-label={ariaLabel}
          >
            {content}
          </Button>
        );
      })}
    </div>
  );
};

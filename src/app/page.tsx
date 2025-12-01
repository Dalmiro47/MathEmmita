
"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Lightbulb, Volume2, LogIn } from "lucide-react";
import { generateProblem, loadVoices, speak, type Problem } from "@/lib/math-engine";
import { getSmartProblem, saveAttempt } from "@/lib/progress-service";
import { Keypad } from "@/components/keypad";
import { TricksModal } from "@/components/tricks-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useUser, useAuth, useFirestore } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { MedalOverlay } from "@/components/medal-overlay";

type AnswerStatus = "idle" | "correct" | "incorrect" | "revealed";

export default function Home() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("idle");
  const [showTricks, setShowTricks] = useState<boolean>(false);
  const [level, setLevel] = useState<1 | 2>(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [debugInput, setDebugInput] = useState("");
  const [showMedal, setShowMedal] = useState(false);

  const say = useCallback(async (text: string) => {
    setIsSpeaking(true);
    await speak(text);
    setIsSpeaking(false);
  }, []);

  const newProblem = useCallback(async (shouldSpeak = false) => {
    const p = user && db ? await getSmartProblem(db, user.uid, level) : generateProblem(level);
    setProblem(p);
    setUserInput("");
    setAnswerStatus("idle");
    if (shouldSpeak) {
      say(`¿Cuánto es ${p.question.replace('×', 'por').replace('÷', 'dividido por')}?`);
    }
  }, [level, say, user, db]);

  useEffect(() => {
    loadVoices();
    if (!userLoading && user) {
      newProblem(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]);

  const checkAnswer = useCallback(() => {
    if (!problem || userInput === "") return;
    
    const isCorrect = parseInt(userInput, 10) === problem.answer;
    
    if (user && db) {
      saveAttempt(db, user.uid, problem, isCorrect);
    }

    if (isCorrect) {
      if (problem.isRetry) {
        // Special celebration for a hard-won victory
        setShowMedal(true);
        say("¡Guau! ¡Has superado un reto difícil! Eres una campeona, Emmita.");
        setTimeout(() => {
          setShowMedal(false);
          newProblem(true);
        }, 4000); // Show medal for 4 seconds
      } else {
        // Normal correct answer
        setAnswerStatus("correct");
        say("¡Correcto!");
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FFB74D', '#FFECB3', '#FFFFFF', '#89CFF0']
        });
        setTimeout(() => {
          if (problem.operator === '÷' && Math.random() < 0.3) {
              setLevel(prev => prev === 1 ? 2 : 1);
          }
          newProblem(true);
        }, 1500);
      }
    } else {
      setAnswerStatus("incorrect");
      say("Oh, intenta de nuevo.");
      setTimeout(() => {
        setAnswerStatus("idle");
        setUserInput("");
      }, 1500);
    }
  }, [problem, userInput, newProblem, say, user, db]);

  const handleShowSolution = useCallback(() => {
    if (!problem) return;
    setAnswerStatus("revealed");
    setUserInput(String(problem.answer));
    setTimeout(() => {
      newProblem(true);
    }, 2000);
  }, [problem, newProblem]);


  const handleKeyPress = useCallback((key: string) => {
    if (answerStatus === 'correct' || answerStatus === 'revealed' || showMedal) return;

    if (key === 'backspace' || key === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
    } else if (key === 'enter' || key === 'Enter') {
      checkAnswer();
    } else if (/\d/.test(key) && userInput.length < 4) {
      setUserInput((prev) => prev + key);
    }
  }, [answerStatus, checkAnswer, userInput.length, showMedal]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);


  const handleLogin = () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
    }
  };

  const handleDebugSubmit = () => {
    const parts = debugInput.match(/(\d+)\s*([*x×/÷])\s*(\d+)/);
    if (!parts) {
      alert("Formato inválido. Usa 'a * b' o 'a / b'.");
      return;
    }
    
    const [, op1, op, op2] = parts;
    const operand1 = parseInt(op1, 10);
    const operand2 = parseInt(op2, 10);
    const operator = ['*', 'x', '×'].includes(op) ? '×' : '÷';

    if (isNaN(operand1) || isNaN(operand2)) {
      alert("Números inválidos.");
      return;
    }

    if (operator === '÷' && operand1 % operand2 !== 0) {
      alert("La división debe ser exacta para este juego.");
      return;
    }

    const answer = operator === '×' ? operand1 * operand2 : operand1 / operand2;

    const newProb: Problem = {
      operand1,
      operand2,
      operator,
      answer,
      question: `${operand1} ${operator} ${operand2}`,
      colorTheme: operator === '×' ? 'orange' : 'blue',
    };

    setProblem(newProb);
    setUserInput("");
    setAnswerStatus("idle");
    say(`¿Cuánto es ${newProb.question.replace('×', 'por').replace('÷', 'dividido por')}?`);
  };

  const statusColorClass = {
    idle: "border-muted",
    correct: "border-green-500",
    incorrect: "border-destructive",
    revealed: "border-sky-500",
  };

  const problemCardColorClass = {
    orange: "bg-card",
    blue: "bg-sky-50",
  }
  
  if (userLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <p>Cargando...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold mb-4 text-foreground/80">Bienvenida a MathEmmita</h1>
          <p className="text-muted-foreground mb-8">Para guardar tu progreso, por favor inicia sesión.</p>
          <Button onClick={handleLogin} size="lg" className="bg-primary hover:bg-primary/90">
            <LogIn className="mr-2" /> Iniciar Sesión con Google
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
       <MedalOverlay show={showMedal} />
       <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-100 p-2 rounded-md shadow-sm">
        <Input
          id="debug-input"
          type="text"
          value={debugInput}
          onChange={(e) => setDebugInput(e.target.value)}
          placeholder="Ej: 4*9 o 36/4"
          className="w-36 h-8 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleDebugSubmit();
            }
          }}
        />
        <Button onClick={handleDebugSubmit} size="sm" className="h-8">Probar</Button>
      </div>

      <div className="relative w-full max-w-md text-center">
        <h1 className="font-headline text-3xl font-bold mb-6 text-foreground/80">MathEmmita</h1>
        
        {problem ? (
          <div className={cn("relative p-8 rounded-2xl shadow-lg mb-8 transition-colors duration-500", problemCardColorClass[problem.colorTheme])}>
            <p className="font-headline text-6xl sm:text-8xl font-bold tracking-widest" aria-live="polite">
              {problem.question}
            </p>
            <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-muted-foreground" onClick={() => say(`¿Cuánto es ${problem.question.replace('×', 'por').replace('÷', 'dividido por')}?`)} disabled={isSpeaking}>
              <Volume2 className="h-6 w-6" />
              <span className="sr-only">Leer problema en voz alta</span>
            </Button>
          </div>
        ) : (
           <div className="p-8 h-40 bg-card rounded-2xl shadow-lg mb-8 flex items-center justify-center">
             <p className="text-xl">Cargando problema...</p>
           </div>
        )}

        <div 
          className={cn(
            "h-24 sm:h-28 w-full bg-card rounded-2xl shadow-inner flex items-center justify-center mb-8 border-4 transition-colors duration-300",
            statusColorClass[answerStatus]
          )}
        >
          <span className="font-headline text-5xl sm:text-7xl font-bold">{userInput || "?"}</span>
        </div>
        
        <Keypad onKeyPress={handleKeyPress} theme={problem?.colorTheme || 'orange'} />
        
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={handleShowSolution}
            className="bg-sky-100 text-sky-800 border-sky-300 hover:bg-sky-200"
            disabled={answerStatus === 'correct' || answerStatus === 'revealed'}
          >
            Ver Solución
          </Button>
          <Button
            className="rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90"
            onClick={() => setShowTricks(true)}
            aria-label="Mostrar truco"
          >
            <Lightbulb className="h-8 w-8 text-primary-foreground" />
          </Button>
        </div>
      </div>
      
      <TricksModal isOpen={showTricks} onClose={() => setShowTricks(false)} problem={problem} />
    </main>
  );
}

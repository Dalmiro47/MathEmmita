export type Problem = {
  operand1: number;
  operand2: number;
  operator: '×' | '÷';
  answer: number;
  question: string;
  colorTheme: 'orange' | 'blue';
  isRetry?: boolean;
};

// --- State for Scaffolding ---
let lastProblem: Problem | null = null;


// --- Problem Generation ---

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateMultiplicationProblem = (): Problem => {
  const operand1 = getRandomInt(4, 9);
  const operand2 = getRandomInt(4, 9);
  const answer = operand1 * operand2;
  const problem: Problem = {
    operand1,
    operand2,
    operator: '×',
    answer,
    question: `${operand1} × ${operand2}`,
    colorTheme: 'orange',
  };
  lastProblem = problem;
  return problem;
};

const generateDivisionProblem = (level: 1 | 2 = 1, fixedOperands?: {dividend: number, divisor: number}): Problem => {
  let dividend: number, divisor: number, quotient: number;

  if (fixedOperands) {
      dividend = fixedOperands.dividend;
      divisor = fixedOperands.divisor;
      quotient = dividend / divisor;
  } else {
      divisor = level === 1 ? getRandomInt(4, 9) : getRandomInt(10, 15);
      quotient = getRandomInt(2, 9);
      dividend = divisor * quotient;
  }

  const problem: Problem = {
    operand1: dividend,
    operand2: divisor,
    operator: '÷',
    answer: quotient,
    question: `${dividend} ÷ ${divisor}`,
    colorTheme: 'blue',
  };
  lastProblem = problem;
  return problem;
};

export function generateProblem(level: 1 | 2 = 1): Problem {
  // Scaffolding: Check if last problem was multiplication
  if (lastProblem && lastProblem.operator === '×' && Math.random() > 0.5) {
      const { operand1, operand2, answer } = lastProblem;
      // 50% chance to provide one of the inverse divisions
      const divisor = Math.random() > 0.5 ? operand1 : operand2;
      return generateDivisionProblem(level, { dividend: answer, divisor: divisor });
  }

  // Default behavior
  const isMultiplication = Math.random() > 0.5;
  if (isMultiplication) {
    return generateMultiplicationProblem();
  }
  return generateDivisionProblem(level);
}


// --- Text-to-Speech Engine ---

let voices: SpeechSynthesisVoice[] = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;
let voicesLoaded = false;

function getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise(resolve => {
        if (voices.length > 0) {
            return resolve(voices);
        }
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            voicesLoaded = true;
            resolve(voices);
        };
        // Fallback for browsers that don't fire 'onvoiceschanged' consistently
        setTimeout(() => {
            if (voices.length === 0) {
                voices = window.speechSynthesis.getVoices();
                voicesLoaded = true;
                resolve(voices);
            }
        }, 500);
    });
}


export function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }
  getVoices(); // Start loading voices
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export async function speak(text: string): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Cancel any ongoing speech
  stopSpeech();

  if (!voicesLoaded) {
      await getVoices();
  }

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";

    // Prioritize a specific male voice, then any male Spanish voice.
    const googleMaleVoice = voices.find(v => v.lang === 'es-ES' && v.name === 'Google español');
    const genericMaleVoice = voices.find(v => v.lang === 'es-ES' && v.gender === 'male');
    
    utterance.voice = googleMaleVoice || genericMaleVoice || voices.find(v => v.lang === 'es-ES') || null;
    
    utterance.pitch = 1.0;
    utterance.rate = 0.9;

    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };
    
    utterance.onerror = () => {
      currentUtterance = null;
      resolve(); // Resolve even on error to not block execution
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}

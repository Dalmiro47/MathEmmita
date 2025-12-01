export type Problem = {
  operand1: number;
  operand2: number;
  operator: '×' | '÷';
  answer: number;
  question: string;
};

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
  return {
    operand1,
    operand2,
    operator: '×',
    answer,
    question: `${operand1} × ${operand2}`,
  };
};

const generateDivisionProblem = (level: 1 | 2 = 1): Problem => {
  const divisor = level === 1 ? getRandomInt(4, 9) : getRandomInt(10, 15);
  const quotient = getRandomInt(2, 9);
  const dividend = divisor * quotient;

  return {
    operand1: dividend,
    operand2: divisor,
    operator: '÷',
    answer: quotient,
    question: `${dividend} ÷ ${divisor}`,
  };
};

export function generateProblem(level: 1 | 2 = 1): Problem {
  const isMultiplication = Math.random() > 0.5;
  if (isMultiplication) {
    return generateMultiplicationProblem();
  }
  return generateDivisionProblem(level);
}

// --- Text-to-Speech Engine ---

let voices: SpeechSynthesisVoice[] = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }
  // The 'voiceschanged' event is fired when the list of voices is ready.
  window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
  };
  // In some browsers, we need to explicitly trigger the loading.
  voices = window.speechSynthesis.getVoices();
}


export async function speak(text: string): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Cancel any ongoing speech
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";

    // Try to find a good quality Spanish voice
    const spanishVoice = voices.find(v => v.lang === 'es-ES' && v.name.includes('Google'));
    utterance.voice = spanishVoice || voices.find(v => v.lang === 'es-ES') || null;
    
    utterance.pitch = 1.1;
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

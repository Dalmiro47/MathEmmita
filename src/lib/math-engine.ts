import { textToSpeech } from '@/ai/flows/tts-flow';

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

let currentAudio: HTMLAudioElement | null = null;

// This function is a placeholder now, as we are not using browser voices.
export function loadVoices() {
  // No-op
}

export async function speak(text: string): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  try {
    const response = await textToSpeech(text);
    const audioData = response.audio;
    
    if (audioData) {
      currentAudio = new Audio(audioData);
      currentAudio.play().catch(e => console.error("Audio playback failed:", e));
    }
  } catch (error) {
    console.error('Failed to generate speech:', error);
  }
}

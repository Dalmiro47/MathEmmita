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

// Function to fetch and filter voices. Must be called once on the client.
export function loadVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const getVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        if (allVoices.length > 0) {
            // Prioritize specific, high-quality voices
            let preferredVoices = allVoices.filter(voice => 
                voice.lang.startsWith('es') && 
                (voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('paulina'))
            );
            
            if (preferredVoices.length > 0) {
                voices = preferredVoices;
            } else {
                 // Fallback to any Spanish voice if specific ones aren't found
                voices = allVoices.filter(voice => voice.lang.startsWith('es'));
            }
        }
    };
    
    // Voices might load asynchronously.
    if (window.speechSynthesis.getVoices().length > 0) {
        getVoices();
    } else {
        window.speechSynthesis.onvoiceschanged = getVoices;
    }
}


export function speak(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }
  
  window.speechSynthesis.cancel(); // Cancel any speech that is currently active

  const utterance = new SpeechSynthesisUtterance(text);
  
  if (voices.length > 0) {
    utterance.voice = voices[0]; // Use the first (and best) found voice
  } else {
      console.warn("No Spanish voices found. Using browser default.");
  }
  
  utterance.pitch = 1.1; // Slightly higher pitch for a friendly tone
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.lang = 'es-ES'; // Explicitly set language
  
  window.speechSynthesis.speak(utterance);
}

import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Lightbulb, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Check, 
  X, 
  RefreshCw, 
  Trophy, 
  Flame, 
  Clock, 
  Target, 
  Maximize2, 
  Minimize2, 
  BookOpen,
  Zap,
  RotateCcw,
  Award,
  PenTool,
  Send,
  HelpCircle,
  Bot,
  Loader2,
  Coins,
  Heart,
  HeartCrack,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { triggerHaptic, playSuccessSound, parseSolutionSteps, FormattedSolutionStep, filterActualTaskIds } from '../utils';
import { MathText } from './MathText';
import { MathRenderer } from './MathRenderer';
import { Badge } from './Badge';
import { CkeScratchpad } from './CkeScratchpad';
import { OpenTaskWorkspace } from './OpenTaskWorkspace';
import { SessionRunner } from './SessionRunner';
import { MathPlot } from './MathPlot';
import { MathDiagram } from './MathDiagram';
import { NumberLineDiagram } from './NumberLineDiagram';
import { UserState, MathTaskItem, TaskOption, TaskSolutionStep } from '../types';
import { deductHeart, getSyncedHearts } from '../lib/heartsManager';
import { apiHeaders } from '../lib/apiClient';

interface TaskViewProps {
  taskData?: any;
  userState?: UserState;
  onCompleteTask: (taskIds?: string | string[], stars?: number, earnedXp?: number, earnedCoins?: number, nextLesson?: any) => void;
  onCancelTask: () => void;
  onDeductCoins?: (amount: number) => boolean;
  onDeductHeart?: () => { wasDeducted: boolean; isOutOfHearts: boolean };
  onOpenParentSponsor?: () => void;
  onOpenProPopup?: () => void;
  onUpdateUserState?: (updater: (prev: UserState) => UserState) => void;
}

export interface FormattedFormulaItem {
  title?: string;
  latex: string;
  description?: string;
}

interface TheoryCardItem {
  title: string;
  badge?: string;
  type?: 'essence' | 'formulas' | 'example' | 'trap' | 'takeaway' | 'default';
  concept_essence?: string;
  matura_context?: string;
  diagram?: any;
  numberLine?: any;
  formulas?: string[];
  structuredFormulas?: FormattedFormulaItem[];
  core_formulas?: string;
  formula_notes?: string;
  worked_example?: {
    problem: string;
    step1?: string;
    step2?: string;
    result?: string;
    steps?: { step_num: number; explanation: string }[];
  };
  exam_trap?: string;
  trap_error?: string;
  trap_correct?: string;
  trap_note?: string;
  content?: string;
}

function extractStructuredFormulas(raw: any): FormattedFormulaItem[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  const results: FormattedFormulaItem[] = [];

  for (const item of list) {
    if (!item) continue;
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('\\begin{aligned}') && trimmed.endsWith('\\end{aligned}')) {
        results.push({ latex: trimmed });
      } else if (trimmed.includes('\n')) {
        const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
          results.push({ latex: line });
        }
      } else {
        results.push({ latex: trimmed });
      }
    } else if (typeof item === 'object') {
      const latex = item.latex || item.formula || item.content_latex || item.content || item.math || item.def || '';
      const title = item.title || item.name || item.label || '';
      const description = item.description || item.desc || item.explanation || item.note || item.legend || '';
      if (latex || title || description) {
        results.push({
          title: title ? String(title).trim() : undefined,
          latex: latex ? String(latex).trim() : (title ? String(title).trim() : ''),
          description: description ? String(description).trim() : undefined
        });
      }
    }
  }

  return results;
}

function buildTheoryCards(theoryItem: any): TheoryCardItem[] {
  const pill = theoryItem?.theory_pill;
  if (pill) {
    const cards: TheoryCardItem[] = [];

    // Card 1: Istota pojęcia & Strategia maturalna (Bento Essence)
    if (pill.concept_essence || pill.matura_context || pill.intuition || pill.key_takeaway || pill.diagram || (pill as any).numberLine) {
      cards.push({
        title: pill.title || 'W pigułce & Strategia maturalna',
        badge: 'Fundament Maturalny',
        type: 'essence',
        concept_essence: pill.concept_essence || pill.intuition,
        matura_context: pill.matura_context || pill.key_takeaway,
        diagram: pill.diagram,
        numberLine: (pill as any).numberLine,
        content: pill.concept_essence || pill.intuition || pill.key_takeaway
      });
    }

    // Card 2: Złote Wzory (Karty Wzorów)
    const rawFormulas = pill.core_formulas || pill.core_formula || pill.coreFormulaLatex || pill.formulas;
    if (rawFormulas && (Array.isArray(rawFormulas) ? rawFormulas.length > 0 : Boolean(rawFormulas))) {
      const structured = extractStructuredFormulas(rawFormulas);
      cards.push({
        title: 'Złote Wzory i Zależności',
        badge: 'Karta Wzorów',
        type: 'formulas',
        core_formulas: typeof rawFormulas === 'string' ? rawFormulas : undefined,
        structuredFormulas: structured,
        formulas: structured.map(s => s.latex),
        formula_notes: pill.formula_notes
      });
    }

    // Card 3: Przykład z arkusza (Worked Example)
    if (pill.worked_example) {
      cards.push({
        title: 'Przykład z arkusza krok po kroku',
        badge: 'Modelowe Rozwiązanie',
        type: 'example',
        worked_example: pill.worked_example
      });
    }

    // Card 4: Pułapka Egzaminacyjna (Exam Trap - delicate warning border, no AI slop)
    if (pill.exam_trap || pill.cke_trap || pill.trap_error || pill.trapAlert) {
      cards.push({
        title: 'Pułapka Egzaminacyjna',
        badge: 'Uwaga na Egzaminie',
        type: 'trap',
        exam_trap: pill.exam_trap || pill.cke_trap || pill.trapAlert,
        trap_error: pill.trap_error,
        trap_correct: pill.trap_correct,
        trap_note: pill.trap_note || pill.exam_trap || pill.cke_trap || pill.trapAlert,
        content: pill.exam_trap || pill.cke_trap || pill.trapAlert
      });
    }

    if (cards.length > 0) return cards;
  }

  // Fallback to parsing officialKey if no structured theory_pill
  return parseTheoryCards(theoryItem?.officialKey || '', theoryItem?.question || '');
}

function parseTheoryCards(officialKey: string, question: string): TheoryCardItem[] {
  const sanitized = (officialKey || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .trim();

  if (sanitized.includes('•')) {
    const rawBullets = sanitized.split(/\n?•\s*/).filter(b => b.trim().length > 0);
    const bullets = rawBullets.filter(b => !b.toLowerCase().startsWith('pigułka wiedzy'));

    return bullets.map(b => {
      const lines = b.split('\n').map(l => l.trim()).filter(Boolean);
      let title = lines[0] || 'Kluczowa Reguła';

      if (title.includes(':')) {
        const colonIdx = title.indexOf(':');
        const afterColon = title.substring(colonIdx + 1).trim();
        title = title.substring(0, colonIdx).trim();
        if (afterColon) {
          lines[0] = afterColon;
        } else {
          lines.shift();
        }
      } else {
        lines.shift();
      }

      const content = lines.join('\n\n');
      const isTrap = title.toLowerCase().includes('pułapk') || title.toLowerCase().includes('błąd');

      return {
        title,
        badge: isTrap ? 'Częsty Błąd' : 'Kluczowa Reguła',
        type: isTrap ? 'trap' : 'default',
        content,
        trap_note: isTrap ? content : undefined
      };
    });
  }

  return [{
    title: 'Pigułka wiedzy',
    badge: 'Podsumowanie',
    type: 'default',
    content: sanitized || question
  }];
}

export function TaskView({ 
  taskData, 
  userState, 
  onCompleteTask, 
  onCancelTask,
  onDeductCoins,
  onDeductHeart,
  onOpenParentSponsor,
  onOpenProPopup,
  onUpdateUserState
}: TaskViewProps) {
  if (taskData?.isSession) {
    return (
      <SessionRunner 
        sessionData={taskData} 
        userState={userState} 
        onCompleteSession={onCompleteTask} 
        onCancelSession={onCancelTask}
        onDeductCoins={onDeductCoins}
        onDeductHeart={onDeductHeart}
        onOpenParentSponsor={onOpenParentSponsor}
        onOpenProPopup={onOpenProPopup}
        onUpdateUserState={onUpdateUserState}
      />
    );
  }

  const heartsData = getSyncedHearts(userState);

  // Determine tasks pool for this lesson
  const rawLessonTasks: any[] = (taskData?.lessonTasks && Array.isArray(taskData.lessonTasks) && taskData.lessonTasks.length > 0)
    ? taskData.lessonTasks
    : (taskData ? [taskData] : []);

  const theoryTask = rawLessonTasks.find((t: any) => t.type === 'theory' || t.id?.includes('THEORY'));
  const practiceTasksList = rawLessonTasks.filter((t: any) => t.type !== 'theory' && !t.id?.includes('THEORY'));

  // Initial mode
  const startsWithTheory = Boolean(taskData?.type === 'theory' || taskData?.id?.includes('THEORY'));
  const [isInTheoryMode, setIsInTheoryMode] = useState<boolean>(startsWithTheory);
  const [currentTheoryIndex, setCurrentTheoryIndex] = useState<number>(0);

  // Practice tasks queue
  const initialPracticeQueue = practiceTasksList.length > 0 
    ? practiceTasksList 
    : (startsWithTheory ? [] : [taskData]);

  const [practiceQueue, setPracticeQueue] = useState<any[]>(initialPracticeQueue);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);

  // Retry buffer & phase
  const [mistakesBuffer, setMistakesBuffer] = useState<any[]>([]);
  const [isRetryPhase, setIsRetryPhase] = useState<boolean>(false);
  const [showRetryInterstitial, setShowRetryInterstitial] = useState<boolean>(false);

  // Statistics for Star Rating and Rewards
  const [firstPassMistakesCount, setFirstPassMistakesCount] = useState<number>(0);
  const [firstAttemptCorrectCount, setFirstAttemptCorrectCount] = useState<number>(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [accumulatedXp, setAccumulatedXp] = useState<number>(startsWithTheory ? 5 : 0);
  const [accumulatedCoins, setAccumulatedCoins] = useState<number>(2);

  // Active question interaction state
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [twoPart1, setTwoPart1] = useState<string>('');
  const [twoPart2, setTwoPart2] = useState<string>('');
  const [tfSelections, setTfSelections] = useState<Record<string, 'P' | 'F'>>({});
  const [numericValue, setNumericValue] = useState<string>('');
  const [openProofText, setOpenProofText] = useState<string>('');
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakeIncorrect, setShakeIncorrect] = useState<boolean>(false);
  const [showSolutionSteps, setShowSolutionSteps] = useState<boolean>(false);

  // Scratchpad Bottom Sheet state
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [scratchpadDataUrl, setScratchpadDataUrl] = useState<string>('');

  // Scroll refs for question and solution steps
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to feedback/solution when evaluated or steps toggled
  useEffect(() => {
    if (isEvaluated) {
      const timer = setTimeout(() => {
        if (solutionRef.current) {
          solutionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isEvaluated, showSolutionSteps]);

  // Hints drawer state (Static CKE hints only for closed tasks)
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(1);
  
  // Socratic AI Tutor state (Active strictly for OPEN_PROOF tasks)
  const [showOpenProofTutorSheet, setShowOpenProofTutorSheet] = useState<boolean>(false);
  const [aiTutorResponse, setAiTutorResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Celebration state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const activeTask: any = isInTheoryMode 
    ? (theoryTask || taskData)
    : (practiceQueue[currentTaskIndex] || taskData || {});

  // Determine Task Type (supporting both standard and legacy)
  const taskType: string = (() => {
    if (activeTask.type === 'theory' || activeTask.id?.includes('THEORY')) return 'theory';
    if (activeTask.type === 'SINGLE_CHOICE' || activeTask.type === 'MULTI_CHOICE') {
      return activeTask.type;
    }
    if (activeTask.type === 'NUMERIC_INPUT' || activeTask.type === 'OPEN_PROOF' || activeTask.type === 'OPEN_TASK') {
      return activeTask.type;
    }
    // Infer for legacy tasks with options:
    if (activeTask.options && Array.isArray(activeTask.options) && activeTask.options.length > 0) {
      return (activeTask.required_selections_count && activeTask.required_selections_count > 1) ? 'MULTI_CHOICE' : 'SINGLE_CHOICE';
    }
    if (activeTask.question && activeTask.question.includes('A)') && activeTask.question.includes('B)')) {
      const isMulti = /wybierz\s+(dwie|2|trzy|3)/i.test(activeTask.question);
      return isMulti ? 'MULTI_CHOICE' : 'SINGLE_CHOICE';
    }
    if (activeTask.method === 'Dowód' || activeTask.title?.toLowerCase().includes('dowód')) {
      return 'OPEN_PROOF';
    }
    // Any task without multiple choice options is an OPEN TASK (calculation or proof)
    return 'OPEN_TASK';
  })();

  // Parse or normalize options
  const normalizedOptions: TaskOption[] = (() => {
    let result: TaskOption[] = [];
    const targetRaw = String(activeTask.correct_answer || activeTask.correctAnswer || '').trim();
    const normTarget = targetRaw.replace(/^Odp\s*/i, '').trim().toUpperCase();

    if (activeTask.options && Array.isArray(activeTask.options) && activeTask.options.length > 0) {
      result = activeTask.options.map((opt: any, idx: number) => {
        const defaultLetter = ['A', 'B', 'C', 'D', 'E', 'F'][idx] || String(idx + 1);
        if (typeof opt === 'string') {
          const match = opt.match(/^([A-D1-4])[\.\)]\s*(.*)$/);
          const optId = match ? match[1].toUpperCase() : defaultLetter;
          const optText = match ? match[2].trim() : opt;
          const isCorr = optId === normTarget || opt === targetRaw || targetRaw.startsWith(optId + '.');
          return { id: optId, text: optText, content_latex: optText, is_correct: isCorr };
        }
        const optId = opt.id || opt.key || opt.label || defaultLetter;
        const optText = opt.text || opt.content_latex || opt.content || '';
        const isCorr = Boolean(
          opt.is_correct ||
          opt.isCorrect ||
          optId === normTarget ||
          optId === targetRaw ||
          targetRaw.startsWith(optId + '.') ||
          (optText && targetRaw && optText.trim() === targetRaw)
        );
        return {
          id: optId,
          text: optText,
          content_latex: optText,
          is_correct: isCorr,
          numberLine: opt.numberLine,
          diagram: opt.diagram
        } as any;
      });
    } else if (activeTask.question) {
      // Fallback: parse lines like "A) $3^3$" from legacy question string
      const lines = activeTask.question.split('\n');
      lines.forEach((line: string) => {
        const match = line.match(/^([A-F])[\).]\s+(.*)/i);
        if (match) {
          const optId = match[1].toUpperCase();
          const content = match[2].trim();
          const isCorr = optId === normTarget || targetRaw.startsWith(optId + '.');
          result.push({ id: optId, text: content, content_latex: content, is_correct: isCorr });
        }
      });
    }

    if (taskType === 'SINGLE_CHOICE' && result.length > 0) {
      const correctIndices = result.map((o, idx) => (o.is_correct ? idx : -1)).filter(idx => idx !== -1);
      if (correctIndices.length === 0) {
        const directIdx = result.findIndex(o => o.id === normTarget || o.id === targetRaw);
        const chosenIdx = directIdx !== -1 ? directIdx : 0;
        result.forEach((o, idx) => { o.is_correct = idx === chosenIdx; });
      } else if (correctIndices.length > 1) {
        const directIdx = result.findIndex(o => o.id === normTarget || o.id === targetRaw);
        const chosenIdx = directIdx !== -1 ? directIdx : correctIndices[0];
        result.forEach((o, idx) => { o.is_correct = idx === chosenIdx; });
      }
    }

    return result;
  })();

  // Formatted solution steps with individual cards, highlighted titles, and spacing
  const solutionSteps = React.useMemo<FormattedSolutionStep[]>(() => {
    if (activeTask.official_solution_steps && activeTask.official_solution_steps.length > 1) {
      return activeTask.official_solution_steps.map((s: any) => {
        const desc = s.description || '';
        const titleMatch = desc.match(/^\*\*([^*]+)\*\*:\s*([\s\S]*)$/);
        return {
          stepNum: s.step_num,
          label: `Krok ${s.step_num}`,
          title: titleMatch ? titleMatch[1] : undefined,
          content: titleMatch ? titleMatch[2] : desc
        };
      });
    }
    const raw = activeTask.explanation || activeTask.officialKey || activeTask.official_solution_steps?.[0]?.description || activeTask.hints?.level_1 || '';
    return parseSolutionSteps(raw);
  }, [activeTask]);

  const requiredCount: number = activeTask.required_selections_count || (taskType === 'MULTI_CHOICE' ? 2 : 1);

  // Check if user is ready to submit
  const isReadyToVerify = (() => {
    if (isEvaluated) return false;
    if (taskType === 'SINGLE_CHOICE') {
      return selectedOptions.length === 1;
    }
    if (taskType === 'MULTI_CHOICE') {
      return selectedOptions.length === requiredCount;
    }
    if (taskType === 'TWO_PART') {
      return twoPart1 !== '' && twoPart2 !== '';
    }
    if (taskType === 'TRUE_FALSE') {
      const statements = activeTask.statements || [];
      return statements.length > 0 && statements.every((s: any) => Boolean(tfSelections[s.id]));
    }
    if (taskType === 'NUMERIC_INPUT' || taskType === 'OPEN_TASK') {
      return numericValue.trim().length > 0 || scratchpadDataUrl.length > 50;
    }
    if (taskType === 'OPEN_PROOF') {
      return openProofText.trim().length > 0 || numericValue.trim().length > 0 || scratchpadDataUrl.length > 50;
    }
    return false;
  })();

  // Trigger celebration confetti
  const triggerCelebration = () => {
    setIsCompleted(true);
    triggerHaptic('success');
    playSuccessSound();

    const end = Date.now() + 2000;
    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#F59E0B', '#FACC15', '#FFE885', '#FFB800']
      });
    }, 250);
  };

  // Option selection handler
  const handleSelectOption = (optId: string) => {
    if (isEvaluated) return;
    triggerHaptic('light');

    if (taskType === 'MULTI_CHOICE') {
      setSelectedOptions(prev => {
        if (prev.includes(optId)) {
          return prev.filter(id => id !== optId);
        } else {
          if (prev.length < requiredCount) {
            return [...prev, optId];
          } else {
            return [...prev.slice(1), optId];
          }
        }
      });
    } else {
      setSelectedOptions([optId]);
    }
  };

  // Desktop keyboard shortcuts: 1-4/A-D for options, Enter/Space for checking/proceeding, Esc to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in text inputs or textareas
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (isCompleted || showRetryInterstitial || isScratchpadOpen || showHintModal || showOpenProofTutorSheet) return;

      const key = e.key.toUpperCase();
      const code = e.code;

      if (!isEvaluated && taskType === 'SINGLE_CHOICE' && normalizedOptions.length > 0) {
        let chosenId: string | null = null;
        if (key === '1' || key === 'A') chosenId = normalizedOptions[0]?.id;
        else if (key === '2' || key === 'B') chosenId = normalizedOptions[1]?.id;
        else if (key === '3' || key === 'C') chosenId = normalizedOptions[2]?.id;
        else if (key === '4' || key === 'D') chosenId = normalizedOptions[3]?.id;

        if (chosenId) {
          e.preventDefault();
          handleSelectOption(chosenId);
          return;
        }
      }

      if (key === 'ENTER' || code === 'Space') {
        e.preventDefault();
        if (isInTheoryMode) {
          // Trigger next card
          if (currentTheoryIndex < buildTheoryCards(theoryTask || activeTask).length - 1) {
            setCurrentTheoryIndex(i => i + 1);
          } else {
            if (practiceQueue.length > 0) {
              setCurrentTaskIndex(0);
              setIsInTheoryMode(false);
            } else {
              triggerCelebration();
            }
          }
          return;
        }

        if (!isEvaluated) {
          if (isReadyToVerify) {
            handleVerifyAnswer();
          }
        } else {
          handleNextQuestion();
        }
        return;
      }

      if (key === 'ESCAPE') {
        e.preventDefault();
        onCancelTask();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCompleted, 
    showRetryInterstitial, 
    isScratchpadOpen, 
    showHintModal, 
    showOpenProofTutorSheet, 
    isEvaluated, 
    taskType, 
    normalizedOptions, 
    isReadyToVerify,
    isInTheoryMode,
    currentTheoryIndex,
    theoryTask,
    activeTask,
    practiceQueue
  ]);

  // Verification Handler
  const handleVerifyAnswer = () => {
    if (!isReadyToVerify) return;
    triggerHaptic('medium');
    setIsEvaluated(true);

    let evaluatedCorrect = false;

    if (taskType === 'SINGLE_CHOICE') {
      const selected = selectedOptions[0];
      const correctOpt = normalizedOptions.find(o => o.is_correct);
      evaluatedCorrect = correctOpt ? correctOpt.id === selected : false;
    } else if (taskType === 'MULTI_CHOICE') {
      const correctIds = normalizedOptions.filter(o => o.is_correct).map(o => o.id).sort().join(',');
      const selectedSorted = [...selectedOptions].sort().join(',');
      evaluatedCorrect = selectedSorted === correctIds;
    } else if (taskType === 'TWO_PART') {
      const correctRaw = String(activeTask.correct_answer || activeTask.correctAnswer || activeTask.officialKey || '').trim();
      const expected1 = activeTask.part_1?.correct || activeTask.correct_combination?.[0] || (correctRaw.length >= 1 ? correctRaw[0] : '');
      const expected2 = activeTask.part_2?.correct || activeTask.correct_combination?.[1] || (correctRaw.length >= 2 ? correctRaw.slice(1).replace(/[^0-9A-Za-z]/g, '') : '');
      
      const matches1 = twoPart1.toUpperCase() === String(expected1).toUpperCase();
      const matches2 = twoPart2.toUpperCase() === String(expected2).toUpperCase();
      evaluatedCorrect = matches1 && matches2;
    } else if (taskType === 'TRUE_FALSE') {
      const statements = activeTask.statements || [];
      evaluatedCorrect = statements.length > 0 && statements.every((s: any) => tfSelections[s.id] === s.correct);
    } else if (taskType === 'NUMERIC_INPUT' || taskType === 'OPEN_TASK') {
      const rawExpected = String(activeTask.numeric_correct_answer || '').trim();
      const normalizeMath = (str: string) => {
        return str
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/,/g, '.')
          .replace(/[{}]/g, '')
          .replace(/\\cdot/g, '*')
          .replace(/\*/g, '');
      };

      const expected = normalizeMath(rawExpected);
      const entered = normalizeMath(numericValue);

      if (rawExpected) {
        evaluatedCorrect = entered === expected;
        // Also allow comparing fractions to decimals (e.g. 1/2 == 0.5)
        if (!evaluatedCorrect && rawExpected.includes('/') && !isNaN(Number(numericValue.replace(',', '.')))) {
          const [num, den] = rawExpected.split('/').map(Number);
          if (den !== 0 && Math.abs(num / den - Number(numericValue.replace(',', '.'))) < 0.001) {
            evaluatedCorrect = true;
          }
        }
      } else {
        // Multi-step calculation or whiteboard answer
        evaluatedCorrect = true;
      }
      setShowSolutionSteps(true);
    } else if (taskType === 'OPEN_PROOF') {
      // In open proof, user self-evaluates or gets verified
      evaluatedCorrect = true;
      setShowSolutionSteps(true);
    }

    setIsCorrect(evaluatedCorrect);

    if (evaluatedCorrect) {
      triggerHaptic('success');
      playSuccessSound();

      if (!isRetryPhase) {
        setFirstAttemptCorrectCount(c => c + 1);
        setAccumulatedXp(x => x + 10);
        setAccumulatedCoins(c => c + 3);
        setCompletedTaskIds(prev => Array.from(new Set([...prev, activeTask.id])));
      } else {
        setAccumulatedXp(x => x + 5);
        setAccumulatedCoins(c => c + 2);
        setCompletedTaskIds(prev => Array.from(new Set([...prev, activeTask.id])));
        setMistakesBuffer(prev => prev.filter(t => t.id !== activeTask.id));
      }
    } else {
      triggerHaptic('error');
      setShakeIncorrect(true);
      setShowSolutionSteps(true);
      setTimeout(() => setShakeIncorrect(false), 500);

      if (onDeductHeart) {
        onDeductHeart();
      } else if (onUpdateUserState) {
        onUpdateUserState(prev => deductHeart(prev).updatedState);
      }

      if (!isRetryPhase) {
        setFirstPassMistakesCount(m => m + 1);
        setMistakesBuffer(prev => {
          if (prev.some(t => t.id === activeTask.id)) return prev;
          return [...prev, activeTask];
        });
      }
    }
  };

  // Advance to next question or trigger retry / completion
  const handleNextQuestion = () => {
    triggerHaptic('medium');

    // Reset interaction states
    setSelectedOptions([]);
    setTwoPart1('');
    setTwoPart2('');
    setTfSelections({});
    setNumericValue('');
    setOpenProofText('');
    setIsEvaluated(false);
    setIsCorrect(null);
    setShowSolutionSteps(false);
    setShowHintModal(false);
    setUnlockedHintLevel(1);
    setAiTutorResponse('');
    setShowOpenProofTutorSheet(false);

    if (currentTaskIndex < practiceQueue.length - 1) {
      setCurrentTaskIndex(idx => idx + 1);
    } else {
      if (!isRetryPhase && mistakesBuffer.length > 0) {
        setShowRetryInterstitial(true);
      } else {
        triggerCelebration();
      }
    }
  };

  // Launch Retry Phase
  const handleStartRetryPhase = () => {
    triggerHaptic('medium');
    setPracticeQueue([...mistakesBuffer]);
    setMistakesBuffer([]);
    setCurrentTaskIndex(0);
    setIsRetryPhase(true);
    setShowRetryInterstitial(false);

    // Reset state
    setSelectedOptions([]);
    setTwoPart1('');
    setTwoPart2('');
    setTfSelections({});
    setNumericValue('');
    setOpenProofText('');
    setIsEvaluated(false);
    setIsCorrect(null);
    setShowSolutionSteps(false);
    setShowHintModal(false);
  };

  // Dedicated Socratic AI Tutor query - strictly for OPEN_PROOF tasks
  const handleAskAiTutor = async () => {
    if (taskType !== 'OPEN_PROOF') return;
    setIsAiLoading(true);
    setShowOpenProofTutorSheet(true);
    triggerHaptic('light');

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: await apiHeaders(),
        body: JSON.stringify({
          question: activeTask.math_statement || activeTask.question,
          instruction: activeTask.instruction,
          studentAnswer: openProofText || 'Uczeń prosi o pierwszą ukierunkowaną wskazówkę',
          staticHint: activeTask.hints?.level_1
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiTutorResponse(data.reply || activeTask.hints?.level_1 || 'Zwróć uwagę na rozkład na czynniki i własności liczb naturalnych.');
      } else {
        setAiTutorResponse(activeTask.hints?.level_1 || 'Spróbuj wyłączyć wspólny czynnik przed nawias.');
      }
    } catch {
      setAiTutorResponse(activeTask.hints?.level_1 || 'Zastosuj wzory skróconego mnożenia lub rozkład na czynniki liniowe.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Calculate star rating (1-3 stars)
  const calculatedStars = firstPassMistakesCount === 0 ? 3 : firstPassMistakesCount <= 2 ? 2 : 1;

  // --------------------------------------------------------------------------
  // 1. OFFICIAL SUCCESS / CELEBRATION SCREEN
  // --------------------------------------------------------------------------
  if (isCompleted) {
    const totalEarnedXp = Math.max(15, accumulatedXp);
    const totalEarnedCoins = Math.max(5, accumulatedCoins);
    const streakDays = userState?.streakDays || 1;
    const streakText = `${streakDays} ${streakDays === 1 ? 'dzień' : 'dni'} serii!`;

    const handleContinue = () => {
      // Tylko poprawnie rozwiązane zadania w ramach tej sesji
      const validDoneIds = filterActualTaskIds(completedTaskIds);

      onCompleteTask(
        validDoneIds, 
        calculatedStars, 
        totalEarnedXp, 
        totalEarnedCoins, 
        taskData?.nextLesson || null
      );
    };

    return (
      <div className="fixed inset-0 z-50 bg-surface-bg/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 lg:p-8 select-none overflow-hidden">
        <div className="w-full h-full md:h-[90vh] md:max-h-[850px] md:max-w-[760px] bg-surface-elevated md:rounded-[32px] md:border md:border-surface-border md:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(255,184,0,0.06)] flex flex-col justify-between items-stretch overflow-hidden relative">
        {/* Top bar header */}
        <header className="shrink-0 px-4 pt-4 pb-3 border-b border-surface-border bg-surface-elevated flex items-center justify-end z-20">
          <button 
            onClick={handleContinue}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors active:scale-95"
            title="Zamknij"
          >
            <X size={16} />
          </button>
        </header>

        {/* Juicy Vertical Center Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center justify-center text-center w-full custom-scrollbar">
          {/* 1. Large Glowing Trophy in centered golden success disc */}
          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute w-44 h-44 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
            <div className="absolute w-36 h-36 rounded-full border border-amber-400/20 animate-spin pointer-events-none" style={{ animationDuration: '24s' }} />

            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 220 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-2 bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-amber-600/20 border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.4)] z-10"
            >
              <Trophy size={52} className="text-amber-400 drop-shadow-md shrink-0" strokeWidth={2} />
            </motion.div>
          </div>

          {/* 2. Bold Title and Subtitle */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-1.5"
          >
            Lekcja ukończona!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="text-slate-400 text-sm mb-5"
          >
            Wszystkie zadania rozwiązane pomyślnie.
          </motion.p>

          {/* 3. Three Equal Reward Cards (XP, Monety, Seria) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full grid grid-cols-3 gap-3 mb-5 max-w-sm sm:max-w-md"
          >
            {/* XP Card */}
            <div className="bg-[#141C28] border border-[#FFB800]/30 rounded-2xl p-3.5 flex flex-col items-center justify-center min-h-[96px] shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/30 flex items-center justify-center mb-1.5 text-[#FFB800]">
                <Zap size={16} className="fill-[#FFB800] text-[#FFB800]" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">+{totalEarnedXp}</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">
                XP
              </span>
            </div>

            {/* Coins Card */}
            <div className="bg-[#141C28] border border-amber-400/30 rounded-2xl p-3.5 flex flex-col items-center justify-center min-h-[96px] shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-1.5 text-amber-400">
                <Coins size={16} className="text-amber-400" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">+{totalEarnedCoins}</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">
                Monet
              </span>
            </div>

            {/* Streak Card */}
            <div className="bg-[#141C28] border border-orange-500/30 rounded-2xl p-3.5 flex flex-col items-center justify-center min-h-[96px] shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mb-1.5 text-orange-400">
                <Flame size={16} className="fill-orange-400 text-orange-400" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">{streakDays} dni</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">
                Seria
              </span>
            </div>
          </motion.div>

          {/* 4. Elegant Accuracy / Completion Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-sm ${
              firstPassMistakesCount === 0
                ? 'bg-slate-900/90 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                : 'bg-slate-900/90 border border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
            }`}
          >
            {firstPassMistakesCount === 0 ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>0 błędów</span>
              </>
            ) : (
              <>
                <RefreshCw size={13} className="text-amber-400 shrink-0" />
                <span>{firstPassMistakesCount} {firstPassMistakesCount === 1 ? 'błąd' : firstPassMistakesCount < 5 ? 'błędy' : 'błędów'}</span>
              </>
            )}
          </motion.div>
        </div>

        {/* 5. Sticky Action Footer: powrót do mapy lekcji */}
        <footer className="shrink-0 w-full p-4 bg-surface-elevated border-t border-surface-border z-20" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <div className="flex flex-col items-center w-full">
            <button 
              onClick={handleContinue}
              className="w-full h-[52px] bg-primary hover:bg-[#FFC72C] border border-primary-dark/40 text-[#070A0F] font-bold text-base px-6 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,184,0,0.35)] cursor-pointer"
            >
              <span>WRÓĆ DO MAPY NAUKI</span>
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            <p className="text-center text-xs font-semibold text-text-muted mt-2.5 truncate max-w-full px-2">
              Zobacz swój zaliczony krok na mapie działu
            </p>
          </div>
        </footer>
      </div>
    </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. RETRY INTERSTITIAL SCREEN
  // --------------------------------------------------------------------------
  if (showRetryInterstitial) {
    return (
      <div className="fixed inset-0 z-50 bg-surface-bg/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 lg:p-8 select-none overflow-hidden">
        <div className="w-full h-full md:h-[90vh] md:max-h-[850px] md:max-w-[760px] bg-surface-elevated md:rounded-[32px] md:border md:border-surface-border md:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(255,184,0,0.08)] flex flex-col justify-between items-stretch overflow-hidden relative">
          <header className="shrink-0 px-4 pt-4 pb-3 border-b border-surface-border bg-surface-elevated flex items-center justify-between z-20">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <RotateCcw size={14} /> Pętla Poprawkowa
          </span>
          <button 
            onClick={onCancelTask}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-8 flex flex-col items-center justify-center text-center w-full custom-scrollbar">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-20 h-20 rounded-3xl bg-[#FFB800]/15 border-2 border-[#FFB800] text-[#FFB800] flex items-center justify-center shadow-[0_0_30px_rgba(255,184,0,0.25)] mb-5"
          >
            <RotateCcw size={40} className="animate-spin-slow" />
          </motion.div>

          <span className="text-xs font-black uppercase text-[#FFB800] tracking-widest px-3 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 mb-3">
            Faza Poprawkowa
          </span>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-2 tracking-tight">
            Czas na szybką powtórkę!
          </h2>

          <p className="text-[#9CA3AF] text-sm max-w-sm leading-relaxed mb-6">
            Popraw błędy, aby ukończyć lekcję i utrwalić wiedzę. Pętla poprawek to najskuteczniejszy sposób na 100% z matury.
          </p>

          <div className="w-full bg-[#141C28] border border-white/10 rounded-2xl p-4 text-left shadow-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-400" />
                Zadania do poprawy:
              </span>
              <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                {mistakesBuffer.length} {mistakesBuffer.length === 1 ? 'zadanie' : 'zadania'}
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Za każdą udaną poprawkę otrzymujesz <span className="text-[#FFB800] font-bold">+5 XP</span> oraz odblokowujesz oficjalny Ekran Sukcesu z gwiazdkami.
            </p>
          </div>
        </div>

        <footer className="shrink-0 w-full p-4 bg-surface-elevated/95 backdrop-blur-md border-t border-surface-border" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <button 
            onClick={handleStartRetryPhase}
            className="w-full bg-[#FFB800] hover:bg-[#FFC72C] border border-[#D97706]/40 text-[#080B11] font-bold text-base py-3.5 px-6 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,184,0,0.35)] cursor-pointer"
          >
            <span>Popraw błędy</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </footer>
      </div>
    </div>
    );
  }

  // --------------------------------------------------------------------------
  // 3. THEORY FLASHCARDS (PIGUŁKA WIEDZY)
  // --------------------------------------------------------------------------
  if (isInTheoryMode) {
    const theoryItem = theoryTask || activeTask;
    const cards = buildTheoryCards(theoryItem);
    const currentCard = cards[currentTheoryIndex] || cards[0];
    const isLastCard = currentTheoryIndex === cards.length - 1;

    return (
      <div className="fixed inset-0 z-50 bg-[#070A0F]/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 lg:p-8 overflow-hidden">
        <div className="w-full h-full h-[100dvh] md:h-[90vh] md:max-h-[850px] md:max-w-[760px] bg-surface-bg md:rounded-[32px] md:border md:border-surface-border md:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(255,184,0,0.06)] flex flex-col justify-start items-stretch overflow-hidden relative">
          <header className="shrink-0 px-4 pt-3.5 pb-3 border-b border-surface-border bg-surface-elevated flex items-center justify-between z-20">
          <button 
            onClick={onCancelTask}
            className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors active:scale-95"
          >
            <X size={14} /> Zamknij
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <BookOpen size={12} />
              <span>{theoryItem.topic || 'Pigułka wiedzy'}</span>
            </span>
            <span className="text-xs font-bold text-[#8B8D98]">
              {currentTheoryIndex + 1} / {cards.length}
            </span>
          </div>
        </header>

        <main 
          className="flex-1 min-h-0 overflow-y-auto px-4 py-3 flex flex-col justify-start items-stretch gap-3 custom-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTheoryIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="bg-[#141C28] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xl flex-1 min-h-0 flex flex-col justify-between relative overflow-y-auto custom-scrollbar"
            >
              <div className="flex-1 flex flex-col justify-start">
                <div className="flex items-center justify-between gap-2 mb-2 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    {currentCard.type === 'trap' ? (
                      <>
                        <AlertTriangle size={14} className="text-amber-400" />
                        <span className="text-amber-400 font-black uppercase tracking-wider">{currentCard.badge || 'Częsty Błąd'}</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb size={14} className="text-[#FFB800]" />
                        <span className="text-[#FFB800] font-black uppercase tracking-wider">{currentCard.badge || 'Kluczowa Reguła'}</span>
                      </>
                    )}
                  </div>

                  {/* Elegant pagination dots in card header */}
                  <div className="flex items-center gap-1.5">
                    {cards.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCurrentTheoryIndex(idx);
                          triggerHaptic('light');
                        }}
                        className={`h-1.5 rounded-full transition-all duration-200 ${
                          idx === currentTheoryIndex ? 'w-5 bg-[#FFB800] shadow-[0_0_8px_rgba(255,184,0,0.5)]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Przejdź do kroku ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-display font-black text-lg sm:text-xl text-white mb-2 leading-snug">
                  {currentCard.title}
                </h3>

                {/* Card Type: essence (Istota pojęcia & Kontekst maturalny) */}
                {currentCard.type === 'essence' ? (
                  <div className="flex flex-col gap-3.5 w-full my-auto">
                    {currentCard.concept_essence && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1622] border border-white/10 text-white/95 text-sm sm:text-base leading-relaxed break-words">
                        <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block mb-1.5">
                          W pigułce:
                        </span>
                        <MathRenderer
                          content={
                            typeof currentCard.concept_essence === 'string'
                              ? currentCard.concept_essence
                              : typeof currentCard.concept_essence === 'object' && currentCard.concept_essence !== null
                                ? [
                                    (currentCard.concept_essence as any).lead,
                                    ...(Array.isArray((currentCard.concept_essence as any).pillars)
                                      ? (currentCard.concept_essence as any).pillars.map((p: any) => p.title ? `**${p.title}**: ${p.description || ''}` : p.description)
                                      : []),
                                    (currentCard.concept_essence as any).mental_model ? `*Model myślowy:* ${(currentCard.concept_essence as any).mental_model}` : ''
                                  ].filter(Boolean).join('\n\n') || (currentCard.concept_essence as any).description || (currentCard.concept_essence as any).text || ''
                                : String(currentCard.concept_essence || '')
                          }
                          className="leading-relaxed"
                        />
                      </div>
                    )}
                    {(currentCard.diagram || currentCard.numberLine) && (
                      <div className="w-full flex justify-center my-1">
                        {currentCard.diagram ? (
                          <MathDiagram diagram={currentCard.diagram} borderless hideTitle={true} />
                        ) : currentCard.numberLine ? (
                          <div className="w-full max-w-lg bg-black/30 border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col items-center gap-2">
                            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider self-start flex items-center gap-1.5">
                              <Target size={13} className="text-amber-400" />
                              <span>Interpretacja na osi liczbowej:</span>
                            </span>
                            <NumberLineDiagram data={currentCard.numberLine} height={64} maxWidth="400px" />
                          </div>
                        ) : null}
                      </div>
                    )}
                    {currentCard.matura_context && (
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-slate-300 text-xs sm:text-sm leading-relaxed break-words">
                        <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block mb-1">
                          Wskazówka egzaminacyjna:
                        </span>
                        <MathRenderer content={currentCard.matura_context} className="leading-relaxed" />
                      </div>
                    )}
                  </div>
                ) : currentCard.type === 'formulas' ? (
                  /* Card Type: formulas */
                  <div className="flex flex-col gap-3 w-full my-auto">
                    {currentCard.structuredFormulas && currentCard.structuredFormulas.length > 0 ? (
                      <div className="space-y-2.5 w-full">
                        {currentCard.structuredFormulas.map((item, idx) => (
                          <div
                            key={idx}
                            className="w-full bg-[#0B101B] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-inner hover:border-[#FFB800]/30 transition-all"
                          >
                            {item.title && (
                              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-[#FFB800]/10 border border-[#FFB800]/25 text-[10px] font-mono font-bold text-[#FFB800] flex items-center justify-center shrink-0">
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                                    {item.title}
                                  </span>
                                </div>
                              </div>
                            )}
                            <div className="w-full text-center overflow-x-auto py-1 text-white">
                              <MathRenderer content={item.latex} displayMode={true} />
                            </div>
                            {item.description && (
                              <div className="mt-1 pt-2.5 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed text-left flex items-start gap-2.5 bg-white/[0.02] -mx-2 px-3 py-2 rounded-xl">
                                <Info className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                                <div className="w-full font-normal">
                                  <MathRenderer content={item.description} className="leading-relaxed" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : currentCard.core_formulas ? (
                      <div className="w-full bg-[#0B101B] border border-white/10 rounded-2xl p-4 sm:p-5 text-center">
                        <div className="w-full max-w-full overflow-x-auto py-1 text-center">
                          <MathRenderer content={currentCard.core_formulas} displayMode={true} />
                        </div>
                      </div>
                    ) : null}

                    {currentCard.formula_notes && (
                      <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-slate-400 leading-relaxed">
                        <MathRenderer content={currentCard.formula_notes} />
                      </div>
                    )}
                  </div>
                ) : currentCard.type === 'example' && currentCard.worked_example ? (
                  /* Card Type: example (Worked example krok po kroku) */
                  <div className="flex flex-col gap-3 w-full my-auto text-left min-w-0 max-w-full overflow-hidden">
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#0F1622] border border-white/10 min-w-0 max-w-full overflow-hidden">
                      <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block mb-1">
                        Zadanie z arkusza:
                      </span>
                      <div className="text-xs sm:text-sm font-medium text-white leading-relaxed min-w-0 max-w-full break-words">
                        <MathRenderer content={currentCard.worked_example.problem} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {currentCard.worked_example.step1 && (
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 min-w-0 max-w-full overflow-hidden">
                          <span className="w-5 h-5 rounded-md bg-[#FFB800]/20 text-[#FFB800] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </span>
                          <div className="flex-1 leading-relaxed min-w-0 max-w-full break-words">
                            <MathRenderer content={currentCard.worked_example.step1} />
                          </div>
                        </div>
                      )}

                      {currentCard.worked_example.step2 && (
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 min-w-0 max-w-full overflow-hidden">
                          <span className="w-5 h-5 rounded-md bg-[#FFB800]/20 text-[#FFB800] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </span>
                          <div className="flex-1 leading-relaxed min-w-0 max-w-full break-words">
                            <MathRenderer content={currentCard.worked_example.step2} />
                          </div>
                        </div>
                      )}

                      {currentCard.worked_example.steps?.map((st: any, idx: number) => {
                        const stepNum = st?.step_num || st?.num || (idx + 1);
                        const stepContent = st?.explanation || st?.text || (typeof st === 'string' ? st : '');
                        return (
                          <div key={stepNum} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 min-w-0 max-w-full overflow-hidden">
                            <span className="w-5 h-5 rounded-md bg-[#FFB800]/20 text-[#FFB800] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {stepNum}
                            </span>
                            <div className="flex-1 leading-relaxed min-w-0 max-w-full break-words">
                              {st?.label && <span className="block text-[11px] font-bold text-[#FFB800] mb-0.5">{st.label}</span>}
                              <MathRenderer content={stepContent} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {currentCard.worked_example.result && (
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-400 font-medium">Wynik końcowy:</span>
                        <span className="font-mono font-bold text-emerald-300">
                          <MathRenderer content={`$${currentCard.worked_example.result}$`} />
                        </span>
                      </div>
                    )}
                  </div>
                ) : currentCard.type === 'trap' ? (
                  /* Card Type: trap (Delicate warning border, Apple-like, no AI slop) */
                  <div className="flex flex-col gap-3 w-full my-auto text-left">
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/30 flex flex-col gap-2.5">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Uwaga na egzaminie:</span>
                      </div>
                      <div className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-normal">
                        <MathRenderer content={currentCard.exam_trap || currentCard.content || ''} />
                      </div>
                    </div>

                    {currentCard.trap_error && (
                      <div className="p-3 sm:p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-400 mb-1.5 shrink-0">
                          <X size={14} className="stroke-[3]" />
                          <span>Częsty błąd</span>
                        </div>
                        <div className="text-white font-medium text-xs sm:text-sm leading-relaxed break-words py-0.5 max-w-full">
                          <MathRenderer 
                            content={currentCard.trap_error.startsWith('$') ? currentCard.trap_error : `$${currentCard.trap_error}$`} 
                            className="flex flex-wrap items-center gap-x-1.5 gap-y-1 break-words max-w-full"
                          />
                        </div>
                      </div>
                    )}

                    {currentCard.trap_correct && (
                      <div className="p-3 sm:p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400 mb-1.5 shrink-0">
                          <Check size={14} className="stroke-[3]" />
                          <span>Prawidłowy zapis</span>
                        </div>
                        <div className="text-white font-medium text-xs sm:text-sm leading-relaxed break-words py-0.5 max-w-full">
                          <MathRenderer 
                            content={currentCard.trap_correct.startsWith('$') ? currentCard.trap_correct : `$${currentCard.trap_correct}$`} 
                            className="flex flex-wrap items-center gap-x-1.5 gap-y-1 break-words max-w-full"
                          />
                        </div>
                      </div>
                    )}

                    {(currentCard.trap_note && currentCard.trap_note !== currentCard.exam_trap) && (
                      <div className="p-3 bg-[#0F1622] border border-white/10 rounded-xl text-xs sm:text-sm text-[#9CA3AF] leading-relaxed break-words max-w-full">
                        <MathRenderer content={currentCard.trap_note} className="break-words" />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Card Type: takeaway or default */
                  <div className="bg-[#0F1622] border border-white/10 rounded-2xl p-4 sm:p-5 my-auto text-white/95 text-sm sm:text-base leading-relaxed break-words">
                    <MathRenderer content={currentCard.content || ''} className="leading-relaxed" />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="shrink-0 p-4 border-t border-surface-border bg-surface-elevated flex gap-3 z-20" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          {currentTheoryIndex > 0 && (
            <button
              onClick={() => {
                setCurrentTheoryIndex(i => i - 1);
                triggerHaptic('light');
              }}
              className="bg-[#141C28] hover:bg-[#1A2434] text-white border border-white/10 font-bold px-5 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center active:scale-95"
            >
              Wstecz
            </button>
          )}

          <button
            onClick={() => {
              triggerHaptic('light');
              if (!isLastCard) {
                setCurrentTheoryIndex(i => i + 1);
              } else {
                if (practiceQueue.length > 0) {
                  setCurrentTaskIndex(0);
                  setIsInTheoryMode(false);
                } else {
                  triggerCelebration();
                }
              }
            }}
            className="flex-1 bg-[#FFB800] hover:bg-[#FFC72C] border border-[#D97706]/40 text-[#080B11] font-bold py-3.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-2 group active:scale-[0.98] shadow-[0_0_20px_rgba(255,184,0,0.35)] cursor-pointer"
          >
            <span>
              {!isLastCard 
                ? 'Następna karta' 
                : 'Przejdź do zadań'}
            </span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </footer>
      </div>
    </div>
    );
  }

  // --------------------------------------------------------------------------
  // 4. UNIWERSALNA "RAMKA AKTYWNOŚCI" (CKE TASK CONTAINER)
  // --------------------------------------------------------------------------
  const progressPercent = practiceQueue.length > 0 
    ? ((currentTaskIndex + (isEvaluated && isCorrect ? 1 : 0)) / practiceQueue.length) * 100 
    : 100;

  const pointsCount = activeTask.points || (activeTask.cke_source?.includes('2 pkt') || taskType === 'MULTI_CHOICE' || taskType === 'OPEN_PROOF' ? 2 : 1);
  const pointsBadge = `${pointsCount} pkt`;
  const instructionText = activeTask.instruction || '';
  const mathStatement = activeTask.math_statement || activeTask.question || activeTask.content || '';

  const hasVisualOptions = normalizedOptions.some(opt => Boolean((opt as any).numberLine || (opt as any).diagram));
  const isShortOptions = !hasVisualOptions && normalizedOptions.every(opt => (opt.content_latex || '').length < 35 && !opt.content_latex.includes('\n'));

  return (
    <div className="fixed inset-0 z-50 bg-surface-bg/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 lg:p-8 overflow-hidden">
      <div className={`w-full h-full h-[100dvh] md:h-[90vh] md:max-h-[850px] md:max-w-[760px] bg-surface-elevated md:rounded-[32px] md:border md:border-surface-border md:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(255,184,0,0.06)] flex flex-col justify-between items-stretch overflow-hidden relative ${shakeIncorrect ? 'animate-shake' : ''}`}>
        {/* -------------------------------------------------------------------- */}
        {/* SECTION 1: HEADER (Compact, Zero-Scroll Sticky Top)                  */}
        {/* -------------------------------------------------------------------- */}
      <header className="shrink-0 px-4 pt-3 pb-2.5 border-b border-surface-border bg-surface-elevated flex flex-col gap-2 z-20">
        <div className="flex items-center justify-between">
          {/* Exit button */}
          <button 
            type="button"
            onClick={onCancelTask}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors active:scale-95"
            title="Zamknij zadanie"
          >
            <X size={16} />
          </button>

          {/* Clean Points Badge: strictly "1 pkt" or "2 pkt" */}
          <div className="flex items-center gap-1.5">
            <Badge variant="jasne">
              {pointsBadge}
            </Badge>
            {(activeTask.difficulty === 'Wymagające' || activeTask.difficulty === 'HARD' || activeTask.tags?.includes('Wymagające')) && (
              <Badge variant="amber">
                Wymagające
              </Badge>
            )}
          </div>

          {/* Lesson progress & hearts indicator */}
          <div className="flex items-center gap-2">
            <button
              id="taskview-hearts-pill"
              onClick={() => {
                triggerHaptic('light');
                if (onOpenParentSponsor) onOpenParentSponsor();
                else if (onOpenProPopup) onOpenProPopup();
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold select-none transition active:scale-95 cursor-pointer ${
                heartsData.isPro
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : heartsData.hearts <= 1
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
              title={heartsData.isPro ? 'Pakiet PRO: Nielimitowane serca' : `Serca: ${heartsData.hearts}/${heartsData.maxHearts}`}
            >
              <Heart className={`w-3.5 h-3.5 text-rose-500 ${heartsData.hearts > 0 ? 'fill-rose-500' : ''} shrink-0`} />
              <span className="font-bold tracking-wide leading-none">{heartsData.isPro ? '∞' : heartsData.hearts}</span>
            </button>

            {isRetryPhase ? (
              <Badge variant="amber" icon={<RotateCcw size={10} />}>
                Poprawka: {currentTaskIndex + 1}/{practiceQueue.length}
              </Badge>
            ) : (
              <span className="text-xs font-bold text-[#8B8D98]">
                {currentTaskIndex + 1}/{practiceQueue.length}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className={`h-full rounded-full transition-all duration-300 ${
              isRetryPhase ? 'bg-amber-400' : 'bg-[#FFB800]'
            }`}
            style={{ width: `${Math.min(100, Math.max(8, progressPercent))}%` }}
          />
        </div>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* SECTION 2: BODY (Zero-Scroll Flex Container for Task & Answers)      */}
      {/* -------------------------------------------------------------------- */}
      <main 
        ref={mainScrollRef} 
        className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-28 flex flex-col justify-between items-stretch gap-2.5 custom-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Task Question Card */}
        <div className="bg-[#141C28] border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-2.5 shrink-0">
          {/* Authentic Source & Exam Metadata line above question */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#8B8D98] flex-wrap pb-1 border-b border-white/5">
            <span className="text-[#38BDF8] font-semibold tracking-wide">
              {activeTask.badge || activeTask.source_badge || activeTask.source || activeTask.cke_source || 'Trening JASNE • Baza CKE'}
            </span>
            <span className="text-white/20">•</span>
            <span className="font-semibold text-white/90">
              {pointsBadge}
            </span>
          </div>

          {instructionText && (
            <div className="text-xs sm:text-sm text-[#8B8D98] font-medium leading-relaxed">
              <MathRenderer content={instructionText} />
            </div>
          )}

          {/* Math Statement - Prominent KaTeX rendered */}
          <div className="text-white font-bold text-base sm:text-lg leading-snug">
            <MathRenderer content={mathStatement} />
          </div>

          {activeTask?.numberLine ? (
            <div className="mt-3 flex justify-center">
              <NumberLineDiagram data={activeTask.numberLine} height={64} maxWidth="360px" />
            </div>
          ) : (activeTask?.diagram || activeTask?.plot) ? (
            <div className="mt-3 flex justify-center">
              <MathDiagram diagram={activeTask.diagram || activeTask.plot} />
            </div>
          ) : null}

          {/* Auxiliary Buttons: Brudnopis & Wskazówka */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setIsScratchpadOpen(true);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#FFB800] hover:text-[#FFC72C] bg-[#FFB800]/10 hover:bg-[#FFB800]/15 border border-[#FFB800]/25 px-2.5 py-1 rounded-xl transition-all active:scale-95 shadow-[0_0_12px_rgba(255,184,0,0.1)]"
              >
                <PenTool size={12} />
                <span>Brudnopis</span>
                {scratchpadDataUrl.length > 50 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Zawiera zapisane obliczenia" />
                )}
              </button>

              {activeTask.hints?.level_1 && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setShowHintModal(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/15 border border-amber-400/25 px-2.5 py-1 rounded-xl transition-all active:scale-95"
                >
                  <Lightbulb size={12} />
                  <span>Wskazówka</span>
                </button>
              )}
            </div>

            {taskType === 'MULTI_CHOICE' && (
              <span className="text-[11px] font-bold text-[#8B8D98] bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                Zaznaczono: <strong className="text-white">{selectedOptions.length}</strong> / {requiredCount}
              </span>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* DYNAMIC ANSWER MODULE DEPENDING ON TYPE                             */}
        {/* ------------------------------------------------------------------ */}

        {/* 1. SINGLE_CHOICE MODULE (2x2 Compact Grid for short math options) */}
        {taskType === 'SINGLE_CHOICE' && (
          <motion.div
            key={`single-options-${activeTask?.id || currentTaskIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={isShortOptions ? "grid grid-cols-2 gap-2 sm:gap-2.5 w-full my-auto" : "grid grid-cols-1 gap-2 w-full my-auto"}
          >
            {normalizedOptions.map(opt => {
              const isSelected = selectedOptions.includes(opt.id);
              const isOptionCorrect = opt.is_correct;

              let cardClasses = isShortOptions 
                ? "h-[52px] sm:h-[56px] px-3 rounded-xl border text-left flex items-center gap-2.5 transition-all select-none overflow-hidden "
                : "p-3 sm:p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all select-none ";
              let badgeClasses = "w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 border ";

              if (!isEvaluated) {
                if (isSelected) {
                  cardClasses += "bg-[#FFB800]/10 border-[#FFB800] text-white shadow-[0_0_15px_rgba(255,184,0,0.2)] scale-[1.01]";
                  badgeClasses += "bg-[#FFB800] text-[#080B11] font-bold border-[#FFB800]";
                } else {
                  cardClasses += "bg-[#141C28] hover:bg-[#1A2434] border-white/5 hover:border-white/15 text-white/90";
                  badgeClasses += "bg-[#0F1622] text-[#8B8D98] border-white/10";
                }
              } else {
                if (isOptionCorrect) {
                  cardClasses += "bg-emerald-500/15 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
                  badgeClasses += "bg-emerald-500 text-white border-emerald-500";
                } else if (isSelected && !isOptionCorrect) {
                  cardClasses += "bg-rose-500/15 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                  badgeClasses += "bg-rose-500 text-white border-rose-500";
                } else {
                  cardClasses += "bg-[#141C28] opacity-40 border-white/5 text-white/60";
                  badgeClasses += "bg-[#0F1622] text-[#8B8D98] border-white/5";
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isEvaluated}
                  onClick={() => handleSelectOption(opt.id)}
                  className={cardClasses}
                >
                  <div className={badgeClasses}>
                    {opt.id}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm font-bold overflow-x-auto">
                    {(opt as any)?.numberLine ? (
                      <NumberLineDiagram data={(opt as any).numberLine} />
                    ) : (opt as any)?.diagram ? (
                      <MathDiagram diagram={(opt as any).diagram} />
                    ) : (
                      <MathRenderer content={opt.content_latex} />
                    )}
                  </div>
                  {!isEvaluated && (
                    <span className="hidden md:inline-flex items-center text-[10px] font-mono font-bold text-[#8B8D98] bg-[#0F1622] border border-white/10 px-1.5 py-0.5 rounded mr-1">
                      {opt.id}
                    </span>
                  )}
                  {isEvaluated && isOptionCorrect && (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  )}
                  {isEvaluated && isSelected && !isOptionCorrect && (
                    <X size={16} className="text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* 2. MULTI_CHOICE MODULE */}
        {taskType === 'MULTI_CHOICE' && (
          <motion.div
            key={`multi-options-${activeTask?.id || currentTaskIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-2 w-full my-auto"
          >
            {normalizedOptions.map(opt => {
              const isSelected = selectedOptions.includes(opt.id);
              const isOptionCorrect = opt.is_correct;

              let cardClasses = "p-3 sm:p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all select-none ";
              let checkboxClasses = "w-6 h-6 rounded-md font-black text-xs flex items-center justify-center shrink-0 border ";

              if (!isEvaluated) {
                if (isSelected) {
                  cardClasses += "bg-[#FFB800]/10 border-[#FFB800] text-white shadow-[0_0_15px_rgba(255,184,0,0.2)]";
                  checkboxClasses += "bg-[#FFB800] text-[#080B11] font-bold border-[#FFB800]";
                } else {
                  cardClasses += "bg-[#141C28] hover:bg-[#1A2434] border-white/5 hover:border-white/15 text-white/90";
                  checkboxClasses += "bg-[#0F1622] text-transparent border-white/15";
                }
              } else {
                if (isOptionCorrect) {
                  cardClasses += "bg-emerald-500/15 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
                  checkboxClasses += "bg-emerald-500 text-white border-emerald-500";
                } else if (isSelected && !isOptionCorrect) {
                  cardClasses += "bg-rose-500/15 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                  checkboxClasses += "bg-rose-500 text-white border-rose-500";
                } else {
                  cardClasses += "bg-[#141C28] opacity-40 border-white/5 text-white/60";
                  checkboxClasses += "bg-[#0F1622] text-transparent border-white/5";
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isEvaluated}
                  onClick={() => handleSelectOption(opt.id)}
                  className={cardClasses}
                >
                  <div className={checkboxClasses}>
                    {isSelected ? <Check size={14} /> : opt.id}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm font-bold leading-snug overflow-x-auto">
                    {(opt as any)?.numberLine ? (
                      <NumberLineDiagram data={(opt as any).numberLine} />
                    ) : (opt as any)?.diagram ? (
                      <MathDiagram diagram={(opt as any).diagram} />
                    ) : (
                      <MathRenderer content={opt.content_latex} />
                    )}
                  </div>
                  {isEvaluated && isOptionCorrect && (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  )}
                  {isEvaluated && isSelected && !isOptionCorrect && (
                    <X size={16} className="text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* 3. TWO_PART (Two-step Grid Selection: A/B then 1/2/3) */}
        {taskType === 'TWO_PART' && (
          <div className="w-full space-y-4 my-auto py-2">
            {/* Krok 1 */}
            <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-2.5 text-left">
              <div className="text-xs sm:text-sm font-bold text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
                <span>{activeTask.part_1?.prompt || 'Wybierz pierwszą część zdania:'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(activeTask.part_1?.options || []).map((opt: any) => {
                  const isSelected = twoPart1 === opt.id;
                  const target1 = (activeTask.part_1?.correct || activeTask.correct_combination?.[0] || (activeTask.correct_answer || activeTask.correctAnswer || '')[0]);
                  const isOptionCorrect = opt.id === target1;

                  let btnClass = 'p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all text-xs sm:text-sm cursor-pointer select-none ';
                  if (!isEvaluated) {
                    btnClass += isSelected 
                      ? 'bg-primary/15 border-primary text-white shadow-[0_0_12px_rgba(255,184,0,0.2)]'
                      : 'bg-surface-elevated border-surface-border hover:border-primary/40 text-text-primary';
                  } else {
                    if (isOptionCorrect) {
                      btnClass += 'bg-emerald-500/15 border-emerald-500 text-emerald-100';
                    } else if (isSelected && !isOptionCorrect) {
                      btnClass += 'bg-rose-500/15 border-rose-500 text-rose-100';
                    } else {
                      btnClass += 'bg-surface-elevated/40 border-surface-border/50 opacity-40 text-text-muted';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isEvaluated}
                      onClick={() => {
                        if (isEvaluated) return;
                        triggerHaptic('light');
                        setTwoPart1(opt.id);
                      }}
                      className={btnClass}
                    >
                      <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-primary text-[#080B11] font-bold border-primary' : 'bg-white/5 border-surface-border text-text-secondary'
                      }`}>
                        {opt.id}
                      </span>
                      <div className="flex-1 font-medium">
                        <MathRenderer content={opt.text || opt.content_latex || ''} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Krok 2 */}
            <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-2.5 text-left">
              <div className="text-xs sm:text-sm font-bold text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
                <span>{activeTask.part_2?.prompt || 'Wybierz uzasadnienie:'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {(activeTask.part_2?.options || []).map((opt: any) => {
                  const isSelected = twoPart2 === opt.id;
                  const target2 = (activeTask.part_2?.correct || activeTask.correct_combination?.[1] || (activeTask.correct_answer || activeTask.correctAnswer || '')[1]);
                  const isOptionCorrect = opt.id === target2;

                  let btnClass = 'p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all text-xs sm:text-sm cursor-pointer select-none ';
                  if (!isEvaluated) {
                    btnClass += isSelected 
                      ? 'bg-primary/15 border-primary text-white shadow-[0_0_12px_rgba(255,184,0,0.2)]'
                      : 'bg-surface-elevated border-surface-border hover:border-primary/40 text-text-primary';
                  } else {
                    if (isOptionCorrect) {
                      btnClass += 'bg-emerald-500/15 border-emerald-500 text-emerald-100';
                    } else if (isSelected && !isOptionCorrect) {
                      btnClass += 'bg-rose-500/15 border-rose-500 text-rose-100';
                    } else {
                      btnClass += 'bg-surface-elevated/40 border-surface-border/50 opacity-40 text-text-muted';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isEvaluated}
                      onClick={() => {
                        if (isEvaluated) return;
                        triggerHaptic('light');
                        setTwoPart2(opt.id);
                      }}
                      className={btnClass}
                    >
                      <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-[#FFB800] text-[#080B11] font-bold border-[#FFB800]' : 'bg-white/5 border-white/10 text-white/80'
                      }`}>
                        {opt.id}
                      </span>
                      <div className="flex-1 font-medium">
                        <MathRenderer content={opt.text || opt.content_latex || ''} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. TRUE_FALSE (P / F Statement Selection) */}
        {taskType === 'TRUE_FALSE' && (
          <div className="w-full space-y-3 my-auto py-2">
            <div className="text-xs sm:text-sm font-semibold text-white/80 flex items-center justify-between px-1">
              <span>Oceń prawdziwość zdań:</span>
              <span className="text-[11px] text-white/50">Wybierz P (Prawda) lub F (Fałsz)</span>
            </div>
            <div className="space-y-2.5">
              {(activeTask.statements || []).map((stmt: any, idx: number) => {
                const userSelection = tfSelections[stmt.id];
                const isStatementCorrect = isEvaluated && userSelection === stmt.correct;

                return (
                  <div
                    key={stmt.id || idx}
                    className={`p-4 rounded-2xl border transition-all text-left ${
                      isEvaluated
                        ? isStatementCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-surface-card border-surface-border'
                    } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-surface-elevated border border-surface-border text-primary font-bold text-xs flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="text-xs sm:text-sm text-text-primary leading-relaxed font-medium">
                        <MathRenderer content={stmt.text || stmt.statement || ''} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {(['P', 'F'] as const).map((opt) => {
                        const isOptSelected = userSelection === opt;
                        const isThisTheCorrectAnswer = stmt.correct === opt;

                        let btnClass = 'w-11 h-10 rounded-xl text-xs font-black flex items-center justify-center transition-all cursor-pointer border select-none ';
                        if (!isEvaluated) {
                          btnClass += isOptSelected
                            ? 'bg-primary border-primary text-[#080B11] font-bold shadow-[0_0_12px_rgba(255,184,0,0.3)]'
                            : 'bg-surface-elevated border-surface-border text-text-secondary hover:text-text-primary hover:border-primary/40';
                        } else {
                          if (isThisTheCorrectAnswer) {
                            btnClass += 'bg-emerald-500 border-emerald-500 text-white';
                          } else if (isOptSelected && !isThisTheCorrectAnswer) {
                            btnClass += 'bg-rose-500 border-rose-500 text-white';
                          } else {
                            btnClass += 'bg-surface-elevated/40 border-surface-border/50 text-text-muted opacity-40';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={isEvaluated}
                            onClick={() => {
                              if (isEvaluated) return;
                              triggerHaptic('light');
                              setTfSelections(prev => ({ ...prev, [stmt.id]: opt }));
                            }}
                            className={btnClass}
                          >
                            <span>{opt}</span>
                            {isEvaluated && isThisTheCorrectAnswer && (
                              <Check size={12} className="ml-0.5 stroke-[3]" />
                            )}
                            {isEvaluated && isOptSelected && !isThisTheCorrectAnswer && (
                              <X size={12} className="ml-0.5 stroke-[3]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. UNIVERSAL OPEN TASK WORKSPACE */}
        {(taskType === 'OPEN_TASK' || taskType === 'OPEN_PROOF' || taskType === 'NUMERIC_INPUT') && (
          <OpenTaskWorkspace
            task={activeTask}
            isEvaluated={isEvaluated}
            isCorrect={isCorrect}
            value={numericValue}
            onChangeValue={(val) => {
              setNumericValue(val);
              setOpenProofText(val);
            }}
            savedCanvasDataUrl={scratchpadDataUrl}
            onSaveCanvasData={(dataUrl) => setScratchpadDataUrl(dataUrl)}
            onOpenScratchpad={() => setIsScratchpadOpen(true)}
            onSubmit={handleVerifyAnswer}
            onAskAiTutor={taskType === 'OPEN_PROOF' ? handleAskAiTutor : undefined}
            isAiLoading={isAiLoading}
            hideWhiteboard={taskType === 'NUMERIC_INPUT'}
          />
        )}
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* SECTION 3: BOTTOM PANEL / BOTTOM SHEET (Duolingo-style Feedback)      */}
      {/* -------------------------------------------------------------------- */}
      {!isEvaluated ? (
        <footer className="shrink-0 p-4 border-t border-surface-border bg-surface-elevated z-20 flex flex-col gap-2.5" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          {/* Main Action Button (No lonely hanging hint here - hint is next to scratchpad) */}
          <button
            type="button"
            disabled={!isReadyToVerify}
            onClick={handleVerifyAnswer}
            className={`w-full py-3.5 px-6 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 select-none ${
              isReadyToVerify
                ? 'bg-[#FFB800] hover:bg-[#FFC72C] border-b-4 border-[#D97706] text-[#080B11] font-bold active:translate-y-1 active:border-b-0 shadow-[0_0_20px_rgba(255,184,0,0.35)] cursor-pointer'
                : 'bg-white/5 text-[#8B8D98] border border-white/5 cursor-not-allowed opacity-60'
            }`}
          >
            <span>SPRAWDŹ</span>
            <span className="hidden md:inline-flex text-[10px] font-mono font-bold opacity-75 bg-black/25 px-1.5 py-0.5 rounded">Enter ↵</span>
            <ArrowRight size={16} />
          </button>
        </footer>
      ) : (
        /* MODERN BOTTOM SHEET FOR EVALUATED ANSWER (Smooth internal scroll, zero cutoff) */
        <motion.footer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`shrink-0 p-4 border-t z-30 flex flex-col gap-3 rounded-t-2xl shadow-2xl max-h-[60vh] ${
            isCorrect
              ? 'bg-[#0E1C1A] border-emerald-500/30'
              : 'bg-[#181216] border-rose-500/30'
          }`}
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          {/* Header with state and discrete pill */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {isCorrect ? <Check size={16} className="stroke-[3]" /> : <X size={16} className="stroke-[3]" />}
              </div>
              <span className={`font-display font-black text-base ${
                isCorrect ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                {isCorrect 
                  ? (isRetryPhase ? 'Poprawione! Świetna robota' : 'Poprawna odpowiedź!') 
                  : 'Niepoprawna odpowiedź'}
              </span>
            </div>

            {/* Discrete info pill */}
            <div>
              {isCorrect ? (
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  {isRetryPhase ? '+5 XP' : '+10 XP'}
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                  Pętla powtórkowa
                </span>
              )}
            </div>
          </div>

          {/* Internal scrollable container for solution and steps with safe padding - never cut off under button */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-1 pb-8">
            {/* Header for solution section */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FFB800] flex items-center gap-1.5">
                <BookOpen size={13} className="text-[#FFB800]" />
                {isCorrect ? 'Oficjalne rozwiązanie maturalne:' : 'Wyjaśnienie i kroki rozwiązania:'}
              </span>
              {isCorrect && solutionSteps.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowSolutionSteps(!showSolutionSteps)}
                  className="text-[11px] font-bold text-[#FFB800] hover:underline flex items-center gap-1"
                >
                  <span>{showSolutionSteps ? 'Zwiń kroki' : `Wszystkie kroki (${solutionSteps.length})`}</span>
                  {showSolutionSteps ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </div>

            {/* If NOT correct: Show ALL steps separated into individual, clean, highlighted cards */}
            {!isCorrect ? (
              <div className="flex flex-col gap-2.5">
                {solutionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-elevated/95 border border-surface-border hover:border-surface-border rounded-xl p-3 sm:p-3.5 flex flex-col gap-2 shadow-sm transition-all"
                  >
                    {/* Step Title / Badge - hide redundant WYJAŚNIENIE badge */}
                    {Boolean(step.title || (step.label && !step.label.toLowerCase().includes('wyjaśnienie'))) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {step.label && !step.label.toLowerCase().includes('wyjaśnienie') && (
                          <span className="bg-[#FFB800]/15 text-[#FFB800] font-black text-[11px] px-2.5 py-0.5 rounded-md border border-[#FFB800]/30 uppercase tracking-wide shrink-0">
                            {step.label}
                          </span>
                        )}
                        {step.title && (
                          <span className="font-bold text-white text-xs leading-snug">
                            {step.title}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Step Body (KaTeX / Text) */}
                    <div className="text-xs text-white/90 leading-relaxed overflow-x-auto pl-0.5">
                      <MathRenderer content={step.content} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* If CORRECT: Show primary solution, with collapsible detailed breakdown */
              <div className="flex flex-col gap-2.5">
                <div className="bg-surface-elevated/95 border border-surface-border rounded-xl p-3 sm:p-3.5 flex flex-col gap-1.5 shadow-sm">
                  {solutionSteps[0]?.title && (
                    <div className="flex items-center gap-2 mb-1">
                      {solutionSteps[0].label && !solutionSteps[0].label.toLowerCase().includes('wyjaśnienie') && (
                        <span className="bg-emerald-500/15 text-emerald-400 font-black text-[10px] px-2 py-0.5 rounded-md border border-emerald-500/30 uppercase">
                          {solutionSteps[0].label}
                        </span>
                      )}
                      <span className="font-bold text-white text-xs">{solutionSteps[0].title}</span>
                    </div>
                  )}
                  <div className="text-xs text-white/90 leading-relaxed overflow-x-auto">
                    <MathRenderer content={solutionSteps[0]?.content || activeTask.explanation || 'Poprawna odpowiedź.'} />
                  </div>
                
                  {/* Explanation Visuals */}
                  {((activeTask as any)?.explanationNumberLine || (activeTask as any)?.explanationDiagram || (activeTask as any)?.explanationPlot) && (
                    <div className="mt-3 flex justify-center w-full">
                      {(activeTask as any)?.explanationNumberLine ? (
                        <NumberLineDiagram data={(activeTask as any).explanationNumberLine} height={64} maxWidth="400px" />
                      ) : (activeTask as any)?.explanationDiagram || (activeTask as any)?.explanationPlot ? (
                        <MathDiagram diagram={(activeTask as any).explanationDiagram || (activeTask as any).explanationPlot} borderless />
                      ) : null}
                    </div>
                  )}
                  </div>


                <AnimatePresence>
                  {showSolutionSteps && solutionSteps.length > 1 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2.5 pt-1"
                    >
                      {solutionSteps.slice(1).map((step, idx) => (
                        <div
                          key={idx}
                          className="bg-[#0F1622] border border-white/10 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-[#FFB800]/15 text-[#FFB800] font-black text-[10px] px-2 py-0.5 rounded-md border border-[#FFB800]/30">
                              {step.label}
                            </span>
                            {step.title && (
                              <span className="font-bold text-white text-xs">{step.title}</span>
                            )}
                          </div>
                          <div className="text-xs text-white/90 leading-relaxed overflow-x-auto">
                            <MathRenderer content={step.content} />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Full-width bottom action button (no duplicate arrows, pinned below solution) */}
          <button
            type="button"
            onClick={handleNextQuestion}
            className={`w-full py-3.5 px-6 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 group shrink-0 active:translate-y-1 active:border-b-0 cursor-pointer ${
              isCorrect
                ? 'bg-[#FFB800] hover:bg-[#FFC72C] border-b-4 border-[#D97706] text-[#080B11] font-bold shadow-[0_0_20px_rgba(255,184,0,0.35)]'
                : 'bg-rose-500 hover:bg-rose-600 border-b-4 border-rose-700 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]'
            }`}
          >
            <span>
              {currentTaskIndex < practiceQueue.length - 1 
                ? 'Następne zadanie' 
                : (!isRetryPhase && mistakesBuffer.length > 0)
                  ? 'Przejdź do powtórki'
                  : 'Ukończ lekcję'}
            </span>
            <span className="hidden md:inline-flex text-[10px] font-mono font-bold opacity-75 bg-black/25 px-1.5 py-0.5 rounded">Spacja ␣</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.footer>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* CKE SCRATCHPAD BOTTOM SHEET                                          */}
      {/* -------------------------------------------------------------------- */}
      <CkeScratchpad
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        savedDataUrl={scratchpadDataUrl}
        onSaveData={(dataUrl) => setScratchpadDataUrl(dataUrl)}
        isOpenProof={taskType === 'OPEN_PROOF'}
        taskQuestion={activeTask.math_statement || activeTask.question}
        taskInstruction={activeTask.instruction}
        staticHint={activeTask.hints?.level_1}
        studentText={openProofText}
      />

      {/* -------------------------------------------------------------------- */}
      {/* STATIC HINT DRAWER / MODAL (FOR CLOSED & OPEN TASKS, NO AI BOTS)    */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHintModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative z-10 w-full max-w-xl mx-auto bg-[#141C28] border-t border-white/15 rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 pointer-events-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-400" />
                  <span className="font-display font-bold text-white text-base">
                    Wskazówki do zadania
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHintModal(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Level 1 Static Hint */}
              <div className="bg-surface-elevated border border-surface-border rounded-xl p-3.5 text-xs text-text-primary leading-relaxed">
                <div className="font-bold text-primary mb-1 flex items-center gap-1">
                  <span>Wskazówka (Karta Wzorów):</span>
                </div>
                <MathRenderer content={activeTask.hints?.level_1 || 'Zwróć uwagę na sprowadzenie wyrażeń do wspólnej postaci i odpowiednie wzory maturalne.'} />
              </div>

              {/* Level 2 Static Hint */}
              {unlockedHintLevel >= 2 ? (
                <div className="bg-surface-elevated border border-surface-border rounded-xl p-3.5 text-xs text-text-primary leading-relaxed">
                  <div className="font-bold text-primary mb-1 flex items-center gap-1">
                    <span>Krok rozwiązania:</span>
                  </div>
                  <MathRenderer content={activeTask.hints?.level_2 || 'Podstaw odpowiednie wzory skróconego mnożenia lub twierdzenia o potęgach i logarytmach.'} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setUnlockedHintLevel(2);
                  }}
                  className="py-2.5 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-xs font-bold text-white/80 hover:text-white transition-all text-center"
                >
                  Odblokuj kolejny krok (Poziom 2)
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------- */}
      {/* DEDICATED SOCRATIC AI TUTOR BOTTOM SHEET (OPEN_PROOF ONLY, MAX 35%)  */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {taskType === 'OPEN_PROOF' && showOpenProofTutorSheet && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOpenProofTutorSheet(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative z-10 w-full max-w-xl mx-auto max-h-[35vh] bg-[#141C28] border-t border-white/15 rounded-t-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3 overflow-y-auto custom-scrollbar pointer-events-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Bot size={18} className="text-[#FFB800]" />
                  <span className="font-display font-bold text-white text-sm sm:text-base">
                    Wskazówka Tutora (Metoda sokratejska)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOpenProofTutorSheet(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="text-xs sm:text-sm text-white/95 leading-relaxed py-1">
                {isAiLoading ? (
                  <div className="flex items-center gap-2 text-[#FFB800] py-3 font-bold">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Tutor analizuje zadanie i Twoje rozumowanie...</span>
                  </div>
                ) : (
                  <MathRenderer content={aiTutorResponse || activeTask.hints?.level_1 || 'Zwróć uwagę na rozkład na czynniki liniowe lub wyłączenie wspólnego składnika przed nawias.'} />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

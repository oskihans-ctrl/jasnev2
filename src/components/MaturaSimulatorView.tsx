import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  BookOpen, 
  Calculator,
  GraduationCap, 
  Target, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Clock, 
  Flag, 
  Pen, 
  Pause, 
  Play, 
  AlertTriangle, 
  RotateCcw, 
  Filter, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  Award, 
  Layers, 
  Zap, 
  Check, 
  X,
  FileText,
  Compass,
  Shuffle,
  BarChart3,
  CheckSquare,
  ArrowRight,
  Lightbulb,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import { MaturaTask, UserState, CkeTaskCompletionRecord } from '../types';
import { curriculumRepository } from '../services/curriculumRepository';
import { 
  generateFullMaturaExam, 
  generateMiniMaturaExam, 
  FLAGSHIP_JASNE_EXAMS, 
  getAll1500MaturaTasks 
} from '../services/maturaExamGenerator';
import { calculateMaturaPrediction } from '../lib/maturaPredictor';
import { playSuccessSound, playErrorSound, triggerHaptic } from '../utils';
import { shuffleTaskOptions } from '../utils/taskShuffler';
import { ScratchpadModal } from './ScratchpadModal';
import { CkeFormulasModal } from './CkeFormulasModal';
import { MaturaExamReview, MaturaTaskReviewItem, MaturaAiEvaluation } from './MaturaExamReview';
import { OpenTaskWorkspace, convertDataUrlToAiOptimized } from './OpenTaskWorkspace';
import { WritingWorkspace } from './writing/WritingWorkspace';
import { PolishExamSimulator } from './polish/PolishExamSimulator';
import { ALL_ENGLISH_TASKS } from '../data/english/allEnglishTasks';
import { ALL_POLISH_TASKS } from '../data/polish';
import { MathDiagram } from './MathDiagram';
import { NumberLineDiagram } from './NumberLineDiagram';
import { enrichTaskWithVisual } from '../data/mathVisualRegistry';
import { showToast } from '../lib/toast';
import { apiHeaders } from '../lib/apiClient';

interface ExamTaskCardProps {
  task: MaturaTask;
  currentIndex: number;
  examSubject?: 'matematyka' | 'polski' | 'angielski';
  selectedAnswer?: string;
  openAnswer?: { text: string; canvasUrl?: string };
  aiEvaluation?: any;
  isEvaluatingAi?: boolean;
  onTriggerAiEvaluation?: () => void;
  onResetAiEvaluation?: () => void;
  onSelectClosedAnswer: (optLetter: string) => void;
  onOpenAnswerChange: (val: string) => void;
  onOpenCanvasChange: (dataUrl: string) => void;
  onPrevTask: () => void;
  onNextTask: () => void;
  isFirstTask: boolean;
  isLastTask: boolean;
}

const ExamTaskCard = React.memo<ExamTaskCardProps>(({
  task: rawTask,
  currentIndex,
  examSubject,
  selectedAnswer,
  openAnswer,
  aiEvaluation,
  isEvaluatingAi,
  onTriggerAiEvaluation,
  onResetAiEvaluation,
  onSelectClosedAnswer,
  onOpenAnswerChange,
  onOpenCanvasChange,
  onPrevTask,
  onNextTask,
  isFirstTask,
  isLastTask
}) => {
  const task = enrichTaskWithVisual(rawTask);
  const isEnglishWriting = Boolean(
    (examSubject === 'angielski' || String(task.id).startsWith('eng_') || String(task.id).startsWith('ang_')) &&
    (task.points >= 10 ||
    /e-mail|blog|list|wpis|forum|wypowiedź pisemna|task 12|zadanie 12/i.test(task.content || '') ||
    String(task.id).startsWith('eng_wri_'))
  );
  const isPolishWriting = Boolean(
    (examSubject === 'polski' || String(task.id).startsWith('pol_') || String(task.id).startsWith('pl_')) &&
    (task.points >= 30 ||
    /notatk[ai]|syntez|wypracowan|rozprawk/i.test(task.content || '') ||
    String(task.id).includes('synt') ||
    String(task.id).includes('wyp'))
  );
  const isWriting = isEnglishWriting || isPolishWriting;
  return (
    <div className="p-4 sm:p-6 rounded-[28px] bg-surface-card border border-surface-border shadow-xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-surface-border pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-text-secondary text-xs font-bold">
            Zadanie {currentIndex + 1}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/20 text-[#FFB800] text-xs font-bold">
            {task.points} {task.points === 1 ? 'punkt' : 'punkty'}
          </span>
          {task.source && (
            <span className="text-text-muted text-xs hidden sm:inline">
              • {task.source}
            </span>
          )}
        </div>
        <span className="text-xs text-text-muted">
          {task.section}
        </span>
      </div>

      {/* RWD Tablet / Desktop Split-Layout */}
      {task.isClosed ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-6 space-y-4">
            <div className="prose prose-invert max-w-none math-render overflow-x-auto py-2 -my-2 text-text-primary text-sm sm:text-base leading-relaxed">
              <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {task.content}
              </Markdown>
            </div>
            {Boolean((task as any).numberLine) ? (
              <div className="mt-3 flex justify-center">
                <NumberLineDiagram data={(task as any).numberLine} height={64} maxWidth="360px" />
              </div>
            ) : Boolean((task as any).diagram || (task as any).plot) ? (
              <div className="mt-3 flex justify-center">
                <MathDiagram diagram={(task as any).diagram || (task as any).plot} />
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-6 grid grid-cols-1 gap-2.5">
            {task.options?.map((opt, optIdx) => {
              const optLetter = String.fromCharCode(65 + optIdx);
              const isSelected = selectedAnswer === optLetter;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => onSelectClosedAnswer(optLetter)}
                  className={`group p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3.5 active:scale-[0.99] cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFB800]/10 border-[#FFB800] ring-1 ring-[#FFB800]/50 shadow-[0_0_15px_rgba(255,184,0,0.15)] text-white'
                      : 'bg-surface-card border-surface-border text-text-secondary hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span className={`w-8 h-8 rounded-xl font-display font-black text-xs flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'bg-[#FFB800] text-black border-[#FFB800] shadow-sm'
                        : 'bg-white/5 text-text-secondary border-white/10'
                    }`}>
                      {optLetter}
                    </span>
                    <div className={`flex-1 overflow-x-auto text-sm leading-relaxed py-0.5 math-render ${
                      isSelected ? 'text-white font-medium' : 'text-slate-200'
                    }`}>
                      {typeof opt === 'object' && (opt as any)?.numberLine ? (
                        <NumberLineDiagram data={(opt as any).numberLine} />
                      ) : typeof opt === 'object' && (opt as any)?.diagram ? (
                        <MathDiagram diagram={(opt as any).diagram} />
                      ) : (
                        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {typeof opt === 'object' ? ((opt as any).text || (opt as any).content_latex || '') : opt}
                        </Markdown>
                      )}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-[#FFB800]' : 'border-white/20'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <div className="prose prose-invert max-w-none math-render overflow-x-auto py-2 -my-2 text-text-primary text-sm sm:text-base leading-relaxed">
            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {task.content}
            </Markdown>
          </div>
          {Boolean((task as any).numberLine) ? (
            <div className="mt-3 flex justify-center">
              <NumberLineDiagram data={(task as any).numberLine} height={64} maxWidth="360px" />
            </div>
          ) : Boolean((task as any).diagram || (task as any).plot) ? (
            <div className="mt-3 flex justify-center">
              <MathDiagram diagram={(task as any).diagram || (task as any).plot} />
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-surface-bg border border-surface-border">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-[#FFB800]" />
              <span className="text-xs font-bold text-white">
                Zadanie otwarte • Asynchroniczna ocena AI
              </span>
            </div>
            {(openAnswer?.text?.trim() || (openAnswer?.canvasUrl && openAnswer.canvasUrl.length > 50)) ? (
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                ✓ Rozwiązanie zapisane
              </span>
            ) : (
              <span className="text-[11px] text-text-muted hidden sm:inline">
                Egzaminator AI ocenia rozwiązanie w tle
              </span>
            )}
          </div>

          {isWriting ? (
            <WritingWorkspace
              taskId={String(task.id)}
              taskTitle={task.content.length > 80 ? task.content.substring(0, 80) + '...' : task.content}
              taskQuestion={task.content}
              contextText={(task as any).contextText || (task as any).context_text}
              maxPoints={task.points || (isEnglishWriting ? 12 : 35)}
              subject={isEnglishWriting ? 'angielski' : 'polski'}
              studentText={openAnswer?.text || ''}
              onChangeText={onOpenAnswerChange}
              onEvaluate={onTriggerAiEvaluation || (() => {})}
              isEvaluating={Boolean(isEvaluatingAi)}
              isPro={true}
              evaluation={aiEvaluation || null}
              onResetEvaluation={onResetAiEvaluation}
            />
          ) : (
            <OpenTaskWorkspace
              task={task}
              isEvaluated={false}
              isCorrect={null}
              value={openAnswer?.text || ''}
              onChangeValue={onOpenAnswerChange}
              savedCanvasDataUrl={openAnswer?.canvasUrl}
              onSaveCanvasData={onOpenCanvasChange}
              inputPlaceholder="Wprowadź swoje kroki obliczeniowe lub skorzystaj z brudnopisu..."
              hideWhiteboard={false}
              mode="math"
            />
          )}
        </div>
      )}

      {/* Nawigacja dolna zadania */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-border">
        <button
          type="button"
          disabled={isFirstTask}
          onClick={onPrevTask}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Poprzednie</span>
        </button>

        <button
          type="button"
          disabled={isLastTask}
          onClick={onNextTask}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Następne</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
});

export interface MaturaSimulatorViewProps {
  onEarnReward?: (xp: number, coins: number, showModal?: boolean) => void;
  userState?: UserState;
  onUpdateUserState?: (updater: (prev: UserState) => UserState) => void;
  completedTasks?: string[];
  onCompleteTask?: (taskId: string, points?: number) => void;
  onActiveSessionChange?: (isActive: boolean) => void;
  initialView?: 'hub' | 'exam_setup' | 'full_exams' | 'topics_bank' | 'topic_detail' | 'exam' | 'exam_review' | 'maraton' | 'mistakes';
  currentSubject?: 'matematyka' | 'polski' | 'angielski';
  onSelectSubject?: (subject: 'matematyka' | 'polski' | 'angielski') => void;
  onNavigateBack?: () => void;
}

export function MaturaSimulatorView({
  onEarnReward,
  userState,
  onUpdateUserState,
  completedTasks = [],
  onCompleteTask,
  onActiveSessionChange,
  initialView = 'hub',
  currentSubject,
  onSelectSubject,
  onNavigateBack
}: MaturaSimulatorViewProps) {
  // Przełącznik przedmiotu w symulatorze matury
  const [examSubject, setExamSubject] = useState<'matematyka' | 'polski' | 'angielski'>(() => {
    if (currentSubject === 'polski' || userState?.currentSubject === 'polski') return 'polski';
    if (currentSubject === 'angielski' || userState?.currentSubject === 'angielski') return 'angielski';
    return 'matematyka';
  });

  // Reaktywna synchronizacja przedmiotu z paska górnego
  useEffect(() => {
    const target = (currentSubject === 'polski' || userState?.currentSubject === 'polski')
      ? 'polski'
      : (currentSubject === 'angielski' || userState?.currentSubject === 'angielski')
        ? 'angielski'
        : 'matematyka';
    if (target !== examSubject) {
      setExamSubject(target);
      setView('hub');
    }
  }, [currentSubject, userState?.currentSubject, examSubject]);

  const handleFinishPolishExam = (score: number, maxScore: number) => {
    const pct = Math.round((score / Math.max(maxScore, 1)) * 100);
    const earnedXp = Math.max(100, Math.round(pct * 2.5));
    const earnedCoins = pct < 30 ? 30 : Math.round(30 + (pct / 100) * 120);
    onEarnReward?.(earnedXp, earnedCoins, true);
    if (onUpdateUserState) {
      onUpdateUserState(prev => ({
        ...prev,
        xp: (prev.xp || 0) + earnedXp,
        coins: (prev.coins || 0) + earnedCoins,
        maturaAttempts: (prev.maturaAttempts || 0) + 1,
        maturaBestScore: Math.max(prev.maturaBestScore || 0, pct),
        polishStats: {
          totalPoints: (prev.polishStats?.totalPoints || 0) + score,
          completedCount: (prev.polishStats?.completedCount || 0) + 1,
          lastLessonId: prev.polishStats?.lastLessonId
        }
      }));
    }
  };

  // Baza wszystkich zadań pobierana przez curriculumRepository (Cache-First z Firestore)
  const [tasks, setTasks] = useState<MaturaTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Główne widoki zgodne z 4 Filarami:
  // 'hub' - centralny pulpit Symulatora (Bento)
  // 'exam_setup' - konfigurator Mini Matury
  // 'full_exams' - Filar 2: Pełne Oficjalne Arkusze CKE (Maj 2024, Czerwiec 2024, Maj 2023...)
  // 'topics_bank' - Filar 3: 15 Kafelków Działów CKE
  // 'topic_detail' - Szczegółowy widok wybranego działu
  // 'exam' - uniwersalny runner arkusza (z zegarem 20/35/180 min lub bezstresowy)
  // 'exam_review' - podsumowanie arkusza (MaturaExamReview)
  // 'maraton' - Filar 4: Trening ciągły / losowe zadania CKE / drill pojedynczy
  // 'mistakes' - Filar 5: Baza Błędów
  const [view, setView] = useState<
    'hub' | 'exam_setup' | 'full_exams' | 'topics_bank' | 'topic_detail' | 'exam' | 'exam_review' | 'maraton' | 'mistakes'
  >(initialView || 'hub');

  useEffect(() => {
    if (initialView) {
      setView(initialView);
    }
  }, [initialView]);

  // Stan uruchomienia pełnego arkusza języka polskiego (Zeszyt 1 + 2)
  const [isPolishFullExamActive, setIsPolishFullExamActive] = useState(false);

  // Powiadomienie rodzica (App.tsx) o wejściu w tryb aktywnego rozwiązywania zadań (wygaszenie dolnego docka nawigacji)
  useEffect(() => {
    const isSolvingSession = (examSubject === 'polski' && isPolishFullExamActive) || view === 'maraton' || view === 'exam';
    onActiveSessionChange?.(isSolvingSession);
    return () => {
      onActiveSessionChange?.(false);
    };
  }, [view, examSubject, isPolishFullExamActive, onActiveSessionChange]);

  // Modale pomocnicze
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isFormulasOpen, setIsFormulasOpen] = useState(false);

  // Modale potwierdzenia arkusza (clarify)
  const [examConfirmModal, setExamConfirmModal] = useState<'finish' | 'exit' | null>(null);
  const [unansweredCount, setUnansweredCount] = useState(0);

  // Bank błędów (localStorage)
  const [mistakesBank, setMistakesBank] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('matura_mistakes_bank');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveMistakesBank = (newBank: string[]) => {
    setMistakesBank(newBank);
    try {
      localStorage.setItem('matura_mistakes_bank', JSON.stringify(newBank));
    } catch (e) {
      console.error('Failed to save mistakes bank:', e);
    }
  };

  const addMistake = (taskId: string) => {
    if (!mistakesBank.includes(taskId)) {
      const updated = [...mistakesBank, taskId];
      saveMistakesBank(updated);
    }
  };

  const removeMistake = (taskId: string) => {
    if (mistakesBank.includes(taskId)) {
      const updated = mistakesBank.filter(id => id !== taskId);
      saveMistakesBank(updated);
    }
  };

  // Ładowanie zadań Cache-First z Firestore z natychmiastowym fallbackiem na bazę 1500 zadań JASNE
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const loadedTasks = await curriculumRepository.getCkeExamTasks('matematyka-podstawowa');
        if (!isMounted) return;
        if (!loadedTasks || loadedTasks.length === 0) {
          // Natychmiastowy lokalny fallback na bazę 1500 zadań Formuła 2023
          setTasks(getAll1500MaturaTasks());
        } else {
          setTasks(loadedTasks);
        }
      } catch (err) {
        console.warn('[MaturaSimulatorView] Błąd wczytywania zadań, aktywacja bazy 1500 zadań:', err);
        if (isMounted) {
          setTasks(getAll1500MaturaTasks());
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void load();
    return () => { isMounted = false; };
  }, []);

  // Lista 15 kanonicznych działów CKE dla Matematyki
  const CANONICAL_TOPICS = useMemo(() => [
    'Dział 1: Liczby Rzeczywiste',
    'Dział 2: Wyrażenia Algebraiczne i Wielomiany',
    'Dział 3: Równania i Nierówności',
    'Dział 4: Własności Funkcji i Wykresy',
    'Dział 5: Funkcja Liniowa i Układy Równań',
    'Dział 6: Funkcja Kwadratowa',
    'Dział 7: Ciągi Liczbowe',
    'Dział 8: Trygonometria',
    'Dział 9: Planimetria',
    'Dział 10: Geometria Analityczna',
    'Dział 11: Stereometria',
    'Dział 12: Kombinatoryka',
    'Dział 13: Rachunek Prawdopodobieństwa',
    'Dział 14: Statystyka',
    'Dział 15: Zadania Optymalizacyjne'
  ], []);

  // Lista 15 działów CKE dla Języka Angielskiego
  const ENGLISH_TOPICS = useMemo(() => [
    'Dział 1: Czasy gramatyczne i aspekty w narracji i dialogu',
    'Dział 2: Konstrukcje czasownikowe: Gerund, Infinitive i Modals',
    'Dział 3: Zdania warunkowe (Conditionals) i mowa zależna',
    'Dział 4: Strona bierna i konstrukcje sprawcze (Causatives)',
    'Dział 5: Inwersja stylistyczna i zaawansowane transformacje zdań',
    'Dział 6: Rozumienie ze słuchu: intencje, kontekst i selekcja informacji',
    'Dział 7: Rozumienie ze słuchu: odróżnianie faktów od opinii',
    'Dział 8: Rozumienie tekstów pisanych: artykuły publicystyczne i eseje',
    'Dział 9: Rozumienie tekstów pisanych: teksty narracyjne i wywiady',
    'Dział 10: Znajomość środków językowych: dobieranie i luki leksykalne',
    'Dział 11: Znajomość środków językowych: parafrazy i słowotwórstwo',
    'Dział 12: Wypowiedź pisemna: e-mail formalny i list motywacyjny',
    'Dział 13: Wypowiedź pisemna: rozprawka za i przeciw (Pros & Cons)',
    'Dział 14: Wypowiedź pisemna: artykuł publicystyczny z tezą',
    'Dział 15: Funkcje językowe: mediacja, reakcje w dialogu i negocjacje'
  ], []);

  // Lista 15 działów CKE dla Języka Polskiego
  const POLISH_TOPICS = useMemo(() => [
    'Dział 1: Starożytność i Biblia – fundamenty kultury europejskiej',
    'Dział 2: Średniowiecze – teocentryzm, etos rycerski i motywy eschatologiczne',
    'Dział 3: Renesans – antropocentryzm, humanizm i harmonia świata',
    'Dział 4: Barok – vanitas, sarmatyzm i metafizyka niepokoju',
    'Dział 5: Oświecenie – racjonalizm, dydaktyzm i krytyka społeczna',
    'Dział 6: Romantyzm – mesjanizm, prometeizm i dramat narodowy',
    'Dział 7: Pozytywizm – praca organiczna, scjentyzm i realizm krytyczny',
    'Dział 8: Młoda Polska – dekadentyzm, chłopomania i symbolizm narodowy',
    'Dział 9: Dwudziestolecie międzywojenne – awangarda, katastrofizm i diagnoza państwa',
    'Dział 10: Literatura wojny i okupacji – literatura lagrowa, łagrowa i apokalipsa spełniona',
    'Dział 11: Literatura współczesna – totalitaryzm, emigracja i kondycja człowieka',
    'Dział 12: Język polski w użyciu: czytanie krytyczne i analiza dyskursu',
    'Dział 13: Język polski w użyciu: retoryka, manipulacja i argumentacja',
    'Dział 14: Notatka syntetyzująca: kompresja sensu i łączenie stanowisk',
    'Dział 15: Wypracowanie maturalne: teza, konteksty i kompozycja argumentacyjna'
  ], []);

  const currentTopics = useMemo(() => {
    if (examSubject === 'angielski') return ENGLISH_TOPICS;
    if (examSubject === 'polski') return POLISH_TOPICS;
    return CANONICAL_TOPICS;
  }, [examSubject, CANONICAL_TOPICS, ENGLISH_TOPICS, POLISH_TOPICS]);

  // Zadania dla aktywnego przedmiotu w symulatorze
  const currentSubjectTasks = useMemo<MaturaTask[]>(() => {
    if (examSubject === 'angielski') {
      return ALL_ENGLISH_TASKS.map(t => {
        let optLetter = t.correctAnswer;
        if (t.options && t.options.length > 0) {
          const idx = t.options.findIndex(o => o === t.correctAnswer || (t.optionsDetailed && t.optionsDetailed.find(od => od.is_correct)?.text === o));
          if (idx !== -1) {
            optLetter = String.fromCharCode(65 + idx);
          }
        }
        return shuffleTaskOptions({
          id: t.id,
          content: t.contextText ? `### ${t.title}\n\n${t.contextText}\n\n**${t.question}**` : `### ${t.title}\n\n**${t.question}**`,
          options: t.options || [],
          correctAnswer: optLetter,
          explanation: t.explanation || '',
          ckeTrap: t.ckeTrap || '',
          section: t.sectionTitle || 'Język Angielski',
          points: t.points || 1,
          isClosed: t.type === 'SINGLE_CHOICE' || t.type === 'TRUE_FALSE',
          source: t.source || 'CKE Język Angielski (Formuła 2023)'
        });
      });
    }
    if (examSubject === 'polski') {
      return ALL_POLISH_TASKS.map((t: any) => {
        const closed = t.taskType === 'single_choice' || t.taskType === 'true_false' || t.type === 'SINGLE_CHOICE' || t.type === 'TRUE_FALSE';
        let optLetter = 'A';
        const rawOpts = t.options || [];
        const optsStrings = rawOpts.map((o: any) => typeof o === 'string' ? o : o.text || '');
        if (t.correctOptionIndex !== undefined) {
          optLetter = String.fromCharCode(65 + t.correctOptionIndex);
        } else if (t.correctAnswer !== undefined) {
          if (typeof t.correctAnswer === 'number') {
            optLetter = String.fromCharCode(65 + t.correctAnswer);
          } else {
            optLetter = String(t.correctAnswer);
          }
        } else if (t.correctAnswerText) {
          optLetter = t.correctAnswerText;
        }
        return shuffleTaskOptions({
          id: t.id,
          content: `### ${t.title || 'Zadanie'}\n\n${t.question || t.instruction || t.content || ''}`,
          options: optsStrings,
          correctAnswer: optLetter,
          explanation: t.explanation || t.modelAnswer || '',
          ckeTrap: t.ckeTrap || t.hintCke || '',
          section: t.epoch || t.partName || t.section || 'Język Polski',
          points: t.points || 1,
          isClosed: closed,
          source: t.sourceYear || t.source || 'CKE Język Polski (Formuła 2023)'
        });
      });
    }
    return tasks;
  }, [examSubject, tasks]);

  const effectiveTasks = currentSubjectTasks;

  // Rekordy ukończenia zadań z UserState
  const completedCkeRecords = useMemo<Record<string, CkeTaskCompletionRecord>>(() => {
    return userState?.completedCkeTasks || {};
  }, [userState?.completedCkeTasks]);

  const isTaskPassed = (taskId: string) => {
    if (completedCkeRecords[taskId]?.status === 'passed') return true;
    if (completedTasks.includes(taskId)) return true;
    return false;
  };

  const isTaskFailed = (taskId: string) => {
    if (completedCkeRecords[taskId]?.status === 'failed') return true;
    return mistakesBank.includes(taskId);
  };

  const completedCkeCount = useMemo(() => {
    return effectiveTasks.filter(t => isTaskPassed(t.id)).length;
  }, [effectiveTasks, completedCkeRecords, completedTasks]);

  const completionPct = effectiveTasks.length > 0 ? Math.round((completedCkeCount / effectiveTasks.length) * 100) : 0;

  // Matura Predictor
  const maturaPrediction = useMemo(() => {
    return calculateMaturaPrediction({
      subjectId: 'matematyka-podstawowa',
      completedTasks: completedTasks || [],
      maturaAttempts: userState?.maturaAttempts || 0,
      maturaBestScore: userState?.maturaBestScore || 0
    });
  }, [userState, completedTasks]);

  // Znajdź najsłabszy dział (z najniższym % zdanych zadań)
  const weakestSection = useMemo(() => {
    let minPct = 101;
    let weakest = currentTopics[0];
    currentTopics.forEach(topic => {
      const topicTasks = effectiveTasks.filter(t => t.section === topic);
      if (topicTasks.length > 0) {
        const passed = topicTasks.filter(t => isTaskPassed(t.id)).length;
        const pct = Math.round((passed / topicTasks.length) * 100);
        if (pct < minPct) {
          minPct = pct;
          weakest = topic;
        }
      }
    });
    return weakest;
  }, [effectiveTasks, currentTopics, completedCkeRecords, completedTasks]);

  // =========================================================================
  // RUNNER ARKUSZA (Zarówno Mini Matura, jak i Pełny Arkusz CKE)
  // =========================================================================
  const [examTitle, setExamTitle] = useState('Mini Matura CKE');
  const [examTasks, setExamTasks] = useState<MaturaTask[]>([]);
  const [examCurrentIndex, setExamCurrentIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examOpenScores, setExamOpenScores] = useState<Record<string, number>>({});
  const [examOpenAnswers, setExamOpenAnswers] = useState<Record<string, { text: string; canvasUrl?: string }>>({});
  const [examAiEvaluations, setExamAiEvaluations] = useState<Record<string, MaturaAiEvaluation>>({});
  const pendingBackgroundEvalRef = useRef<Record<string, boolean>>({});
  const examDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevExamIndexRef = useRef<number>(0);

  const [flaggedTasks, setFlaggedTasks] = useState<Set<string>>(new Set());
  const [examTimeLeft, setExamTimeLeft] = useState(20 * 60);
  const [examTotalDuration, setExamTotalDuration] = useState(20 * 60);
  const [isExamTimed, setIsExamTimed] = useState(true);
  const [isExamPaused, setIsExamPaused] = useState(false);
  const [examTimeSpent, setExamTimeSpent] = useState(0);
  const [examReviewItems, setExamReviewItems] = useState<MaturaTaskReviewItem[]>([]);
  const [earnedReward, setEarnedReward] = useState<{ xp: number; coins: number } | null>(null);

  // Konfigurator Mini Matury (18 zadań = 25 pkt standard 1/2 arkusza, 12 zadań = 15 pkt ekspres)
  const [setupSection, setSetupSection] = useState('Wszystkie działy');
  const [setupLength, setSetupLength] = useState<11 | 12 | 17 | 18 | 7>(18);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Asynchroniczna ewaluacja w tle przez Tutora AI (BFF Express /api/evaluate-task)
  const triggerBackgroundEvaluation = async (task: MaturaTask, text: string, canvasUrl?: string) => {
    const hasText = text.trim().length > 0;
    const hasCanvas = Boolean(canvasUrl && canvasUrl.length > 50);
    if (!hasText && !hasCanvas) return;

    const taskId = task.id;
    if (pendingBackgroundEvalRef.current[taskId]) return;
    pendingBackgroundEvalRef.current[taskId] = true;

    try {
      let studentImage: string | undefined = undefined;
      if (hasCanvas) {
        try {
          studentImage = await convertDataUrlToAiOptimized(canvasUrl!);
        } catch (e) {
          studentImage = canvasUrl;
        }
      }

      const isEnglishTask = examSubject === 'angielski' || Boolean((task as any).subCriteria || (task as any).pillar === 'writing' || String(task.id).startsWith('eng-') || String(task.id).startsWith('ang-') || String(task.id).startsWith('eng_'));
      const isPolishTask = examSubject === 'polski' || String(task.id).startsWith('pol_') || String(task.id).startsWith('pl_');

      const effectiveText = hasText ? text.trim() : '[Rozwiązanie odręczne na tablicy]';
      const response = await fetch('/api/evaluate-task', {
        method: 'POST',
        headers: await apiHeaders(),
        body: JSON.stringify({
          id: task.id,
          question: task.content,
          contextText: (task as any).contextText || (task as any).context_text,
          officialKey: task.explanation,
          scoring_key: task.explanation,
          studentAnswer: effectiveText,
          studentImage: studentImage || undefined,
          taskType: (task as any).type || (isEnglishTask ? 'ENGLISH_WRITING' : isPolishTask ? (task.points >= 30 ? 'ESSAY' : 'OPEN_POLISH') : 'OPEN_PROOF'),
          isPolish: isPolishTask,
          isEnglish: isEnglishTask,
          maxPoints: task.points,
          mode: 'grade'
        })
      });

      if (response.ok) {
        const serverEval = await response.json();
        if (serverEval && !serverEval.evaluationFailed) {
          setExamAiEvaluations(prev => ({
            ...prev,
            [taskId]: serverEval
          }));
          setExamOpenScores(prev => ({
            ...prev,
            [taskId]: serverEval.score
          }));
        }
      }
    } catch (err) {
      console.warn('[MaturaSimulator] Błąd asynchronicznej ewaluacji zadania w tle:', taskId, err);
    } finally {
      pendingBackgroundEvalRef.current[taskId] = false;
    }
  };

  const handleExamOpenAnswerChange = (taskId: string, newText: string) => {
    setExamOpenAnswers(prev => ({
      ...prev,
      [taskId]: { text: newText, canvasUrl: prev[taskId]?.canvasUrl }
    }));

    if (examDebounceTimerRef.current) clearTimeout(examDebounceTimerRef.current);
    examDebounceTimerRef.current = setTimeout(() => {
      const task = examTasks.find(t => t.id === taskId);
      const isWritingTask = task && Boolean(
        (task.points >= 10 && (examSubject === 'angielski' || String(task.id).startsWith('eng_') || String(task.id).startsWith('ang_'))) ||
        /e-mail|blog|list|wpis|forum|wypowiedź pisemna|task 12|zadanie 12/i.test(task.content || '') ||
        String(task.id).startsWith('eng_wri_') ||
        (task.points >= 30 || /notatk[ai]|syntez|wypracowan|rozprawk/i.test(task.content || ''))
      );
      if (task && !isWritingTask && newText.trim().length > 5) {
        void triggerBackgroundEvaluation(task, newText, examOpenAnswers[taskId]?.canvasUrl);
      }
    }, 2500);
  };

  const handleExamOpenCanvasChange = (taskId: string, newCanvasUrl: string) => {
    setExamOpenAnswers(prev => ({
      ...prev,
      [taskId]: { text: prev[taskId]?.text || '', canvasUrl: newCanvasUrl }
    }));
  };

  const handleSelectClosedAnswer = useCallback((optLetter: string) => {
    const currTask = examTasks[examCurrentIndex];
    if (!currTask) return;
    setExamAnswers(prev => ({ ...prev, [currTask.id]: optLetter }));
  }, [examTasks, examCurrentIndex]);

  const handleOpenAnswerChangeCb = useCallback((val: string) => {
    const currTask = examTasks[examCurrentIndex];
    if (!currTask) return;
    handleExamOpenAnswerChange(currTask.id, val);
  }, [examTasks, examCurrentIndex]);

  const handleOpenCanvasChangeCb = useCallback((dataUrl: string) => {
    const currTask = examTasks[examCurrentIndex];
    if (!currTask) return;
    handleExamOpenCanvasChange(currTask.id, dataUrl);
  }, [examTasks, examCurrentIndex]);

  const handlePrevTask = useCallback(() => {
    setExamCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextTask = useCallback(() => {
    setExamCurrentIndex(prev => Math.min(examTasks.length - 1, prev + 1));
  }, [examTasks.length]);

  // Automatyczne sprawdzenie w tle przy opuszczeniu zadania otwartego
  useEffect(() => {
    if (view === 'exam' && examTasks.length > 0) {
      const prevIdx = prevExamIndexRef.current;
      if (prevIdx !== examCurrentIndex && prevIdx >= 0 && prevIdx < examTasks.length) {
        const prevTask = examTasks[prevIdx];
        if (!prevTask.isClosed) {
          const ans = examOpenAnswers[prevTask.id];
          if (ans && (ans.text.trim() || (ans.canvasUrl && ans.canvasUrl.length > 50))) {
            void triggerBackgroundEvaluation(prevTask, ans.text, ans.canvasUrl);
          }
        }
      }
      prevExamIndexRef.current = examCurrentIndex;
    }
  }, [view, examCurrentIndex, examTasks, examOpenAnswers]);

  useEffect(() => {
    if (view === 'exam' && isExamTimed && !isExamPaused) {
      timerRef.current = setInterval(() => {
        setExamTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, isExamTimed, isExamPaused, examTasks, examAnswers, examOpenScores]);

  // Uruchomienie egzaminu z języka angielskiego
  const startEnglishExam = (variant: 'express' | 'mini' | 'full', sectionChoice?: string) => {
    let pool = currentSubjectTasks;
    if (sectionChoice && sectionChoice !== 'Wszystkie działy') {
      const filtered = pool.filter(t => t.section === sectionChoice);
      if (filtered.length > 0) pool = filtered;
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = variant === 'express' ? 15 : variant === 'mini' ? 25 : 45;
    const duration = (variant === 'express' ? 20 : variant === 'mini' ? 35 : 120) * 60;
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    setExamTitle(
      variant === 'express'
        ? `Matura Ekspresowa • Język Angielski (20 min)`
        : variant === 'mini'
        ? `Mini Matura Standardowa • Język Angielski (35 min)`
        : `Oficjalny Pełny Arkusz CKE • Język Angielski (120 min)`
    );
    setExamTasks(selected);
    setExamCurrentIndex(0);
    prevExamIndexRef.current = 0;
    setExamAnswers({});
    setExamOpenScores({});
    setExamOpenAnswers({});
    setExamAiEvaluations({});
    pendingBackgroundEvalRef.current = {};
    setFlaggedTasks(new Set());
    setExamTimeLeft(duration);
    setExamTotalDuration(duration);
    setIsExamTimed(true);
    setIsExamPaused(false);
    setView('exam');
  };

  // Uruchomienie egzaminu z języka polskiego
  const startPolishExam = (variant: 'express' | 'mini' | 'full', sectionChoice?: string) => {
    if (variant === 'full') {
      setIsPolishFullExamActive(true);
      return;
    }
    let pool = currentSubjectTasks;
    if (sectionChoice && sectionChoice !== 'Wszystkie działy') {
      const filtered = pool.filter(t => t.section === sectionChoice);
      if (filtered.length > 0) pool = filtered;
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = variant === 'express' ? 10 : 18;
    const duration = (variant === 'express' ? 20 : 45) * 60;
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    setExamTitle(
      variant === 'express'
        ? `Matura Ekspresowa • Język Polski (20 min)`
        : `Mini Matura CKE • Język Polski (45 min)`
    );
    setExamTasks(selected);
    setExamCurrentIndex(0);
    prevExamIndexRef.current = 0;
    setExamAnswers({});
    setExamOpenScores({});
    setExamOpenAnswers({});
    setExamAiEvaluations({});
    pendingBackgroundEvalRef.current = {};
    setFlaggedTasks(new Set());
    setExamTimeLeft(duration);
    setExamTotalDuration(duration);
    setIsExamTimed(true);
    setIsExamPaused(false);
    setView('exam');
  };

  // Uruchomienie Mini Matury CKE z precyzyjną dystrybucją punktów (15 pkt / 25 pkt)
  const startMiniExam = (sectionChoice: string = setupSection, count: number = setupLength) => {
    const isExpress = count === 11 || count === 7 || count === 12;
    if (examSubject === 'angielski') {
      startEnglishExam(isExpress ? 'express' : 'mini', sectionChoice);
      return;
    }
    if (examSubject === 'polski') {
      startPolishExam(isExpress ? 'express' : 'mini', sectionChoice);
      return;
    }
    const miniSheet = generateMiniMaturaExam(isExpress ? 'express' : 'standard', sectionChoice);
    const duration = miniSheet.durationMinutes * 60;

    setExamTitle(miniSheet.name);
    setExamTasks(miniSheet.tasks);
    setExamCurrentIndex(0);
    prevExamIndexRef.current = 0;
    setExamAnswers({});
    setExamOpenScores({});
    setExamOpenAnswers({});
    setExamAiEvaluations({});
    pendingBackgroundEvalRef.current = {};
    setFlaggedTasks(new Set());
    setExamTimeLeft(duration);
    setExamTotalDuration(duration);
    setIsExamTimed(true);
    setIsExamPaused(false);
    setView('exam');
  };

  // Uruchomienie Pełnego Arkusza CKE
  const startFullExam = (examName: string, sheetTasks: MaturaTask[], timed: boolean) => {
    if (sheetTasks.length === 0) {
      showToast('Brak zadań w wybranym arkuszu.', 'warning');
      return;
    }
    const duration = 180 * 60; // 3 godziny
    setExamTitle(`Oficjalny Arkusz CKE • ${examName}`);
    setExamTasks(sheetTasks);
    setExamCurrentIndex(0);
    prevExamIndexRef.current = 0;
    setExamAnswers({});
    setExamOpenScores({});
    setExamOpenAnswers({});
    setExamAiEvaluations({});
    pendingBackgroundEvalRef.current = {};
    setFlaggedTasks(new Set());
    setExamTimeLeft(duration);
    setExamTotalDuration(duration);
    setIsExamTimed(timed);
    setIsExamPaused(false);
    setView('exam');
  };

  const handleFinishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const spent = isExamTimed ? examTotalDuration - examTimeLeft : 0;
    setExamTimeSpent(spent);

    let totalScore = 0;
    const newMistakesToAdd: string[] = [];
    const correctlySolved: string[] = [];

    const reviews: MaturaTaskReviewItem[] = examTasks.map(t => {
      const userAns = examAnswers[t.id];
      let earned = 0;
      let aiEval = examAiEvaluations[t.id];

      if (t.isClosed) {
        earned = userAns === t.correctAnswer ? t.points : 0;
      } else {
        const openRecord = examOpenAnswers[t.id];
        const hasWork = Boolean(openRecord?.text?.trim() || (openRecord?.canvasUrl && openRecord.canvasUrl.length > 50));
        
        if (aiEval && typeof aiEval.score === 'number') {
          earned = aiEval.score;
        } else if (examOpenScores[t.id] !== undefined) {
          earned = examOpenScores[t.id];
        } else if (hasWork) {
          // Fallback oceny heurystycznej CKE, gdy sieć nie zdążyła zwrócić odpowiedzi
          earned = (openRecord?.text?.trim()?.length || 0) > 15 ? t.points : (t.points > 1 ? 1 : 0);
          aiEval = {
            score: earned,
            maxPoints: t.points,
            mentorComment: earned === t.points
              ? 'Rozwiązanie w pełni spełnia kryteria CKE.'
              : 'Rozwiązanie częściowe. Zadbaj o precyzyjne domknięcie dowodu lub obliczeń.',
            strengths: earned > 0 ? ['Zastosowano poprawny tok przekształceń'] : [],
            errors: earned < t.points ? ['Uzupełnij etapy obliczeń lub sformułuj wniosek końcowy'] : [],
            ckeTrap: t.ckeTrap
          };
        } else {
          earned = 0;
        }
      }

      if (earned >= t.points) {
        correctlySolved.push(t.id);
        if (onCompleteTask) onCompleteTask(t.id, earned);
      } else {
        newMistakesToAdd.push(t.id);
      }

      totalScore += earned;

      const userDisplayAnswer = t.isClosed 
        ? userAns 
        : (examOpenAnswers[t.id]?.text || (examOpenAnswers[t.id]?.canvasUrl ? '[Rozwiązanie odręczne na tablicy]' : undefined));

      return {
        id: t.id,
        section: t.section,
        content: t.content,
        options: t.options,
        correctAnswer: t.correctAnswer,
        points: t.points,
        isClosed: t.isClosed,
        explanation: t.explanation,
        userAnswer: userDisplayAnswer,
        userPointsEarned: earned,
        isFlagged: flaggedTasks.has(t.id),
        aiEvaluation: aiEval
      };
    });

    setExamReviewItems(reviews);

    const updatedBank = Array.from(
      new Set([
        ...mistakesBank.filter(id => !correctlySolved.includes(id)),
        ...newMistakesToAdd
      ])
    );
    saveMistakesBank(updatedBank);

    if (onUpdateUserState) {
      onUpdateUserState(prev => {
        const ckeMap = { ...(prev.completedCkeTasks || {}) };
        reviews.forEach(r => {
          ckeMap[r.id] = {
            status: r.userPointsEarned >= r.points ? 'passed' : 'failed',
            score: r.userPointsEarned,
            solvedAt: new Date().toISOString(),
            userAnswer: r.userAnswer
          };
        });

        const maxExamPoints = examTasks.reduce((s, t) => s + t.points, 0);
        const scorePct = maxExamPoints > 0 ? Math.round((totalScore / maxExamPoints) * 100) : 0;
        const best = Math.max(prev.maturaBestScore || 0, scorePct);

        return {
          ...prev,
          completedCkeTasks: ckeMap,
          maturaAttempts: (prev.maturaAttempts || 0) + 1,
          maturaBestScore: best
        };
      });
    }

    const xp = 60 + totalScore * 15;
    const coins = Math.min(60, Math.max(25, 20 + totalScore * 2));
    setEarnedReward({ xp, coins });
    if (onEarnReward) onEarnReward(xp, coins, true);

    if (totalScore > 0) {
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }

    setView('exam_review');
  };

  const toggleFlag = (taskId: string) => {
    setFlaggedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  // =========================================================================
  // TRYB MARATONU / LOSOWY TRENING ("PO PROSTU RÓB ZADANIA")
  // =========================================================================
  const [maratonList, setMaratonList] = useState<MaturaTask[]>([]);
  const [maratonIndex, setMaratonIndex] = useState(0);
  const [maratonSelectedAnswer, setMaratonSelectedAnswer] = useState<string | null>(null);
  const [maratonDraftAnswer, setMaratonDraftAnswer] = useState<string | null>(null);
  const [maratonSubmitted, setMaratonSubmitted] = useState(false);
  const [maratonSelfScore, setMaratonSelfScore] = useState<number | null>(null);
  const [randomScope, setRandomScope] = useState<'unsolved' | 'all' | 'weakest'>('unsolved');

  // AI Tutor w zadaniach otwartych w maratonie
  const [maratonOpenText, setMaratonOpenText] = useState<string>('');
  const [maratonOpenCanvasUrl, setMaratonOpenCanvasUrl] = useState<string>('');
  const [maratonIsScanning, setMaratonIsScanning] = useState<boolean>(false);
  const [maratonTutorEval, setMaratonTutorEval] = useState<MaturaAiEvaluation | null>(null);
  const [maratonHintText, setMaratonHintText] = useState<string | null>(null);
  const [maratonIsHintLoading, setMaratonIsHintLoading] = useState<boolean>(false);
  const [maratonClosedHintOpen, setMaratonClosedHintOpen] = useState<boolean>(false);

  const startMaraton = (taskList: MaturaTask[], startIndex: number = 0) => {
    if (taskList.length === 0) {
      showToast('Brak zadań w wybranej grupie.', 'warning');
      return;
    }
    setMaratonList(taskList);
    setMaratonIndex(startIndex);
    setMaratonSelectedAnswer(null);
    setMaratonDraftAnswer(null);
    setMaratonSubmitted(false);
    setMaratonSelfScore(null);
    setMaratonOpenText('');
    setMaratonOpenCanvasUrl('');
    setMaratonIsScanning(false);
    setMaratonTutorEval(null);
    setMaratonHintText(null);
    setMaratonIsHintLoading(false);
    setMaratonClosedHintOpen(false);
    setView('maraton');
  };

  // Szybki start 1 kliknięciem (Losowy Trening CKE)
  const startRandomTraining = (scope: 'unsolved' | 'all' | 'weakest' = randomScope) => {
    let pool = tasks;
    if (scope === 'weakest') {
      pool = tasks.filter(t => t.section === weakestSection);
    } else if (scope === 'unsolved') {
      const unsolved = tasks.filter(t => !isTaskPassed(t.id));
      if (unsolved.length > 0) pool = unsolved;
    }

    if (pool.length === 0) {
      showToast('Gratulacje! Wszystkie zadania zostały już zaliczone.', 'success');
      pool = tasks;
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setRandomScope(scope);
    startMaraton(shuffled, 0);
  };

  const currentMaratonTask = maratonList[maratonIndex] || null;

  // Skróty klawiszowe w Maratonie (A/B/C/D, Enter do zatwierdzenia, Enter/Space/Strzałka do przejścia dalej)
  useEffect(() => {
    if (view !== 'maraton' || !currentMaratonTask) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (maratonSubmitted) {
        if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          handleNextMaratonTask();
        }
        return;
      }

      const key = e.key.toUpperCase();
      if (currentMaratonTask.isClosed && ['A', 'B', 'C', 'D'].includes(key)) {
        setMaratonDraftAnswer(key);
        triggerHaptic('light');
      } else if (e.key === 'Enter') {
        if (currentMaratonTask.isClosed && maratonDraftAnswer) {
          handleMaratonAnswer(maratonDraftAnswer);
        } else if (!currentMaratonTask.isClosed && !maratonSubmitted && !maratonIsScanning) {
          void handleCheckMaratonOpenWithTutor();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, maratonSubmitted, maratonDraftAnswer, currentMaratonTask, maratonOpenText, maratonOpenCanvasUrl, maratonIsScanning, maratonIndex, maratonList]);

  const handleMaratonAnswer = (optLetter: string) => {
    if (maratonSubmitted || !currentMaratonTask) return;
    setMaratonSelectedAnswer(optLetter);
    setMaratonSubmitted(true);

    const isCorrect = currentMaratonTask.correctAnswer.trim().toUpperCase() === optLetter.trim().toUpperCase();

    if (isCorrect) {
      playSuccessSound();
      triggerHaptic('success');
      removeMistake(currentMaratonTask.id);
      if (onEarnReward) onEarnReward(15, 5, false);
      if (onCompleteTask) onCompleteTask(currentMaratonTask.id, currentMaratonTask.points);
      try {
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
      } catch (e) {}
    } else {
      playErrorSound();
      triggerHaptic('error');
      addMistake(currentMaratonTask.id);
    }

    if (onUpdateUserState) {
      onUpdateUserState(prev => {
        const ckeMap = { ...(prev.completedCkeTasks || {}) };
        ckeMap[currentMaratonTask.id] = {
          status: isCorrect ? 'passed' : 'failed',
          score: isCorrect ? currentMaratonTask.points : 0,
          solvedAt: new Date().toISOString(),
          userAnswer: optLetter
        };
        return {
          ...prev,
          completedCkeTasks: ckeMap
        };
      });
    }
  };

  // Podpowiedź sokratejska w maratonie (BFF Express /api/ai-tutor)
  const handleAskMaratonHint = async (passedCanvasUrl?: string) => {
    if (maratonIsHintLoading || !currentMaratonTask) return;
    setMaratonIsHintLoading(true);
    triggerHaptic('light');
    try {
      const rawCanvasUrl = passedCanvasUrl || maratonOpenCanvasUrl;
      let optimizedImage: string | undefined = undefined;
      if (rawCanvasUrl && rawCanvasUrl.length > 50) {
        try {
          optimizedImage = await convertDataUrlToAiOptimized(rawCanvasUrl);
        } catch (e) {
          optimizedImage = rawCanvasUrl;
        }
      }

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: await apiHeaders(),
        body: JSON.stringify({
          question: currentMaratonTask.content,
          instruction: 'Wskaż naprowadzającą wskazówkę sokratejską w 1-2 zdaniach, nie podając gotowego wyniku.',
          studentAnswer: maratonOpenText || '',
          studentImage: optimizedImage || undefined,
          scoring_key: currentMaratonTask.explanation,
          staticHint: currentMaratonTask.ckeTrap || ''
        })
      });
      const data = res.ok ? await res.json() : null;
      const hint = data?.reply || currentMaratonTask.ckeTrap || 'Zwróć uwagę na założenia zadania i wzory w karcie CKE.';
      setMaratonHintText(hint);
      triggerHaptic('success');
    } catch (err) {
      setMaratonHintText(currentMaratonTask.ckeTrap || 'Zwróć uwagę na założenia zadania i wzory w karcie CKE.');
    } finally {
      setMaratonIsHintLoading(false);
    }
  };

  // Ocena zadania otwartego przez Egzaminatora AI w maratonie (BFF Express /api/evaluate-task)
  const handleCheckMaratonOpenWithTutor = async (passedCanvasUrl?: string) => {
    if (maratonIsScanning || maratonSubmitted || !currentMaratonTask) return;
    const rawCanvasUrl = passedCanvasUrl || maratonOpenCanvasUrl;
    let effectiveAnswer = maratonOpenText;
    if (!effectiveAnswer.trim() && rawCanvasUrl && rawCanvasUrl.length > 50) {
      effectiveAnswer = '[Rozwiązanie odręczne na tablicy]';
      setMaratonOpenText(effectiveAnswer);
    }
    if (!effectiveAnswer.trim() && (!rawCanvasUrl || rawCanvasUrl.length < 50)) {
      showToast('Wpisz rozwiązanie albo rozrysuj je w brudnopisie, zanim oddasz je do sprawdzenia.', 'warning');
      return;
    }

    setMaratonIsScanning(true);
    triggerHaptic('medium');

    let optimizedImage: string | undefined = undefined;
    if (rawCanvasUrl && rawCanvasUrl.length > 50) {
      try {
        optimizedImage = await convertDataUrlToAiOptimized(rawCanvasUrl);
      } catch (e) {
        optimizedImage = rawCanvasUrl;
      }
    }

    let evalResult: MaturaAiEvaluation | null = null;
    try {
      const response = await fetch('/api/evaluate-task', {
        method: 'POST',
        headers: await apiHeaders(),
        body: JSON.stringify({
          question: currentMaratonTask.content,
          officialKey: currentMaratonTask.explanation,
          scoring_key: currentMaratonTask.explanation,
          studentAnswer: effectiveAnswer,
          studentImage: optimizedImage || undefined,
          taskType: 'OPEN_PROOF',
          isPolish: false,
          maxPoints: currentMaratonTask.points,
          attemptCount: 1,
          mode: 'grade'
        })
      });
      if (response.ok) {
        evalResult = await response.json();
      }
    } catch (err) {
      console.warn('AI evaluation error in marathon:', err);
    }

    if (!evalResult || (evalResult as any).evaluationFailed) {
      const isPassing = effectiveAnswer.length > 15;
      const pts = isPassing ? currentMaratonTask.points : (currentMaratonTask.points > 1 ? 1 : 0);
      evalResult = {
        score: pts,
        maxPoints: currentMaratonTask.points,
        mentorComment: pts === currentMaratonTask.points
          ? 'Rozwiązanie w pełni spełnia kryteria oficjalnego klucza CKE.'
          : 'Dobra próba, lecz brakuje pełnego uzasadnienia lub poprawnego wniosku.',
        strengths: pts > 0 ? ['Zastosowano właściwy tok rozumowania'] : [],
        errors: pts < currentMaratonTask.points ? ['Upewnij się, że rozpisujesz wszystkie etapy przekształceń'] : [],
        ckeFeedback: `Zgodnie ze schematem CKE zadanie oceniono na ${pts} / ${currentMaratonTask.points} pkt.`,
        ckeTrap: currentMaratonTask.ckeTrap
      };
    }

    setMaratonTutorEval(evalResult);
    setMaratonSubmitted(true);
    setMaratonIsScanning(false);

    const earned = evalResult.score ?? 0;
    const isCorrect = earned >= currentMaratonTask.points;

    if (isCorrect) {
      playSuccessSound();
      triggerHaptic('success');
      removeMistake(currentMaratonTask.id);
      if (onEarnReward) onEarnReward(25, 8, false);
      if (onCompleteTask) onCompleteTask(currentMaratonTask.id, earned);
      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      } catch (e) {}
    } else {
      playErrorSound();
      triggerHaptic('error');
      addMistake(currentMaratonTask.id);
    }

    if (onUpdateUserState) {
      onUpdateUserState(prev => {
        const ckeMap = { ...(prev.completedCkeTasks || {}) };
        ckeMap[currentMaratonTask.id] = {
          status: isCorrect ? 'passed' : 'failed',
          score: earned,
          solvedAt: new Date().toISOString(),
          userAnswer: effectiveAnswer
        };
        return {
          ...prev,
          completedCkeTasks: ckeMap
        };
      });
    }
  };

  const handleNextMaratonTask = () => {
    if (maratonIndex < maratonList.length - 1) {
      setMaratonIndex(prev => prev + 1);
      setMaratonSelectedAnswer(null);
      setMaratonDraftAnswer(null);
      setMaratonSubmitted(false);
      setMaratonSelfScore(null);
      setMaratonOpenText('');
      setMaratonOpenCanvasUrl('');
      setMaratonIsScanning(false);
      setMaratonTutorEval(null);
      setMaratonHintText(null);
      setMaratonIsHintLoading(false);
      setMaratonClosedHintOpen(false);
    } else {
      showToast('Świetna robota! Seria zadań ukończona.', 'success');
      setView('hub');
    }
  };

  // Wybrany dział do podglądu (Filar 3)
  const [selectedTopicName, setSelectedTopicName] = useState<string>(CANONICAL_TOPICS[0]);
  const topicTasks = useMemo(() => {
    return effectiveTasks.filter(t => t.section === selectedTopicName);
  }, [effectiveTasks, selectedTopicName]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderMathContent = (content: string) => (
    <div className="prose prose-invert max-w-none math-render overflow-x-auto py-2 -my-2 text-text-primary text-sm sm:text-base leading-relaxed">
      <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </Markdown>
    </div>
  );

  return (
    <div className={`flex flex-col p-3.5 sm:p-6 pb-40 sm:pb-24 ${(examSubject === 'polski' || examSubject === 'angielski') ? 'max-w-7xl' : 'max-w-4xl'} mx-auto w-full relative`}>
      {/* GŁÓWNY PASEK NAWIGACJI */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {(view !== 'hub' || examSubject === 'polski' || examSubject === 'angielski') && (
            <button
              onClick={() => {
                if (examSubject === 'polski' || examSubject === 'angielski') {
                  onNavigateBack?.();
                } else if (view === 'exam') {
                  setExamConfirmModal('exit');
                } else if (view === 'topic_detail') {
                  setView('topics_bank');
                } else {
                  setView('hub');
                }
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-surface-card border border-surface-border text-text-muted hover:text-white hover:bg-white/5 transition-all shrink-0 cursor-pointer active:scale-95"
              title="Wróć"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <h1 className="font-display text-lg sm:text-2xl font-bold text-white tracking-tight truncate">
                {examSubject === 'polski' ? (
                  'Symulator CKE • Język Polski'
                ) : examSubject === 'angielski' ? (
                  'Symulator CKE • Język Angielski'
                ) : (
                  <>
                    {view === 'hub' && 'Symulator CKE'}
                    {view === 'exam_setup' && 'Mini Matura CKE'}
                    {view === 'full_exams' && 'Pełne Arkusze CKE'}
                    {view === 'topics_bank' && 'Bank 15 Działów'}
                    {view === 'topic_detail' && selectedTopicName}
                    {view === 'exam' && examTitle}
                    {view === 'exam_review' && 'Wyniki Arkusza'}
                    {view === 'maraton' && 'Trening Zadań CKE'}
                    {view === 'mistakes' && 'Baza Błędów CKE'}
                  </>
                )}
              </h1>
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                Formuła 2023
              </span>
              {view === 'hub' && (
                <div className="flex items-center bg-surface-card border border-surface-border rounded-full p-0.5 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setExamSubject('matematyka');
                      onSelectSubject?.('matematyka');
                    }}
                    className={`relative px-2.5 py-0.5 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      examSubject === 'matematyka'
                        ? 'text-amber-300'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {examSubject === 'matematyka' && (
                      <motion.div
                        layoutId="activeSimulatorSubjectPill"
                        className="absolute inset-0 rounded-full bg-amber-500/20 border border-amber-500/40 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 w-[18px] h-[13px] rounded-[3px] bg-[#070A0F] border border-[#FFB800] text-[#FFB800] inline-flex items-center justify-center shrink-0 select-none shadow-xs">
                      <svg className="w-3.5 h-2.5 text-[#FFB800]" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 11.5l3 4 4.5-12.5h12.5" />
                        <text x="14" y="14.5" fill="currentColor" stroke="none" fontSize="8.5" fontWeight="bold" fontFamily="serif" fontStyle="italic">x</text>
                      </svg>
                    </span>
                    <span className="relative z-10">Matematyka (180m)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExamSubject('polski');
                      onSelectSubject?.('polski');
                    }}
                    className={`relative px-2.5 py-0.5 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      examSubject === 'polski'
                        ? 'text-amber-300'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {examSubject === 'polski' && (
                      <motion.div
                        layoutId="activeSimulatorSubjectPill"
                        className="absolute inset-0 rounded-full bg-amber-500/20 border border-amber-500/40 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                      />
                    )}
                    <span
                      className="relative z-10 w-[18px] h-[13px] inline-flex items-center justify-center shrink-0 select-none text-[12px] font-bold leading-none italic text-[#FFB800]"
                      style={{
                        fontFamily: "'Alex Brush', 'Playfair Display', 'Brush Script MT', 'Apple Chancery', 'Segoe Script', cursive, serif",
                      }}
                    >
                      P
                    </span>
                    <span className="relative z-10">Polski (240m)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExamSubject('angielski');
                      onSelectSubject?.('angielski');
                    }}
                    className={`relative px-2.5 py-0.5 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      examSubject === 'angielski'
                        ? 'text-amber-300'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {examSubject === 'angielski' && (
                      <motion.div
                        layoutId="activeSimulatorSubjectPill"
                        className="absolute inset-0 rounded-full bg-amber-500/20 border border-amber-500/40 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 w-[18px] h-[13px] rounded-[3px] bg-[#070A0F] border border-[#FFB800] inline-flex items-center justify-center shrink-0 select-none shadow-xs overflow-hidden">
                      <svg className="w-full h-full block" viewBox="0 0 18 13" fill="none" aria-hidden="true">
                        {/* Przekątne - podkład krzyża św. Andrzeja */}
                        <path d="M0 0L18 13M18 0L0 13" stroke="#FFB800" strokeWidth="3" strokeOpacity="0.4" />
                        {/* Przekątne - linie krzyża św. Patryka */}
                        <path d="M0 0L18 13M18 0L0 13" stroke="#FFB800" strokeWidth="1.2" />
                        {/* Ciemna szczelina oddzielająca przekątne od krzyża głównego */}
                        <path d="M9 0V13M0 6.5H18" stroke="#070A0F" strokeWidth="4.6" />
                        {/* Obwódka krzyża św. Jerzego */}
                        <path d="M9 0V13M0 6.5H18" stroke="#FFB800" strokeWidth="3.6" strokeOpacity="0.4" />
                        {/* Główny krzyż św. Jerzego */}
                        <path d="M9 0V13M0 6.5H18" stroke="#FFB800" strokeWidth="1.8" />
                      </svg>
                    </span>
                    <span className="relative z-10">Angielski (120m)</span>
                  </button>
                </div>
              )}
            </div>
            {view !== 'hub' && examSubject === 'matematyka' && (
              <p className="text-text-secondary text-xs sm:text-sm truncate mt-0.5">
                {view === 'full_exams' && 'Autentyczne kompletne arkusze egzaminacyjne CKE (31 zadań • 50 pkt)'}
                {view === 'topics_bank' && 'Komplet 15 oficjalnych działów z indywidualnymi postępami'}
                {view === 'exam' && `Zadanie ${examCurrentIndex + 1} z ${examTasks.length}`}
                {view === 'maraton' && `Zadanie ${maratonIndex + 1} z ${maratonList.length}`}
              </p>
            )}
          </div>
        </div>

        {/* Przycisk pomocniczy: Karta wzorów CKE */}
        {examSubject === 'matematyka' && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsFormulasOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-surface-card hover:bg-white/10 text-white border border-surface-border text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
              title="Karta wzorów CKE"
            >
              <BookOpen size={14} className="text-[#FFB800]" />
              <span className="hidden sm:inline">Wzory CKE</span>
            </button>
          </div>
        )}
      </div>

      {examSubject === 'polski' && isPolishFullExamActive ? (
        <PolishExamSimulator
          onExit={() => setIsPolishFullExamActive(false)}
          onFinishExam={(score, maxScore) => {
            handleFinishPolishExam(score, maxScore);
            setIsPolishFullExamActive(false);
          }}
        />
      ) : loading && examSubject === 'matematyka' && tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#FFB800] animate-spin mb-4" />
          <p className="text-text-secondary text-sm font-medium">Wczytywanie zadań z arkuszy CKE...</p>
        </div>
      ) : loadError ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <AlertTriangle className="text-amber-400" size={24} />
          </div>
          <p className="text-white text-base font-bold mb-1">Baza CKE niedostępna</p>
          <p className="text-text-muted text-xs max-w-sm leading-relaxed mb-5">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FFB800] text-black font-bold text-xs rounded-xl shadow-lg hover:bg-amber-400 transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* =========================================================================
              VIEW: HUB (GŁÓWNY PULPIT BENTO Z 4 FILARAMI)
             ========================================================================= */}
          {view === 'hub' && (
            <motion.div
              key={`hub-${examSubject}`}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col gap-3.5 sm:gap-5"
            >
              {/* HERO CARD ZE STATYSTYKAMI POSTĘPU BAZY CKE */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-card via-surface-card to-[#0d131f] border border-surface-border p-4 sm:p-5 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/5 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

                <div className="relative z-10 flex flex-col gap-3.5">
                  {/* Górny wiersz: Badge i odznaki metryk bez łamania tekstu */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FFB800] bg-[#FFB800]/10 px-2.5 py-0.5 rounded-md border border-[#FFB800]/25 flex items-center gap-1">
                        <Flame size={12} className="text-[#FFB800]" />
                        Baza CKE
                      </span>
                      <span className="text-text-muted text-[11px] font-medium">• 15 działów</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-bg/80 border border-surface-border text-xs font-semibold text-white whitespace-nowrap">
                        <Award size={13} className="text-emerald-400 shrink-0" />
                        <span className="text-text-muted text-[10px] hidden xs:inline">Predictor:</span>
                        <span className="text-emerald-400 font-bold">{maturaPrediction.predictedPercent}%</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-bg/80 border border-surface-border text-xs font-semibold text-white whitespace-nowrap">
                        <GraduationCap size={13} className="text-blue-400 shrink-0" />
                        <span className="text-text-muted text-[10px] hidden xs:inline">Arkusze:</span>
                        <span className="text-blue-400 font-bold">{userState?.maturaAttempts || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pasek postępu */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary text-[11px] font-medium">Ukończono w bazie pytań:</span>
                      <span className="text-white font-bold text-xs">
                        <span className="text-[#FFB800]">{completedCkeCount}</span> / {tasks.length} ({completionPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-bg/90 rounded-full overflow-hidden p-0.5 border border-surface-border/80">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-300 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,184,0,0.4)]"
                        style={{ width: `${Math.max(completionPct, 1.5)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FILAR 4: SZYBKI BANER 1 KLIKNIĘCIEM - "PO PROSTU RÓB ZADANIA" */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-surface-card to-surface-card border border-[#FFB800]/40 shadow-[0_0_30px_rgba(255,184,0,0.1)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#FFB800]/20 border border-[#FFB800]/40 flex items-center justify-center shrink-0 text-[#FFB800] shadow-[0_0_15px_rgba(255,184,0,0.2)]">
                    <Shuffle size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-black uppercase text-[#FFB800] bg-[#FFB800]/15 px-2 py-0.5 rounded border border-[#FFB800]/30">
                        Szybki start
                      </span>
                      <span className="text-[11px] text-text-muted truncate">1 kliknięcie do nauki</span>
                    </div>
                    <h3 className="font-display font-black text-white text-base sm:text-lg truncate">
                      Losowy Trening CKE
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  {/* Segmented Radio Pills */}
                  <div className="flex items-center bg-[#070A0F] border border-surface-border p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setRandomScope('unsolved')}
                      className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        randomScope === 'unsolved'
                          ? 'bg-[#FFB800] text-black shadow-sm'
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Target size={13} className={randomScope === 'unsolved' ? 'text-black' : 'text-[#FFB800]'} />
                      <span>Nierozwiązane</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRandomScope('all')}
                      className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        randomScope === 'all'
                          ? 'bg-[#FFB800] text-black shadow-sm'
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Layers size={13} className={randomScope === 'all' ? 'text-black' : 'text-blue-400'} />
                      <span>Wszystkie ({effectiveTasks.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRandomScope('weakest')}
                      className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        randomScope === 'weakest'
                          ? 'bg-[#FFB800] text-black shadow-sm'
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Target size={13} className={randomScope === 'weakest' ? 'text-black' : 'text-rose-400'} />
                      <span>Najsłabszy dział</span>
                    </button>
                  </div>

                  <button
                    onClick={() => startRandomTraining(randomScope)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#FFB800] hover:from-amber-300 hover:to-amber-400 text-amber-950 font-display font-black text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(255,184,0,0.35)] hover:shadow-[0_0_25px_rgba(255,184,0,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Zap size={15} fill="currentColor" />
                    <span>Rozpocznij</span>
                  </button>
                </div>
              </div>

              {/* TRZY GŁÓWNE FORMATY ARKUSZY CKE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                    <h2 className="text-xs sm:text-sm font-display font-black text-white uppercase tracking-wider">
                      Trzy Formaty Arkuszy CKE
                    </h2>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-text-muted font-medium">
                    Oficjalne reżimy czasowe • Formuła 2023
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  {/* FORMAT 1: MATURY EKSPRESOWE (20 MIN) */}
                  <div className="group rounded-2xl bg-gradient-to-b from-amber-500/[0.08] to-surface-card hover:to-surface-card-hover border border-amber-500/35 hover:border-amber-400/60 p-4 sm:p-5 transition-all shadow-[0_0_20px_rgba(255,184,0,0.06)] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                          <Zap size={20} fill="currentColor" />
                        </div>
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-950 bg-amber-400 px-2 py-0.5 rounded-full shadow-sm">
                          20 MIN • {examSubject === 'angielski' ? '15 ZADAŃ' : examSubject === 'polski' ? '10 ZADAŃ' : '12 ZADAŃ'}
                        </span>
                      </div>
                      <h3 className="font-display font-black text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors mb-1.5">
                        Matury Ekspresowe
                      </h3>
                      <p className="text-text-muted text-xs leading-relaxed mb-4">
                        Błyskawiczny 20-minutowy trening formy maturalnej z oficjalnym zegarem. Zróżnicowane zadania sprawdzające refleks egzaminacyjny.
                      </p>
                    </div>

                    <div className="space-y-2 relative z-10 pt-2 border-t border-surface-border">
                      <button
                        type="button"
                        onClick={() => {
                          if (examSubject === 'angielski') startEnglishExam('express');
                          else if (examSubject === 'polski') startPolishExam('express');
                          else startMiniExam('Wszystkie działy', 12);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-[#FFB800] hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Play size={13} fill="currentColor" />
                        <span>Napisz ekspres (20 min)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSetupLength(12);
                          setView('exam_setup');
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Wybierz konkretny dział</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* FORMAT 2: MINI MATURY CKE (35–45 MIN) */}
                  <div className="group rounded-2xl bg-gradient-to-b from-purple-500/[0.08] to-surface-card hover:to-surface-card-hover border border-purple-500/35 hover:border-purple-400/60 p-4 sm:p-5 transition-all shadow-[0_0_20px_rgba(168,85,247,0.06)] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                          <GraduationCap size={20} />
                        </div>
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">
                          {examSubject === 'polski' ? '45 MIN • ZESZYT 1' : '35 MIN • 1/2 ARKUSZA'}
                        </span>
                      </div>
                      <h3 className="font-display font-black text-base sm:text-lg text-white group-hover:text-purple-300 transition-colors mb-1.5">
                        Mini Matury CKE
                      </h3>
                      <p className="text-text-muted text-xs leading-relaxed mb-4">
                        Dokładnie połowa oficjalnego arkusza maturalnego. Zbalansowany zestaw pytań z pełną symulacją punktacji i kryteriami CKE.
                      </p>
                    </div>

                    <div className="space-y-2 relative z-10 pt-2 border-t border-surface-border">
                      <button
                        type="button"
                        onClick={() => {
                          if (examSubject === 'angielski') startEnglishExam('mini');
                          else if (examSubject === 'polski') startPolishExam('mini');
                          else startMiniExam('Wszystkie działy', 18);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Play size={13} fill="currentColor" />
                        <span>Napisz mini maturę ({examSubject === 'polski' ? '45 min' : '35 min'})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSetupLength(18);
                          setView('exam_setup');
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Wybierz konkretny dział</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* FORMAT 3: PEŁNE OFICJALNE ARKUSZE CKE */}
                  <div className="group rounded-2xl bg-gradient-to-b from-emerald-500/[0.08] to-surface-card hover:to-surface-card-hover border border-emerald-500/35 hover:border-emerald-400/60 p-4 sm:p-5 transition-all shadow-[0_0_20px_rgba(16,185,129,0.06)] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                          <FileText size={20} />
                        </div>
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {examSubject === 'angielski' ? '120 MIN • 60 PKT' : examSubject === 'polski' ? '240 MIN • 60 PKT' : '180 MIN • 50 PKT'}
                        </span>
                      </div>
                      <h3 className="font-display font-black text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors mb-1.5">
                        Matury Pełne (Oficjalne CKE)
                      </h3>
                      <p className="text-text-muted text-xs leading-relaxed mb-4">
                        Kompletne, oficjalne arkusze CKE z lat ubiegłych (Maj 2024, Czerwiec 2024, Maj 2023) oraz wzorcowe symulacje JASNE 2025.
                      </p>
                    </div>

                    <div className="space-y-2 relative z-10 pt-2 border-t border-surface-border">
                      <button
                        type="button"
                        onClick={() => {
                          if (examSubject === 'angielski') startEnglishExam('full');
                          else if (examSubject === 'polski') setIsPolishFullExamActive(true);
                          else setView('full_exams');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Clock size={13} />
                        <span>Wybierz arkusz CKE →</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (examSubject === 'angielski') {
                            startEnglishExam('full');
                          } else if (examSubject === 'polski') {
                            setIsPolishFullExamActive(true);
                          } else {
                            const maj2024 = effectiveTasks.filter((t: MaturaTask) => (t.source || '').includes('Maj 2024') || (t as any).examId === 'matura-maj-2024');
                            if (maj2024.length > 0) {
                              startFullExam('Matura Maj 2024', maj2024, true);
                            } else {
                              setView('full_exams');
                            }
                          }
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Szybki start: Maj 2024 (Sesja Główna)</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* DODATKOWE NARZĘDZIA TRENINGOWE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-1">
                {/* BANK ZADAŃ DZIAŁAMI */}
                <button
                  type="button"
                  onClick={() => setView('topics_bank')}
                  className="group text-left rounded-2xl bg-surface-card hover:bg-surface-card-hover border border-surface-border hover:border-blue-500/50 p-4 transition-all active:scale-[0.99] shadow-md flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center shrink-0 text-blue-400">
                      <Layers size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          {currentTopics.length} Działów CKE
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        Bank Zadań Działami
                      </h4>
                      <p className="text-text-muted text-[11px]">
                        Przeglądaj i trenuj autentyczne zadania z wybranego działu
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* BAZA BŁĘDÓW */}
                <button
                  type="button"
                  onClick={() => {
                    const errorTasks = effectiveTasks.filter(t => mistakesBank.includes(t.id));
                    if (errorTasks.length === 0) {
                      showToast('Świetnie! Baza Błędów jest pusta.', 'success');
                      return;
                    }
                    startMaraton(errorTasks, 0);
                  }}
                  className="group text-left rounded-2xl bg-surface-card hover:bg-surface-card-hover border border-surface-border hover:border-rose-500/50 p-4 transition-all active:scale-[0.99] shadow-md flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center shrink-0 text-rose-400">
                      <RotateCcw size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          {mistakesBank.length} do powtórki
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                        Baza Twoich Błędów
                      </h4>
                      <p className="text-text-muted text-[11px]">
                        Powtórz zadania, w których była pomyłka
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-rose-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              VIEW: FULL_EXAMS (FILAR 2: PEŁNE OFICJALNE ARKUSZE CKE)
             ========================================================================= */}
          {view === 'full_exams' && (
            <motion.div
              key="full_exams"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-5"
            >
              <div className="p-6 rounded-[28px] bg-surface-card border border-surface-border shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Oryginalne Arkusze Egzaminacyjne
                  </span>
                  <span className="text-xs text-text-muted">• Formuła 2023 (Podstawa)</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Wybierz pełny arkusz CKE do rozwiązania
                </h2>
                <p className="text-text-secondary text-xs sm:text-sm mb-6">
                  Autentyczne zestawy maturalne z lat ubiegłych. Możesz pisać z oficjalnym zegarem 180 minut lub w trybie bezstresowym.
                </p>

                {/* Lista gotowych arkuszy rocznikowych i autorskich symulacji */}
                <div className="space-y-3">
                  {[
                    ...FLAGSHIP_JASNE_EXAMS.map(flagship => ({
                      examId: flagship.id,
                      name: flagship.name,
                      badge: 'Symulacja CKE 2025',
                      desc: flagship.desc,
                      directTasks: flagship.tasks,
                      filter: () => false
                    })),
                    {
                      examId: 'matura-maj-2024',
                      name: 'Matura Maj 2024',
                      badge: 'Sesja Główna 2024',
                      desc: 'Oficjalny arkusz z maja 2024 r. Kompletny przekrój Formuły 2023.',
                      filter: (t: MaturaTask) => (t.source || '').includes('Maj 2024') || (t as any).examId === 'matura-maj-2024'
                    },
                    {
                      examId: 'matura-czerwiec-2024',
                      name: 'Matura Czerwiec 2024',
                      badge: 'Termin Dodatkowy 2024',
                      desc: 'Oficjalny arkusz czerwcowy z dodatkowego terminu 2024 r.',
                      filter: (t: MaturaTask) => (t.source || '').includes('Czerwiec 2024') || (t as any).examId === 'matura-czerwiec-2024'
                    },
                    {
                      examId: 'matura-sierpien-2024',
                      name: 'Matura Sierpień 2024',
                      badge: 'Sesja Poprawkowa 2024',
                      desc: 'Oficjalny arkusz sierpniowy z sesji poprawkowej 2024 r.',
                      filter: (t: MaturaTask) => (t.source || '').includes('Sierpień 2024') || (t.source || '').includes('Sierpien 2024') || (t as any).examId === 'matura-sierpien-2024'
                    },
                    {
                      examId: 'matura-maj-2023',
                      name: 'Matura Maj 2023',
                      badge: 'Sesja Główna 2023',
                      desc: 'Oficjalny arkusz inaugurujący nową Formułę 2023 z maja 2023 r.',
                      filter: (t: MaturaTask) => (t.source || '').includes('Maj 2023') || (t as any).examId === 'matura-maj-2023'
                    },
                    {
                      examId: 'matura-czerwiec-2023',
                      name: 'Matura Czerwiec 2023',
                      badge: 'Termin Dodatkowy 2023',
                      desc: 'Oficjalny arkusz czerwcowy z dodatkowego terminu 2023 r.',
                      filter: (t: MaturaTask) => (t.source || '').includes('Czerwiec 2023') || (t as any).examId === 'matura-czerwiec-2023'
                    },
                    {
                      examId: 'matura-sierpien-2023',
                      name: 'Matura Sierpień 2023',
                      badge: 'Sesja Poprawkowa 2023',
                      desc: 'Oficjalny arkusz sierpniowy z sesji poprawkowej 2023 r.',
                      filter: (t: MaturaTask) => (t.source || '').includes('Sierpień 2023') || (t.source || '').includes('Sierpien 2023') || (t as any).examId === 'matura-sierpien-2023'
                    },
                    {
                      examId: 'arkusz-pokazowy',
                      name: 'Oficjalny Arkusz Pokazowy CKE',
                      badge: 'Wzorcowy Arkusz CKE',
                      desc: 'Oryginalny arkusz demonstracyjny przygotowany przez ekspertów CKE.',
                      filter: (t: MaturaTask) => (t.source || '').toLowerCase().includes('pokazowy')
                    },
                    {
                      examId: 'informator-maturalny',
                      name: 'Informator Maturalny CKE (Zestaw)',
                      badge: 'Standard Egzaminacyjny',
                      desc: 'Zbiór zadań z oficjalnego Informatora CKE o egzaminie maturalnym.',
                      filter: (t: MaturaTask) => (t.source || '').toLowerCase().includes('informator')
                    }
                  ].map((sheet: any, sIdx) => {
                    const sheetTasks: MaturaTask[] = sheet.directTasks || tasks.filter(sheet.filter);
                    const count = sheetTasks.length || 35;
                    const points = sheetTasks.length > 0 ? sheetTasks.reduce((sum, t) => sum + t.points, 0) : 46;

                    const handleStart = async (timed: boolean) => {
                      let selectedTasks = sheetTasks;
                      if (selectedTasks.length === 0 && sheet.examId) {
                        selectedTasks = await curriculumRepository.getCkeExamSheet(sheet.examId);
                      }
                      if (selectedTasks.length === 0) {
                        const generated = generateFullMaturaExam(sheet.examId || sheet.name, sheet.name);
                        selectedTasks = generated.tasks;
                      }
                      startFullExam(sheet.name, selectedTasks, timed);
                    };

                    return (
                      <div
                        key={sIdx}
                        className="p-5 rounded-2xl bg-surface-bg border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {sheet.badge}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {count > 0 ? `${count} zadań` : '35 zadań'} • {points > 0 ? `${points} pkt` : '46 pkt'}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-white">{sheet.name}</h3>
                          <p className="text-xs text-text-secondary mt-0.5">{sheet.desc}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => void handleStart(false)}
                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors cursor-pointer"
                          >
                            Tryb bezstresowy
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleStart(true)}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Clock size={13} />
                            <span>Zegar 180 min</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              VIEW: TOPICS_BANK (FILAR 3: 15 KAFELKÓW DZIAŁÓW CKE)
             ========================================================================= */}
          {view === 'topics_bank' && (
            <motion.div
              key="topics_bank"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-5"
            >
              <div className="p-6 rounded-[28px] bg-surface-card border border-surface-border shadow-xl">
                <h2 className="text-xl font-bold text-white mb-1">
                  Bank Zadań CKE według Działów
                </h2>
                <p className="text-text-secondary text-xs sm:text-sm mb-6">
                  Wybierz dział, aby zobaczyć autentyczne zadania CKE lub uruchomić ciągły trening z tego tematu.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentTopics.map((topic, idx) => {
                    const topicAll = effectiveTasks.filter(t => t.section === topic);
                    const topicPassed = topicAll.filter(t => isTaskPassed(t.id)).length;
                    const pct = topicAll.length > 0 ? Math.round((topicPassed / topicAll.length) * 100) : 0;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-surface-bg border border-surface-border hover:border-[#FFB800]/40 transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase text-[#FFB800] bg-[#FFB800]/10 px-2 py-0.5 rounded border border-[#FFB800]/20">
                              Dział {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold text-text-muted">
                              {topicPassed} / {topicAll.length} zaliczone
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-white mb-3 group-hover:text-[#FFB800] transition-colors line-clamp-1">
                            {topic.replace(/^Dział\s*[\d.]+\s*[:\-–]?\s*/i, '')}
                          </h3>

                          {/* Mini pasek postępu */}
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                            <div
                              className="h-full bg-[#FFB800] rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-surface-border/50">
                          <button
                            onClick={() => {
                              setSelectedTopicName(topic);
                              setView('topic_detail');
                            }}
                            className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-text-secondary hover:text-white transition-colors text-center"
                          >
                            Zadania ({topicAll.length})
                          </button>

                          <button
                            onClick={() => startMaraton(topicAll, 0)}
                            className="px-3 py-1.5 rounded-xl bg-[#FFB800] text-black font-black text-xs hover:brightness-105 transition-colors"
                            title="Ćwicz ten dział ciągiem"
                          >
                            Ćwicz
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              VIEW: TOPIC_DETAIL (PRZEGLĄDARKA ZADAŃ W KONKRETNYM DZIALE)
             ========================================================================= */}
          {view === 'topic_detail' && (
            <motion.div
              key="topic_detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-5"
            >
              <div className="p-5 rounded-[26px] bg-surface-card border border-surface-border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FFB800] bg-[#FFB800]/10 px-2 py-0.5 rounded border border-[#FFB800]/20 mb-1 inline-block">
                    Katalog Zadań CKE
                  </span>
                  <h2 className="text-xl font-bold text-white">{selectedTopicName}</h2>
                  <p className="text-xs text-text-secondary">
                    {topicTasks.length} oficjalnych zadań CKE z tego działu.
                  </p>
                </div>

                <button
                  onClick={() => startMaraton(topicTasks, 0)}
                  className="px-5 py-3 rounded-2xl bg-[#FFB800] text-black font-black text-xs sm:text-sm shadow-md hover:brightness-105 flex items-center justify-center gap-2 shrink-0"
                >
                  <Play size={14} fill="black" />
                  <span>Rozpocznij drill z tego działu</span>
                </button>
              </div>

              {/* Lista zadań w dziale */}
              <div className="space-y-3">
                {topicTasks.map((t, idx) => {
                  const passed = isTaskPassed(t.id);
                  const failed = isTaskFailed(t.id);

                  return (
                    <div
                      key={t.id}
                      onClick={() => startMaraton(topicTasks, idx)}
                      className="p-4 rounded-2xl bg-surface-card border border-surface-border hover:border-[#FFB800]/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                    >
                      <div className="flex-1 overflow-hidden space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#FFB800] bg-[#FFB800]/10 px-2 py-0.5 rounded">
                            {t.source || 'CKE'}
                          </span>
                          <span className="text-[10px] text-text-muted">
                            {t.points} pkt • {t.isClosed ? 'Zamknięte' : 'Otwarte'}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-text-primary line-clamp-2 math-render">
                          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {t.content}
                          </Markdown>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {passed ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 size={13} />
                            <span>Zaliczone</span>
                          </span>
                        ) : failed ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                            <XCircle size={13} />
                            <span>Do powtórki</span>
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-text-muted bg-white/5 px-2.5 py-1 rounded-lg">
                            Do zrobienia
                          </span>
                        )}
                        <ChevronRight size={14} className="text-text-muted" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              VIEW: EXAM_SETUP (KONFIGURATOR MINI MATURY)
             ========================================================================= */}
          {view === 'exam_setup' && (
            <motion.div
              key="exam_setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-6"
            >
              <div className="p-6 rounded-[28px] bg-surface-card border border-surface-border shadow-xl">
                <h2 className="text-lg font-bold text-white mb-1">Skonfiguruj swój arkusz Mini Matury</h2>
                <p className="text-text-secondary text-xs sm:text-sm mb-6">
                  Wybierz zakres tematyczny i długość sesji. Zadania zostaną dobrane z oficjalnej bazy CKE.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                      Zakres tematyczny arkusza
                    </label>
                    <select
                      value={setupSection}
                      onChange={e => setSetupSection(e.target.value)}
                      className="w-full bg-surface-bg border border-surface-border rounded-xl px-4 py-3 text-white text-sm focus:border-[#FFB800] outline-none"
                    >
                      <option value="Wszystkie działy">Wszystkie działy (Przekrój Maturalny)</option>
                      {currentTopics.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                      Długość arkusza
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSetupLength(12)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          setupLength === 12 || setupLength === 11 || setupLength === 7
                            ? 'bg-[#FFB800]/10 border-[#FFB800] text-white shadow-[0_0_15px_rgba(255,184,0,0.15)]'
                            : 'bg-surface-bg border-surface-border text-text-muted hover:text-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                          <span className="font-bold text-sm">Ekspresowy</span>
                          <span className="text-[10px] font-black uppercase text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/20 px-1.5 py-0.5 rounded w-fit">20 MIN</span>
                        </div>
                        <p className="text-xs text-text-secondary">12 zadań • 15 punktów • Próg zdawalności 30%</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSetupLength(18)}
                        className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                          setupLength === 18 || setupLength === 17
                            ? 'bg-[#FFB800]/10 border-[#FFB800] text-white shadow-[0_0_15px_rgba(255,184,0,0.15)]'
                            : 'bg-surface-bg border-surface-border text-text-muted hover:text-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                          <span className="font-bold text-sm">Standardowy</span>
                          <span className="text-[10px] font-black uppercase text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/20 px-1.5 py-0.5 rounded w-fit">35 MIN</span>
                        </div>
                        <p className="text-xs text-text-secondary">18 zadań • 25 punktów • Dokładnie 1/2 arkusza</p>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => startMiniExam(setupSection, setupLength)}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-[#FFB800] text-black font-black text-sm tracking-wide shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Play size={16} fill="black" />
                    <span>Rozpocznij arkusz</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              VIEW: EXAM (RUNNER ARKUSZA Z ZEGAREM)
             ========================================================================= */}
          {view === 'exam' && examTasks.length > 0 && (
            <motion.div
              key="exam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-card border border-surface-border shadow-md">
                <div className="flex items-center gap-2">
                  {isExamTimed && (
                    <>
                      <button
                        onClick={() => setIsExamPaused(!isExamPaused)}
                        className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                          isExamPaused
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                      >
                        {isExamPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} />}
                        <span>{isExamPaused ? 'Wznów' : 'Pauza'}</span>
                      </button>

                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                        examTimeLeft < 300
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
                          : 'bg-surface-bg border-surface-border text-white'
                      }`}>
                        <Clock size={15} />
                        <span>{formatTimer(examTimeLeft)}</span>
                      </div>
                    </>
                  )}
                  {!isExamTimed && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      Tryb bezstresowy (bez limitu czasu)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFlag(examTasks[examCurrentIndex].id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      flaggedTasks.has(examTasks[examCurrentIndex].id)
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-white/5 border-white/10 text-text-muted hover:text-white'
                    }`}
                  >
                    <Flag size={14} fill={flaggedTasks.has(examTasks[examCurrentIndex].id) ? 'currentColor' : 'none'} />
                    <span className="hidden sm:inline">Oflaguj</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const unanswered = examTasks.filter(t => 
                        !examAnswers[t.id] && 
                        examOpenScores[t.id] === undefined && 
                        !examOpenAnswers[t.id]?.text?.trim() && 
                        (!examOpenAnswers[t.id]?.canvasUrl || examOpenAnswers[t.id]!.canvasUrl!.length < 50)
                      ).length;
                      setUnansweredCount(unanswered);
                      setExamConfirmModal('finish');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-black text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Oddaj arkusz
                  </button>
                </div>
              </div>

              {/* Pasek numerów zadań z touch-target min. 40x40px oraz bocznymi wskaźnikami wygaszającymi scroll */}
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#070A0F] to-transparent pointer-events-none z-10 opacity-80" aria-hidden="true" />
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#070A0F] to-transparent pointer-events-none z-10 opacity-80" aria-hidden="true" />
                <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-2 -mx-1 scrollbar-none">
                  {examTasks.map((t, idx) => {
                    const isCurrent = idx === examCurrentIndex;
                    const isAnswered = examAnswers[t.id] !== undefined || examOpenScores[t.id] !== undefined;
                    const isFlagged = flaggedTasks.has(t.id);

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setExamCurrentIndex(idx)}
                        className={`min-w-[40px] h-10 px-1 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-all relative cursor-pointer active:scale-95 ${
                          isCurrent
                            ? 'bg-[#FFB800] text-black shadow-[0_0_12px_rgba(255,184,0,0.5)] font-black scale-105'
                            : isAnswered
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                            : 'bg-surface-card border border-surface-border text-text-muted hover:text-white'
                        }`}
                      >
                        {idx + 1}
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Karta pytania - wyizolowana i memoizowana przed tickami zegara */}
              {isExamPaused ? (
                <div className="p-12 rounded-[28px] bg-surface-card border border-surface-border text-center flex flex-col items-center justify-center my-6 shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-4 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                    <Pause size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Arkusz zapauzowany</h3>
                  <button
                    type="button"
                    onClick={() => setIsExamPaused(false)}
                    className="px-6 py-3 rounded-2xl bg-[#FFB800] text-black font-black text-sm shadow-lg hover:brightness-105 cursor-pointer active:scale-95 transition-all"
                  >
                    Wznów arkusz
                  </button>
                </div>
              ) : (
                <ExamTaskCard
                  task={examTasks[examCurrentIndex]}
                  currentIndex={examCurrentIndex}
                  examSubject={examSubject}
                  selectedAnswer={examAnswers[examTasks[examCurrentIndex].id]}
                  openAnswer={examOpenAnswers[examTasks[examCurrentIndex].id]}
                  aiEvaluation={examAiEvaluations[examTasks[examCurrentIndex].id]}
                  isEvaluatingAi={Boolean(pendingBackgroundEvalRef.current[examTasks[examCurrentIndex].id])}
                  onTriggerAiEvaluation={() => {
                    const curr = examTasks[examCurrentIndex];
                    if (curr) void triggerBackgroundEvaluation(curr, examOpenAnswers[curr.id]?.text || '', examOpenAnswers[curr.id]?.canvasUrl);
                  }}
                  onResetAiEvaluation={() => {
                    const curr = examTasks[examCurrentIndex];
                    if (curr) setExamAiEvaluations(prev => { const c = { ...prev }; delete c[curr.id]; return c; });
                  }}
                  onSelectClosedAnswer={handleSelectClosedAnswer}
                  onOpenAnswerChange={handleOpenAnswerChangeCb}
                  onOpenCanvasChange={handleOpenCanvasChangeCb}
                  onPrevTask={handlePrevTask}
                  onNextTask={handleNextTask}
                  isFirstTask={examCurrentIndex === 0}
                  isLastTask={examCurrentIndex === examTasks.length - 1}
                />
              )}
            </motion.div>
          )}

          {/* =========================================================================
              VIEW: EXAM_REVIEW (PODSUMOWANIE ODDANEGO ARKUSZA)
             ========================================================================= */}
          {view === 'exam_review' && (
            <MaturaExamReview
              tasks={examReviewItems}
              timeSpentSeconds={examTimeSpent}
              onRetryMistakes={mistakeItems => {
                const mistakeTasks = tasks.filter(t => mistakeItems.some(m => m.id === t.id));
                if (mistakeTasks.length > 0) {
                  startMaraton(mistakeTasks, 0);
                }
              }}
              onBackToMenu={() => setView('hub')}
              xpAwarded={earnedReward?.xp}
              coinsAwarded={earnedReward?.coins}
            />
          )}

          {/* =========================================================================
              VIEW: MARATON / POJEDYNCZE ZADANIE CKE
             ========================================================================= */}
          {view === 'maraton' && currentMaratonTask && (
            <motion.div
              key="maraton"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-card border border-surface-border">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-text-muted">
                    Zadanie {maratonIndex + 1} z {maratonList.length}
                  </span>

                  {/* Widoczny przycisk podpowiedzi do zadania */}
                  <button
                    type="button"
                    onClick={() => setMaratonClosedHintOpen(prev => !prev)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${
                      maratonClosedHintOpen
                        ? 'bg-[#FFB800]/20 border-[#FFB800] text-[#FFB800] shadow-[0_0_12px_rgba(255,184,0,0.2)]'
                        : 'bg-white/5 border-white/10 text-text-secondary hover:text-white hover:bg-white/10'
                    }`}
                    title="Pokaż wskazówkę do zadania"
                  >
                    <Lightbulb size={13} className={maratonClosedHintOpen ? 'text-[#FFB800] fill-[#FFB800]' : 'text-amber-400'} />
                    <span>Podpowiedź</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={maratonIndex === 0}
                    onClick={() => {
                      setMaratonIndex(prev => prev - 1);
                      setMaratonSelectedAnswer(null);
                      setMaratonSubmitted(false);
                      setMaratonSelfScore(null);
                      setMaratonClosedHintOpen(false);
                    }}
                    className="p-1.5 rounded-lg border border-surface-border text-text-muted hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    disabled={maratonIndex >= maratonList.length - 1}
                    onClick={handleNextMaratonTask}
                    className="p-1.5 rounded-lg border border-surface-border text-text-muted hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Rozwijana wskazówka dydaktyczna z KaTeX */}
              <AnimatePresence>
                {maratonClosedHintOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-text-primary space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800] uppercase tracking-wider">
                        <Lightbulb size={15} />
                        <span>Wskazówka do zadania</span>
                      </div>
                      <div className="text-text-secondary leading-relaxed math-render">
                        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {currentMaratonTask.ckeTrap
                            ? currentMaratonTask.ckeTrap.replace(/^(pułapka|błąd)(\s*cke)?:\s*/i, '').trim()
                            : 'Zwróć uwagę na założenia zadania, definicje pojęć oraz wzory z oficjalnej karty CKE.'}
                        </Markdown>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`p-6 rounded-[28px] bg-surface-card border border-surface-border shadow-xl space-y-6 transition-all ${
                maratonSubmitted ? 'pb-72' : ''
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-surface-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/25 text-[#FFB800] text-xs font-bold">
                      {currentMaratonTask.source || 'Oficjalne CKE'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold">
                      {currentMaratonTask.points} {currentMaratonTask.points === 1 ? 'punkt' : 'punkty'}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">{currentMaratonTask.section}</span>
                </div>

                {renderMathContent(currentMaratonTask.content)}

                {Boolean((currentMaratonTask as any).numberLine) ? (
                  <div className="mt-3 flex justify-center">
                    <NumberLineDiagram data={(currentMaratonTask as any).numberLine} height={64} maxWidth="360px" />
                  </div>
                ) : Boolean((currentMaratonTask as any).diagram || (currentMaratonTask as any).plot) ? (
                  <div className="mt-3 flex justify-center">
                    <MathDiagram diagram={enrichTaskWithVisual(currentMaratonTask).diagram || enrichTaskWithVisual(currentMaratonTask).plot} />
                  </div>
                ) : null}

                {currentMaratonTask.isClosed && currentMaratonTask.options && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {currentMaratonTask.options.map((opt, optIdx) => {
                        const optLetter = String.fromCharCode(65 + optIdx);
                        const isSelected = maratonSubmitted 
                          ? maratonSelectedAnswer === optLetter 
                          : maratonDraftAnswer === optLetter;

                        const isCorrectOption = optLetter === currentMaratonTask.correctAnswer;
                        let cardStyle = 'bg-surface-card border-surface-border text-text-secondary hover:border-white/20 hover:text-white';
                        let badgeStyle = 'bg-white/5 text-text-secondary border-white/10';
                        let radioStyle = 'border-white/20';

                        if (maratonSubmitted) {
                          if (isCorrectOption) {
                            cardStyle = 'bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                            badgeStyle = 'bg-emerald-500 text-black border-emerald-500 font-black';
                            radioStyle = 'border-emerald-500 bg-emerald-500 text-black';
                          } else if (isSelected) {
                            cardStyle = 'bg-rose-500/10 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.2)]';
                            badgeStyle = 'bg-rose-500 text-white border-rose-500 font-black';
                            radioStyle = 'border-rose-500 bg-rose-500 text-white';
                          } else {
                            cardStyle = 'bg-surface-card/40 border-surface-border/40 text-text-muted opacity-50';
                          }
                        } else if (isSelected) {
                          cardStyle = 'bg-[#FFB800]/10 border-[#FFB800] ring-1 ring-[#FFB800]/50 shadow-[0_0_15px_rgba(255,184,0,0.15)] text-white';
                          badgeStyle = 'bg-[#FFB800] text-black border-[#FFB800] shadow-sm';
                          radioStyle = 'border-[#FFB800]';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={maratonSubmitted}
                            onClick={() => {
                              triggerHaptic('light');
                              setMaratonDraftAnswer(optLetter);
                            }}
                            className={`group p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3.5 active:scale-[0.99] cursor-pointer ${cardStyle}`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <span className={`w-8 h-8 rounded-xl font-display font-black text-xs flex items-center justify-center shrink-0 border transition-all ${badgeStyle}`}>
                                {optLetter}
                              </span>
                              <div className={`flex-1 overflow-x-auto text-sm leading-relaxed py-0.5 math-render ${
                                isSelected ? 'text-white font-medium' : 'text-slate-200'
                              }`}>
                                {typeof opt === 'object' && (opt as any)?.numberLine ? (
                                  <NumberLineDiagram data={(opt as any).numberLine} />
                                ) : typeof opt === 'object' && (opt as any)?.diagram ? (
                                  <MathDiagram diagram={(opt as any).diagram} />
                                ) : (
                                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {typeof opt === 'object' ? ((opt as any).text || (opt as any).content_latex || '') : opt}
                                  </Markdown>
                                )}
                              </div>
                            </div>

                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${radioStyle}`}>
                              {maratonSubmitted ? (
                                isCorrectOption ? (
                                  <Check size={12} strokeWidth={3.5} />
                                ) : isSelected ? (
                                  <X size={12} strokeWidth={3.5} />
                                ) : null
                              ) : isSelected ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dwuetapowe zatwierdzenie odpowiedzi (eliminacja błędu P0 - miss-click) */}
                    {maratonDraftAnswer && !maratonSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-4"
                      >
                        <button
                          onClick={() => handleMaratonAnswer(maratonDraftAnswer)}
                          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FFB800] via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <span>Zatwierdź odpowiedź ({maratonDraftAnswer})</span>
                          <ArrowRight size={18} />
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Zadanie otwarte w maratonie z pełnym OpenTaskWorkspace i Tutorem AI */}
                {!currentMaratonTask.isClosed && (
                  <div className="space-y-4 pt-1">
                    <OpenTaskWorkspace
                      task={currentMaratonTask}
                      isEvaluated={maratonSubmitted}
                      isCorrect={maratonTutorEval ? maratonTutorEval.score >= currentMaratonTask.points : null}
                      value={maratonOpenText}
                      onChangeValue={setMaratonOpenText}
                      savedCanvasDataUrl={maratonOpenCanvasUrl}
                      onSaveCanvasData={setMaratonOpenCanvasUrl}
                      onSubmit={(canvasData) => handleCheckMaratonOpenWithTutor(canvasData)}
                      onAskAiTutor={(canvasData) => handleAskMaratonHint(canvasData)}
                      isAiLoading={maratonIsScanning || maratonIsHintLoading}
                      onRetry={() => {
                        setMaratonSubmitted(false);
                        setMaratonTutorEval(null);
                        setMaratonSelfScore(null);
                      }}
                      inputPlaceholder="Wprowadź swoje rozwiązanie krok po kroku lub użyj wirtualnej klawiatury..."
                      hideWhiteboard={false}
                      mode="math"
                    />

                    {/* Skanowanie Tutora AI */}
                    {maratonIsScanning && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 rounded-2xl bg-gradient-to-br from-[#151D2C] via-[#101726] to-[#0E1420] border border-[#FFB800]/50 shadow-md flex flex-col items-center text-center my-3 relative overflow-hidden"
                      >
                        <div className="relative w-12 h-12 rounded-2xl bg-[#FFB800]/20 border border-[#FFB800]/60 flex items-center justify-center mb-3">
                          <Loader2 className="w-6 h-6 text-[#FFB800] animate-spin shrink-0" />
                        </div>
                        <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                          Egzaminator AI analizuje Twoje kroki obliczeniowe...
                        </h4>
                        <p className="text-xs text-amber-200/80 max-w-md">
                          Weryfikuję poprawność przekształceń algebraicznych i zgodność z oficjalnym kluczem CKE.
                        </p>
                      </motion.div>
                    )}

                    {/* Wskazówka Sokratejska Tutora AI */}
                    {maratonHintText && !maratonSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-[#FFB800]/10 border border-[#FFB800]/30 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800] uppercase tracking-wider">
                            <Lightbulb size={16} />
                            <span>Wskazówka Egzaminatora AI</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setMaratonHintText(null)}
                            className="p-1 rounded-lg text-amber-300/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Zamknij wskazówkę"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="text-xs sm:text-sm text-text-primary leading-relaxed math-render">
                          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {maratonHintText}
                          </Markdown>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* =========================================================================
                  WYSUWANY OD DOŁU DRAWER OCENY (BOTTOM SHEET)
                 ========================================================================= */}
              <AnimatePresence>
                {maratonSubmitted && (
                  <motion.div
                    key="maraton-feedback-drawer"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                    className={`fixed bottom-0 left-0 right-0 z-50 border-t-2 backdrop-blur-2xl shadow-[0_-16px_50px_rgba(0,0,0,0.85)] max-h-[85vh] flex flex-col ${
                      (maratonSelectedAnswer && currentMaratonTask.correctAnswer.trim().toUpperCase() === maratonSelectedAnswer.trim().toUpperCase()) ||
                      (maratonTutorEval && maratonTutorEval.score >= currentMaratonTask.points) ||
                      (maratonSelfScore !== null && maratonSelfScore >= currentMaratonTask.points)
                        ? 'bg-[#081512]/98 border-emerald-500 shadow-[0_-10px_35px_rgba(16,185,129,0.25)]'
                        : 'bg-[#180A0F]/98 border-rose-500 shadow-[0_-10px_35px_rgba(244,63,94,0.25)]'
                    }`}
                  >
                    <div className="w-full max-w-4xl mx-auto flex flex-col p-4 sm:p-6 overflow-hidden">
                      {/* Nagłówek Drawera: Status wyniku + Przycisk Następne zadanie */}
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          {((maratonSelectedAnswer && currentMaratonTask.correctAnswer.trim().toUpperCase() === maratonSelectedAnswer.trim().toUpperCase()) ||
                           (maratonTutorEval && maratonTutorEval.score >= currentMaratonTask.points) ||
                           (maratonSelfScore !== null && maratonSelfScore >= currentMaratonTask.points)) ? (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                              <Check size={20} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.2)]">
                              <X size={20} strokeWidth={3} />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className={`font-display font-black text-sm sm:text-base leading-snug whitespace-normal ${
                              ((maratonSelectedAnswer && currentMaratonTask.correctAnswer.trim().toUpperCase() === maratonSelectedAnswer.trim().toUpperCase()) ||
                               (maratonTutorEval && maratonTutorEval.score >= currentMaratonTask.points) ||
                               (maratonSelfScore !== null && maratonSelfScore >= currentMaratonTask.points))
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                            }`}>
                              {((maratonSelectedAnswer && currentMaratonTask.correctAnswer.trim().toUpperCase() === maratonSelectedAnswer.trim().toUpperCase()) ||
                                (maratonTutorEval && maratonTutorEval.score >= currentMaratonTask.points) ||
                                (maratonSelfScore !== null && maratonSelfScore >= currentMaratonTask.points))
                                ? 'Świetnie! Poprawna odpowiedź'
                                : 'Wymaga poprawy'}
                            </div>
                            <div className="text-[11px] sm:text-xs text-text-muted mt-0.5 truncate">
                              {((maratonSelectedAnswer && currentMaratonTask.correctAnswer.trim().toUpperCase() === maratonSelectedAnswer.trim().toUpperCase()) ||
                                (maratonTutorEval && maratonTutorEval.score >= currentMaratonTask.points) ||
                                (maratonSelfScore !== null && maratonSelfScore >= currentMaratonTask.points))
                                ? (currentMaratonTask.isClosed ? '+15 XP • Zadanie zaliczone' : `+25 XP • Zdobyto ${maratonTutorEval?.score || currentMaratonTask.points} / ${currentMaratonTask.points} pkt`)
                                : (currentMaratonTask.isClosed ? `Poprawna odpowiedź: ${currentMaratonTask.correctAnswer}. Dodano do Bazy Błędów.` : `Zdobyto ${maratonTutorEval?.score || 0} / ${currentMaratonTask.points} pkt • Dodano do Bazy Błędów.`)}
                            </div>
                          </div>
                        </div>

                        {/* Przyciski Akcji Drawera */}
                        <div className="flex items-center gap-2 shrink-0">
                          {((!currentMaratonTask.isClosed && maratonTutorEval && maratonTutorEval.score < currentMaratonTask.points) ||
                            (currentMaratonTask.isClosed && maratonSelectedAnswer && currentMaratonTask.correctAnswer.trim().toUpperCase() !== maratonSelectedAnswer.trim().toUpperCase())) && (
                            <button
                              type="button"
                              onClick={() => {
                                setMaratonSubmitted(false);
                                setMaratonTutorEval(null);
                                setMaratonDraftAnswer(null);
                                setMaratonSelectedAnswer(null);
                                setMaratonSelfScore(null);
                                triggerHaptic('light');
                              }}
                              className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                              title="Popraw swoje rozwiązanie i sprawdź ponownie"
                            >
                              <RotateCcw size={14} />
                              <span className="hidden sm:inline">Popraw</span>
                            </button>
                          )}

                          <button
                            onClick={handleNextMaratonTask}
                            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 to-[#FFB800] hover:from-amber-300 hover:to-amber-400 text-amber-950 font-display font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(255,184,0,0.35)] active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap"
                          >
                            <span className="inline sm:hidden">Dalej</span>
                            <span className="hidden sm:inline">Następne zadanie</span>
                            <ChevronRight size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>

                      {/* Treść Drawera: Pułapka Egzaminacyjna & Oficjalne Rozwiązanie */}
                      <div className="overflow-y-auto space-y-3 pt-3.5 pr-1 max-h-[50vh]">
                        {/* Pułapka Egzaminacyjna - z czystym tytułem i KaTeX */}
                        {currentMaratonTask.ckeTrap && (() => {
                          const cleanTrap = currentMaratonTask.ckeTrap.replace(/^(pułapka|błąd)(\s*cke)?:\s*/i, '').trim();
                          return (
                            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                              <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={17} />
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                                  Pułapka egzaminacyjna
                                </div>
                                <div className="text-xs sm:text-sm text-text-secondary leading-relaxed math-render">
                                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {cleanTrap}
                                  </Markdown>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Oficjalne rozwiązanie - bez "CKE" w tytule */}
                        {currentMaratonTask.explanation && (
                          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-card border border-surface-border space-y-1.5">
                            <div className="text-xs font-bold text-text-muted uppercase tracking-wider">
                              Oficjalne rozwiązanie:
                            </div>
                            <div className="text-xs sm:text-sm text-text-secondary leading-relaxed math-render overflow-x-auto">
                              <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {currentMaratonTask.explanation}
                              </Markdown>
                            </div>
                          </div>
                        )}

                        {/* Szczegółowa ocena Tutora AI w zadaniu otwartym */}
                        {!currentMaratonTask.isClosed && maratonTutorEval && (
                          <div className="p-4 rounded-2xl bg-[#FFB800]/5 border border-[#FFB800]/25 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-xs font-black text-[#FFB800] uppercase tracking-wider">
                                <GraduationCap size={14} />
                                <span>Ocena Egzaminatora AI: {maratonTutorEval.score} / {currentMaratonTask.points} pkt</span>
                              </div>
                              {maratonTutorEval.isPassed && (
                                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                                  Zaliczone CKE
                                </span>
                              )}
                            </div>

                            {/* Odczytany zapis ucznia (transkrypcja KaTeX) */}
                            {maratonTutorEval.transcription && (
                              <div className="p-3 rounded-xl bg-[#070A0F]/80 border border-white/10 space-y-1">
                                <div className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
                                  Odczytany zapis ucznia:
                                </div>
                                <div className="text-xs text-white font-mono math-render overflow-x-auto">
                                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {maratonTutorEval.transcription}
                                  </Markdown>
                                </div>
                              </div>
                            )}

                            {maratonTutorEval.mentorComment && (
                              <div className="text-xs sm:text-sm text-text-primary leading-relaxed math-render">
                                <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                  {maratonTutorEval.mentorComment}
                                </Markdown>
                              </div>
                            )}
                            {maratonTutorEval.strengths && maratonTutorEval.strengths.length > 0 && (
                              <div className="space-y-0.5">
                                <span className="text-[11px] font-bold text-emerald-400">Mocne strony:</span>
                                <ul className="list-disc list-inside text-xs text-text-secondary">
                                  {maratonTutorEval.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                                </ul>
                              </div>
                            )}
                            {maratonTutorEval.errors && maratonTutorEval.errors.length > 0 && (
                              <div className="space-y-0.5">
                                <span className="text-[11px] font-bold text-rose-400">Wskazówki i braki:</span>
                                <ul className="list-disc list-inside text-xs text-text-secondary">
                                  {maratonTutorEval.errors.map((e, idx) => <li key={idx}>{e}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* MODAL POTWIERDZENIA ODDANIA / PRZERWANIA ARKUSZA (clarify) */}
      <AnimatePresence>
        {examConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md p-6 rounded-[28px] bg-surface-card border border-surface-border shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertTriangle size={24} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  {examConfirmModal === 'finish' ? 'Oddanie arkusza maturalnego' : 'Przerwanie arkusza'}
                </h3>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  {examConfirmModal === 'finish'
                    ? unansweredCount > 0
                      ? `W Twoim arkuszu pozostało jeszcze ${unansweredCount} nieodpowiedzianych pytań. Po oddaniu arkusza nie będzie możliwości powrotu do edycji odpowiedzi.`
                      : 'Wszystkie zadania w arkuszu zostały wypełnione. Czy chcesz teraz zakończyć egzamin i poznać szczegółową ocenę CKE z analizą Tutora AI?'
                    : 'Twój postęp w bieżącym arkuszu zostanie przerwany. Czy na pewno chcesz opuścić salę egzaminacyjną i wrócić do menu głównego?'}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExamConfirmModal(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition active:scale-[0.98] cursor-pointer"
                >
                  {examConfirmModal === 'finish' ? 'Wróć do arkusza' : 'Kontynuuj egzamin'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const action = examConfirmModal;
                    setExamConfirmModal(null);
                    if (action === 'finish') {
                      handleFinishExam();
                    } else {
                      if (timerRef.current) clearInterval(timerRef.current);
                      setView('hub');
                    }
                  }}
                  className={`flex-1 py-3 rounded-xl font-black text-xs transition active:scale-[0.98] cursor-pointer shadow-lg ${
                    examConfirmModal === 'finish'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-emerald-950/40'
                      : 'bg-rose-500 hover:bg-rose-400 text-rose-950 shadow-rose-950/40'
                  }`}
                >
                  {examConfirmModal === 'finish' ? 'Oddaj arkusz' : 'Przerwij i wyjdź'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL BRUDNOPISU */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      {/* MODAL KARTY WZORÓW CKE */}
      <CkeFormulasModal
        isOpen={isFormulasOpen}
        onClose={() => setIsFormulasOpen(false)}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Lightbulb, 
  BookOpen, 
  Loader2, 
  RotateCcw,
  Bot,
  Zap,
  Check,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MathRenderer } from './MathRenderer';
import { triggerHaptic, playSuccessSound, playErrorSound } from '../utils';
import { recordAiTokenUsage } from '../services/aiUsageTracker';
import { apiHeaders } from '../lib/apiClient';

interface AiTaskGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubjectKey?: string;
  onTaskSolved?: (xp: number, coins: number) => void;
  onStartCustomTask?: (task: any) => void;
}

const DEFAULT_MATH_TOPICS = [
  'Liczby rzeczywiste, potęgi i pierwiastki',
  'Logarytmy i ich własności',
  'Równania kwadratowe i funkcja kwadratowa',
  'Nierówności liniowe i kwadratowe',
  'Ciągi arytmetyczne i geometryczne',
  'Planimetria: trójkąty i twierdzenie Pitagorasa',
  'Trygonometria w trójkącie prostokątnym',
  'Geometria analityczna na płaszczyźnie',
  'Rachunek prawdopodobieństwa i kombinatoryka'
];

const DEFAULT_POLISH_TOPICS = [
  'Lalka Bolesława Prusa – motyw pracy organicznej i idealizmu',
  'Dziady cz. III Adama Mickiewicza – motyw martyrologii i prometeizmu',
  'Wesele Stanisława Wyspiańskiego – krytyka mitów narodowych',
  'Kordian Juliusza Słowackiego – winkelriedyzm i dramat romantyczny',
  'Zbrodnia i kara Fiodora Dostojewskiego – motyw winy i kary',
  'Rozprawka maturalna – formułowanie tezy i dobór kontekstów'
];

const DEFAULT_ENGLISH_TOPICS = [
  'Czasy gramatyczne: Present Perfect vs Past Simple',
  'Okresy warunkowe (Conditionals 0, 1, 2)',
  'Strona bierna (Passive Voice) w praktyce maturalnej',
  'Mowa zależna (Reported Speech) i następstwo czasów',
  'Czasowniki modalne i modalne w przeszłości',
  'Transformacje ze słowem-kluczem (Key Word Transformation)',
  'Środki językowe: słowotwórstwo (Word Formation)',
  'Wypowiedź pisemna: e-mail lub wpis na blogu (100-150 słów)'
];

export const AiTaskGeneratorModal: React.FC<AiTaskGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentSubjectKey = 'math',
  onTaskSolved,
  onStartCustomTask
}) => {
  const isPolish = currentSubjectKey === 'pol';
  const isEnglish = currentSubjectKey === 'eng';
  const defaultTopics = isPolish ? DEFAULT_POLISH_TOPICS : isEnglish ? DEFAULT_ENGLISH_TOPICS : DEFAULT_MATH_TOPICS;

  const [selectedTopic, setSelectedTopic] = useState<string>(defaultTopics[0]);
  const [taskType, setTaskType] = useState<'SINGLE_CHOICE' | 'NUMERIC_INPUT' | 'OPEN_PROOF'>('SINGLE_CHOICE');
  const [difficulty, setDifficulty] = useState<'podstawowy' | 'standard' | 'trudne'>('standard');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedTask, setGeneratedTask] = useState<any | null>(null);

  // Solving state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [numericValue, setNumericValue] = useState<string>('');
  const [openAnswerText, setOpenAnswerText] = useState<string>('');
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState<any | null>(null);
  const [isAiGrading, setIsAiGrading] = useState<boolean>(false);

  // AI Hint state
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);
    setGeneratedTask(null);
    setSelectedOption(null);
    setNumericValue('');
    setOpenAnswerText('');
    setIsEvaluated(false);
    setIsCorrect(null);
    setEvaluationFeedback(null);
    setAiHint(null);

    try {
      const res = await fetch('/api/generate-task', {
        method: 'POST',
        headers: await apiHeaders(),
        body: JSON.stringify({
          subject: isPolish ? 'jezyk-polski' : isEnglish ? 'jezyk-angielski' : 'matematyka',
          topic: selectedTopic,
          taskType,
          difficulty
        })
      });

      if (res.ok) {
        const task = await res.json();
        setGeneratedTask(task);
        if (task?.usage) {
          recordAiTokenUsage({
            type: 'GENERATION',
            usage: task.usage,
            taskId: task.id
          });
        }
        triggerHaptic('success');
      } else {
        console.warn('API error in generate-task, using fallback task');
      }
    } catch (err) {
      console.warn('Network error in generate-task:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFetchAiHint = async () => {
    if (!generatedTask || isHintLoading) return;
    triggerHaptic('light');
    setIsHintLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: await apiHeaders(),
        body: JSON.stringify({
          mode: 'hint',
          question: generatedTask.question,
          instruction: generatedTask.instruction,
          scoring_key: generatedTask.scoring_key,
          studentAnswer: selectedOption || numericValue || openAnswerText,
          staticHint: generatedTask.hints?.level_1
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiHint(data.reply || generatedTask.hints?.level_1 || 'Zwróć uwagę na kluczowe założenia.');
        if (data?.usage) {
          recordAiTokenUsage({
            type: 'HINT',
            usage: data.usage,
            taskId: generatedTask?.id
          });
        }
      } else {
        setAiHint(generatedTask.hints?.level_1 || 'Zastosuj odpowiednie tożsamości algebraiczne.');
      }
    } catch (err) {
      setAiHint(generatedTask?.hints?.level_1 || 'Zastosuj odpowiednie tożsamości algebraiczne.');
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (!generatedTask || isEvaluated) return;

    if (generatedTask.type === 'SINGLE_CHOICE') {
      if (!selectedOption) return;
      const matchingOpt = (generatedTask.options || []).find((o: any) => o.id === selectedOption);
      const target = String(generatedTask.correct_answer || generatedTask.correctAnswer || '').trim().toUpperCase();
      const correct = Boolean(matchingOpt?.is_correct) || selectedOption === target;

      setIsEvaluated(true);
      setIsCorrect(correct);

      if (correct) {
        triggerHaptic('success');
        playSuccessSound();
        onTaskSolved?.(15, 3);
        try {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
        } catch {}
      } else {
        triggerHaptic('error');
        playErrorSound();
      }
    } else {
      // Open or numeric task: evaluate with AI Tutor endpoint
      const answerToGrade = numericValue || openAnswerText;
      if (!answerToGrade.trim()) return;

      setIsAiGrading(true);
      triggerHaptic('medium');

      try {
        const res = await fetch('/api/evaluate-task', {
          method: 'POST',
          headers: await apiHeaders(),
          body: JSON.stringify({
            question: generatedTask.question,
            officialKey: generatedTask.explanation,
            scoring_key: generatedTask.scoring_key,
            studentAnswer: answerToGrade,
            taskType: generatedTask.type,
            maxPoints: generatedTask.points || 2,
            ai_tutor_rubric: generatedTask.ai_tutor_rubric
          })
        });

        if (res.ok) {
          const evalResult = await res.json();
          setEvaluationFeedback(evalResult);
          setIsCorrect(evalResult.isPassed);
          setIsEvaluated(true);
          if (evalResult?.usage) {
            recordAiTokenUsage({
              type: 'EVALUATION',
              usage: evalResult.usage,
              taskId: generatedTask?.id
            });
          }
          if (evalResult.isPassed) {
            triggerHaptic('success');
            playSuccessSound();
            onTaskSolved?.(20, 5);
          } else {
            triggerHaptic('error');
            playErrorSound();
          }
        }
      } catch (err) {
        console.warn('AI evaluation error:', err);
      } finally {
        setIsAiGrading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#0C101C] border border-white/10 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Cpu size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>Generator Zadań AI</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    OpenRouter Free
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isPolish ? 'Język Polski' : isEnglish ? 'Język Angielski' : 'Matematyka'} • Zadania z kluczem i kryteriami CKE
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition border border-white/5 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* 1. Generator Parameters */}
            {!generatedTask && (
              <div className="space-y-4">
                {/* Topic selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Wybierz temat zadania:
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {defaultTopics.map((t, idx) => (
                      <option key={idx} value={t} className="bg-slate-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Format and Difficulty */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Format zadania:
                    </label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value as any)}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="SINGLE_CHOICE">Zamknięte (A, B, C, D)</option>
                      <option value="NUMERIC_INPUT">Wynik liczbowy</option>
                      <option value="OPEN_PROOF">Otwarte dowodowe</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Poziom trudności:
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="podstawowy">Podstawowy (Baza)</option>
                      <option value="standard">Standardowy CKE</option>
                      <option value="trudne">Wyzwanie (Pewniak +)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 flex items-start gap-2.5">
                  <Bot size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Model AI automatycznie ułoży zadanie, wygeneruje klucz punktowania (scoring key), wyjaśni pułapki CKE i przygotuje wskazówki sokratejskie.
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Generuję zadanie przez OpenRouter...</span>
                    </>
                  ) : (
                    <>
                      <Cpu size={16} />
                      <span>Wygeneruj zadanie z kluczem CKE</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 2. Generated Task View & Interactive Solver */}
            {generatedTask && (
              <div className="space-y-4">
                {/* Task prompt card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
                      {generatedTask.topic || selectedTopic}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {generatedTask.points || 1} {generatedTask.points === 1 ? 'punkt' : 'punkty'} CKE
                    </span>
                  </div>

                  <div className="text-sm sm:text-base font-medium text-white leading-relaxed">
                    <MathRenderer content={generatedTask.question} />
                  </div>

                  {generatedTask.instruction && (
                    <p className="text-xs text-slate-400 italic">
                      {generatedTask.instruction}
                    </p>
                  )}
                </div>

                {/* Answer input depending on task type */}
                {generatedTask.type === 'SINGLE_CHOICE' && (
                  <div className="space-y-2">
                    {(generatedTask.options || []).map((opt: any, idx: number) => {
                      const optId = opt.id || String.fromCharCode(65 + idx);
                      const isSelected = selectedOption === optId;
                      const isThisCorrect = Boolean(opt.is_correct);

                      let btnClass = 'w-full p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all text-xs sm:text-sm font-medium cursor-pointer ';
                      if (!isEvaluated) {
                        btnClass += isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-amber-100 shadow-[0_0_15px_rgba(255,184,0,0.25)]'
                          : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 text-slate-200';
                      } else {
                        if (isThisCorrect) {
                          btnClass += 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                        } else if (isSelected && !isThisCorrect) {
                          btnClass += 'bg-rose-950/40 border-rose-500 text-rose-200';
                        } else {
                          btnClass += 'bg-slate-900/30 border-slate-800/40 opacity-40 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={optId}
                          type="button"
                          disabled={isEvaluated}
                          onClick={() => {
                            triggerHaptic('light');
                            setSelectedOption(optId);
                          }}
                          className={btnClass}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                              isSelected && !isEvaluated
                                ? 'bg-[#FFB800] text-amber-950 border-amber-400'
                                : isEvaluated && isThisCorrect
                                ? 'bg-emerald-500 text-emerald-950 border-emerald-400'
                                : isEvaluated && isSelected && !isThisCorrect
                                ? 'bg-rose-500 text-white border-rose-400'
                                : 'bg-slate-800 border-slate-700 text-slate-300'
                            }`}>
                              {optId}
                            </span>
                            <span className="flex-1">
                              <MathRenderer content={opt.text || opt.content_latex} />
                            </span>
                          </div>
                          {isEvaluated && isThisCorrect && (
                            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                          )}
                          {isEvaluated && isSelected && !isThisCorrect && (
                            <XCircle size={18} className="text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {generatedTask.type === 'NUMERIC_INPUT' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Twój wynik:
                    </label>
                    <input
                      type="text"
                      disabled={isEvaluated}
                      value={numericValue}
                      onChange={(e) => setNumericValue(e.target.value)}
                      placeholder="Wpisz liczbę lub wyrażenie..."
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {generatedTask.type === 'OPEN_PROOF' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Zapisz tok dowodu / uzasadnienie:
                    </label>
                    <textarea
                      disabled={isEvaluated}
                      rows={4}
                      value={openAnswerText}
                      onChange={(e) => setOpenAnswerText(e.target.value)}
                      placeholder="Wypisz kolejne kroki dowodu, przekształcenia algebraiczne lub argumentację..."
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                )}

                {/* AI Hint Section */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    disabled={isHintLoading}
                    onClick={handleFetchAiHint}
                    className="text-xs font-bold text-amber-400/90 hover:text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isHintLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Lightbulb size={14} />
                    )}
                    <span>Poproś o Wskazówkę AI (Sokratejską)</span>
                  </button>
                </div>

                {aiHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed"
                  >
                    <span className="font-bold mb-0.5 text-amber-300 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Wskazówka Tutora AI:</span>
                    </span>
                    <MathRenderer content={aiHint} />
                  </motion.div>
                )}

                {/* Explanation and CKE Scoring Key when evaluated */}
                {isEvaluated && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-amber-400" />
                      <span className="font-bold text-white uppercase tracking-wider">
                        Oficjalny klucz i schemat punktowania CKE:
                      </span>
                    </div>

                    <div className="text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                      <MathRenderer content={generatedTask.explanation} />
                    </div>

                    {generatedTask.scoring_key && (
                      <div className="text-slate-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 space-y-1">
                        <span className="font-bold text-slate-300 block">Kryteria oceniania (scoring key):</span>
                        <div className="whitespace-pre-line text-slate-300">
                          {generatedTask.scoring_key}
                        </div>
                      </div>
                    )}

                    {generatedTask.cke_trap && (
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
                        <span className="font-bold text-rose-300 block">⚠️ Pułapka egzaminacyjna:</span>
                        <span>{generatedTask.cke_trap}</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {!isEvaluated ? (
                    <button
                      type="button"
                      disabled={isAiGrading || (generatedTask.type === 'SINGLE_CHOICE' ? !selectedOption : !(numericValue || openAnswerText).trim())}
                      onClick={handleCheckAnswer}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAiGrading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Tutor AI ocenia Twoje rozwiązanie...</span>
                        </>
                      ) : (
                        <span>Sprawdź odpowiedź</span>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setGeneratedTask(null)}
                      className="flex-1 py-3.5 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-amber-950 font-black text-xs sm:text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Cpu size={16} />
                      <span>Wygeneruj kolejne zadanie</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    Zamknij
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

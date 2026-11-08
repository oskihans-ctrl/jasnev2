import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  Trophy, 
  Flame, 
  Coins, 
  Zap,
  RefreshCw, 
  RotateCcw, 
  Check, 
  Info,
  Clock,
  FileText,
  Lightbulb,
  Loader2,
  Heart,
  HeartCrack,
  ShieldCheck,
  Users,
  Compass,
  Target,
  GraduationCap,
  Feather,
  Scan,
  Award,
  Calculator,
  ShieldAlert,
  BookmarkCheck,
  Layers,
  Scale,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Headphones,
  ChevronDown,
  Key,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { playSuccessSound, playErrorSound, triggerHaptic, isActualTaskId, calculateStreakOnTaskCompletion } from '../utils';
import { MathRenderer, formatMathAnswer } from './MathRenderer';
import { Badge } from './Badge';

import { UserState, LessonTheoryPill } from '../types';
import { LessonFormulaSheet, drawSessionTasks, getLessonTheoryPill, getLessonTaskPool } from '../data/dzial1TaskPool';
import { pickRetryTask, nextQueueIndex } from '../lib/sessionQueue';
import { toFormulaBoxContent } from '../lib/formulaBox';
import { apiHeaders } from '../lib/apiClient';
import { curriculumRepository } from '../services/curriculumRepository';
import { addMistakeToBank, removeMistakeFromBank } from '../utils/mistakesBank';
import { OpenTaskWorkspace, convertDataUrlToAiOptimized } from './OpenTaskWorkspace';
import { WritingWorkspace } from './writing/WritingWorkspace';
import { AiTutorScanOverlay } from './AiTutorScanOverlay';
import { RubricSelfAssessment } from './RubricSelfAssessment';
import { MathPlot } from './MathPlot';
import { MathDiagram } from './MathDiagram';
import { NumberLineDiagram } from './NumberLineDiagram';
import { OutOfHeartsModal } from './OutOfHeartsModal';
import { ParentSponsorModal } from './ParentSponsorModal';
import { ProPopup } from './ProPopup';
import { PromoFloatingPill } from './PromoFloatingPill';
import { getSyncedHearts, deductHeart, refillHeartsWithCoins, activatePro, activateProWithCode, isFirstLessonGrace } from '../lib/heartsManager';
import { showToast } from '../lib/toast';
import { recordAiTokenUsage } from '../services/aiUsageTracker';
import { enrichTaskWithVisual, enrichTheoryPillWithVisual } from '../data/mathVisualRegistry';
import { getCkeFormulas, getCkeFormulaTopics } from '../services/ckeCatalogRepository';
import { withLocalCkeFormulas, withLocalCkeFormulaTopics } from '../data/ckeFormulasData';
import { getPolishLessonDocument } from '../data/polishCurriculumData';
import { getPolishBookSummary } from '../data/polish/polishBookSummaries';
import { getPolishBentoConceptsForLesson } from '../data/polish/polishBentoConcepts';
import { EnglishConceptFormatter } from './english/EnglishConceptFormatter';
import { getDuetDataForLesson } from '../data/english/englishDuetData';
import { MaturalnyDuetGame } from './english/MaturalnyDuetGame';
import { EnglishTrapInteractive } from './english/EnglishTrapInteractive';
import {
  saveSessionState,
  saveSessionStateSync,
  clearSessionState,
  saveCanvasDrawing,
  restoreCanvasDrawing,
  generateSessionId,
  SavedSessionState
} from '../services/sessionRecoveryService';

/**
 * Wyznacza identyfikator tematu CKE dla danego działu i lekcji.
 * Obsługuje dwukierunkowo oba standardy: 10 działów kurikulum oraz 15 działów matury CKE.
 */
export function resolveCkeTopicForDepartment(
  departmentBadgeLabel: string,
  moduleBadgeName?: string | null,
  lessonTitle?: string | null
): string | null {
  const deptNum = (departmentBadgeLabel || '').replace(/\D+/g, '');
  const modName = (moduleBadgeName || '').toLowerCase().trim();
  const title = (lessonTitle || '').toLowerCase().trim();
  const fullText = `${deptNum} ${modName} ${title}`;

  // 1. Dopasowanie po specyficznych słowach kluczowych (priorytet treści)
  if (fullText.includes('trygonometr') || fullText.includes('sinus') || fullText.includes('cosinus') || fullText.includes('tangens')) {
    return 'trygonometria';
  }
  if (fullText.includes('ciąg') || fullText.includes('ciag') || fullText.includes('arytmetycz') || (fullText.includes('geometrycz') && !fullText.includes('geometr'))) {
    return 'ciagi';
  }
  if (fullText.includes('logarytm') || fullText.includes('procent') || fullText.includes('kapitalizacj')) {
    return 'logarytmy-procenty';
  }
  if (
    fullText.includes('potęg') || fullText.includes('poteg') ||
    fullText.includes('pierwiast') ||
    fullText.includes('skróconego') || fullText.includes('skroconego') ||
    fullText.includes('wartość bezwzględn') || fullText.includes('wartosc bezwzgledn') ||
    fullText.includes('liczby rzeczywist')
  ) {
    return 'potegi-pierwiastki';
  }
  if (fullText.includes('stereometr')) {
    return 'stereometria';
  }
  if (
    fullText.includes('analitycz') ||
    fullText.includes('kartezjańsk') ||
    fullText.includes('odległość punkt') ||
    fullText.includes('środek odcink') ||
    fullText.includes('równanie okręgu')
  ) {
    return 'geometria';
  }
  if (
    fullText.includes('planimetr') ||
    fullText.includes('tales') ||
    fullText.includes('trójkąt równoboczn') ||
    fullText.includes('podobieństw') ||
    fullText.includes('cechy podobieństwa')
  ) {
    return 'planimetria';
  }
  if (
    fullText.includes('prawdopodob') ||
    fullText.includes('kombinatoryk') ||
    fullText.includes('statystyk') ||
    fullText.includes('mediana') ||
    fullText.includes('średnia') || fullText.includes('srednia')
  ) {
    return 'prawdopodobienstwo';
  }
  if (
    fullText.includes('kwadrat') ||
    fullText.includes('parabol') ||
    fullText.includes('delta') ||
    fullText.includes('wierzchoł') ||
    fullText.includes('viète') || fullText.includes('viete') ||
    fullText.includes('liniow') ||
    fullText.includes('funkcj') ||
    fullText.includes('wykres') ||
    fullText.includes('nierówno') ||
    fullText.includes('równa') ||
    fullText.includes('wymiern') ||
    fullText.includes('iloczynow')
  ) {
    return 'funkcje-rownania';
  }

  // 2. Mapowanie po numerze działu (uwzględniające oba standardy: mikroedukacyjny 1-10 i maturalny CKE 1-21)
  switch (deptNum) {
    case '1':
      return 'potegi-pierwiastki';
    case '2':
      return 'logarytmy-procenty';
    case '3':
      // Dział 3: Wartość bezwzględna (kurikulum) lub Równania i nierówności (CKE)
      return modName.includes('równa') || modName.includes('nierówno') ? 'funkcje-rownania' : 'potegi-pierwiastki';
    case '4':
      // Dział 4: Wzory skróconego mnożenia (kurikulum) lub Układy równań (CKE)
      return modName.includes('układ') || modName.includes('równa') ? 'funkcje-rownania' : 'potegi-pierwiastki';
    case '5':
      return 'funkcje-rownania'; // Nierówności liniowe / Funkcje i wykresy
    case '6':
      return 'funkcje-rownania'; // Równania iloczynowe / Funkcja kwadratowa
    case '7':
      // Dział 7: Równania i wyrażenia wymierne (kurikulum) vs Ciągi liczbowe (CKE)
      return modName.includes('ciąg') || modName.includes('ciag') ? 'ciagi' : 'funkcje-rownania';
    case '8':
      // Dział 8: Nierówności kwadratowe (kurikulum) vs Trygonometria (CKE)
      return modName.includes('trygono') ? 'trygonometria' : 'funkcje-rownania';
    case '9':
      // Dział 9: Wykres funkcji (kurikulum) vs Planimetria (CKE)
      return modName.includes('planimetr') || modName.includes('geometr') ? 'planimetria' : 'funkcje-rownania';
    case '10':
      // Dział 10: Funkcja liniowa (kurikulum) vs Geometria analityczna (CKE)
      return modName.includes('geometr') || modName.includes('analitycz') ? 'geometria' : 'funkcje-rownania';
    case '11':
      return modName.includes('stereometr') || modName.includes('geometr') ? 'stereometria' : 'ciagi';
    case '12':
      return modName.includes('kombin') || modName.includes('prawd') ? 'prawdopodobienstwo' : 'geometria';
    case '13':
      return modName.includes('prawd') ? 'prawdopodobienstwo' : 'geometria';
    case '14':
      return modName.includes('statyst') ? 'prawdopodobienstwo' : 'trygonometria';
    case '15':
      return modName.includes('optymal') ? 'funkcje-rownania' : 'planimetria';
    case '16':
      return 'planimetria';
    case '17':
      return 'geometria';
    case '18':
      return 'stereometria';
    case '19':
      return 'prawdopodobienstwo';
    case '20':
      return 'prawdopodobienstwo';
    case '21':
      return 'funkcje-rownania';
    default:
      return 'funkcje-rownania';
  }
}

export interface ParsedExamTrap {
  error?: string;
  correct?: string;
  tip?: string;
  description?: string;
}

/**
 * Robust parser for CKE exam trap data, separating typical error, correct approach, and tips without emojis.
 */
function parseExamTrap(trapRaw: any): ParsedExamTrap | null {
  if (!trapRaw) return null;

  // 1. If it's already a structured object
  if (typeof trapRaw === 'object' && !Array.isArray(trapRaw)) {
    const errorText = trapRaw.fail || trapRaw.error || trapRaw.typical_mistake || '';
    const correctText = trapRaw.win || trapRaw.correct || trapRaw.correction || trapRaw.solution || '';
    const tipText = trapRaw.ckeTip || trapRaw.matura_tip || trapRaw.tip || '';
    const descText = trapRaw.description || trapRaw.explanation || '';

    const cleanErr = errorText ? String(errorText).replace(/^[❌⚠️\s]*(?:typowy\s*błąd(?:\s*cke)?|błąd\s*typowy|błąd)[:\s-]*/i, '').trim() : undefined;
    const cleanCorr = correctText ? String(correctText).replace(/^[✓✔\s]*(?:poprawnie|poprawne\s*podejście|prawidłowo|dobre\s*podejście)[:\s-]*/i, '').trim() : undefined;
    const cleanTip = tipText ? String(tipText).replace(/^[💡\s]*(?:wskazówka(?:\s*cke)?|rada)[:\s-]*/i, '').trim() : undefined;
    const cleanDesc = descText ? String(descText).replace(/^[❌⚠️💡✓✔\s]*(?:typowy\s*błąd(?:\s*cke)?|błąd\s*typowy|błąd)?[:\s-]*/i, '').trim() : undefined;

    if (cleanErr || cleanCorr || cleanTip || cleanDesc) {
      return {
        error: cleanErr,
        correct: cleanCorr,
        tip: cleanTip,
        description: cleanDesc
      };
    }
  }

  // 2. If it's a string, parse out typical error, correct approach, and tips
  if (typeof trapRaw === 'string') {
    let text = trapRaw.trim();
    text = text.replace(/^[❌⚠️\s]+/, '');

    const errorMatch = text.match(/(?:(?:typowy\s*błąd(?:\s*cke)?|błąd\s*typowy|błąd)[:\s-]*)([\s\S]*?)(?=(?:(?:✓|✔)?\s*(?:poprawnie|poprawne\s*podejście|prawidłowo)|(?:💡)?\s*wskazówka|$))/i);
    const correctMatch = text.match(/(?:(?:✓|✔)?\s*(?:poprawnie|poprawne\s*podejście|prawidłowo)[:\s-]*)([\s\S]*?)(?=(?:(?:💡)?\s*wskazówka|$))/i);
    const tipMatch = text.match(/(?:(?:💡)?\s*wskazówka(?:\s*cke)?[:\s-]*)([\s\S]*)/i);

    if (errorMatch || correctMatch) {
      return {
        error: errorMatch ? errorMatch[1].replace(/^[❌⚠️\s]*(?:typowy\s*błąd(?:\s*cke)?|błąd\s*typowy|błąd)?[:\s-]*/i, '').trim() : undefined,
        correct: correctMatch ? correctMatch[1].replace(/^[✓✔\s]*(?:poprawnie|poprawne\s*podejście|prawidłowo)?[:\s-]*/i, '').trim() : undefined,
        tip: tipMatch ? tipMatch[1].replace(/^[💡\s]*/, '').trim() : undefined
      };
    }

    if (text.includes('➔') || text.includes('->')) {
      const parts = text.split(/➔|->/);
      return {
        error: parts[0]?.replace(/^[❌⚠️\s]*(?:typowy\s*błąd(?:\s*cke)?|błąd\s*typowy|błąd)?[:\s-]*/i, '').trim(),
        correct: parts[1]?.replace(/^[✓✔\s]*(?:poprawnie|poprawne\s*podejście|prawidłowo)?[:\s-]*/i, '').trim()
      };
    }

    return {
      description: text.replace(/^[❌⚠️💡✓✔\s]*(?:typowy\s*błąd(?:\s*cke)?|błąd\s*typowy|błąd)?[:\s-]*/i, '').trim()
    };
  }

  return null;
}

/**
 * Helper to render micro-article text containing markdown bold (**bold**) and LaTeX ($...$)
 */
function renderMicroContent(rawText?: string | any) {
  if (!rawText) return null;
  let textToParse = '';
  if (typeof rawText === 'string') {
    textToParse = rawText;
  } else if (Array.isArray(rawText)) {
    textToParse = rawText.map(item => {
      if (!item) return '';
      if (typeof item === 'string') return item;
      if (typeof item === 'object') {
        return item.text || item.description || item.title || item.content || item.latex || '';
      }
      return String(item);
    }).filter(Boolean).join('\n\n');
  } else if (typeof rawText === 'object') {
    if ('description' in rawText && typeof rawText.description === 'string') {
      textToParse = rawText.description;
    } else if ('text' in rawText && typeof rawText.text === 'string') {
      textToParse = rawText.text;
    } else {
      try {
        textToParse = JSON.stringify(rawText);
      } catch {
        textToParse = String(rawText);
      }
    }
  } else {
    textToParse = String(rawText);
  }

  if (!textToParse || !textToParse.trim()) return null;

  // Pre-sanitize LaTeX backslash escapes mangled into JSON newlines/tabs
  textToParse = textToParse
    .replace(/(?:\n|^)\s*eq(?![a-zA-Z])/g, '\\neq ')
    .replace(/\n\s*ot(?![a-zA-Z])/g, '\\not ')
    .replace(/\t\s*imes(?![a-zA-Z])/g, '\\times ');

  // Format bullet items into distinct micro-cards if bullet points are present
  const bulletItems = textToParse
    .split(/(?:^|\n+)\s*[•\-\*]\s+/g)
    .map(item => item.trim())
    .filter(Boolean);

  if (bulletItems.length > 1 || (textToParse.trim().startsWith('•') && bulletItems.length >= 1)) {
    return (
      <div className="space-y-3 my-1">
        {bulletItems.map((itemStr, idx) => {
          // Ensure space after colon before words (e.g. ":nową" -> ": nową")
          const normalizedItem = itemStr.replace(/:([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ])/g, ': $1');
          const parts = normalizedItem.split(/(\*\*[^*]+\*\*)/g);

          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-[#0E1522]/90 border border-white/10 hover:border-amber-500/30 transition-all shadow-sm group"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFB800] shadow-[0_0_8px_rgba(255,184,0,0.6)] shrink-0 mt-2" />
              <div className="flex-1 text-slate-200 text-sm sm:text-base leading-relaxed break-words font-normal">
                {parts.map((part, pIdx) => {
                  if (!part) return null;
                  if (part.startsWith('**') && part.endsWith('**')) {
                    const boldText = part.slice(2, -2);
                    return (
                      <strong key={pIdx} className="font-bold text-white tracking-wide mr-1">
                        <MathRenderer content={boldText} />
                      </strong>
                    );
                  }
                  return <MathRenderer key={pIdx} content={part} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Standard non-bullet inline text formatting
  const normalizedText = textToParse.replace(/:([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ])/g, ': $1');
  const parts = normalizedText.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={index} className="font-bold text-white mr-1">
              <MathRenderer content={boldText} />
            </strong>
          );
        }
        return <MathRenderer key={index} content={part} />;
      })}
    </>
  );
}

export function resolveTrueFalseTarget(task: any): 'P' | 'F' {
  const raw = String(task?.correct_answer || task?.correctAnswer || task?.statements?.[0]?.correct || '').trim().toUpperCase();
  if (raw.startsWith('P') || raw.startsWith('T') || raw === 'TRUE' || raw === 'PRAWDA') return 'P';
  if (raw.startsWith('F') || raw === 'FALSE' || raw === 'FAŁSZ') return 'F';
  if (raw === 'A') {
    const optA = task?.options?.find((o: any) => o.id === 'A');
    if (optA && (optA.text?.toUpperCase().includes('FAŁSZ') || optA.text?.toUpperCase().includes('FALSE'))) return 'F';
    return 'P';
  }
  if (raw === 'B') {
    const optB = task?.options?.find((o: any) => o.id === 'B');
    if (optB && (optB.text?.toUpperCase().includes('PRAWDA') || optB.text?.toUpperCase().includes('TRUE'))) return 'P';
    return 'F';
  }
  const correctOpt = task?.options?.find((o: any) => o.is_correct);
  if (correctOpt) {
    const txt = String(correctOpt.text || correctOpt.id || '').toUpperCase();
    if (txt.includes('PRAWDA') || txt.includes('TRUE') || txt === 'P' || correctOpt.id === 'A') return 'P';
    if (txt.includes('FAŁSZ') || txt.includes('FALSE') || txt === 'F' || correctOpt.id === 'B') return 'F';
  }
  return 'P';
}

/**
 * Sanitizes and cleans up examiner tips, replacing sensationalist phrases (e.g. ALL CAPS "ŻELAZNY PEWNIAK")
 * with a professional, mentoring tone.
 */
export function sanitizeExaminerTip(text: string): string {
  if (!text) return '';
  let cleaned = text.trim()
    .replace(/^(?:wskazówka\s+egzaminatora\s+cke|wskazówka\s+egzaminatora|wskazówka\s+cke|wskazówka)\s*[:\-–!]\s*/i, '')
    // Strip case-insensitive CKE / maturalny pseudo-headings up to 70 chars
    .replace(/^[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9\s$.,()–—\-]{2,70}?\s*(?:CKE|maturaln[a-ząćęłńóśźż]+)\s*(?:dla\s+zadania\s+za\s+\d+\s*pkt)?\s*[:\-–!]\s*/i, '')
    // Strip common pedagogical pseudo-headings
    .replace(/^(?:żelazna\s+zasada[a-ząćęłńóśźż\s]*|złota\s+(?:zasada|reguła)[a-ząćęłńóśźż\s]*|kluczowa\s+zasada[a-ząćęłńóśźż\s]*|klucz\s+do[a-ząćęłńóśźż\s]*|algorytm[a-ząćęłńóśźż\s]*|schemat[a-ząćęłńóśźż\s]*|checklista[a-ząćęłńóśźż\s]*|błyskawiczny\s+(?:odczyt|sposób)|błyskawiczne\s+wyznaczanie\s+boków|trik\s+(?:z|na)[a-ząćęłńóśźż\s]*|strategia\s+wyboru\s+narzędzia|trójki\s+pitagorejskie\s+na\s+pamięć|najpopularniejsza\s+cecha\s+na\s+maturze|warunek\s+styczności\s+na\s+maturze|częste\s+przekroje\s+na\s+maturze|praktyczny\s+sposób\s+na\s+równanie\s+prostej|przejście\s+z\s+postaci\s+ogólnej\s+do\s+kierunkowej|skracanie\s+silni|metoda\s+sklejenia|zadania\s+z\s+dodawaniem\s+kul|zestawienie\s+miar\s+w\s+1\s+minutę|przewodnik\s+wyboru\s+metody|kwadrat\s+optymalny|zliczanie\s+odcinków\s+siatki|odejmij\s+bramę\s+na\s+samym\s+początku|pole\s+trójkąta\s+z\s+sumą\s+boków|kluczowy\s+skrót\s+matematyczny|bilans\s+obwodu\s+okna\s+normańskiego|uważaj\s+na\s+(?:treść\s+zadania|potęgi\s+we\s+wzorach|nawias\s+przy\s+odejmowaniu\s+kosztów))\s*[:\-–!]\s*/i, '')
    // Strip uppercase heading prefixes (e.g. "ŻELAZNY SCHEMAT 5 KROKÓW CKE NA 4 PUNKTY:", "OBOWIĄZKOWY KROK 1:", "NIE WYMNAŻAJ NAWIASÓW!")
    .replace(/^[A-ZĄĆĘŁŃÓŚŹŻ0-9\s–—\-]{4,}[:!]\s*/, '')
    .replace(/[Żż]elazny\s+pewniak[^\n:!.]*(?::|!|\.|\b)\s*/gi, '')
    .replace(/\b100%\s+pewniak!?/gi, 'Częsty motyw w arkuszach CKE.')
    .replace(/NIGDY\s+nie\s+daje/g, 'nie daje')
    .replace(/\bNIGDY\b/g, 'nigdy')
    .replace(/\bZAWSZE\b/g, 'zawsze')
    .replace(/\bDOKŁADNY\b/g, 'dokładny')
    .trim();
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Renders the conceptual introduction & definition card with visual hierarchy:
 * - Upper card: Conceptual definition with stylish left accent border (border-l-4)
 * - Lower cards: Extracted key formulas and operational rules (e.g. Podwyżka/Obniżka)
 */
function renderConceptEssenceCard(rawText: string | any, isPolishSession: boolean, diagram?: any, numberLine?: any) {
  if (!rawText && !diagram && !numberLine) return null;
  let textToParse = '';
  if (typeof rawText === 'string') {
    textToParse = rawText;
  } else if (Array.isArray(rawText)) {
    textToParse = rawText.map(item => (typeof item === 'string' ? item : item?.text || item?.description || '')).filter(Boolean).join('\n\n');
  } else if (typeof rawText === 'object' && rawText !== null) {
    if (rawText.lead || rawText.pillars || rawText.mental_model) {
      const parts: string[] = [];
      if (rawText.lead) parts.push(rawText.lead);
      if (rawText.pillars && Array.isArray(rawText.pillars)) {
        parts.push(rawText.pillars.map((p: any) => p.title ? `**${p.title}**: ${p.description || ''}` : (p.description || '')).join('\n\n'));
      }
      if (rawText.mental_model) parts.push(`*Model myślowy:* ${rawText.mental_model}`);
      textToParse = parts.filter(Boolean).join('\n\n');
    } else {
      textToParse = rawText.description || rawText.text || '';
    }
  } else if (rawText) {
    textToParse = String(rawText);
  }

  // Pre-sanitize: fix any unintended LaTeX backslash escapes that got mangled into JSON newlines/tabs
  textToParse = textToParse
    .replace(/(?:\n|^)\s*eq(?![a-zA-Z])/g, '\\neq ')
    .replace(/\n\s*ot(?![a-zA-Z])/g, '\\not ')
    .replace(/\t\s*imes(?![a-zA-Z])/g, '\\times ');

  // Parse lines or sentences, guaranteeing we never break math formulas or formula continuations
  const rawLines = textToParse.split(/\n+/).map(p => p.trim()).filter(Boolean);
  const rawParagraphs: string[] = [];
  for (const line of rawLines) {
    if (rawParagraphs.length === 0) {
      rawParagraphs.push(line);
      continue;
    }
    const prev = rawParagraphs[rawParagraphs.length - 1];
    const prevDollarCount = (prev.match(/\$/g) || []).length;
    const isInsideMath = prevDollarCount % 2 === 1;
    const isFormulaContinuation = /^(?:\\?neq\b|eq\b|\\?le\b|\\?ge\b|[=<>+\-*,;]|\p{Ll})/u.test(line) || line.startsWith(')');

    if (isInsideMath || isFormulaContinuation) {
      rawParagraphs[rawParagraphs.length - 1] += ' ' + line;
    } else {
      rawParagraphs.push(line);
    }
  }

  const sentences: string[] = [];
  
  if (rawParagraphs.length > 1) {
    sentences.push(...rawParagraphs);
  } else if (rawParagraphs.length === 1) {
    // Split sentences safely without breaking inside math mode ($...$) or common abbreviations
    const text = rawParagraphs[0];
    const parts: string[] = [];
    let current = '';
    let inMath = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '$') {
        inMath = !inMath;
        current += char;
      } else if (!inMath && (char === '.' || char === '!' || char === '?')) {
        current += char;
        const rest = text.slice(i + 1);
        const match = rest.match(/^(\s+)([A-ZĄĆĘŁŃÓŚŹŻ])/);
        if (match) {
          const wordBeforeDot = current.slice(-10).toLowerCase();
          if (!/(?:np|tzn|tzw|itd|itp|dr|prof)\.$/.test(wordBeforeDot)) {
            parts.push(current.trim());
            current = '';
            i += match[1].length;
          }
        }
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      parts.push(current.trim());
    }
    sentences.push(...parts.filter(Boolean));
  }

  const leadDefinition = sentences.length > 0 ? sentences[0] : textToParse;
  const supportingClauses = sentences.slice(1);

  return (
    <div className="w-full space-y-4">
      {/* 1. Wyrazista definicja wprowadzająca (Hero Lead Definition) */}
      {leadDefinition && (
        <div className="p-3.5 sm:p-4 rounded-xl border-l-4 border border-l-[#FFB800] border-white/10 bg-white/[0.03] text-slate-200 text-sm sm:text-base leading-relaxed shadow-sm">
          {renderMicroContent(leadDefinition)}
        </div>
      )}

      {/* 2. Dedykowany moduł wizualny (diagram bez podwójnych ramek) */}
      {(diagram || numberLine) && (
        <div className="w-full flex justify-center py-1">
          {diagram ? (
            <MathDiagram diagram={diagram} borderless hideTitle={true} />
          ) : numberLine ? (
            <div className="w-full max-w-lg bg-black/30 border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider self-start flex items-center gap-1.5">
                <Target size={13} className="text-amber-400" />
                <span>Interpretacja na osi liczbowej:</span>
              </span>
              <NumberLineDiagram data={numberLine} height={64} maxWidth="400px" />
            </div>
          ) : null}
        </div>
      )}

      {/* 3. Filary pojęciowe i kluczowe reguły (czytelna siatka zamiast zbitego tekstu) */}
      {supportingClauses.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GraduationCap size={14} className="text-[#FFB800]" />
            <span>Kluczowe zasady i własności</span>
          </div>
          <div className={`grid gap-2.5 ${supportingClauses.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {supportingClauses.map((clause, idx) => {
              let label = `Zasada ${idx + 1}`;
              let dotColor = 'bg-[#FFB800]';
              let textColor = 'text-[#FFB800]';

              const isLogarithm = /logarytm|\\log|\blog\b/i.test(textToParse) || /logarytm|\\log|\blog\b/i.test(clause);

              if (/liczba\s+logarytmowana/i.test(clause)) {
                label = 'Liczba logarytmowana';
                dotColor = 'bg-cyan-400';
                textColor = 'text-cyan-400';
              } else if (/podstawa/i.test(clause)) {
                if (isLogarithm) {
                  label = 'Podstawa logarytmu';
                  dotColor = 'bg-amber-400';
                  textColor = 'text-amber-400';
                } else {
                  label = 'Podstawa potęgi (baza)';
                  dotColor = 'bg-amber-400';
                  textColor = 'text-amber-400';
                }
              } else if (/wykładnik/i.test(clause)) {
                if (isLogarithm) {
                  label = 'Wartość logarytmu (wykładnik)';
                  dotColor = 'bg-emerald-400';
                  textColor = 'text-emerald-400';
                } else {
                  label = 'Wykładnik (licznik operacji)';
                  dotColor = 'bg-cyan-400';
                  textColor = 'text-cyan-400';
                }
              } else if (/wartość\s+logarytmu/i.test(clause)) {
                label = 'Wartość logarytmu';
                dotColor = 'bg-emerald-400';
                textColor = 'text-emerald-400';
              } else if (/cke|bazy|odruch|odruchem|najprostsz/i.test(clause)) {
                label = 'Wskazówka maturalna';
                dotColor = 'bg-emerald-400';
                textColor = 'text-emerald-400';
              } else if (/^podwyżka/i.test(clause)) {
                label = 'Podwyżka procentowa';
              } else if (/^obniżka/i.test(clause)) {
                label = 'Obniżka procentowa';
              } else if (/^wzór/i.test(clause)) {
                label = 'Zapis formalny';
              }

              let sanitizedClause = clause
                .replace(/^eq(?![a-zA-Z])/i, 'a \\neq ')
                .replace(/^\$eq(?![a-zA-Z])/i, '$a \\neq ')
                .trim();

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-1.5 shadow-sm"
                >
                  <span className={`text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${textColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    {label}
                  </span>
                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {renderMicroContent(sanitizedClause)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper to normalize worked examples whether they come as strings, objects or arrays
 */
interface NormalizedWorkedExample {
  problem: string;
  steps: { num: number | string; label?: string; text: string }[];
  result?: string;
  numberLine?: any;
  diagram?: any;
  plot?: any;
}

function normalizeWorkedExample(raw: any): NormalizedWorkedExample | null {
  if (!raw) return null;

  if (typeof raw === 'object') {
    if (raw.quote || raw.fragment || raw.source_text) {
      const quoteText = raw.quote || raw.fragment || raw.source_text;
      const questionText = raw.question ? `\n\n**Zadanie CKE:** ${raw.question}` : '';
      const titleText = raw.title ? `**${raw.title}**\n\n` : '';
      const problem = `${titleText}„${String(quoteText).replace(/^[„"']|[”"']$/g, '')}”${questionText}`;
      const steps: { num: number | string; label?: string; text: string }[] = [];
      if (raw.context) {
        steps.push({ num: 1, label: 'Kontekst i geneza fragmentu', text: raw.context });
      }
      if (raw.analysis) {
        steps.push({ num: steps.length + 1, label: 'Analiza motywu i wymowa fragmentu', text: raw.analysis });
      }
      if (raw.model_solution || raw.interpretation) {
        steps.push({ num: steps.length + 1, label: 'Modelowa interpretacja CKE', text: raw.model_solution || raw.interpretation });
      }
      if (raw.matura_tip || raw.examiner_tip) {
        steps.push({ num: steps.length + 1, label: 'Wskazówka egzaminatora', text: raw.matura_tip || raw.examiner_tip });
      }
      return {
        problem,
        steps: steps.length > 0 ? steps : [{ num: 1, label: 'Klucz interpretacyjny', text: raw.analysis || quoteText }],
        result: raw.result || raw.thesis || undefined,
        numberLine: raw.numberLine || raw.number_line,
        diagram: raw.diagram,
        plot: raw.plot
      };
    }
    if (raw.text_fragment) {
      const problem = `${raw.text_fragment}\n\n**Polecenie:** ${raw.question || ''}`;
      const steps: { num: number | string; label?: string; text: string }[] = [];
      if (raw.model_solution) {
        steps.push({ num: 1, label: 'Wzorcowa odpowiedź', text: raw.model_solution });
      }
      if (raw.examiner_tip) {
        steps.push({ num: 2, label: 'Wskazówka egzaminatora', text: raw.examiner_tip });
      }
      return {
        problem,
        steps,
        result: raw.result || undefined,
        numberLine: raw.numberLine || raw.number_line,
        diagram: raw.diagram,
        plot: raw.plot
      };
    }
    const steps: { num: number | string; label?: string; text: string }[] = [];
    if (raw.step1) steps.push({ num: 1, text: typeof raw.step1 === 'string' ? raw.step1 : (raw.step1.explanation || raw.step1.text || String(raw.step1)) });
    if (raw.step2) steps.push({ num: 2, text: typeof raw.step2 === 'string' ? raw.step2 : (raw.step2.explanation || raw.step2.text || String(raw.step2)) });
    if (Array.isArray(raw.steps)) {
      raw.steps.forEach((s: any, idx: number) => {
        const text = typeof s === 'string' ? s : (s.explanation || s.text || s.step || String(s));
        const label = typeof s === 'object' && s.label ? s.label : undefined;
        steps.push({ num: s.num || s.step_num || idx + 1, label, text });
      });
    }
    return {
      problem: raw.problem || raw.question || raw.task || raw.text || '',
      steps,
      result: raw.result || raw.answer || raw.odpowiedz,
      numberLine: raw.numberLine || raw.number_line,
      diagram: raw.diagram,
      plot: raw.plot
    };
  }

  if (typeof raw === 'string') {
    const text = raw.trim();
    if (!text) return null;

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let problem = '';
    const steps: { num: number | string; label?: string; text: string }[] = [];
    let result: string | undefined = undefined;
    let stepCounter = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();

      if (lower.startsWith('odpowiedź:') || lower.startsWith('odpowiedz:') || lower.startsWith('odp:')) {
        result = line.replace(/^(?:odpowiedź|odpowiedz|odp):\s*/i, '').trim();
      } else if (lower.startsWith('krok ') || lower.startsWith('krok:')) {
        const match = line.match(/^krok\s*(\d+)?:?\s*(.*)$/i);
        const num = match?.[1] ? parseInt(match[1], 10) : stepCounter++;
        const content = match?.[2] || line;
        steps.push({ num, text: content });
      } else if (lower.startsWith('rozwiązanie:') || lower.startsWith('rozwiazanie:')) {
        const content = line.replace(/^(?:rozwiązanie|rozwiazanie):\s*/i, '').trim();
        steps.push({ num: stepCounter++, label: 'Rozwiązanie', text: content });
      } else if (!problem) {
        problem = line;
      } else {
        steps.push({ num: stepCounter++, text: line });
      }
    }

    if (!problem && steps.length > 0) {
      problem = steps.shift()!.text;
    }

    return {
      problem: problem || text,
      steps,
      result
    };
  }

  return null;
}

/**
 * Bezpiecznik dynamiczny: jeśli teoria lekcji nie posiada jawnego worked_example,
 * syntetyzuje modelową analizę CKE z pierwszego zadania lekcji.
 */
function deriveWorkedExampleFromTasks(
  tasksList?: any[],
  theory?: any,
  isPolish?: boolean,
  isEnglish?: boolean
): NormalizedWorkedExample | null {
  if (!tasksList || !tasksList.length) return null;
  const candidate = tasksList.find((t: any) => t.explanation && (t.question || t.instruction)) || tasksList[0];
  if (!candidate) return null;

  const rawProblem = (candidate as any).instruction || candidate.question || '';
  const cleanProblem = String(rawProblem).trim();
  if (!cleanProblem) return null;

  const steps: { num: number | string; label?: string; text: string }[] = [];
  const hints = candidate.hints;
  if (hints?.level_1) {
    steps.push({
      num: 1,
      label: isPolish ? 'Identyfikacja problemu i intencji nadawcy' : 'Krok 1: Analiza polecenia',
      text: hints.level_1
    });
  }
  if (hints?.level_2) {
    steps.push({
      num: steps.length + 1,
      label: isPolish ? 'Analiza mechanizmu językowego i kryteriów CKE' : 'Krok 2: Tok rozumowania',
      text: hints.level_2
    });
  }
  if ((candidate as any).explanation) {
    steps.push({
      num: steps.length + 1,
      label: isPolish ? 'Wzorcowe uzasadnienie CKE' : 'Rozwiązanie krok po kroku',
      text: (candidate as any).explanation
    });
  }

  let resultText: string | undefined = undefined;
  if (candidate.type === 'SINGLE_CHOICE' && candidate.options) {
    const correctOpt = candidate.options.find((o: any) => o.is_correct || o.isCorrect);
    if (correctOpt) {
      resultText = correctOpt.text;
    }
  } else if ((candidate as any).correct_answer) {
    resultText = String((candidate as any).correct_answer);
  } else if ((candidate as any).explanation) {
    resultText = (candidate as any).explanation;
  }

  if (steps.length === 0) {
    steps.push({
      num: 1,
      label: isPolish ? 'Wskazówka analityczna CKE' : 'Krok rozwiązania',
      text: (candidate as any).explanation || 'Przeanalizuj treść zadania pod kątem kluczowych pojęć z leksykonu.'
    });
  }

  return {
    problem: cleanProblem,
    steps,
    result: resultText
  };
}

export interface FormattedFormulaItem {
  title?: string;
  latex: string;
  description?: string;
  cke_page?: string | number;
  in_cke_sheet?: boolean;
  matura_tip?: string;
  mnemonic?: string;
  example?: string;
  numberLine?: any;
  diagram?: any;
}

/**
 * Helper to extract array of formulas safely with title, latex and description
 */
function getCoreFormulas(raw: any): FormattedFormulaItem[] {
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
      const cke_page = item.cke_page || item.ckePage || item.tablice_str || item.page;
      const in_cke_sheet = item.in_cke_sheet ?? item.inCkeSheet ?? (cke_page ? true : undefined);
      const matura_tip = item.matura_tip || item.maturaTip || item.patent || item.tip;
      const mnemonic = item.mnemonic || item.mnemonika || item.visual_rule || item.skrot;
      const example = item.example || item.przyklad || item.mini_example;
      const numberLine = item.numberLine || item.number_line;
      const diagram = item.diagram || item.plot;

      if (latex || title || description || matura_tip || mnemonic || numberLine || diagram) {
        results.push({
          title: title ? String(title).trim() : undefined,
          latex: latex ? String(latex).trim() : (title ? String(title).trim() : ''),
          description: description ? String(description).trim() : undefined,
          cke_page: cke_page ? String(cke_page).trim() : undefined,
          in_cke_sheet: in_cke_sheet,
          matura_tip: matura_tip ? String(matura_tip).trim() : undefined,
          mnemonic: mnemonic ? String(mnemonic).trim() : undefined,
          example: example ? String(example).trim() : undefined,
          numberLine,
          diagram
        });
      }
    }
  }

  return results;
}

export interface SessionRunnerProps {
  sessionData: {
    lessonId: string;
    lessonTitle: string;
    tasks: any[];
    formulaSheet?: LessonFormulaSheet | null;
    theoryPill?: LessonTheoryPill | null;
    nextLesson?: any;
    allTaskIdsToMarkCompleted?: string[];
    required_correct_tasks?: number;
    estimated_time_formatted?: string;
    sessionId?: string;
    taskQueue?: any[];
    currentQueueIndex?: number;
    currentStep?: number;
    theorySubStep?: number;
    selectedOption?: string | null;
    openAnswerText?: string;
    openCanvasDataUrl?: string;
    activeSeconds?: number;
    sessionMistakesCount?: number;
    correctAnswersCount?: number;
    correctlySolvedTaskIds?: string[];
    numericInput?: string;
    tfSelections?: Record<string, 'P' | 'F'>;
    twoPart1?: string | null;
    twoPart2?: string | null;
    isRestoredSession?: boolean;
    [key: string]: any;
  };
  userState?: UserState;
  onCompleteSession: (
    taskIds?: string | string[],
    stars?: number,
    earnedXp?: number,
    earnedCoins?: number,
    nextLesson?: any,
    sessionDurationSeconds?: number,
    mistakesCount?: number
  ) => void;
  onCancelSession: () => void;
  onDeductCoins?: (amount: number) => boolean;
  onDeductHeart?: () => { wasDeducted: boolean; isOutOfHearts: boolean };
  onOpenParentSponsor?: () => void;
  onOpenProPopup?: () => void;
  onOpenBlikModal?: () => void;
  onUpdateUserState?: (updater: (prev: UserState) => UserState) => void;
  guestPromoSecondsLeft?: number;
  onOpenGuestPromo?: () => void;
}

export function sanitizeLessonHeading(title?: string): string {
  if (!title) return '';
  let cleaned = title.trim();
  // Fix "Lekcja dzial-11-lekcja-1: ..." or "dzial-11-lekcja-1: ..." -> "Lekcja 11.1: ..."
  cleaned = cleaned.replace(/^(?:Lekcja\s+)?(?:dzial[.-]?(\d+)[-_.]lekcja[-_.]?(\d+))\s*[:.]\s*/i, 'Lekcja $1.$2: ');
  // Fix "Lekcja lesson-1-2: ..." -> "Lekcja 1.2: ..."
  cleaned = cleaned.replace(/^Lekcja\s+(?:pol|eng|mat-roz|math-roz|eng-roz)?[-_]?lesson-(\d+)-(\d+)\s*[:.]\s*/i, 'Lekcja $1.$2: ');
  // Fix "lesson-1-2: ..." -> "Lekcja 1.2: ..."
  cleaned = cleaned.replace(/^(?:pol|eng|mat-roz|math-roz|eng-roz)?[-_]?lesson-(\d+)-(\d+)\s*[:.]\s*/i, 'Lekcja $1.$2: ');
  // Fix double prefixes like "Lekcja 8.1: 8.1: Paszport Epoki..." -> "Lekcja 8.1: Paszport Epoki..."
  cleaned = cleaned.replace(/^Lekcja\s+(\d+[-.]\d+)\s*[:.]\s*(?:Lekcja\s+\1\s*[:.]\s*|\1\s*[:.]\s*)+/i, 'Lekcja $1: ');
  // Fix "8.1: 8.1: ..." -> "Lekcja 8.1: ..."
  cleaned = cleaned.replace(/^(\d+[-.]\d+)\s*[:.]\s*(?:\1\s*[:.]\s*)+/i, 'Lekcja $1: ');
  // Fix "Lekcja 8.1: Lekcja 8.1: ..." -> "Lekcja 8.1: ..."
  cleaned = cleaned.replace(/^(Lekcja\s+\d+[-.]\d+:\s*)(?:Lekcja\s+\d+[-.]\d+:\s*)+/i, '$1');
  // Fix "Sprawdzian:\s*Sprawdzian" -> "Sprawdzian:"
  // Fix internal codes like "L1.1.1: ..." -> clean title
  cleaned = cleaned.replace(/^L\d+(?:\.\d+)+\s*[:\-–]?\s*/i, '');
  return cleaned;
}

// Safe validator for emergency fallback theory pill
export const isEmergencyFallback = (pill: any): boolean => {
  if (!pill || !pill.concept_essence) return true;
  if (typeof pill.concept_essence === 'string') {
    return pill.concept_essence.includes('Zapoznaj się z kluczowymi') || pill.concept_essence.includes('Zapoznaj sie z kluczowymi');
  }
  if (typeof pill.concept_essence === 'object' && pill.concept_essence !== null) {
    const textVal = pill.concept_essence.text || pill.concept_essence.lead || pill.concept_essence.description || '';
    if (typeof textVal === 'string') {
      return textVal.includes('Zapoznaj się z kluczowymi') || textVal.includes('Zapoznaj sie z kluczowymi');
    }
  }
  return false;
};

export const SessionRunner: React.FC<SessionRunnerProps> = ({
  sessionData,
  userState,
  onCompleteSession,
  onCancelSession,
  onDeductCoins,
  onDeductHeart,
  onOpenParentSponsor,
  onOpenProPopup,
  onOpenBlikModal,
  onUpdateUserState,
  guestPromoSecondsLeft,
  onOpenGuestPromo
}) => {
  const {
    lessonId = '1.1',
    lessonTitle: rawLessonTitle = 'Lekcja 1.1',
    tasks = [],
    formulaSheet,
    nextLesson,
    allTaskIdsToMarkCompleted = []
  } = sessionData;

  const lessonTitle = sanitizeLessonHeading(rawLessonTitle);

  // Stable session identifier for real-time recovery
  const sessionId = useMemo(() => {
    return sessionData?.sessionId || generateSessionId(lessonId);
  }, [sessionData?.sessionId, lessonId]);

  const isEnglishSession = Boolean(
    (sessionData as any)?.isEnglish ||
    (sessionData as any)?.subjectId === 'jezyk-angielski' ||
    (sessionData as any)?.subjectId === 'angielski' ||
    (sessionData as any)?.subjectKey === 'eng' ||
    String(lessonId).startsWith('eng-') ||
    String((sessionData as any)?.topicId || '').startsWith('eng-')
  );

  const isPolishSession = !isEnglishSession && Boolean(
    (sessionData as any)?.isPolish ||
    (sessionData as any)?.subjectId === 'jezyk-polski' ||
    (sessionData as any)?.subjectId === 'polski' ||
    (sessionData as any)?.subjectKey === 'pol' ||
    String(lessonId).startsWith('pol-') ||
    String((sessionData as any)?.topicId || '').startsWith('pol-') ||
    formulaSheet?.isLeksykon === true ||
    (sessionData as any)?.theoryPill?.leksykon
  );

  const isMathExplicit = !isEnglishSession && !isPolishSession && Boolean(
    (sessionData as any)?.subjectId === 'matematyka-podstawowa' ||
    (sessionData as any)?.subjectId === 'matematyka' ||
    (sessionData as any)?.subjectId === 'math' ||
    (sessionData as any)?.subjectKey === 'math' ||
    String(lessonId).match(/^(?:math[-_]?)?lesson-\d+-\d+/) ||
    String((sessionData as any)?.topicId || '').match(/^(?:math[-_]?)?dzial-\d+/) ||
    String(lessonId).match(/^\d+\.\d+$/)
  );

  // Serca i ochrona PRO
  const heartsData = getSyncedHearts(userState);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState<boolean>(false);
  const [showParentSponsorModal, setShowParentSponsorModal] = useState<boolean>(false);
  const [showProPopup, setShowProPopup] = useState<boolean>(false);
  const [showHeartsPopover, setShowHeartsPopover] = useState<boolean>(false);
  const [isHeartShaking, setIsHeartShaking] = useState<boolean>(false);
  const [pillShockwave, setPillShockwave] = useState<boolean>(false);
  const [pillImpactDone, setPillImpactDone] = useState<boolean>(false);
  const [heartFlyAnim, setHeartFlyAnim] = useState<{
    active: boolean;
    key: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    currentHearts: number;
    nextHearts: number;
  } | null>(null);

  // Dynamiczny wymóg zaliczenia zadań – odczytywany z obiektu lekcji
  const targetCorrectAnswers = sessionData.required_correct_tasks || (sessionData as any).tasksRequired || 4;
  const [sessionMistakesCount, setSessionMistakesCount] = useState<number>(() => sessionData?.sessionMistakesCount ?? 0);

  const [taskQueue, setTaskQueue] = useState<any[]>(() => {
    if (sessionData?.taskQueue && sessionData.taskQueue.length > 0) return [...sessionData.taskQueue];
    if (sessionData?.tasks && sessionData.tasks.length > 0 && sessionData?.isRestoredSession) return [...sessionData.tasks];
    if (tasks && tasks.length >= targetCorrectAnswers) return [...tasks];
    const pool = getLessonTaskPool(lessonId);
    if (pool.length > 0) {
      const drawn = drawSessionTasks(lessonId);
      return drawn.sessionTasks.length > 0 ? drawn.sessionTasks : [...tasks];
    }
    return [...tasks];
  });
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(() => sessionData?.currentQueueIndex ?? 0);
  const [currentStep, setCurrentStep] = useState<number>(() => sessionData?.currentStep ?? 0); // 0: Pigułka wiedzy, 1: Zadania
  const [theorySubStep, setTheorySubStep] = useState<number>(() => sessionData?.theorySubStep ?? 0); // 0: Istota i Strategia, 1: Wzory / Pojęcia, 2: Przykład / Analiza, 3: Pułapka CKE
  const [selectedOption, setSelectedOption] = useState<string | null>(() => sessionData?.selectedOption ?? null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Stan interaktywnego mini-wyzwania bramkowego w zakładce Istota (Active Recall dla j. polskiego)
  const [gatekeeperSelected, setGatekeeperSelected] = useState<Record<string, number>>({});
  const [gatekeeperShowHint, setGatekeeperShowHint] = useState<Record<string, boolean>>({});
  const [expandedTraps, setExpandedTraps] = useState<Record<string, boolean>>({});

  // Gatekeeper pułapki CKE (Typowy błąd) dla języka angielskiego
  const [isEnglishTrapPassed, setIsEnglishTrapPassed] = useState<boolean>(() => {
    if (!isEnglishSession) return true;
    try {
      return localStorage.getItem(`jasne_trap_passed_${lessonId}`) === 'true';
    } catch {
      return false;
    }
  });

  const handleEnglishTrapPassed = () => {
    setIsEnglishTrapPassed(true);
    const xpKey = `jasne_trap_xp_${lessonId}`;
    try {
      if (localStorage.getItem(xpKey) !== 'true') {
        localStorage.setItem(xpKey, 'true');
        if (onUpdateUserState) {
          onUpdateUserState(prev => ({
            ...prev,
            xp: (prev.xp || 0) + 5
          }));
        }
      }
    } catch {
      // Ignoruj błąd zapisu
    }
  };

  // Active Time Tracking Engine: Tracks active study time with 120s inactivity & visibility auto-pause
  const [activeSeconds, setActiveSeconds] = useState<number>(() => sessionData?.activeSeconds ?? 0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const lastActivityRef = React.useRef<number>(Date.now());


  // Theory Pill resolution: provided in payload or fetched from lesson curriculum with resilient fallback
  const [asyncTheoryPill, setAsyncTheoryPill] = useState<any>(() => {
    if (sessionData?.theoryPill && !isEmergencyFallback(sessionData.theoryPill)) {
      return enrichTheoryPillWithVisual(sessionData.theoryPill, lessonId);
    }
    const cached = curriculumRepository.getCachedLesson(lessonId, (sessionData as any)?.subjectId);
    if (cached?.theory_pill && !isEmergencyFallback(cached.theory_pill)) {
      return enrichTheoryPillWithVisual(cached.theory_pill, lessonId);
    }
    if (isPolishSession) {
      const polDoc = getPolishLessonDocument((sessionData as any)?.topicId, lessonId);
      if (polDoc?.theory_pill) {
        return polDoc.theory_pill;
      }
    }
    return sessionData?.theoryPill || null;
  });

  const theoryPill: LessonTheoryPill = useMemo(() => {
    const raw = (asyncTheoryPill && !isEmergencyFallback(asyncTheoryPill))
      ? asyncTheoryPill
      : (sessionData.theoryPill && !isEmergencyFallback(sessionData.theoryPill))
        ? sessionData.theoryPill
        : (asyncTheoryPill || sessionData.theoryPill || (isPolishSession ? getPolishLessonDocument((sessionData as any)?.topicId, lessonId)?.theory_pill : null) || getLessonTheoryPill(lessonId) || curriculumRepository.getCachedLesson(lessonId, (sessionData as any)?.subjectId)?.theory_pill);

    if (raw) {
      const normRaw = { ...raw };
      if (isPolishSession) {
        if (!normRaw.polishTheory) {
          const polDoc = getPolishLessonDocument((sessionData as any)?.topicId, lessonId);
          if (polDoc?.theory_pill?.polishTheory) {
            normRaw.polishTheory = polDoc.theory_pill.polishTheory;
          }
        }
        if (!(normRaw as any).book_summary) {
          const bs = getPolishBookSummary(lessonTitle + ' ' + (normRaw.title || '') + ' ' + ((normRaw as any).lektura || (normRaw.polishTheory as any)?.lektura || ''));
          if (bs) {
            (normRaw as any).book_summary = bs;
          }
        }
      }
      if (!normRaw.worked_example && (raw as any).workedExample) {
        normRaw.worked_example = (raw as any).workedExample;
      }
      if (!normRaw.exam_trap && ((raw as any).cke_trap || (raw as any).ckeTrap)) {
        const ct = (raw as any).cke_trap || (raw as any).ckeTrap;
        (normRaw as any).cke_trap = ct;
        if (typeof ct === 'string') {
          normRaw.exam_trap = ct.replace(/^[❌⚠️\s]*/, '');
        } else {
          const err = ct.error || ct.typical_mistake || '';
          const corr = ct.correct || ct.correction || ct.solution || '';
          const tip = ct.matura_tip || ct.tip ? `\n\nWskazówka CKE: ${ct.matura_tip || ct.tip}` : '';
          normRaw.exam_trap = `Typowy błąd: ${err}\n\nPoprawnie: ${corr}${tip}`;
        }
      }
      if (!normRaw.keyTakeaway && (raw as any).golden_rule) {
        normRaw.keyTakeaway = (raw as any).golden_rule;
      }
      return enrichTheoryPillWithVisual(normRaw, lessonId);
    }
    return enrichTheoryPillWithVisual({
      title: lessonTitle || `Lekcja ${lessonId}`,
      concept_essence: isPolishSession
        ? 'Zapoznaj się z kluczowymi pojęciami, funkcjami języka i strategiami analizy tekstu.'
        : 'Zapoznaj się z kluczowymi pojęciami, własnościami i wzorami dla tej lekcji.',
      matura_context: isPolishSession
        ? 'Pewniak maturalny w Arkuszu 1 (Język polski w użyciu) – zadania sprawdzają świadomość językową i retoryczną.'
        : 'Pewniak maturalny – opanowanie tego schematu pozwala zdobyć cenne punkty na egzaminie.',
      core_formulas: formulaSheet?.formulas || [],
      worked_example: undefined,
      exam_trap: formulaSheet?.ckeTrap ? `${formulaSheet.ckeTrap.error} ➔ ${formulaSheet.ckeTrap.correct}` : undefined,
      keyTakeaway: formulaSheet?.goldenRule || (isPolishSession ? 'Uważnie analizuj kontekst fragmentu i intencję nadawcy.' : 'Pamiętaj o dokładnym czytaniu polecenia i weryfikacji założeń zadania.')
    } as LessonTheoryPill, lessonId);
  }, [asyncTheoryPill, sessionData.theoryPill, lessonId, lessonTitle, formulaSheet, isPolishSession]);

  // AI Tutor for Open Tasks
  const [openAnswerText, setOpenAnswerText] = useState<string>(() => sessionData?.openAnswerText ?? '');
  const [openCanvasDataUrl, setOpenCanvasDataUrl] = useState<string>(() => sessionData?.openCanvasDataUrl ?? '');
  const latestCanvasDataRef = React.useRef<string>(sessionData?.openCanvasDataUrl ?? '');
  const [isTutorScanning, setIsTutorScanning] = useState<boolean>(false);
  const [isScanFinished, setIsScanFinished] = useState<boolean>(false);
  const pendingEvalDataRef = React.useRef<any>(null);
  /** Backend nie miał żadnego ewaluatora (provider:'none') — nie oceniamy i nie karzemy. */
  const aiEvaluationUnavailableRef = React.useRef<boolean>(false);
  /** Ocena policzona rubryką/heurystyką zamiast AI — UI oznacza ją jako przybliżoną. */
  const usedApproximateEvaluationRef = React.useRef<boolean>(false);
  const [evaluationUnavailable, setEvaluationUnavailable] = useState<boolean>(false);
  const [isApproximateEvaluation, setIsApproximateEvaluation] = useState<boolean>(false);
  const [tutorEvaluation, setTutorEvaluation] = useState<any | null>(null);
  const evaluationCardRef = React.useRef<HTMLDivElement>(null);
  const [showModelSolution, setShowModelSolution] = useState<boolean>(false);

  // Statistics: postęp mierzony liczbą poprawnych odpowiedzi (wymóg: 4)
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(() => sessionData?.correctAnswersCount ?? 0);
  const [correctlySolvedTaskIds, setCorrectlySolvedTaskIds] = useState<string[]>(() => sessionData?.correctlySolvedTaskIds ?? []);
  const [earnedXp, setEarnedXp] = useState<number>(() => sessionData?.earnedXp ?? 0);
  const [earnedCoins, setEarnedCoins] = useState<number>(() => sessionData?.earnedCoins ?? 0);

  // Modals & Drawers
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showFormulaSheet, setShowFormulaSheet] = useState<boolean>(false);
  const [formulaSearchQuery, setFormulaSearchQuery] = useState<string>('');
  const [formulaViewMode, setFormulaViewMode] = useState<'department' | 'all'>('department');
  const [selectedFormulaCkeTopic, setSelectedFormulaCkeTopic] = useState<string>('all');
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(() => Boolean(sessionData?.isSessionComplete || (sessionData?.correctAnswersCount && sessionData.correctAnswersCount >= targetCorrectAnswers)));

  // Scroll Container Ref do resetowania pozycji przewijania przy każdym nowym kroku
  const taskAreaRef = React.useRef<HTMLElement>(null);
  const ckeChipsScrollRef = React.useRef<HTMLDivElement>(null);

  const isTheoryStep = currentStep === 0;

  // Synchronizacja liczby serc z animacją – zmiana dopiero w momencie uderzenia komety.
  // Zawsze pokazujemy realny stan (∞ tylko w PRO), żeby licznik zgadzał się z nagłówkiem aplikacji.
  const displayedHeartsCount = useMemo(() => {
    if (heartsData.isPro) return '∞';
    if (heartFlyAnim?.active && !pillImpactDone) {
      return heartFlyAnim.currentHearts;
    }
    return heartsData.hearts;
  }, [heartsData, heartFlyAnim, pillImpactDone]);

  // Bieżąca wartość isEvaluated dostępna także dla handlerów z poprzedniego renderu (patrz handleNextStep)
  const isEvaluatedLiveRef = React.useRef(false);
  isEvaluatedLiveRef.current = isEvaluated;
  const rawCurrentTask = taskQueue[currentQueueIndex] || taskQueue[0] || tasks[0];
  const currentTask = useMemo(() => {
    if (!rawCurrentTask) return rawCurrentTask;
    return enrichTaskWithVisual(rawCurrentTask, lessonId);
  }, [rawCurrentTask, lessonId]);

  // Task format classification
  const isSwipeTask = false;
  const isCardinalTask = false;
  const isArgumentBuilderTask = false;
  const isSynthesisTask = false;
  const isPolishInteractiveTask = false;

  const isNumericTask = currentTask?.type === 'NUMERIC_INPUT';
  const isTrueFalseTask = currentTask?.type === 'TRUE_FALSE';
  const isTwoPartTask = currentTask?.type === 'TWO_PART' || Boolean(currentTask?.part_1 && currentTask?.part_2);
  const isOpenTask = (
    currentTask?.type === 'OPEN_PROOF' || 
    currentTask?.type === 'OPEN_CALCULATION' ||
    currentTask?.type === 'OPEN_TASK' || 
    currentTask?.type === 'OPEN_GENERAL' ||
    currentTask?.type === 'OPEN' ||
    currentTask?.type === 'OPEN_SHORT' ||
    currentTask?.type === 'OPEN_SYNTHESIS' ||
    currentTask?.type === 'SHORT_ANSWER' ||
    currentTask?.type === 'ESSAY' ||
    currentTask?.pillarId === 'pillar-writing'
  ) && !isNumericTask && !isTrueFalseTask && !isTwoPartTask && !isPolishInteractiveTask;
  const isSingleChoice = !isOpenTask && !isNumericTask && !isTrueFalseTask && !isTwoPartTask && !isPolishInteractiveTask;

  const isEnglishWriting = isEnglishSession && (
    currentTask?.type === 'OPEN_TASK' ||
    currentTask?.pillarId === 'pillar-writing' ||
    String(currentTask?.id).startsWith('eng_wri_') ||
    (currentTask?.points || 0) >= 10 ||
    /e-mail|blog|list|wpis|forum|wypowiedź pisemna|task 12|zadanie 12/i.test(currentTask?.question || '')
  );
  const isPolishEssay = isPolishSession && (
    (currentTask?.points || 0) >= 30 ||
    currentTask?.type === 'ESSAY' ||
    /wypracowan|rozprawk/i.test(currentTask?.question || '')
  );
  const isPolishSynthesis = isPolishSession && (
    (currentTask?.points || 0) === 4 ||
    /notatk[ai]|syntez/i.test(currentTask?.question || '') ||
    String(currentTask?.id).includes('synt')
  );
  const isRichWritingTask = isOpenTask && (isEnglishWriting || isPolishEssay || isPolishSynthesis);

  const isAiHintTask = Boolean(isOpenTask || currentTask?.ai_hint_enabled);
  const currentTaskHintCost = typeof currentTask?.hint_cost === 'number'
    ? currentTask.hint_cost
    : (typeof currentTask?.hint_cost === 'object' && (currentTask.hint_cost as any)?.level_1)
      ? (currentTask.hint_cost as any).level_1
      : (isAiHintTask ? 20 : 10);

  // New task format interaction states
  const [numericInput, setNumericInput] = useState<string>(() => sessionData?.numericInput ?? sessionData?.openAnswerText ?? '');
  const [tfSelections, setTfSelections] = useState<Record<string, 'P' | 'F'>>(() => sessionData?.tfSelections ?? {});
  const [twoPart1, setTwoPart1] = useState<string | null>(() => sessionData?.twoPart1 ?? null);
  const [twoPart2, setTwoPart2] = useState<string | null>(() => sessionData?.twoPart2 ?? null);

  // Dwutorowy System Wskazówek (Hint Economy)
  const [unlockedHints, setUnlockedHints] = useState<Record<string, string>>(() => sessionData?.unlockedHints ?? {});
  const [isHintExpanded, setIsHintExpanded] = useState<Record<string, boolean>>({});
  const [isHintSheetOpen, setIsHintSheetOpen] = useState<boolean>(false);
  const [isAiHintLoading, setIsAiHintLoading] = useState<boolean>(false);
  const [localCoins, setLocalCoins] = useState<number>(() => userState?.coins ?? 100);
  const currentCoins = userState?.coins ?? localCoins;
  const isHintUnlocked = Boolean(currentTask?.id && unlockedHints[currentTask.id]);

  const spendCoins = (amount: number): boolean => {
    if (currentCoins < amount) return false;
    if (onDeductCoins) {
      const ok = onDeductCoins(amount);
      if (ok) setLocalCoins(prev => Math.max(0, prev - amount));
      return ok;
    }
    setLocalCoins(prev => Math.max(0, prev - amount));
    return true;
  };

  const handleToggleOrBuyHint = async () => {
    if (!currentTask?.id || isAiHintLoading) return;
    const taskId = currentTask.id;
    const hintCost = currentTaskHintCost;
    const isUnlocked = Boolean(unlockedHints[taskId]);

    if (isUnlocked) {
      triggerHaptic('light');
      setIsHintSheetOpen(prev => !prev);
      setIsHintExpanded(prev => ({ ...prev, [taskId]: !prev[taskId] }));
      return;
    }

    if (currentCoins < hintCost) {
      triggerHaptic('warning');
      return;
    }

    // ŚCIEŻKA B: Zadania otwarte (Egzaminator AI)
    if (isAiHintTask) {
      setIsAiHintLoading(true);
      triggerHaptic('medium');
      try {
        const res = await fetch('/api/ai-tutor', {
          method: 'POST',
          headers: await apiHeaders(),
          body: JSON.stringify({
            question: currentTask?.question || currentTask?.content || currentTask?.math_statement || '',
            instruction: currentTask?.instruction || '',
            studentAnswer: openAnswerText || '',
            studentImage: latestCanvasDataRef.current || openCanvasDataUrl || '',
            scoring_key: currentTask?.scoring_key || currentTask?.officialKey || currentTask?.explanation || '',
            staticHint: currentTask?.hint || currentTask?.hints?.level_1 || ''
          })
        });
        const data = res.ok ? await res.json() : null;
        let hintText = data?.reply;
        if (data?.usage) {
          recordAiTokenUsage({
            type: 'HINT',
            usage: data.usage,
            taskId,
            hasImage: Boolean(latestCanvasDataRef.current || openCanvasDataUrl)
          });
        }

        // Wskazówka AI pochodzi WYŁĄCZNIE z backendu (/api/ai-tutor).
        // Klucz OpenRouter nigdy nie trafia do przeglądarki — klient nie wykonuje
        // żadnych wywołań do dostawców AI.

        const finalHintText = hintText || currentTask?.hint || currentTask?.hints?.level_1 || (
          isPolishSession
            ? 'Zwróć uwagę na intencję nadawcy, kontekst i kluczowe pojęcia w poleceniu.'
            : 'Zwróć uwagę na kluczowe przekształcenia algebraiczne i założenia zadania.'
        );
        const ok = spendCoins(hintCost);
        if (ok) {
          setUnlockedHints(prev => ({ ...prev, [taskId]: finalHintText }));
          setIsHintExpanded(prev => ({ ...prev, [taskId]: true }));
          setIsHintSheetOpen(true);
          triggerHaptic('success');
        }
      } catch (err) {
        console.warn('AI Hint error:', err);
        const fallbackHint = currentTask?.hint || currentTask?.hints?.level_1 || (
          isPolishSession
            ? 'Przeanalizuj uważnie polecenie i odwołaj się do podanego fragmentu tekstu.'
            : 'Przeanalizuj założenia zadania i skorzystaj ze wzorów z oficjalnej Karty Wzorów.'
        );
        const ok = spendCoins(hintCost);
        if (ok) {
          setUnlockedHints(prev => ({ ...prev, [taskId]: fallbackHint }));
          setIsHintExpanded(prev => ({ ...prev, [taskId]: true }));
          setIsHintSheetOpen(true);
          triggerHaptic('success');
        }
      } finally {
        setIsAiHintLoading(false);
      }
      return;
    }

    // ŚCIEŻKA A: Zadania zamknięte i proste (SINGLE_CHOICE, NUMERIC_INPUT, TRUE_FALSE, TWO_PART)
    const staticHint = currentTask?.hint || currentTask?.hints?.level_1 || 'Zwróć uwagę na kluczowe założenia w treści zadania i wzory maturalne.';
    const spent = spendCoins(hintCost);
    if (spent) {
      setUnlockedHints(prev => ({ ...prev, [taskId]: staticHint }));
      setIsHintExpanded(prev => ({ ...prev, [taskId]: true }));
      setIsHintSheetOpen(true);
      triggerHaptic('success');
    }
  };
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Validation if user can click check answer
  const isReadyToCheck = useMemo(() => {
    if (isEvaluated || isPolishInteractiveTask) return false;
    if (isSingleChoice) return selectedOption !== null;
    if (isNumericTask) return numericInput.trim().length > 0;
    if (isTrueFalseTask) {
      const statements = currentTask?.statements || [];
      if (statements.length > 1) {
        return Object.keys(tfSelections).length === statements.length;
      }
      return selectedOption === 'P' || selectedOption === 'F' || tfSelections['single'] !== undefined;
    }
    if (isTwoPartTask) return Boolean(twoPart1 && twoPart2);
    if (isOpenTask) return (openAnswerText.trim().length > 0 || openCanvasDataUrl.length > 50) && !isTutorScanning;
    return false;
  }, [isEvaluated, isPolishInteractiveTask, isSingleChoice, selectedOption, isNumericTask, numericInput, isTrueFalseTask, tfSelections, isTwoPartTask, twoPart1, twoPart2, isOpenTask, openAnswerText, openCanvasDataUrl, isTutorScanning, currentTask]);

  // Reset pozycji przewijania do samej góry przy przejściu do nowego kroku lub podkarty teorii
  useEffect(() => {
    if (taskAreaRef.current) {
      taskAreaRef.current.scrollTop = 0;
    }
    const timer = setTimeout(() => {
      if (taskAreaRef.current) {
        taskAreaRef.current.scrollTop = 0;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep, theorySubStep, currentQueueIndex]);

  // Automatyczne płynne przewinięcie do wyników oceny tutora przy zadaniach otwartych
  useEffect(() => {
    if (isEvaluated && isOpenTask && tutorEvaluation) {
      const scrollTimer = setTimeout(() => {
        if (evaluationCardRef.current) {
          evaluationCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (taskAreaRef.current) {
          taskAreaRef.current.scrollTo({ top: taskAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
      }, 80);
      return () => clearTimeout(scrollTimer);
    }
  }, [isEvaluated, isOpenTask, tutorEvaluation]);

  // Active Time Tracking Listener
  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now();
      if (isPaused && document.visibilityState === 'visible') {
        setIsPaused(false);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setIsPaused(true);
      } else {
        lastActivityRef.current = Date.now();
        setIsPaused(false);
      }
    };

    window.addEventListener('mousemove', markActive, { passive: true });
    window.addEventListener('mousedown', markActive, { passive: true });
    window.addEventListener('keydown', markActive, { passive: true });
    window.addEventListener('touchstart', markActive, { passive: true });
    window.addEventListener('scroll', markActive, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    const timer = setInterval(() => {
      if (isSessionComplete) return;

      const idleDuration = Date.now() - lastActivityRef.current;
      const isHidden = document.visibilityState === 'hidden';

      if (idleDuration > 120000 || isHidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
        setActiveSeconds(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', markActive);
      window.removeEventListener('mousedown', markActive);
      window.removeEventListener('keydown', markActive);
      window.removeEventListener('touchstart', markActive);
      window.removeEventListener('scroll', markActive);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isSessionComplete, isPaused]);

  // ==========================================================================
  // Session Recovery & Real-Time Auto-Save Engine
  // ==========================================================================
  const isClearedRef = React.useRef<boolean>(false);
  const currentStepRef = React.useRef(currentStep); currentStepRef.current = currentStep;
  const theorySubStepRef = React.useRef(theorySubStep); theorySubStepRef.current = theorySubStep;
  const currentQueueIndexRef = React.useRef(currentQueueIndex); currentQueueIndexRef.current = currentQueueIndex;
  const selectedOptionRef = React.useRef(selectedOption); selectedOptionRef.current = selectedOption;
  const openAnswerTextRef = React.useRef(openAnswerText); openAnswerTextRef.current = openAnswerText;
  const numericInputRef = React.useRef(numericInput); numericInputRef.current = numericInput;
  const tfSelectionsRef = React.useRef(tfSelections); tfSelectionsRef.current = tfSelections;
  const twoPart1Ref = React.useRef(twoPart1); twoPart1Ref.current = twoPart1;
  const twoPart2Ref = React.useRef(twoPart2); twoPart2Ref.current = twoPart2;
  const activeSecondsRef = React.useRef(activeSeconds); activeSecondsRef.current = activeSeconds;
  const sessionMistakesCountRef = React.useRef(sessionMistakesCount); sessionMistakesCountRef.current = sessionMistakesCount;
  const correctAnswersCountRef = React.useRef(correctAnswersCount); correctAnswersCountRef.current = correctAnswersCount;
  const correctlySolvedTaskIdsRef = React.useRef(correctlySolvedTaskIds); correctlySolvedTaskIdsRef.current = correctlySolvedTaskIds;
  const earnedXpRef = React.useRef(earnedXp); earnedXpRef.current = earnedXp;
  const earnedCoinsRef = React.useRef(earnedCoins); earnedCoinsRef.current = earnedCoins;
  const unlockedHintsRef = React.useRef(unlockedHints); unlockedHintsRef.current = unlockedHints;
  const taskQueueRef = React.useRef(taskQueue); taskQueueRef.current = taskQueue;
  const isSessionCompleteRef = React.useRef(isSessionComplete); isSessionCompleteRef.current = isSessionComplete;
  const currentTaskIdRef = React.useRef(currentTask?.id); currentTaskIdRef.current = currentTask?.id;
  const theoryPillRef = React.useRef<LessonTheoryPill>(theoryPill); theoryPillRef.current = theoryPill;

  // Asynchronously restore canvas drawing for current task from IndexedDB
  useEffect(() => {
    const taskId = currentTask?.id;
    if (!taskId) return;
    let isMounted = true;
    restoreCanvasDrawing(sessionId, taskId).then(drawing => {
      if (isMounted && drawing && (!latestCanvasDataRef.current || latestCanvasDataRef.current.length < 50)) {
        setOpenCanvasDataUrl(drawing);
        latestCanvasDataRef.current = drawing;
      }
    }).catch(err => {
      console.warn('[SessionRecovery] Canvas restore error:', err);
    });
    return () => {
      isMounted = false;
    };
  }, [sessionId, currentTask?.id]);

  const buildCurrentSessionState = (): SavedSessionState => {
    const activePill = theoryPillRef.current || theoryPill;
    const isDegraded = (p: any) => isEmergencyFallback(p);
    const resolvedPill = (!isDegraded(activePill))
      ? activePill
      : (!isDegraded(sessionData?.theoryPill) ? sessionData.theoryPill : (activePill || sessionData?.theoryPill));

    return {
      sessionId,
      lessonId,
      lessonTitle: sessionData?.lessonTitle || rawLessonTitle || 'Lekcja',
      theoryPill: resolvedPill,
      originTab: (sessionData as any)?.originTab || 'learn',
    tasks: taskQueueRef.current,
    currentQueueIndex: currentQueueIndexRef.current,
    currentStep: currentStepRef.current,
    theorySubStep: theorySubStepRef.current,
    selectedOption: selectedOptionRef.current,
    openAnswerText: openAnswerTextRef.current,
    activeSeconds: activeSecondsRef.current,
    sessionMistakesCount: sessionMistakesCountRef.current,
    correctAnswersCount: correctAnswersCountRef.current,
    timestamp: Date.now(),
    required_correct_tasks: targetCorrectAnswers,
    correctlySolvedTaskIds: correctlySolvedTaskIdsRef.current,
    numericInput: numericInputRef.current,
    tfSelections: tfSelectionsRef.current,
    twoPart1: twoPart1Ref.current,
    twoPart2: twoPart2Ref.current,
    earnedXp: earnedXpRef.current,
    earnedCoins: earnedCoinsRef.current,
    unlockedHints: unlockedHintsRef.current,
    isSessionComplete: isSessionCompleteRef.current,
    subjectId: (sessionData as any)?.subjectId,
    subjectKey: (sessionData as any)?.subjectKey,
    isPolish: isPolishSession,
    topicId: (sessionData as any)?.topicId,
    formulaSheet,
    nextLesson,
    allTaskIdsToMarkCompleted
    };
  };

  const flushStateSync = () => {
    if (isClearedRef.current || isSessionCompleteRef.current) return;
    if (debouncedSaveTimerRef.current) clearTimeout(debouncedSaveTimerRef.current);
    if (debouncedSaveCanvasTimerRef.current) clearTimeout(debouncedSaveCanvasTimerRef.current);
    saveSessionStateSync(buildCurrentSessionState());
    if (latestCanvasDataRef.current && currentTaskIdRef.current) {
      saveCanvasDrawing(sessionId, currentTaskIdRef.current, latestCanvasDataRef.current).catch(() => {});
    }
  };

  const debouncedSaveTimerRef = React.useRef<any>(null);
  const debouncedSaveCanvasTimerRef = React.useRef<any>(null);

  const triggerDebouncedSave = () => {
    if (isClearedRef.current || isSessionCompleteRef.current) return;
    if (debouncedSaveTimerRef.current) clearTimeout(debouncedSaveTimerRef.current);
    debouncedSaveTimerRef.current = setTimeout(() => {
      if (isClearedRef.current || isSessionCompleteRef.current) return;
      saveSessionState(buildCurrentSessionState()).catch(err => {
        console.warn('[SessionRecovery] Auto-save error:', err);
      });
    }, 300);
  };

  const triggerDebouncedCanvasSave = (tId: string, dataUrl: string) => {
    if (isClearedRef.current || isSessionCompleteRef.current) return;
    if (debouncedSaveCanvasTimerRef.current) clearTimeout(debouncedSaveCanvasTimerRef.current);
    debouncedSaveCanvasTimerRef.current = setTimeout(() => {
      if (isClearedRef.current || isSessionCompleteRef.current) return;
      saveCanvasDrawing(sessionId, tId, dataUrl).catch(err => {
        console.warn('[SessionRecovery] Canvas auto-save error:', err);
      });
    }, 300);
  };

  // Asynchronous recovery for theory pill if missing, degraded, or in restored session
  useEffect(() => {
    let isMounted = true;
    const currentPill = theoryPillRef.current || asyncTheoryPill || sessionData?.theoryPill;
    const isDegradedOrMissing = isEmergencyFallback(currentPill) ||
      (!currentPill?.worked_example && !currentPill?.core_formulas?.length);

    if (isDegradedOrMissing || sessionData?.isRestoredSession) {
      const topicId = (sessionData as any)?.topicId;
      const subjectId = (sessionData as any)?.subjectId || ((sessionData as any)?.isPolish || isPolishSession ? 'jezyk-polski' : undefined);
      curriculumRepository.ensureLessonLoaded(lessonId, topicId, subjectId)
        .then(lessonDoc => {
          if (!isMounted || !lessonDoc) return;
          const recoveredPill = lessonDoc.theory_pill;
          if (recoveredPill) {
            const enriched = enrichTheoryPillWithVisual(recoveredPill, lessonId);
            theoryPillRef.current = enriched;
            setAsyncTheoryPill(enriched);

            // Immediately persist authoritative recovered pill to avoid race conditions or reload losses
            if (!isClearedRef.current && !isSessionCompleteRef.current) {
              try {
                saveSessionStateSync({
                  ...buildCurrentSessionState(),
                  theoryPill: enriched
                });
              } catch (e) {
                console.warn('[SessionRecovery] Failed immediate sync save of recovered pill:', e);
              }
            }
          }
        })
        .catch(err => {
          console.warn('[SessionRunner] Failed to asynchronously ensure lesson loaded for theoryPill:', err);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [lessonId, sessionData?.isRestoredSession, isPolishSession]);

  // Real-time debounced auto-save on state transitions
  useEffect(() => {
    if (isClearedRef.current || isSessionComplete) return;
    triggerDebouncedSave();
  }, [
    currentStep,
    theorySubStep,
    currentQueueIndex,
    selectedOption,
    openAnswerText,
    numericInput,
    tfSelections,
    twoPart1,
    twoPart2,
    activeSeconds,
    sessionMistakesCount,
    correctAnswersCount,
    earnedXp,
    earnedCoins,
    asyncTheoryPill
  ]);

  // Hook up visibilitychange and beforeunload listeners for immediate synchronous flush
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushStateSync();
      }
    };

    const handleBeforeUnload = () => {
      flushStateSync();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (debouncedSaveTimerRef.current) clearTimeout(debouncedSaveTimerRef.current);
      if (debouncedSaveCanvasTimerRef.current) clearTimeout(debouncedSaveCanvasTimerRef.current);
    };
  }, [sessionId]);

  const handleSaveCanvasData = (dataUrl: string) => {
    setOpenCanvasDataUrl(dataUrl);
    latestCanvasDataRef.current = dataUrl;
    if (currentTask?.id) {
      triggerDebouncedCanvasSave(currentTask.id, dataUrl);
    }
    triggerDebouncedSave();
  };

  // Humanizacja prezentacji czasu: np. 36 sek lub 1 min 45 s
  const formattedHumanTime = useMemo(() => {
    const m = Math.floor(activeSeconds / 60);
    const s = activeSeconds % 60;
    if (m === 0) {
      return `${s} sek`;
    }
    if (s === 0) {
      return `${m} min`;
    }
    return `${m} min ${s} s`;
  }, [activeSeconds]);

  const { lessonPillLabel, lessonTitleClean } = useMemo(() => {
    let raw = lessonTitle || '';
    raw = raw.replace(/^L\d+(?:\.\d+)+\s*[:\-–]?\s*/i, '').trim();

    // 1. Sprawdź czy numer jest w tytule: np. "Lekcja 1.1: Funkcje..." lub "1.1 Funkcje..."
    const titleMatch = raw.match(/^(?:Lekcja\s+)?(\d+[.-]\d+)\s*[:\-–]?\s*(.*)$/i);
    if (titleMatch) {
      return {
        lessonPillLabel: `LEKCJA ${titleMatch[1].replace('-', '.')}`,
        lessonTitleClean: titleMatch[2].trim() || raw
      };
    }
    // 2. Jeśli nie ma w tytule, wyciągnij z lessonId: np. "pol-lesson-1-1", "lesson-1-1", "1.1"
    const idMatch = String(lessonId || '').match(/(?:pol[-_]?)?(?:lesson[-_]?)?(\d+)[-_.](\d+)/i);
    if (idMatch) {
      return {
        lessonPillLabel: `LEKCJA ${idMatch[1]}.${idMatch[2]}`,
        lessonTitleClean: raw
      };
    }
    // 3. Kanon lektur / sprawdzian
    if (String(lessonId || '').includes('lektura') || (sessionData as any)?.isCanonical) {
      return {
        lessonPillLabel: 'LEKTURA CKE',
        lessonTitleClean: raw
      };
    }
    return {
      lessonPillLabel: 'LEKCJA',
      lessonTitleClean: raw
    };
  }, [lessonTitle, lessonId, sessionData]);

  const departmentBadgeLabel = useMemo(() => {
    const topicIdStr = String((sessionData as any)?.topicId || (sessionData as any)?.topic_id || '');
    const lessonIdStr = String(lessonId || '');
    const mMatch = topicIdStr.match(/dzial[-_]?(\d+)/i) || lessonIdStr.match(/lesson[-_]?(\d+)/i) || lessonIdStr.match(/^(\d+)[.-]/);
    if (isMathExplicit || !isPolishSession) {
      if (mMatch) {
        return `DZIAŁ ${mMatch[1]}`;
      }
      return 'DZIAŁ 1';
    }
    if (isPolishSession) {
      const topicNumMatch = topicIdStr.match(/(?:dzial|topic|pillar)[-_]?(\d+)/i) || lessonIdStr.match(/(?:pol[-_]?)?lesson[-_]?(\d+)/i);
      if (topicNumMatch) {
        return `FILAR ${topicNumMatch[1]}`;
      }
      return 'FILAR 1';
    }
    return 'DZIAŁ 1';
  }, [sessionData, lessonId, isMathExplicit, isPolishSession]);

  const moduleBadgeName = useMemo(() => {
    // 1. Jeśli to matematyka, priorytetowo używaj nazwy działu matematyki
    if (isMathExplicit) {
      if ((sessionData as any)?.short_title) {
        return String((sessionData as any).short_title).trim();
      }
      if ((sessionData as any)?.topicTitle) {
        return String((sessionData as any).topicTitle).replace(/^(?:Dział\s*[\d.]+\s*[:\-–]?\s*|\d+[.:\-–]?\s*)/i, '').trim();
      }
      if ((sessionData as any)?.topicName) {
        return String((sessionData as any).topicName).replace(/^(?:Dział\s*[\d.]+\s*[:\-–]?\s*|\d+[.:\-–]?\s*)/i, '').trim();
      }
      if ((sessionData as any)?.topic) {
        return String((sessionData as any).topic).replace(/^(?:Dział\s*[\d.]+\s*[:\-–]?\s*|\d+[.:\-–]?\s*)/i, '').trim();
      }
      const topicIdStr = String((sessionData as any)?.topicId || (sessionData as any)?.topic_id || '');
      const lessonIdStr = String(lessonId || '');
      const mMatch = topicIdStr.match(/dzial[-_]?(\d+)/i) || lessonIdStr.match(/lesson[-_]?(\d+)/i) || lessonIdStr.match(/^(\d+)[.-]/);
      if (mMatch) {
        const num = mMatch[1];
        const mathTopicMap: Record<string, string> = {
          '1': 'Potęgi i pierwiastki',
          '2': 'Logarytmy',
          '3': 'Wartość bezwzględna',
          '4': 'Wzory skróconego mnożenia i algebra',
          '5': 'Nierówności liniowe',
          '6': 'Równania w postaci iloczynowej',
          '7': 'Równania i wyrażenia wymierne',
          '8': 'Nierówności kwadratowe',
          '9': 'Odczyt z wykresu funkcji',
          '10': 'Funkcja liniowa i jej własności',
          '11': 'Ciągi liczbowe',
          '12': 'Funkcja kwadratowa',
          '13': 'Przekształcenia wykresów funkcji',
          '14': 'Trygonometria',
          '15': 'Planimetria i stereometria'
        };
        if (mathTopicMap[num]) return mathTopicMap[num];
      }
      return 'Potęgi i pierwiastki';
    }

    // 2. Jeśli to język polski
    if (isPolishSession) {
      if ((sessionData as any)?.pillarName) {
        const rawPillar = String((sessionData as any).pillarName);
        const clean = rawPillar.replace(/^Filar\s*(?:[IVX\d]+|\d+)\s*[:\-–]?\s*/i, '').trim();
        if (clean) return clean;
      }
      const topicId = String((sessionData as any)?.topicId || (sessionData as any)?.topic_id || '');
      const lessonIdStr = String(lessonId || '');
      
      const topicNumMatch = topicId.match(/(?:dzial|topic)[-_]?(\d+)/i) || lessonIdStr.match(/(?:pol[-_]?)?lesson[-_]?(\d+)/i);
      const num = topicNumMatch ? parseInt(topicNumMatch[1], 10) : null;
      
      if (topicId.includes('pillar-1') || topicId.includes('jezyk') || (num !== null && num >= 1 && num <= 4)) {
        return 'Język w użyciu';
      }
      if (topicId.includes('pillar-2') || topicId.includes('lektur') || (num !== null && num >= 5 && num <= 16)) {
        return 'Lektury i epoki';
      }
      if (topicId.includes('pillar-3') || topicId.includes('wyprac') || (num !== null && num >= 17)) {
        return 'Wypracowanie';
      }
      return 'Lektury i epoki';
    }

    // 3. Inne przedmioty / fallback
    if ((sessionData as any)?.pillarName) {
      const rawPillar = String((sessionData as any).pillarName);
      const clean = rawPillar.replace(/^Filar\s*(?:[IVX\d]+|\d+)\s*[:\-–]?\s*/i, '').trim();
      if (clean) return clean;
    }
    if ((sessionData as any)?.topicTitle) {
      return String((sessionData as any).topicTitle).replace(/^(?:Dział\s*[\d.]+\s*[:\-–]?\s*|\d+[.:\-–]?\s*)/i, '').trim();
    }
    if ((sessionData as any)?.topicName) {
      return String((sessionData as any).topicName).replace(/^(?:Dział\s*[\d.]+\s*[:\-–]?\s*|\d+[.:\-–]?\s*)/i, '').trim();
    }
    if ((sessionData as any)?.topic) {
      return String((sessionData as any).topic).replace(/^(?:Dział\s*[\d.]+\s*[:\-–]?\s*|\d+[.:\-–]?\s*)/i, '').trim();
    }
    return null;
  }, [sessionData, isPolishSession, isMathExplicit, lessonId]);

  // Czytelna nazwa bieżącego działu (np. "Potęgi i pierwiastki" zamiast "DZIAŁ 1")
  const departmentNameOnly = useMemo(() => {
    if (moduleBadgeName && moduleBadgeName.trim()) {
      return moduleBadgeName.trim();
    }
    if ((sessionData as any)?.topicTitle) {
      return String((sessionData as any).topicTitle).replace(/^(?:Dział\s*[\d.]+\s*[:\-–]?\s*|\d+[.:\-–]?\s*)/i, '').trim();
    }
    if ((sessionData as any)?.topicName) {
      return String((sessionData as any).topicName).replace(/^(?:Dział\s*[\d.]+\s*[:\-–]?\s*|\d+[.:\-–]?\s*)/i, '').trim();
    }
    return isPolishSession ? 'Lektury i epoki' : 'Potęgi i pierwiastki';
  }, [moduleBadgeName, sessionData, isPolishSession]);

  // Rozpoznawanie tematu CKE dla danego działu do karty wzorów
  const matchedCkeTopicId = useMemo(() => {
    return resolveCkeTopicForDepartment(departmentBadgeLabel, moduleBadgeName, lessonTitleClean || rawLessonTitle);
  }, [departmentBadgeLabel, moduleBadgeName, lessonTitleClean, rawLessonTitle]);

  // Podręczny zestaw wzorów dla bieżącego działu (Core-4 + CKE)
  const departmentFormulas = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      latex: string;
      subFormulas?: { label: string; formula: string }[];
      description?: string;
      in_cke_sheet?: boolean;
      cke_page?: string | number;
      matura_tip?: string;
      mnemonic?: string;
      example?: string;
      diagram?: any;
    }> = [];

    // 1. Z pigułki wiedzy lekcji (getCoreFormulas)
    const tpFormulas = getCoreFormulas(theoryPill?.core_formulas || theoryPill?.coreFormulaLatex);
    for (let i = 0; i < tpFormulas.length; i++) {
      const f = tpFormulas[i];
      if (f.latex || f.title) {
        list.push({
          id: `tp-${i}`,
          title: f.title || (isPolishSession ? 'Kluczowe pojęcie' : 'Wzór z lekcji'),
          latex: f.latex,
          description: f.description,
          in_cke_sheet: f.in_cke_sheet,
          cke_page: f.cke_page,
          matura_tip: f.matura_tip,
          mnemonic: f.mnemonic,
          example: f.example
        });
      }
    }

    // 2. Z formulaSheet lekcji (jeśli istnieje)
    if (formulaSheet?.formulas && Array.isArray(formulaSheet.formulas)) {
      for (let i = 0; i < formulaSheet.formulas.length; i++) {
        const f = formulaSheet.formulas[i];
        const alreadyInList = list.some(item => item.latex && f.latex && item.latex.trim() === f.latex.trim());
        if (!alreadyInList && (f.latex || f.title)) {
          list.push({
            id: `fs-${i}`,
            title: f.title || 'Wzór maturalny',
            latex: f.latex,
            description: (f as any).description,
            cke_page: (f as any).cke_page,
            in_cke_sheet: (f as any).in_cke_sheet ?? ((f as any).cke_page ? true : undefined)
          });
        }
      }
    }

    // 3. Wzbogacenie o oficjalne tablice CKE dla danego działu (jeśli matematyka)
    if (!isPolishSession && matchedCkeTopicId) {
      const ckeList = withLocalCkeFormulas(getCkeFormulas());
      const matchingCke = [...ckeList.filter(item => item.topicId === matchedCkeTopicId)];
      const searchContext = `${departmentBadgeLabel} ${moduleBadgeName || ''} ${lessonTitleClean || rawLessonTitle || ''}`.toLowerCase();

      // Sortowanie: wzory najbardziej korespondujące z tematem (np. funkcja kwadratowa w Dziale 8) na samej górze
      matchingCke.sort((a, b) => {
        const aTitleMatch = searchContext.includes(a.title.toLowerCase()) ? 3 : 0;
        const bTitleMatch = searchContext.includes(b.title.toLowerCase()) ? 3 : 0;
        const aKwMatch = a.keywords.some(k => searchContext.includes(k.toLowerCase())) ? 2 : 0;
        const bKwMatch = b.keywords.some(k => searchContext.includes(k.toLowerCase())) ? 2 : 0;
        return (bTitleMatch + bKwMatch) - (aTitleMatch + aKwMatch);
      });

      for (const item of matchingCke) {
        const alreadyHas = list.some(l => 
          (l.title && l.title.toLowerCase() === item.title.toLowerCase()) ||
          (l.latex && item.formula && l.latex.replace(/\s+/g, '') === item.formula.replace(/\s+/g, ''))
        );
        if (!alreadyHas) {
          list.push({
            id: item.id,
            title: item.title,
            latex: item.formula,
            subFormulas: item.subFormulas,
            description: item.explanation,
            cke_page: item.cke_page,
            in_cke_sheet: true,
            matura_tip: item.ckeTrap,
            mnemonic: item.goldenRule,
            diagram: (item as any).diagram
          });
        }
      }
    }

    return list;
  }, [theoryPill, formulaSheet, isPolishSession, matchedCkeTopicId, departmentBadgeLabel, moduleBadgeName, lessonTitleClean, rawLessonTitle]);

  // Dostępne tematy CKE do filtrowania w widoku "Wszystkie działy CKE"
  const availableCkeTopics = useMemo(() => {
    return withLocalCkeFormulaTopics(getCkeFormulaTopics());
  }, []);

  // Filtrowane wzory w drawerze (wspiera wyszukiwanie i filtrowanie działów CKE)
  const drawerFormulas = useMemo(() => {
    const query = formulaSearchQuery.trim().toLowerCase();

    if (formulaViewMode === 'all' && !isPolishSession) {
      const ckeList = withLocalCkeFormulas(getCkeFormulas());
      return ckeList
        .filter(item => {
          // Filtr działu CKE
          if (selectedFormulaCkeTopic !== 'all' && item.topicId !== selectedFormulaCkeTopic) {
            return false;
          }
          if (!query) return true;
          return (
            item.title.toLowerCase().includes(query) ||
            item.formula.toLowerCase().includes(query) ||
            item.topicName.toLowerCase().includes(query) ||
            item.keywords.some(k => k.toLowerCase().includes(query)) ||
            (item.goldenRule?.toLowerCase().includes(query) ?? false) ||
            (item.ckeTrap?.toLowerCase().includes(query) ?? false)
          );
        })
        .map(item => ({
          id: item.id,
          title: item.title,
          latex: item.formula,
          subFormulas: item.subFormulas,
          description: item.explanation,
          cke_page: item.cke_page,
          in_cke_sheet: true,
          matura_tip: item.ckeTrap,
          mnemonic: item.goldenRule,
          diagram: item.diagram
        }));
    }

    if (!query) return departmentFormulas;

    return departmentFormulas.filter(item => {
      const inTitle = item.title?.toLowerCase().includes(query) ?? false;
      const inLatex = item.latex?.toLowerCase().includes(query) ?? false;
      const inDesc = item.description?.toLowerCase().includes(query) ?? false;
      const inMnem = item.mnemonic?.toLowerCase().includes(query) ?? false;
      const inTip = item.matura_tip?.toLowerCase().includes(query) ?? false;
      const inSub = item.subFormulas?.some(s => s.label.toLowerCase().includes(query) || s.formula.toLowerCase().includes(query)) ?? false;
      return inTitle || inLatex || inDesc || inMnem || inTip || inSub;
    });
  }, [departmentFormulas, formulaSearchQuery, formulaViewMode, isPolishSession, selectedFormulaCkeTopic]);

  // Rozpoznawanie autentycznego źródła zadania i stylu plakietki (CKE vs Autorskie vs Informator)
  const taskSourceBadge = useMemo(() => {
    // Sprawdzamy pole źródłowe z priorytetem dla badge / source_badge
    const raw = (currentTask?.badge || currentTask?.source_badge || currentTask?.source || currentTask?.cke_source || '').trim();
    
    if (!raw) {
      return {
        label: 'Trening JASNE • w stylu CKE',
        type: 'autorskie' as const,
        badgeClass: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
        dotClass: 'bg-emerald-400'
      };
    }

    const zadMatch = raw.match(/zad(?:anie)?\.?\s*(\d+(?:\.\d+)?)/i);
    const monthMatch = raw.match(/(maj|czerwiec|sierpi?e[nń]|grudzi?e[nń]|wrzesi?e[nń]|marzec)/i);
    const yearMatch = raw.match(/20\d\d/);
    const isInformatorOrPokazowy = /informator|arkusz\s*pokazowy/i.test(raw);
    const hasMaturaKeywords = /matura|cke/i.test(raw);

    // 1. Oficjalne arkusze CKE z określoną sesją i rokiem
    if (monthMatch && yearMatch) {
      const mRaw = monthMatch[1].toLowerCase();
      const monthMap: Record<string, string> = {
        maj: 'maj', czerwiec: 'czerwiec', sierpien: 'sierpień', 'sierpień': 'sierpień',
        grudzien: 'grudzień', 'grudzień': 'grudzień', wrzesien: 'wrzesień', 'wrzesień': 'wrzesień', marzec: 'marzec'
      };
      const mClean = monthMap[mRaw] || mRaw;
      const isProbna = /próbna|probna/i.test(raw);
      const prefix = isProbna ? 'Matura próbna' : 'Matura';
      let label = `${prefix} ${mClean} ${yearMatch[0]}`;
      if (zadMatch) {
        label += ` • Zad. ${zadMatch[1]}`;
      }
      return {
        label,
        type: 'cke_matura' as const,
        badgeClass: 'bg-sky-500/15 border-sky-400/30 text-sky-300',
        dotClass: 'bg-sky-400'
      };
    }

    // 2. Informator CKE / Arkusz pokazowy
    if (isInformatorOrPokazowy) {
      let label = /pokazowy/i.test(raw) ? 'Arkusz pokazowy CKE' : 'Informator CKE';
      if (zadMatch) {
        label += ` • Zad. ${zadMatch[1]}`;
      }
      return {
        label,
        type: 'cke_matura' as const,
        badgeClass: 'bg-sky-500/15 border-sky-400/30 text-sky-300',
        dotClass: 'bg-sky-400'
      };
    }

    // 3. Matura CKE z rokiem lub numerem zadania
    if (yearMatch && (hasMaturaKeywords || /202[3-6]/.test(raw))) {
      let label = `Matura ${yearMatch[0]}`;
      if (zadMatch) {
        label += ` • Zad. ${zadMatch[1]}`;
      }
      return {
        label,
        type: 'cke_matura' as const,
        badgeClass: 'bg-sky-500/15 border-sky-400/30 text-sky-300',
        dotClass: 'bg-sky-400'
      };
    }

    if (zadMatch && hasMaturaKeywords) {
      const cleanRaw = raw.replace(/\bCKE\s+CKE\b/gi, 'CKE').replace(/\bCKE\s*•\s*CKE\b/gi, 'CKE').trim();
      return {
        label: cleanRaw.startsWith('CKE') || cleanRaw.startsWith('Matura') ? cleanRaw : `Matura • Zad. ${zadMatch[1]}`,
        type: 'cke_matura' as const,
        badgeClass: 'bg-sky-500/15 border-sky-400/30 text-sky-300',
        dotClass: 'bg-sky-400'
      };
    }

    // 4. Zadania treningowe, rozgrzewkowe lub autorskie
    return {
      label: 'Trening JASNE • w stylu CKE',
      type: 'autorskie' as const,
      badgeClass: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
      dotClass: 'bg-emerald-400'
    };
  }, [currentTask]);

  const taskSourceLabel = taskSourceBadge.label;

  const taskPointsCount = useMemo(() => {
    const pts = currentTask?.points || (isOpenTask ? 2 : 1);
    if (pts === 1) return '1 punkt';
    if (pts >= 2 && pts <= 4) return `${pts} punkty`;
    return `${pts} punktów`;
  }, [currentTask?.points, isOpenTask]);

  const formatSourceTag = (source?: string, points?: number, isOpen?: boolean) => {
    const pts = points || (isOpen ? 2 : 1);
    if (!source) return `Zadanie maturalne • ${pts} pkt`;
    let clean = source.replace(/CKE/gi, '').replace(/Zadanie\s*Zadanie/gi, 'Zadanie').trim();
    if (clean.toLowerCase().includes('pkt')) return clean;
    return `${clean} • ${pts} pkt`;
  };

  // Normalized single-choice options for the current question (preserving authentic CKE order and single truth of is_correct)
  const randomizedOptions = useMemo(() => {
    if (!currentTask?.options || !Array.isArray(currentTask.options) || currentTask.options.length === 0) {
      return [];
    }

    if (!isSingleChoice) {
      return currentTask.options;
    }

    const rawOptions = currentTask.options;
    const targetRaw = String(currentTask?.correct_answer || currentTask?.correctAnswer || '').trim();
    const normTarget = targetRaw.replace(/^Odp\s*/i, '').trim().toUpperCase();

    // 1. Normalize each option into { id, text, content_latex, is_correct }
    const normalized = rawOptions.map((opt: any, idx: number) => {
      const defaultLetter = ['A', 'B', 'C', 'D', 'E', 'F'][idx] || String(idx + 1);
      let optId = defaultLetter;
      let text = '';
      let isExplicitlyCorrect = false;

      if (typeof opt === 'string') {
        const m = opt.match(/^([A-D1-4])[\.\)]\s*(.*)$/);
        if (m) {
          optId = m[1].toUpperCase();
          text = m[2].trim();
        } else {
          text = opt.trim();
        }
        isExplicitlyCorrect = (
          optId === targetRaw ||
          optId === normTarget ||
          targetRaw.startsWith(optId + '.') ||
          targetRaw.startsWith(optId + ')') ||
          opt.trim() === targetRaw ||
          text === targetRaw
        );
      } else if (typeof opt === 'object' && opt !== null) {
        optId = opt.id || opt.key || opt.label || defaultLetter;
        text = opt.text || opt.content_latex || opt.content || '';
        const textPrefix = typeof text === 'string' ? text.match(/^([A-D1-4])[\.\)]\s*(.*)$/) : null;
        if (textPrefix) {
          text = textPrefix[2].trim();
        }
        isExplicitlyCorrect = Boolean(
          opt.is_correct ||
          opt.isCorrect ||
          optId === targetRaw ||
          optId === normTarget ||
          targetRaw.startsWith(optId + '.') ||
          targetRaw.startsWith(optId + ')') ||
          (text && targetRaw && text.trim() === targetRaw)
        );
      }

      return {
        id: optId,
        text,
        content_latex: text,
        numberLine: (typeof opt === 'object' && opt !== null) ? opt.numberLine : undefined,
        diagram: (typeof opt === 'object' && opt !== null) ? opt.diagram : undefined,
        is_correct: isExplicitlyCorrect
      };
    });

    // 2. Guarantee EXACTLY ONE correct answer in single-choice questions
    let correctIndices = normalized
      .map((o, idx) => (o.is_correct ? idx : -1))
      .filter(idx => idx !== -1);

    if (correctIndices.length === 0) {
      // If none matched, find by ID matching normTarget or default to 0
      const directIdx = normalized.findIndex(o => o.id === normTarget || o.id === targetRaw);
      const chosenIdx = directIdx !== -1 ? directIdx : 0;
      normalized.forEach((o, idx) => {
        o.is_correct = idx === chosenIdx;
      });
    } else if (correctIndices.length > 1) {
      // If multiple were somehow flagged, keep ONLY the one matching normTarget or the first one
      const directIdx = normalized.findIndex(o => o.id === normTarget || o.id === targetRaw);
      const chosenIdx = directIdx !== -1 ? directIdx : correctIndices[0];
      normalized.forEach((o, idx) => {
        o.is_correct = idx === chosenIdx;
      });
    }

    return normalized;
  }, [currentTask, isSingleChoice]);

  const correctAnswerLabel = useMemo(() => {
    if (isSingleChoice) {
      const correctOpt = (randomizedOptions || []).find((o: any) => o.is_correct);
      if (correctOpt) {
        return correctOpt.text ? `${correctOpt.id}: ${correctOpt.text}` : correctOpt.id;
      }
      return currentTask?.correct_answer || currentTask?.correctAnswer || 'A';
    }
    if (isNumericTask) {
      const rawAns = currentTask?.correctAnswer || currentTask?.correct_answer || currentTask?.numeric_correct_answer || '';
      return formatMathAnswer(rawAns);
    }
    if (isTrueFalseTask) {
      const statements = currentTask?.statements || [];
      if (statements.length > 1) {
        return statements.map((s: any, idx: number) => `${idx + 1}:${s.correct}`).join(', ');
      }
      const normTarget = resolveTrueFalseTarget(currentTask);
      return normTarget === 'P' ? 'P (Prawda)' : 'F (Fałsz)';
    }
    if (isTwoPartTask) {
      return String(currentTask?.correctAnswer || currentTask?.correct_answer || '');
    }
    if (isOpenTask) {
      if (currentTask?.correct_answer || currentTask?.correctAnswer) {
        return formatMathAnswer(currentTask.correct_answer || currentTask.correctAnswer);
      }
      if (Array.isArray(currentTask?.scoring_key) && currentTask.scoring_key.length > 0) {
        for (let i = currentTask.scoring_key.length - 1; i >= 0; i--) {
          const step = String(currentTask.scoring_key[i]);
          const match = step.match(/wynik\s+([^\.]+)/i);
          if (match) return formatMathAnswer(match[1].trim());
        }
        return 'Dowód wg kryteriów CKE';
      }
      if (currentTask?.type === 'OPEN_PROOF') {
        const match = (currentTask?.explanation || '').match(/=\s*([^=]+\s*\\in\s*\\[a-zA-Z]+)/);
        if (match) return formatMathAnswer(match[1].trim());
        const matchEq = (currentTask?.explanation || '').match(/=\s*([0-9a-zA-Z\\]+)\.?\s*$/);
        if (matchEq) return formatMathAnswer(matchEq[1].trim());
        return 'Dowód algebraiczny CKE';
      }
      return 'Rozwiązanie otwarte';
    }
    return '';
  }, [currentTask, isSingleChoice, isNumericTask, isTrueFalseTask, isTwoPartTask, isOpenTask, randomizedOptions]);

  const modalExamTrap = useMemo(() => {
    if (currentTask?.cke_trap?.description) return currentTask.cke_trap.description;
    if (typeof currentTask?.cke_trap === 'string' && currentTask.cke_trap.trim()) return currentTask.cke_trap;
    if (typeof currentTask?.trap === 'string' && currentTask.trap.trim()) return currentTask.trap;
    if (typeof currentTask?.exam_trap === 'string' && currentTask.exam_trap.trim()) return currentTask.exam_trap;
    // Pułapka zapisana w wyjaśnieniu tego zadania ma pierwszeństwo przed ogólną pułapką lekcji
    const ownTrap = String(currentTask?.explanation || '').match(/\*\*Pułapka CKE:\*\*\s*([\s\S]*?)(?:\n\n|$)/);
    if (ownTrap && ownTrap[1].trim()) return ownTrap[1].trim();
    if (currentTask?.type === 'OPEN_PROOF' && (currentTask?.question?.includes('\\sqrt') || currentTask?.question?.includes('pierwiastek')) && currentTask?.question?.includes('^2')) {
      return 'Błędne podniesienie dwumianu do kwadratu: $(\\sqrt{7}-1)^2 \\neq 7 - 1$. Należy zastosować wzór skróconego mnożenia: $(a-b)^2 = a^2 - 2ab + b^2 = 7 - 2\\sqrt{7} + 1$.';
    }
    if (formulaSheet?.ckeTrap?.description) return formulaSheet.ckeTrap.description;
    if (formulaSheet?.ckeTrap?.error) return `Częsty błąd: $${formulaSheet.ckeTrap.error}$. Poprawnie: $${formulaSheet.ckeTrap.correct || (formulaSheet.ckeTrap as any).correction || ''}$`;
    if (theoryPill?.trapAlert) return theoryPill.trapAlert;
    if (theoryPill?.exam_trap) return theoryPill.exam_trap;
    if (currentTask?.hint_2 && !currentTask.hint_2.includes('Przeanalizuj powiązania logiczne')) return currentTask.hint_2;
    return null;
  }, [currentTask, formulaSheet, theoryPill]);

  // Reset state on step / question change
  const isFirstStepMountRef = React.useRef(true);
  useEffect(() => {
    if (isFirstStepMountRef.current) {
      isFirstStepMountRef.current = false;
      return;
    }
    setSelectedOption(null);
    setNumericInput('');
    setTfSelections({});
    setTwoPart1(null);
    setTwoPart2(null);
    setShowExplanation(false);
    setOpenAnswerText('');
    setOpenCanvasDataUrl('');
    setIsTutorScanning(false);
    setTutorEvaluation(null);
    setShowModelSolution(false);
    setIsEvaluated(false);
    setIsCorrect(null);
    setIsHintSheetOpen(false);
    if (currentStep === 0) {
      setTheorySubStep(0);
    }
  }, [currentStep, currentQueueIndex]);

  // Reset entire session state when lessonId changes (e.g. proceeding to next lesson)
  const prevLessonIdRef = React.useRef(lessonId);
  useEffect(() => {
    if (prevLessonIdRef.current === lessonId) {
      return; // Skip on initial mount! Preserve restored state!
    }
    prevLessonIdRef.current = lessonId;

    setCurrentStep(0);
    setTheorySubStep(0);
    setCurrentQueueIndex(0);
    setSessionMistakesCount(0);
    setActiveSeconds(0);
    setIsPaused(false);
    setSelectedOption(null);
    setNumericInput('');
    setTfSelections({});
    setTwoPart1(null);
    setTwoPart2(null);
    setShowExplanation(false);
    setOpenAnswerText('');
    setOpenCanvasDataUrl('');
    latestCanvasDataRef.current = '';
    setIsTutorScanning(false);
    setIsScanFinished(false);
    pendingEvalDataRef.current = null;
    setTutorEvaluation(null);
    setShowModelSolution(false);
    setIsEvaluated(false);
    setIsCorrect(null);
    setCorrectAnswersCount(0);
    setCorrectlySolvedTaskIds([]);
    setEarnedXp(0);
    setEarnedCoins(0);
    setShowExitModal(false);
    setShowFormulaSheet(false);
    setIsSessionComplete(false);
    setUnlockedHints({});
    setIsHintExpanded({});
    setIsHintSheetOpen(false);
    setIsAiHintLoading(false);

    // Refresh queue for new lesson
    if (tasks && tasks.length >= targetCorrectAnswers) {
      setTaskQueue([...tasks]);
    } else {
      const pool = getLessonTaskPool(lessonId);
      if (pool.length > 0) {
        const drawn = drawSessionTasks(lessonId);
        setTaskQueue(drawn.sessionTasks.length > 0 ? drawn.sessionTasks : [...tasks]);
      } else {
        const drawn = drawSessionTasks(lessonId);
        setTaskQueue(drawn.sessionTasks.length > 0 ? drawn.sessionTasks : [...tasks]);
      }
    }
  }, [lessonId]);

  // Obsługa utraty serc (Hearts Engine)
  const firstLessonGraceNoticeShown = React.useRef(false);
  const handleMistakeDeduction = (count: number = 1) => {
    if (userState?.isPro) return;
    if (isFirstLessonGrace(userState)) {
      if (!firstLessonGraceNoticeShown.current) {
        firstLessonGraceNoticeShown.current = true;
        showToast('Pierwsza lekcja jest na próbę – błędy nie zabierają serc.', 'info');
      }
      return;
    }

    // Obliczenie dokładnych współrzędnych docelowych wskaźnika serc w nagłówku
    let targetX = typeof window !== 'undefined' ? window.innerWidth - 65 : 140;
    let targetY = 28;
    const pillEl = document.getElementById('session-hearts-pill');
    if (pillEl) {
      const rect = pillEl.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    const currentH = typeof userState?.hearts === 'number' ? userState.hearts : 5;
    const nextH = Math.max(0, currentH - count);
    const dyingSlotIdx = nextH; // 0-indexed: when dropping from 5 to 4, slot 4 loses its heart
    const slotStep = 44;
    const startX = typeof window !== 'undefined' ? window.innerWidth / 2 + (dyingSlotIdx - 2) * slotStep : 0;
    const startY = 135; // Dokładny środek pojemnika w pływającej pigułce HUD

    // Reset stanu uderzenia w nagłówek (licznik w nagłówku trzyma stary stan aż do uderzenia komety)
    setPillImpactDone(false);

    // Uruchomienie animacji 5 serc i lecącej komety
    setHeartFlyAnim({
      active: true,
      key: Date.now(),
      startX,
      startY,
      targetX,
      targetY,
      currentHearts: currentH,
      nextHearts: nextH
    });

    // Moment uderzenia komety we wskaźnik w nagłówku (~800ms)
    setTimeout(() => {
      setPillImpactDone(true);
      setIsHeartShaking(true);
      setPillShockwave(true);
      triggerHaptic('medium');
      setTimeout(() => setIsHeartShaking(false), 650);
      setTimeout(() => setPillShockwave(false), 750);
    }, 800);

    // Zakończenie animacji HUD (~1350ms)
    setTimeout(() => {
      setHeartFlyAnim(null);
    }, 1350);

    for (let i = 0; i < count; i++) {
      if (onDeductHeart) {
        const res = onDeductHeart();
        if (res.isOutOfHearts) {
          setTimeout(() => setShowOutOfHeartsModal(true), 1400);
          break;
        }
      } else if (onUpdateUserState) {
        onUpdateUserState(prev => {
          const res = deductHeart(prev);
          if (res.isOutOfHearts) {
            setTimeout(() => setShowOutOfHeartsModal(true), 1400);
          }
          return res.updatedState;
        });
      }
    }
  };

  const handlePolishTaskComplete = (taskId?: string, xpReward = 30, coinsReward = 5) => {
    triggerHaptic('success');
    playSuccessSound();
    const nextCorrect = correctAnswersCount + 1;
    setCorrectAnswersCount(nextCorrect);
    setEarnedXp(prev => prev + xpReward);
    setEarnedCoins(prev => prev + coinsReward);

    if (taskId) {
      removeMistakeFromBank(taskId);
      setCorrectlySolvedTaskIds(prev => Array.from(new Set([...prev, taskId])));
    }

    if (nextCorrect >= targetCorrectAnswers || currentQueueIndex + 1 >= taskQueue.length) {
      setIsSessionComplete(true);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#10B981', '#F43F5E', '#F59E0B', '#8B5CF6']
        });
      } catch (e) {}
    } else {
      setCurrentQueueIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsEvaluated(false);
      setIsCorrect(null);
      setOpenAnswerText('');
      setOpenCanvasDataUrl('');
      latestCanvasDataRef.current = '';
      setNumericInput('');
      setTfSelections({});
      setTwoPart1(null);
      setTwoPart2(null);
      setTutorEvaluation(null);
      setShowModelSolution(false);
    }
  };


  const handleRefillHeartsWithCoins = () => {
    if (!onUpdateUserState || !userState) return;
    const res = refillHeartsWithCoins(userState);
    if (res.success) {
      onUpdateUserState(() => res.updatedState);
      setShowOutOfHeartsModal(false);
    }
  };

  const handleActivatePro = async (code: string): Promise<{ ok: boolean; error?: string }> => {
    if (!onUpdateUserState || !userState) {
      return { ok: false, error: 'Nie można teraz aktywować PRO. Odśwież aplikację i spróbuj ponownie.' };
    }

    // Reguły Firestore dopuszczają tylko atomową aktywację kodem jednorazowym.
    const result = await activateProWithCode(code);
    if (!result.ok) return result;

    // Stan lokalny aktualizujemy dopiero po potwierdzonym zapisie w chmurze.
    onUpdateUserState(prev => activatePro(prev));
    setShowOutOfHeartsModal(false);
    setShowParentSponsorModal(false);
    return { ok: true };
  };

  // Dynamically resolve next lesson in chain (e.g. lesson-1-1 -> lesson-1-2 -> ... -> lesson-1-15)
  const resolvedNextLesson = useMemo(() => {
    if (nextLesson && nextLesson.isSession && nextLesson.tasks && nextLesson.tasks.length > 0) {
      return nextLesson;
    }

    // Try auto-resolving next lesson in Dział 1: Liczby Rzeczywiste (supports both lesson-1-1 and 1.1)
    const match = String(lessonId).match(/^(?:lesson-)?(\d+)[.-](\d+)$/);
    if (match) {
      const topicNum = parseInt(match[1], 10);
      const lessonNum = parseInt(match[2], 10);
      const maxLessonsInTopic = 15;

      if (topicNum === 1 && lessonNum < maxLessonsInTopic) {
        const nextNum = lessonNum + 1;
        const nextIdCandidateDash = `lesson-${topicNum}-${nextNum}`;
        const nextIdCandidateDot = `${topicNum}.${nextNum}`;
        
        const poolResult = drawSessionTasks(nextIdCandidateDash);
        const tasksToUse = (poolResult.sessionTasks && poolResult.sessionTasks.length > 0)
          ? poolResult.sessionTasks
          : drawSessionTasks(nextIdCandidateDot).sessionTasks;

        if (tasksToUse && tasksToUse.length > 0) {
          const titles: Record<string, string> = {
            '1.1': 'Lekcja 1.1: Zbiory i osie: Bramkarze na osi',
            '1.2': 'Lekcja 1.2: Liczby wymierne i niewymierne',
            '1.3': 'Lekcja 1.3: Ułamki 1: Wspólny mianownik',
            '1.4': 'Lekcja 1.4: Ułamki 2: Skracanie i dodawanie',
            '1.5': 'Lekcja 1.5: Procenty 1: Mnożniki w obniżkach i podwyżkach',
            '1.6': 'Lekcja 1.6: Procenty 2: Błąd bezwzględny i względny',
            '1.7': 'Lekcja 1.7: Potęgi 1: Prawa mnożenia i wspólna podstawa',
            '1.8': 'Lekcja 1.8: Potęgi 2: Salto ujemnego wykładnika',
            '1.9': 'Lekcja 1.9: Potęgi 3: Wykładnik ułamkowy',
            '1.10': 'Lekcja 1.10: Pierwiastki 1: Mnożenie i wyłączanie przed znak',
            '1.11': 'Lekcja 1.11: Pierwiastki 2: Usuwanie niewymierności z mianownika',
            '1.12': 'Lekcja 1.12: Wzory skróconego mnożenia',
            '1.13': 'Lekcja 1.13: Logarytmy 1: Odwrócona potęga',
            '1.14': 'Lekcja 1.14: Logarytmy 2: Zwijanie sumy i różnicy',
            '1.15': 'Lekcja 1.15: Wartość bezwzględna i odległość na osi'
          };

          return {
            isSession: true,
            lessonId: nextIdCandidateDash,
            lessonTitle: titles[`${topicNum}.${nextNum}`] || `Lekcja ${topicNum}.${nextNum}`,
            tasks: tasksToUse,
            firstTask: tasksToUse[0],
            allTasks: tasksToUse,
            formulaSheet: poolResult.formulaSheet,
            allTaskIdsToMarkCompleted: tasksToUse.map((t: any) => t.id),
            nextLesson: nextNum < maxLessonsInTopic ? {
              isSession: true,
              lessonId: `lesson-${topicNum}-${nextNum + 1}`
            } : null
          };
        }
      }
    }

    // Fallback: if nextLesson provided with tasks
    if (nextLesson) {
      return {
        isSession: true,
        lessonId: nextLesson.lessonId || nextLesson.id || 'next',
        lessonTitle: nextLesson.lessonTitle || nextLesson.title || 'Kolejna Lekcja',
        tasks: nextLesson.tasks || nextLesson.lessonTasks || nextLesson.allTasks || (nextLesson.firstTask ? [nextLesson.firstTask] : []),
        formulaSheet: nextLesson.formulaSheet || null,
        nextLesson: nextLesson.nextLesson || null
      };
    }

    return null;
  }, [lessonId, nextLesson]);

  // Keyboard navigation for desktop: 1-4 / A-D to select, Enter/Space to check or proceed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitModal || isSessionComplete) return;

      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          if (!isEvaluated && !isTutorScanning && openAnswerText.trim()) {
            handleCheckOpenAnswerWithTutor();
          }
        }
        return;
      }

      const key = e.key.toUpperCase();
      const code = e.code;

      // Handle Theory Sub-step Navigation with Arrow Keys
      if (isTheoryStep) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setTheorySubStep(prev => Math.max(0, prev - 1));
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setTheorySubStep(prev => Math.min(3, prev + 1));
          return;
        }
      }

      // Handle True/False Selection (P / 1 or F / 2)
      if (!isEvaluated && isTrueFalseTask && (!currentTask?.statements || currentTask.statements.length <= 1)) {
        if (key === 'P' || key === '1' || key === 'T') {
          e.preventDefault();
          handleSelectOption('P');
          setTfSelections({ single: 'P' });
          return;
        }
        if (key === 'F' || key === '2') {
          e.preventDefault();
          handleSelectOption('F');
          setTfSelections({ single: 'F' });
          return;
        }
      }

      // Handle Option Selection (1, 2, 3, 4 or A, B, C, D)
      if (!isEvaluated && !isOpenTask && !isTrueFalseTask) {
        const opts = randomizedOptions.length > 0 ? randomizedOptions : (currentTask?.options || []);
        if (opts.length > 0) {
          let chosenOptionId: string | null = null;
          if (key === '1' || key === 'A') {
            chosenOptionId = opts[0]?.id || 'A';
          } else if (key === '2' || key === 'B') {
            chosenOptionId = opts[1]?.id || 'B';
          } else if (key === '3' || key === 'C') {
            chosenOptionId = opts[2]?.id || 'C';
          } else if (key === '4' || key === 'D') {
            chosenOptionId = opts[3]?.id || 'D';
          }

          if (chosenOptionId) {
            e.preventDefault();
            handleSelectOption(chosenOptionId);
            return;
          }
        }
      }

      // Handle Check or Next Step (Enter or Space)
      if (key === 'ENTER' || code === 'Space') {
        e.preventDefault();
        if (isTheoryStep) {
          triggerHaptic('medium');
          if (theorySubStep < 3) {
            setTheorySubStep(prev => prev + 1);
          } else {
            playSuccessSound();
            setCurrentStep(1);
          }
          return;
        }
        if (!isEvaluated) {
          if (isOpenTask) {
            if (openAnswerText.trim() && !isTutorScanning) {
              handleCheckOpenAnswerWithTutor();
            }
          } else if (isReadyToCheck) {
            handleCheckAnswer();
          }
        } else if (isEvaluated) {
          handleNextStep();
        }
        return;
      }

      // Handle Formula Sheet Toggle (F or W)
      if (key === 'F' || key === 'W') {
        e.preventDefault();
        setShowFormulaSheet(prev => !prev);
        return;
      }

      // Handle Escape (Exit modal or sheet)
      if (key === 'ESCAPE') {
        e.preventDefault();
        if (isHintSheetOpen) {
          setIsHintSheetOpen(false);
        } else if (showFormulaSheet) {
          setShowFormulaSheet(false);
        } else {
          setShowExitModal(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEvaluated, selectedOption, isReadyToCheck, openAnswerText, isTutorScanning, isOpenTask, currentTask, showExitModal, isSessionComplete, showFormulaSheet, isHintSheetOpen]);

  // Handle option click
  const handleSelectOption = (optionId: string) => {
    if (isEvaluated) return;
    triggerHaptic('light');
    setSelectedOption(optionId);
  };

  // Check answer for standard multiple-choice and new task types
  const handleCheckAnswer = () => {
    if (isEvaluated) return;

    const currentHearts = getSyncedHearts(userState);
    if (!currentHearts.isPro && currentHearts.hearts <= 0) {
      triggerHaptic('warning');
      setShowOutOfHeartsModal(true);
      return;
    }

    let correct = false;

    if (isSingleChoice) {
      if (!selectedOption) return;
      const opts = randomizedOptions.length > 0 ? randomizedOptions : (currentTask?.options || []);
      const matchingOpt = opts.find((o: any) => o.id === selectedOption);
      correct = Boolean(matchingOpt?.is_correct);
    } else if (isNumericTask) {
      if (!numericInput.trim()) return;

      const parseNumericVal = (raw: string): number => {
        const s = raw.trim().replace(/,/g, '.').replace(/[−–]/g, '-').replace(/[\$\s]/g, '');
        const frac = s.match(/\\frac\{?([^}]+)\}?\{?([^}]+)\}?/);
        if (frac) {
          const n = parseFloat(frac[1]);
          const d = parseFloat(frac[2]);
          if (!isNaN(n) && !isNaN(d) && d !== 0) return n / d;
        }
        if (s.includes('/')) {
          const parts = s.split('/');
          if (parts.length === 2) {
            const n = parseFloat(parts[0]);
            const d = parseFloat(parts[1]);
            if (!isNaN(n) && !isNaN(d) && d !== 0) return n / d;
          }
        }
        return parseFloat(s);
      };

      const normStr = (s: string) => s
        .replace(/\s+/g, '')
        .replace(/,/g, '.')
        .replace(/\\left/g, '')
        .replace(/\\right/g, '')
        .replace(/\\langle\s*/g, '⟨')
        .replace(/\\rangle\s*/g, '⟩')
        .replace(/\\infty\s*/g, '∞')
        .replace(/[−–]/g, '-')
        .replace(/[\$\{\}]/g, '');

      const userClean = numericInput.trim();
      const targetClean = String(
        currentTask?.correctAnswer || 
        currentTask?.correct_answer || 
        currentTask?.numeric_correct_answer || 
        currentTask?.correct_val ||
        ''
      ).trim();

      if (normStr(userClean) === normStr(targetClean)) {
        correct = true;
      } else {
        const userNum = parseNumericVal(userClean);
        const targetNum = parseNumericVal(targetClean);
        if (!isNaN(userNum) && !isNaN(targetNum) && Math.abs(userNum - targetNum) < 1e-5) {
          correct = true;
        }
      }
    } else if (isTrueFalseTask) {
      const statements = currentTask?.statements || [];
      if (statements.length > 1) {
        const allCorrect = statements.every(stmt => tfSelections[stmt.id] === stmt.correct);
        correct = allCorrect;
      } else {
        const userChoice = selectedOption || tfSelections['single'];
        if (!userChoice) return;
        const normTarget = resolveTrueFalseTarget(currentTask);
        const normUser = (userChoice.startsWith('P') || userChoice.startsWith('T') || userChoice === 'TRUE' || userChoice === 'A') ? 'P' : 'F';
        correct = normUser === normTarget;
      }
    } else if (isTwoPartTask) {
      if (!twoPart1 || !twoPart2) return;
      const userChoice = `${twoPart1}${twoPart2}`.toUpperCase();
      const target = String(currentTask?.correctAnswer || currentTask?.correct_answer || '').replace(/\s+/g, '').toUpperCase();
      correct = userChoice === target;
    }

    setIsEvaluated(true);
    setIsCorrect(correct);

    if (correct) {
      triggerHaptic('success');
      playSuccessSound();
      setCorrectAnswersCount(prev => prev + 1);
      setEarnedXp(prev => prev + 10);
      setEarnedCoins(prev => prev + 3);

      if (currentTask?.id) {
        removeMistakeFromBank(currentTask.id);
        setCorrectlySolvedTaskIds(prev => Array.from(new Set([...prev, currentTask.id])));
      }

      try {
        confetti({
          particleCount: 28,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10B981', '#06B6D4', '#3B82F6', '#F59E0B']
        });
      } catch (e) {}
    } else {
      triggerHaptic('error');
      playErrorSound();
      setEarnedXp(prev => prev + 2); // Small effort XP
      setSessionMistakesCount(prev => prev + 1);
      handleMistakeDeduction();

      if (currentTask?.id) {
        addMistakeToBank(currentTask.id);
      }

      // Zasada Mastery Learning: błędna odpowiedź nie przesuwa paska postępu,
      // a zadanie (lub inne wylosowane z tej samej lekcji) trafia na koniec kolejki
      const lessonPool = getLessonTaskPool(lessonId);
      // Najpierw zadanie z puli, którego nie było w kolejce; gdy pula jest wyczerpana – zadanie jeszcze
      // nierozwiązane poprawnie, inne niż bieżące (logika i testy: src/lib/sessionQueue.ts).
      const retryCandidate: any = pickRetryTask(lessonPool as any[], taskQueue, currentTask?.id, correctlySolvedTaskIds);
      if (retryCandidate) {
        const nextPoolTask = retryCandidate;
        // Dane merytoryczne powtórki (treść, klucz, rysunek, podpowiedzi) pochodzą wyłącznie z nowego zadania puli.
        // Z poprzedniego zadania zostają tylko pola sesji – inaczej powtórka dziedziczyłaby np. cudzy rysunek albo jednostkę.
        const isMathLesson = !/^(pol|eng)-/.test(String(lessonId || ''));
        const {
          diagram: _d, plot: _p, numberLine: _n, visual: _v, statements: _s, part_1: _p1, part_2: _p2,
          options: _o, unit: _u, tolerance: _t, hints: _h, matura_tip: _m, input_placeholder: _ip,
          ...sessionFields
        } = (currentTask || {}) as any;
        const formattedTask = {
          ...sessionFields,
          ...(isMathLesson ? nextPoolTask : {}),
          id: nextPoolTask.id,
          type: nextPoolTask.type || currentTask.type,
          title: `Zadanie powtórkowe${nextPoolTask.tierLabel ? ` • ${nextPoolTask.tierLabel}` : ''}`,
          instruction: nextPoolTask.instruction || (isMathLesson ? undefined : 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.'),
          math_statement: nextPoolTask.question,
          question: nextPoolTask.question,
          options: nextPoolTask.options || [],
          correct_answer: nextPoolTask.correct_answer,
          correctAnswer: nextPoolTask.correctAnswer || nextPoolTask.correct_answer,
          numeric_correct_answer: nextPoolTask.correct_answer,
          input_placeholder: nextPoolTask.input_placeholder,
          statements: nextPoolTask.statements,
          part_1: nextPoolTask.part_1,
          part_2: nextPoolTask.part_2,
          explanation: nextPoolTask.explanation,
          officialKey: nextPoolTask.officialKey || nextPoolTask.explanation,
          hints: nextPoolTask.hints || {
            level_1: nextPoolTask.hint_1,
            level_2: nextPoolTask.hint_2
          },
          isRetry: true
        };
        setTaskQueue(prev => [...prev, formattedTask]);
      } else {
        setTaskQueue(prev => [...prev, { ...currentTask, isRetry: true }]);
      }
    }
  };

  // Check open task answer with AI Tutor
  const handleCheckOpenAnswerWithTutor = async (passedCanvasUrl?: string) => {
    const rawCanvasUrl = (typeof passedCanvasUrl === 'string' && passedCanvasUrl.length > 50)
      ? passedCanvasUrl
      : (latestCanvasDataRef.current || openCanvasDataUrl);

    if (rawCanvasUrl && rawCanvasUrl.length > 50 && (!openCanvasDataUrl || openCanvasDataUrl !== rawCanvasUrl)) {
      setOpenCanvasDataUrl(rawCanvasUrl);
      latestCanvasDataRef.current = rawCanvasUrl;
    }

    let effectiveAnswer = openAnswerText;
    if (!effectiveAnswer.trim() && rawCanvasUrl && rawCanvasUrl.length > 50) {
      effectiveAnswer = '[Rozwiązanie odręczne na tablicy]';
      setOpenAnswerText(effectiveAnswer);
    }
    if (!effectiveAnswer.trim() || isTutorScanning || isEvaluated) return;

    const currentHearts = getSyncedHearts(userState);
    if (!currentHearts.isPro && currentHearts.hearts <= 0) {
      triggerHaptic('warning');
      setShowOutOfHeartsModal(true);
      return;
    }

    setIsTutorScanning(true);
    setIsScanFinished(false);
    setEvaluationUnavailable(false);
    aiEvaluationUnavailableRef.current = false;
    usedApproximateEvaluationRef.current = false;
    triggerHaptic('medium');

    let evalData: any = null;

    const targetPts = currentTask?.points || 2;
    const isEssay = isPolishSession && (targetPts >= 30 || currentTask?.type === 'ESSAY');

    // Optimize handwriting image for AI Vision OCR (pure white background, crisp dark ink)
    let optimizedImagePayload: string | undefined = undefined;
    if (rawCanvasUrl && rawCanvasUrl.length > 50) {
      try {
        optimizedImagePayload = await convertDataUrlToAiOptimized(rawCanvasUrl);
      } catch (e) {
        console.warn('Canvas optimization error:', e);
        optimizedImagePayload = rawCanvasUrl;
      }
    }

    try {
      const evalEndpoint = isEnglishSession ? '/api/english-eval' : '/api/evaluate-task';
      const response = await fetch(evalEndpoint, {
        method: 'POST',
        headers: await apiHeaders(),
        body: JSON.stringify({
          taskId: currentTask?.id,
          question: currentTask?.question || currentTask?.math_statement,
          contextText: currentTask?.passage_text || currentTask?.context_text || currentTask?.contextText || '',
          officialKey: currentTask?.officialKey || currentTask?.explanation,
          scoring_key: currentTask?.scoring_key || currentTask?.officialKey || currentTask?.explanation,
          studentAnswer: effectiveAnswer,
          studentImage: optimizedImagePayload || undefined,
          taskType: isEnglishSession ? (currentTask?.type || 'OPEN_TASK') : (isPolishSession ? (isEssay ? 'ESSAY' : (currentTask?.type || 'OPEN_TASK')) : 'OPEN_PROOF'),
          isPolish: isPolishSession,
          isEnglish: isEnglishSession,
          subjectId: isEnglishSession ? 'jezyk-angielski' : (isPolishSession ? 'jezyk-polski' : undefined),
          maxPoints: targetPts,
          ai_tutor_rubric: currentTask?.ai_tutor_rubric,
          rubric_stages: currentTask?.rubric_stages,
          zero_rules: currentTask?.zero_rules,
          attemptCount: 1,
          mode: 'grade'
        })
      });

      if (response.ok) {
        const serverEval = await response.json();

        // Backend zwraca provider:'none', gdy żaden ewaluator (AI ani rubryka)
        // nie był dostępny. Wtedy NIE wystawiamy oceny i nie zabieramy serca —
        // uczeń widzi komunikat i może spróbować ponownie.
        if (serverEval?.evaluationFailed && serverEval?.provider === 'none') {
          aiEvaluationUnavailableRef.current = true;
        } else {
          evalData = serverEval;
          if (serverEval?.evaluationFailed) {
            // Ocena policzona rubryką po stronie serwera (AI niedostępne).
            usedApproximateEvaluationRef.current = true;
          }
          if (serverEval?.usage) {
            recordAiTokenUsage({
              type: 'EVALUATION',
              usage: serverEval.usage,
              taskId: currentTask?.id,
              hasImage: Boolean(optimizedImagePayload)
            });
          }
        }
      } else if (response.status === 429) {
        // Limit zapytań — nie oceniamy, ale też nie karzemy ucznia.
        aiEvaluationUnavailableRef.current = true;
      } else {
        console.warn('[SessionRunner] /api/evaluate-task zwróciło', response.status);
        usedApproximateEvaluationRef.current = true;
      }
    } catch (err) {
      console.warn('[SessionRunner] Brak połączenia z /api/evaluate-task:', err);
      usedApproximateEvaluationRef.current = true;
    }

    // UWAGA BEZPIECZEŃSTWO: usunięto bezpośrednie wywołanie OpenRouter z
    // przeglądarki (klucz VITE_OPENROUTER_API_KEY trafiał do publicznego bundla).
    // Każde zapytanie do modelu przechodzi przez backend: /api/ai-tutor,
    // /api/evaluate-task, /api/generate-task.

    // Zadania z etapami CKE nie są oceniane heurystyką słów kluczowych – zostaje ponowienie albo samoocena etapami.
    if (!evalData && Array.isArray(currentTask?.rubric_stages) && currentTask.rubric_stages.length > 0) {
      aiEvaluationUnavailableRef.current = true;
    }

    // If server AI evaluation didn't succeed, generate resilient offline rubric evaluation
    if (!evalData && !aiEvaluationUnavailableRef.current) {
      const text = effectiveAnswer.toLowerCase();
      const hasHandwriting = Boolean(rawCanvasUrl && rawCanvasUrl.length > 50);

      if (isEssay) {
        const words = text.split(/\s+/).filter(Boolean).length;
        const hasThesis = text.includes('teza') || text.includes('uważam') || text.includes('twierdzę') || text.includes('wnios') || text.includes('stanowisk');
        const hasLektura = text.includes('lalk') || text.includes('wokulsk') || text.includes('rzeck') || text.includes('dżum') || text.includes('dziad') || text.includes('wesele') || text.includes('kordian') || text.includes('pan tad') || text.includes('antygon') || text.includes('makbet') || text.includes('tren') || text.includes('bohater');
        const hasKontekst = text.includes('kontekst') || text.includes('epok') || text.includes('filozof') || text.includes('historycz') || text.includes('biblij') || text.includes('mitolog') || text.includes('pozytywiz') || text.includes('romantyz');
        const hasKonektory = text.includes('ponadto') || text.includes('z jednej strony') || text.includes('z kolei') || text.includes('warto zauważyć') || text.includes('konkludując') || text.includes('świadczy o tym');

        let formalScore = 1;
        let litScore = 8;
        let compScore = 3;
        let langScore = 5;

        if (words >= 300) {
          litScore = hasLektura ? (hasKontekst ? 14 : 11) : 8;
          compScore = (hasThesis && hasKonektory) ? 6 : 5;
          langScore = words > 400 ? 10 : 8;
        } else if (words >= 150) {
          litScore = hasLektura ? 9 : 6;
          compScore = 4;
          langScore = 5;
        } else {
          litScore = 4;
          compScore = 2;
          langScore = 2;
        }

        const totalScore = formalScore + litScore + compScore + langScore;
        const passThreshold = 11; // 30% z 35 pkt CKE

        evalData = {
          score: totalScore,
          maxPoints: 35,
          isPassed: totalScore >= passThreshold,
          gradeTitle: `${totalScore} / 35 PKT – ${totalScore >= 28 ? 'Znakomite wypracowanie maturalne' : totalScore >= 20 ? 'Dobra rozprawka maturalna' : 'Praca zaliczona na progu'}`,
          summary: `Oficjalna ocena wypracowania CKE (${words} słów). ${words < 300 ? 'Uwaga: objętość poniżej normy 300 słów.' : 'Wymóg objętościowy 300+ słów spełniony.'}`,
          mentorComment: `Twoje wypracowanie podejmuje temat w sposób ${hasThesis ? 'uporządkowany z wyraźną tezą' : 'ogólny'}. ${hasKontekst ? 'Świetnie, że przywołujesz funkcjonalny kontekst!' : 'Pamiętaj o wyraźniejszym rozbudowaniu kontekstu (historycznego/filozoficznego).'}.`,
          strengths: [
            words >= 300 ? `Spełniono wymóg objętościowy CKE (${words} słów)` : `Podjęto próbę rozwinięcia tematu`,
            hasLektura ? 'Trafne odwołanie do motywów z kanonu lektur obowiązkowych' : 'Zrozumienie problemu polecenia',
            hasKonektory ? 'Dojrzałe stosowanie konektorów logicznych między akapitami' : 'Zachowano logiczny podział wypowiedzi'
          ],
          errors: [
            words < 300 ? `Objętość ${words} słów jest poniżej progu 300 słów CKE – uzupełnij argumentację.` : null,
            !hasKontekst ? 'Wzbogać wywód o wyrazisty kontekst (np. historyczny, filozoficzny lub biograficzny).' : null,
            !hasThesis ? 'Sformułuj jednoznaczną tezę lub hipotezę już w pierwszym akapicie (wstępie).' : null
          ].filter(Boolean),
          ckeFeedback: `Kryteria oceniania: Warunki formalne ${formalScore}/1, Lektura i konteksty ${litScore}/16, Kompozycja ${compScore}/7, Język i styl ${langScore}/11. Łącznie: ${totalScore}/35 pkt.`,
          suggestion: 'Przejrzyj wzorcowy konspekt i schemat argumentacji TEEL poniżej.',
          hintForNextAttempt: '',
          criteriaBreakdown: {
            formal: { score: formalScore, max: 1, comment: 'Temat podjęty, brak błędu kardynalnego.' },
            literary_cultural: { score: litScore, max: 16, comment: hasLektura ? 'Trafny dobór motywów i postaci z lektury.' : 'Wymagane pogłębienie analizy lektury.' },
            composition: { score: compScore, max: 7, comment: hasKonektory ? 'Poprawny podział na akapity i spójność wywodu.' : 'Zadbaj o płynniejsze przejścia (konektory).' },
            language_style: { score: langScore, max: 11, comment: 'Dojrzałe słownictwo i poprawna składnia.' }
          }
        };
      } else if (isPolishSession) {
        const words = text.split(/\s+/).filter(Boolean).length;
        let fallbackScore = 0;
        if (words >= 10 || text.length >= 50) {
          fallbackScore = targetPts;
        } else if (words >= 3 || text.length >= 15) {
          fallbackScore = Math.max(1, Math.floor(targetPts / 2));
        }

        evalData = {
          score: fallbackScore,
          maxPoints: targetPts,
          isPassed: fallbackScore >= Math.ceil(targetPts * 0.5),
          gradeTitle: fallbackScore === targetPts 
            ? `${targetPts} / ${targetPts} PKT – Kompletna odpowiedź i argumentacja`
            : (fallbackScore > 0 ? `${fallbackScore} / ${targetPts} PKT – Częściowa odpowiedź` : `0 / ${targetPts} PKT – Próba odpowiedzi`),
          summary: fallbackScore === targetPts 
            ? (currentTask?.ai_tutor_rubric?.criterion_2_points || 'Perfekcyjne rozwiązanie! Odpowiedź w pełni zgodna ze schematem maturalnym.')
            : (currentTask?.ai_tutor_rubric?.criterion_1_point || 'Częściowo poprawna odpowiedź. Wskaż dodatkowy element z tekstu.'),
          mentorComment: fallbackScore === targetPts
            ? 'Intencja polecenia trafnie odczytana, uzasadnienie precyzyjne.'
            : 'Twoja odpowiedź idzie w dobrym kierunku, ale pamiętaj o precyzyjniejszym odwołaniu do tekstu.',
          strengths: fallbackScore > 0 
            ? ['Poprawnie zidentyfikowano kluczowe cechy wypowiedzi', 'Trafna argumentacja w kontekście polecenia'] 
            : [],
          errors: fallbackScore < targetPts 
            ? ['Upewnij się, że odwołujesz się do konkretnych sformułowań z załączonego tekstu lub lektury'] 
            : [],
          ckeFeedback: fallbackScore === targetPts 
            ? 'Egzaminator przyznaje pełne punkty za trafną interpretację i wyczerpujące uzasadnienie.'
            : 'Egzaminator maturalny docenia próbę odpowiedzi. Do pełnej punktacji uzupełnij wypowiedź o wskazany w poleceniu element.',
          suggestion: 'Zapoznaj się z wzorcowym modelem rozwiązania poniżej.',
          hintForNextAttempt: ''
        };
      } else {
        // Universal math fallback logic: Fraction arithmetic & algebra
        const hasFractionFinal = 
          text.includes('2/5') || 
          text.includes('0.4') || 
          text.includes('0{,}4') || 
          text.includes('12/30') || 
          text.includes('\\frac{2}{5}') ||
          text.includes('0,4');

        const hasFractionStep = 
          text.includes('1/6') || 
          text.includes('4/6') || 
          text.includes('3/6') || 
          text.includes('\\frac{1}{6}') || 
          text.includes('\\frac{4}{6}') || 
          text.includes('12/5') || 
          text.includes('wspólny') || 
          text.includes('mianownik');

        const hasAlgebraProgress = 
          text.includes('3n^2') || 
          text.includes('3n²') || 
          text.includes('4n(n+1)') || 
          text.includes('4k(k+1)') || 
          text.includes('4k(') || 
          text.includes('4n(') || 
          text.includes('5(n-1)') || 
          text.includes('5n(') || 
          text.includes('2^96') || 
          text.includes('2^{96}') || 
          text.includes('2^20') || 
          text.includes('2^{20}') || 
          text.includes('2k') ||
          text.includes('wyłącz') || 
          text.includes('wspólny') ||
          text.includes('rozł') || 
          text.includes('kwadrat') || 
          text.includes('iloczyn') ||
          text.includes('reszt');

        const hasConclusion = 
          text.includes('podziel') || 
          text.includes('całkowit') || 
          text.includes('wniosek') || 
          text.includes('udowodnion') || 
          text.includes('cnd') || 
          text.includes('c.n.d') || 
          text.includes('reszta 2') || 
          text.includes('8k') || 
          text.includes('30k') || 
          text.includes('21k') || 
          text.includes('k \\in') || 
          text.includes('c \\in') || 
          text.includes('n \\in');

        const keyText = String(currentTask?.officialKey || currentTask?.scoring_key || currentTask?.explanation || '').toLowerCase();
        const matchesOfficial = Boolean(keyText && text && (
          keyText.includes(text) || 
          (text.length >= 1 && keyText.split(/[\s,;=]+/).some(token => token && token === text))
        ));

        if (hasHandwriting) {
          evalData = {
            score: 0,
            maxPoints: targetPts,
            isPassed: false,
            gradeTitle: `0 / ${targetPts} PKT – Wymagana weryfikacja`,
            transcription: undefined,
            summary: 'Zapis z tablicy nie mógł zostać automatycznie oceniony w trybie offline.',
            mentorComment: 'Aby egzaminator CKE mógł ocenić Twoje rozwiązanie z tablicy, upewnij się, że masz połączenie z internetem lub wprowadź ostateczny wynik za pomocą klawiatury matematycznej.',
            strengths: [],
            errors: ['Brak połączenia z siecią do analizy zapisu odręcznego.'],
            ckeFeedback: 'Do oceny zapisu odręcznego z tablicy wymagana jest aktywna weryfikacja AI.',
            suggestion: 'Wprowadź odpowiedź za pomocą klawiatury matematycznej lub sprawdź połączenie z siecią.',
            hintForNextAttempt: ''
          };
        } else {
          let fallbackScore = 0;
          if (matchesOfficial || hasFractionFinal || (hasAlgebraProgress && hasConclusion)) {
            fallbackScore = targetPts;
          } else if (hasFractionStep || hasAlgebraProgress || text.length > 20) {
            fallbackScore = 1;
          }

          const isRootTask = (currentTask?.question || '').includes('\\sqrt') || (currentTask?.question || '').includes('pierwiastek');
          const isProofTask = (currentTask?.question || '').includes('wykaż') || (currentTask?.question || '').includes('dowód') || (currentTask?.question || '').includes('\\mathbb{Z}') || (currentTask?.type === 'OPEN_PROOF');
          const isFractionTask = hasFractionFinal || hasFractionStep || (currentTask?.question || '').includes('ułamek') || (currentTask?.question || '').includes('/');

          let dynamicMentorComment = '';
          let dynamicStrengths: string[] = [];
          let dynamicErrors: string[] = [];
          let dynamicSuggestion = 'Pamiętaj o czytelnym zapisywaniu każdego kroku na arkuszu maturalnym.';
          let dynamicTranscription: string | undefined = (openAnswerText && openAnswerText !== '[Rozwiązanie odręczne na tablicy]' ? openAnswerText : undefined);

          if (isRootTask || isProofTask) {
            dynamicMentorComment = fallbackScore === targetPts
              ? 'Znakomita praca! Zastosowano właściwe wzory i przekształcenia, zredukowano wyrazy i sformułowano poprawny wniosek końcowy.'
              : fallbackScore === 1
              ? 'Dobra robota za poprawny pierwszy etap przekształceń algebraicznych. Dokończ redukcję wyrazów, aby uzyskać pełną punktację.'
              : 'Zwróć uwagę na wzory skróconego mnożenia oraz redukcję wyrazów podobnych.';
            dynamicStrengths = fallbackScore >= 1 ? ['Zastosowano poprawny tok przekształceń', 'Logiczny ciąg operacji'] : [];
            dynamicErrors = fallbackScore < targetPts ? ['Wymagane pełne zredukowanie wyrazów do wniosku końcowego'] : [];
            dynamicSuggestion = 'Pamiętaj o starannym rozpisaniu każdego etapu dowodu algebraicznego.';
          } else if (isFractionTask) {
            dynamicMentorComment = fallbackScore === targetPts
              ? 'Znakomita praca! Działania na ułamkach oraz kolejność wykonywania operacji zostały przeprowadzone bezbłędnie.'
              : fallbackScore === 1
              ? 'Dobra robota za poprawny pierwszy krok (np. wspólny mianownik lub zamiana dzielenia na mnożenie). Pamiętaj, aby dokończyć obliczenia i podać wynik w najprostszej postaci.'
              : 'Zwróć uwagę na kolejność wykonywania działań oraz poprawne sprowadzanie ułamków do wspólnego mianownika.';
            dynamicStrengths = fallbackScore >= 1 ? ['Poprawne wykonanie kluczowych działań na ułamkach', 'Zastosowanie właściwych reguł arytmetycznych'] : [];
            dynamicErrors = fallbackScore < targetPts ? ['Upewnij się, że wynik końcowy jest podany w postaci nieskracalnej'] : [];
            dynamicSuggestion = 'Pamiętaj o zamianie dzielenia przez ułamek na mnożenie przez jego odwrotność.';
          } else {
            dynamicMentorComment = fallbackScore === targetPts
              ? 'Znakomita praca! Rozwiązanie zadania w pełni odpowiada oficjalnym wymaganiom maturalnym CKE.'
              : fallbackScore === 1
              ? 'Dobra próba i wykonanie pierwszego kluczowego etapu. Uzupełnij ostateczne uzasadnienie.'
              : 'Przeanalizuj założenia polecenia i skorzystaj z oficjalnej karty wzorów CKE.';
            dynamicStrengths = fallbackScore >= 1 ? ['Poprawny pierwszy etap rozwiązania', 'Zgodność z tokiem CKE'] : [];
            dynamicErrors = fallbackScore < targetPts ? ['Brak pełnego uzasadnienia lub wyniku'] : [];
          }

          evalData = {
            score: fallbackScore,
            maxPoints: targetPts,
            isPassed: fallbackScore >= 1,
            gradeTitle: fallbackScore === targetPts 
              ? `${targetPts} / ${targetPts} PKT – Kompletne i bezbłędne rozwiązanie`
              : (fallbackScore === 1 ? `1 / ${targetPts} PKT – Zasadniczy postęp` : `0 / ${targetPts} PKT – Próba rozwiązania`),
            transcription: dynamicTranscription,
            summary: fallbackScore === targetPts 
              ? (currentTask?.ai_tutor_rubric?.criterion_2_points || 'Perfekcyjne rozwiązanie! Obliczenia i wynik są w pełni poprawne.')
              : (currentTask?.ai_tutor_rubric?.criterion_1_point || 'Zasadniczy postęp w rozwiązaniu zadania. Poprawny pierwszy etap obliczeń.'),
            mentorComment: dynamicMentorComment,
            strengths: dynamicStrengths,
            errors: dynamicErrors,
            ckeFeedback: fallbackScore === targetPts 
              ? 'Zgodnie z oficjalnym modelem oceniania CKE przyznano pełną punktację za bezbłędny wynik końcowy.'
              : 'Zgodnie z kryteriami CKE za zasadniczy postęp w toku rozumowania przysługuje 1 punkt.',
            suggestion: dynamicSuggestion,
            hintForNextAttempt: ''
          };
        }
      }
    }

    // Brak jakiegokolwiek ewaluatora: pokazujemy komunikat i pozwalamy ponowić
    // próbę. Nie zapisujemy błędu, nie zabieramy serca, nie zaniżamy XP.
    if (aiEvaluationUnavailableRef.current || !evalData) {
      aiEvaluationUnavailableRef.current = false;
      pendingEvalDataRef.current = null;
      setEvaluationUnavailable(true);
      setIsTutorScanning(false);
      setIsScanFinished(false);
      return;
    }

    // Set pending evaluation and signal the scanning animation to conclude
    setIsApproximateEvaluation(usedApproximateEvaluationRef.current);
    usedApproximateEvaluationRef.current = false;
    pendingEvalDataRef.current = evalData;
    setIsScanFinished(true);

    // Safety fallback: guarantee overlay closes within 750ms even if component event was dropped
    setTimeout(() => {
      if (pendingEvalDataRef.current) {
        handleScanAnimationComplete();
      }
    }, 750);
  };

  // Samoocena etapami CKE: wybrany próg punktowy przechodzi tę samą ścieżkę co ocena egzaminatora AI
  const handleRubricSelfAssessment = (points: number) => {
    const stages = currentTask?.rubric_stages || [];
    if (isEvaluated || isTutorScanning || stages.length === 0) return;
    const maxPts = currentTask?.points || stages[stages.length - 1].points;
    const reached = stages.filter((s: any) => s.points <= points);
    const next = stages.find((s: any) => s.points > points);

    setEvaluationUnavailable(false);
    setIsApproximateEvaluation(false);
    pendingEvalDataRef.current = {
      score: points,
      maxPoints: maxPts,
      isPassed: points > 0,
      gradeTitle: `${points} / ${maxPts} PKT – samoocena według etapów CKE`,
      summary: points === maxPts
        ? 'Pełne rozwiązanie według zasad oceniania CKE.'
        : reached.length > 0 ? `Osiągnięty etap: ${reached[reached.length - 1].label}.` : 'Nie masz jeszcze żadnego etapu – zacznij od pierwszego kroku ze wzorcowego rozwiązania.',
      mentorComment: next
        ? `Do progu ${next.points} pkt brakuje: ${next.criterion}`
        : 'Masz komplet punktów. Porównaj jeszcze zapis ze wzorcowym rozwiązaniem – egzaminator sprawdza też uzasadnienia.',
      strengths: reached.map((s: any) => s.criterion),
      errors: next ? [next.criterion] : [],
      ckeFeedback: 'Samoocena według etapów z zasad oceniania CKE.',
      suggestion: currentTask?.zero_rules?.[0] || '',
      hintForNextAttempt: '',
      selfAssessed: true,
      // Uczciwe „0 pkt” w samoocenie nie zabiera serca – inaczej opłacałoby się zawyżać wynik.
      wasDeducted: false
    };
    triggerHaptic('light');
    handleScanAnimationComplete();
  };

  // Called when the scanning animation has smoothly finished
  const handleScanAnimationComplete = () => {
    const evalData = pendingEvalDataRef.current;
    if (!evalData) {
      setIsTutorScanning(false);
      setIsScanFinished(false);
      return;
    }

    pendingEvalDataRef.current = null;
    setTutorEvaluation(evalData);
    setIsEvaluated(true);
    setIsTutorScanning(false);
    setIsScanFinished(false);

    const passed = evalData.isPassed ?? (evalData.score >= 1);
    setIsCorrect(passed);

    if (evalData.score >= (currentTask?.points || 2)) {
      triggerHaptic('success');
      playSuccessSound();
      setCorrectAnswersCount(prev => prev + 1);
      setEarnedXp(prev => prev + 25);
      setEarnedCoins(prev => prev + 8);
      if (currentTask?.id) {
        removeMistakeFromBank(currentTask.id);
        setCorrectlySolvedTaskIds(prev => Array.from(new Set([...prev, currentTask.id])));
      }
      try {
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#10B981', '#06B6D4', '#F59E0B']
        });
      } catch (e) {}
    } else if (evalData.score > 0) {
      triggerHaptic('medium');
      playSuccessSound();
      setCorrectAnswersCount(prev => prev + 1);
      setEarnedXp(prev => prev + 15);
      setEarnedCoins(prev => prev + 4);
      if (currentTask?.id) {
        removeMistakeFromBank(currentTask.id);
        setCorrectlySolvedTaskIds(prev => Array.from(new Set([...prev, currentTask.id])));
      }
    } else {
      triggerHaptic('error');
      playErrorSound();
      setEarnedXp(prev => prev + 3);
      setSessionMistakesCount(prev => prev + 1);
      if (!isRichWritingTask && evalData?.wasDeducted !== false) {
        handleMistakeDeduction();
      }
      if (currentTask?.id) addMistakeToBank(currentTask.id);

      // Re-queue open task
      const lessonPool = getLessonTaskPool(lessonId);
      const usedIds = taskQueue.map((t: any) => t.id);
      const unusedInPool = lessonPool.filter((t: any) => !usedIds.includes(t.id));
      if (unusedInPool.length > 0) {
        const nextPoolTask = unusedInPool[0];
        setTaskQueue(prev => [...prev, {
          ...currentTask,
          id: nextPoolTask.id,
          question: nextPoolTask.question,
          math_statement: nextPoolTask.question,
          isRetry: true
        }]);
      } else {
        setTaskQueue(prev => [...prev, { ...currentTask, isRetry: true }]);
      }
    }
  };

  // Allow student to retry / refine open task answer without losing their written answer
  const handleRetryOpenTask = () => {
    setIsEvaluated(false);
    setTutorEvaluation(null);
    setIsCorrect(null);
    setShowModelSolution(false);
    triggerHaptic('light');
  };

  // Next step or finish – Mastery Learning (dynamiczny wymóg poprawnych odpowiedzi)
  const handleNextStep = () => {
    if (isTheoryStep) {
      setCurrentStep(1);
      setCurrentQueueIndex(0);
      setSelectedOption(null);
      setIsEvaluated(false);
      setIsCorrect(null);
      return;
    }

    const currentHearts = getSyncedHearts(userState);
    if (!currentHearts.isPro && currentHearts.hearts <= 0) {
      triggerHaptic('warning');
      setShowOutOfHeartsModal(true);
      return;
    }

    if (correctAnswersCount >= targetCorrectAnswers) {
      // Zdobyto wymaganą liczbę poprawnych odpowiedzi – lekcja zaliczona!
      setIsSessionComplete(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#10B981', '#06B6D4', '#F59E0B', '#8B5CF6']
        });
      } catch (e) {}
    } else {
      // Ponowne stuknięcie „Dalej” (przycisk znika dopiero po animacji) nie może przeskoczyć zadania:
      // przechodzimy dalej tylko z zadania, które zostało już sprawdzone.
      if (!isEvaluatedLiveRef.current) return;
      isEvaluatedLiveRef.current = false;
      // Przejdź do kolejnego zadania z kolejki – nigdy poza jej koniec (inaczej wyświetlałoby się w kółko pierwsze zadanie)
      setCurrentQueueIndex(prev => nextQueueIndex(prev, taskQueueRef.current.length));
      setSelectedOption(null);
      setIsEvaluated(false);
      setIsCorrect(null);
      setOpenAnswerText('');
      setOpenCanvasDataUrl('');
      latestCanvasDataRef.current = '';
      setNumericInput('');
      setTfSelections({});
      setTwoPart1(null);
      setTwoPart2(null);
      setTutorEvaluation(null);
      setShowModelSolution(false);
    }
  };

  // Final finish - Always marks lesson completed and returns to learning map or routes to next lesson
  const handleFinishSession = (goToNextLesson = false) => {
    const finalEarnedXp = Math.max(40, earnedXp + 20);
    const isPerfect = sessionMistakesCount === 0;
    const perfectCoinsBonus = isPerfect ? 5 : 0;
    const finalEarnedCoins = Math.max(15, earnedCoins + 8 + perfectCoinsBonus);

    const stars = 3;

    const cleanLessonId = lessonId.replace('lesson-', '');
    const dotLessonId = cleanLessonId.replace('-', '.');
    
    // Tylko i wyłącznie zadania poprawnie rozwiązane przez ucznia w tej sesji
    const validSolvedTaskIds = Array.from(new Set(correctlySolvedTaskIds.filter(isActualTaskId)));

    // Znaczniki ukończenia lekcji (zawsze z prefiksem LESSON-, aby nie były liczone jako zadania)
    const lessonCompletionTags = [
      `LESSON-${lessonId}`,
      `LESSON-${cleanLessonId}`,
      `LESSON-${dotLessonId}`,
      `LESSON-${lessonId.toLowerCase()}`
    ];

    const completedIds = Array.from(new Set([
      ...validSolvedTaskIds,
      ...lessonCompletionTags
    ]));

    isClearedRef.current = true;
    clearSessionState(sessionId).catch(err => {
      console.warn('[SessionRecovery] Error clearing session on finish:', err);
    });

    onCompleteSession(
      completedIds, 
      stars, 
      finalEarnedXp, 
      finalEarnedCoins, 
      goToNextLesson ? resolvedNextLesson : null, 
      activeSeconds, 
      sessionMistakesCount
    );
  };

  // Render Celebration Screen - Unified 150ms fade-in, zero CLS/stagger jitter
  if (isSessionComplete) {
    const calculatedXp = Math.max(35, earnedXp + 20);
    const isPerfect = sessionMistakesCount === 0;
    const perfectCoinsBonus = isPerfect ? 5 : 0;
    const calculatedCoins = Math.max(15, earnedCoins + 8 + perfectCoinsBonus);
    // Ta sama reguła co przy zapisie postępu: druga lekcja tego samego dnia nie zwiększa serii
    const streakDays = calculateStreakOnTaskCompletion(userState?.streakDays || 0, userState?.lastStreakDate, userState?.streakActiveDates || []).newStreakDays;
    // np. "math-lesson-9-2" → "9.2" (wcześniej uczeń widział techniczne "math.9-2")
    const lessonNumberMatch = String(lessonId).match(/(\d+)-(\d+)$/);
    const cleanLessonNumber = lessonNumberMatch
      ? `${lessonNumberMatch[1]}.${lessonNumberMatch[2]}`
      : lessonId.replace('lesson-', '').replace('-', '.');

    const accuracyPct = sessionMistakesCount === 0 
      ? 100 
      : Math.round((targetCorrectAnswers / (targetCorrectAnswers + sessionMistakesCount)) * 100);

    const mistakesCountLabel = sessionMistakesCount === 1 
      ? '1 błąd poprawiony w trakcie nauki'
      : sessionMistakesCount < 5 
        ? `${sessionMistakesCount} błędy poprawione w trakcie nauki` 
        : `${sessionMistakesCount} błędów poprawionych w trakcie nauki`;

    return (
      <div 
        id="session-celebration-screen"
        className="fixed inset-0 z-50 bg-[#070A0F]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 text-white select-none overflow-y-auto"
      >
        <div className="w-full max-w-md mx-auto bg-[#0B0F19] rounded-3xl border border-white/10 flex flex-col items-center justify-center p-4 sm:p-6 text-white select-none relative shadow-2xl my-auto">
          <div className="w-full flex flex-col items-center justify-center text-center">
            
            {/* 1. Profesjonalny puchar Lucide Trophy w złotym okręgu sukcesu */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative mt-2 mb-6 flex items-center justify-center"
            >
              {/* Radial ambient glow */}
              <div className="absolute w-44 h-44 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
              <div className="absolute w-36 h-36 rounded-full border border-amber-400/20 animate-spin pointer-events-none" style={{ animationDuration: '24s' }} />

              {/* Glowing golden success circle with centered Lucide Trophy */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-amber-600/20 flex items-center justify-center border-2 border-amber-400/80 shadow-md shadow-black/20 z-10">
                <Trophy size={50} className="text-amber-400 drop-shadow-md shrink-0" strokeWidth={2} />
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2"
            >
              Lekcja {cleanLessonNumber} ukończona!
            </motion.h1>

            {/* Dynamiczny komunikat gratulacyjny bez emotikonów */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="text-slate-300 text-sm sm:text-base max-w-sm mb-5 leading-relaxed font-medium"
            >
              {sessionMistakesCount === 0 
                ? 'Perfekcyjna runda! Wszystkie zadania za pierwszym podejściem.'
                : 'Lekcja zaliczona. Materiał opanowany.'
              }
            </motion.p>

            {/* 2. Równy rozmiar 4 kafelków: XP, Monety, Seria, Czas Sesji - CSS Grid 2 kolumny */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full grid grid-cols-2 gap-3 sm:gap-4 mb-5"
            >
              <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[90px] shadow-sm">
                <div className="w-7 h-7 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/30 flex items-center justify-center mb-1 text-[#FFB800]">
                  <Zap className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">+{calculatedXp}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">XP</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[90px] shadow-sm">
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-1 text-amber-400">
                  <Coins className="w-3.5 h-3.5" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">+{calculatedCoins}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                  {isPerfect ? 'Monet (+5 Czysta)' : 'Monet'}
                </span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[90px] shadow-sm">
                <div className="w-7 h-7 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mb-1 text-orange-400">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  {streakDays === 1 ? '1 dzień' : `${streakDays} dni`}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Seria</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[90px] shadow-sm">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-1 text-emerald-400">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">{formattedHumanTime}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Czas</span>
              </div>
            </motion.div>

            {/* 3. Karta podsumowania błędów (Bilans Skuteczności) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex items-center justify-center mb-6"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold ${
                sessionMistakesCount === 0 
                  ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-300 shadow-sm' 
                  : 'bg-slate-900/90 border-amber-500/30 text-amber-300 shadow-sm'
              }`}>
                {sessionMistakesCount === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span>
                  {sessionMistakesCount === 0 
                    ? 'Skuteczność: 100% • 0 błędów'
                    : `Skuteczność: ${accuracyPct}% • ${mistakesCountLabel}`
                  }
                </span>
              </div>
            </motion.div>

            {/* Przyciski akcji: "Następna lekcja" (główny) + "Wróć do mapy lekcji" (wtórny) */}
            <div className="w-full pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
              {resolvedNextLesson ? (
                <>
                  <button
                    id="session-celebration-next-button"
                    onClick={() => handleFinishSession(true)}
                    className="w-full py-4 px-6 rounded-2xl font-black text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition shadow-sm flex items-center justify-center gap-2 text-base cursor-pointer tracking-wide"
                  >
                    <span>Następna lekcja</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </button>

                  <button
                    id="session-celebration-return-button"
                    onClick={() => handleFinishSession(false)}
                    className="w-full py-3 px-6 rounded-2xl font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 active:scale-[0.98] transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <span>Wróć do mapy lekcji</span>
                  </button>
                </>
              ) : (
                <button
                  id="session-celebration-return-button"
                  onClick={() => handleFinishSession(false)}
                  className="w-full py-4 px-6 rounded-2xl font-black text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition shadow-sm flex items-center justify-center gap-2 text-base cursor-pointer tracking-wide"
                >
                  <span>Wróć do mapy lekcji</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Tier color mapping
  const tier = currentTask?.tier || 'A';
  const tierBadgeColor = 
    tier === 'C' 
      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' 
      : tier === 'B' 
        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

  return (
    <div 
      id="session-runner-modal"
      className="fixed inset-0 z-50 bg-[#070A0F] flex flex-col w-full h-full overflow-hidden p-0 m-0 select-none"
    >
      <div 
        id="session-runner-container"
        className="w-full h-full flex flex-col justify-between overflow-hidden relative text-white bg-[#070A0F] rounded-none border-0 shadow-none transition-all duration-200"
      >
      {/* ================= DEDICATED FOCUS SESSION BAR ================= */}
      <header 
        id="session-header"
        className="w-full shrink-0 bg-[#0B0F19] border-b border-white/10 z-20 sticky top-0"
      >
        <div className="w-full mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 transition-all max-w-3xl lg:max-w-4xl">
          {/* Lewa strona: Przycisk wyjścia [X] + Etykieta fazy / Pasek postępu z celem */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              id="session-exit-button"
              onClick={() => setShowExitModal(true)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 shrink-0 flex items-center justify-center cursor-pointer border border-white/5"
              title="Przerwij sesję"
              aria-label="Przerwij sesję"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {isTheoryStep ? (
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => {
                    if (isEnglishSession) return;
                    triggerHaptic('light');
                    setShowFormulaSheet(prev => !prev);
                  }}
                  title={isPolishSession ? `Leksykon: ${departmentBadgeLabel}` : isEnglishSession ? `Dział CKE: ${departmentBadgeLabel}` : `Karta wzorów: ${departmentBadgeLabel}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold tracking-wide whitespace-nowrap shrink-0 shadow-sm transition active:scale-95 cursor-pointer ${
                    isPolishSession
                      ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/35'
                      : isEnglishSession
                        ? 'text-emerald-200 bg-emerald-500/20 border border-emerald-400/40 shadow-sm'
                        : 'text-amber-200 bg-amber-500/25 border border-amber-400/50 shadow-sm'
                  }`}
                >
                  {departmentBadgeLabel}
                </button>
                <span 
                  title={moduleBadgeName ? `${lessonPillLabel ? lessonPillLabel.replace('LEKCJA', 'Lekcja') + ': ' : ''}${lessonTitleClean || moduleBadgeName}` : (lessonTitleClean || lessonTitle)}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold truncate flex-1 min-w-0 max-w-full sm:max-w-md shadow-sm ${
                    isPolishSession
                      ? 'bg-rose-950/40 text-rose-200/90 border border-rose-500/25'
                      : isEnglishSession
                        ? 'bg-emerald-950/40 text-emerald-200/90 border border-emerald-500/25'
                        : 'bg-amber-950/40 text-amber-200/90 border border-amber-500/25'
                  }`}
                >
                  <span className="font-bold shrink-0">{lessonPillLabel ? lessonPillLabel.replace('LEKCJA', 'Lekcja') + ': ' : ''}</span>
                  <span className="truncate">{lessonTitleClean || moduleBadgeName}</span>
                </span>
              </div>
            ) : (
              /* Badges + Segmented Progress Bars for Lesson Tasks */
              <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5 min-w-0 overflow-hidden">
                <button
                  id="session-department-badge-button"
                  type="button"
                  disabled={!isTheoryStep}
                  onClick={isTheoryStep ? () => {
                    triggerHaptic('light');
                    setShowFormulaSheet(prev => !prev);
                  } : undefined}
                  title={departmentBadgeLabel}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold tracking-wide whitespace-nowrap shrink-0 shadow-sm select-none ${
                    isTheoryStep ? 'cursor-pointer active:scale-95 transition' : 'cursor-default'
                  } ${
                    isPolishSession
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/35'
                      : 'text-amber-200 bg-amber-500/25 border border-amber-400/50 shadow-sm'
                  }`}
                >
                  {departmentBadgeLabel}
                </button>
                <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-[36px] max-w-[110px] xs:max-w-[160px] sm:max-w-[260px]">
                  {Array.from({ length: Math.max(1, targetCorrectAnswers) }).map((_, idx) => {
                    const isDone = idx < correctAnswersCount;
                    const isActive = idx === correctAnswersCount;

                    return (
                      <div
                        key={idx}
                        className={`flex-1 h-2 sm:h-2.5 rounded-full overflow-hidden relative p-0.5 transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-950/60 border border-emerald-500/60 shadow-sm'
                            : isActive
                              ? 'bg-amber-950/50 border border-[#FFB800] shadow-sm ring-1 ring-[#FFB800]/50'
                              : 'bg-slate-900/90 border border-white/10 shadow-inner'
                        }`}
                      >
                        <motion.div
                          initial={false}
                          animate={{
                            width: isDone || isActive ? '100%' : '0%'
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 140,
                            damping: 18,
                            mass: 0.8
                          }}
                          className={`h-full rounded-full relative overflow-hidden transition-colors duration-500 ${
                            isDone
                              ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 shadow-sm'
                              : isActive
                                ? 'bg-gradient-to-r from-[#FF8800] via-[#FFB800] to-[#FFE082] shadow-sm animate-pulse'
                                : 'bg-transparent'
                          }`}
                        >
                          {/* Top Specular Glass Reflection */}
                          <div className="absolute top-0 inset-x-0.5 h-[40%] bg-white/45 rounded-full pointer-events-none" />

                          {/* Ambient Shimmer Sweep on latest completed bar */}
                          {idx === correctAnswersCount - 1 && isDone && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', repeatDelay: 1.5 }}
                            />
                          )}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Prawa strona: Kapsułki gracza (Serca + Monety + Wzory) w uporządkowanym kontenerze */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            {/* Przycisk Wzory / Leksykon dla bieżącego działu (ukryty dla języka angielskiego) */}
            {!isEnglishSession && (isTheoryStep ? (
              <button
                id="session-formulas-button"
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setShowFormulaSheet(prev => !prev);
                }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold shadow-sm select-none transition-all active:scale-95 cursor-pointer shrink-0 ${
                  isPolishSession
                    ? 'bg-rose-500/15 hover:bg-rose-500/25 active:bg-rose-500/30 border-rose-500/35 text-rose-300'
                    : 'text-amber-200 bg-slate-800/80 border border-amber-500/30 hover:bg-slate-700/80'
                }`}
                title={isPolishSession ? 'Leksykon pojęć i zasady (klawisz W)' : `Wzory z tego działu: ${departmentBadgeLabel} (klawisz W)`}
                aria-label={isPolishSession ? 'Leksykon pojęć' : 'Wzory z tego działu'}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline font-semibold">
                  {isPolishSession ? 'Leksykon' : 'Wzory'}
                </span>
              </button>
            ) : (
              /* Dedykowany, czytelny przycisk wzorów w trakcie zadań */
              <button
                id="session-task-formulas-button"
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setShowFormulaSheet(prev => !prev);
                }}
                className={`flex items-center justify-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all select-none ${
                  isPolishSession
                    ? 'text-rose-200 bg-slate-800/80 border border-rose-500/30 hover:bg-slate-700/80'
                    : 'text-amber-200 bg-slate-800/80 border border-amber-500/30 hover:bg-slate-700/80'
                }`}
                title={isPolishSession ? 'Leksykon pojęć i zasady (klawisz W)' : `Wzory z tego działu: ${departmentBadgeLabel} (klawisz W)`}
                aria-label={isPolishSession ? 'Leksykon pojęć' : 'Wzory z tego działu'}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline font-semibold">
                  {isPolishSession ? 'Leksykon' : 'Wzory'}
                </span>
              </button>
            ))}

            {/* Hearts Indicator Pill with Shockwave Arrival Effect */}
            <div className="relative shrink-0">
              {/* Expanding Shockwave Ring upon Heart Impact */}
              <AnimatePresence>
                {pillShockwave && (
                  <motion.div
                    initial={{ opacity: 0.95, scale: 0.8 }}
                    animate={{ opacity: 0, scale: 2.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-2 border-rose-500 bg-rose-500/25 pointer-events-none shadow-sm z-10"
                  />
                )}
              </AnimatePresence>

              <motion.button
                id="session-hearts-pill"
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  if (!heartsData.isPro && heartsData.hearts <= 0) {
                    setShowOutOfHeartsModal(true);
                  } else {
                    setShowHeartsPopover(prev => !prev);
                  }
                }}
                animate={isHeartShaking && !isTheoryStep ? {
                  x: [0, -6, 6, -5, 5, -2, 2, 0],
                  scale: [1, 1.25, 0.9, 1.1, 1]
                } : {}}
                transition={{ duration: 0.6 }}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs font-semibold shadow-sm select-none transition-all active:scale-95 cursor-pointer ${
                  heartsData.isPro || isTheoryStep
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : isHeartShaking
                      ? 'bg-rose-500/30 border-rose-500 text-rose-300 shadow-sm'
                      : Number(displayedHeartsCount) <= 1 && !heartsData.isPro
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                }`}
                title={heartsData.isPro || isTheoryStep ? (isTheoryStep ? 'Teoria: Nielimitowane serca' : 'Pakiet PRO: Nielimitowane serca') : `Serca: ${displayedHeartsCount}/${heartsData.maxHearts}`}
              >
                {isHeartShaking && !isTheoryStep ? (
                  <HeartCrack className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
                ) : (
                  <Heart className={`w-3.5 h-3.5 text-rose-500 ${Number(displayedHeartsCount) > 0 || heartsData.isPro || isTheoryStep ? 'fill-rose-500' : ''} shrink-0`} />
                )}
                <motion.span 
                  key={String(displayedHeartsCount)}
                  initial={{ scale: 1.45 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                  className="font-bold tracking-wide leading-none inline-block"
                >
                  {displayedHeartsCount}
                </motion.span>
              </motion.button>

              {/* Quick Hearts Popover Dropdown in Session */}
              <AnimatePresence>
                {showHeartsPopover && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowHeartsPopover(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 z-50 w-72 bg-[#0E131F] border border-slate-700/80 rounded-2xl p-4 shadow-2xl shadow-black/80"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Heart size={16} className="text-rose-500 fill-rose-500" />
                          <span className="font-bold text-white text-sm">Twoje serca</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-300">
                          {heartsData.isPro ? 'Nielimitowane' : `${heartsData.hearts} / ${heartsData.maxHearts}`}
                        </span>
                      </div>

                      {/* 5 Serc Wizualnie */}
                      <div className="flex items-center justify-center gap-2 py-2 mb-3 bg-slate-900/60 rounded-xl border border-white/5">
                        {Array.from({ length: heartsData.maxHearts }).map((_, idx) => {
                          const hasHeart = idx < heartsData.hearts || heartsData.isPro;
                          return (
                            <Heart
                              key={idx}
                              size={20}
                              className={`transition-all duration-300 ${
                                hasHeart 
                                  ? 'text-rose-500 fill-rose-500' 
                                  : 'text-slate-700 stroke-slate-700'
                              }`}
                            />
                          );
                        })}
                      </div>

                      {/* Timer regeneracji */}
                      {!heartsData.isPro && heartsData.hearts < heartsData.maxHearts && (
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-[#FFB800]" />
                            <span>Kolejne serce za:</span>
                          </div>
                          <span className="font-mono font-bold text-[#FFB800]">{heartsData.formattedTime}</span>
                        </div>
                      )}

                      {heartsData.isPro && (
                        <div className="text-xs text-amber-300/90 mb-3 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-center font-medium">
                          Pakiet PRO: Uczysz się bez przerw i bez utraty serc!
                        </div>
                      )}

                      {/* Akcje doładowania */}
                      <div className="space-y-2 pt-1">
                        {!heartsData.isPro && heartsData.hearts < heartsData.maxHearts && (
                          <button
                            onClick={() => {
                              setShowHeartsPopover(false);
                              handleRefillHeartsWithCoins();
                            }}
                            disabled={currentCoins < 150}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer ${
                              currentCoins >= 150
                                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                                : 'bg-slate-800/60 text-slate-500 border border-slate-700/40 cursor-not-allowed'
                            }`}
                          >
                            <Coins size={14} className="text-amber-400" />
                            <span>Napełnij serca za 150 monet</span>
                          </button>
                        )}

                        {!heartsData.isPro && (
                          <button
                            onClick={() => {
                              setShowHeartsPopover(false);
                              if (onOpenParentSponsor) onOpenParentSponsor();
                              else setShowParentSponsorModal(true);
                            }}
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 flex items-center justify-center gap-1.5 transition active:scale-98 shadow-md shadow-orange-500/20 cursor-pointer"
                          >
                            <Users size={14} className="fill-slate-950" />
                            <span>Poproś rodzica o PRO (BLIK)</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Wskaźniki trybu zadań: Cel i Monety w uporządkowanym kontenerze shrink-0 */}
            {!isTheoryStep && (
              <>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/80 text-[11px] sm:text-xs shrink-0 select-none shadow-sm">
                  <span className="text-slate-400 font-medium hidden sm:inline">Cel:</span>
                  <span className={correctAnswersCount > 0 ? (isPolishSession ? "text-[#F43F5E] font-black" : "text-[#FFB800] font-black") : "text-white font-bold"}>
                    {correctAnswersCount}
                  </span>
                  <span className="text-slate-600 font-normal">/</span>
                  <span className="text-slate-400 font-semibold">{targetCorrectAnswers}</span>
                </span>

                <div 
                  id="session-coins-pill"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/80 text-slate-200 text-xs font-semibold shadow-sm select-none"
                  title={`Stan portfela: ${currentCoins} monet`}
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-bold text-white tracking-wide">{currentCoins}</span>
                </div>
              </>
            )}

          </div>
        </div>
      </header>

      {/* Dynamic Studio-Grade 5-Hearts Floating HUD Tray & Parabolic Flight Animation */}
      <AnimatePresence>
        {heartFlyAnim?.active && (() => {
          const startX = heartFlyAnim.startX;
          const startY = heartFlyAnim.startY;
          const targetX = heartFlyAnim.targetX;
          const targetY = heartFlyAnim.targetY;

          return (
            <div 
              key={heartFlyAnim.key} 
              className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
              aria-hidden="true"
            >
              {/* 1. Subtle Atmospheric Top Vignette (Zero Murkiness, 100% Content Legibility) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.75, 0.5, 0] }}
                transition={{ duration: 1.35, times: [0, 0.2, 0.75, 1], ease: 'easeInOut' }}
                className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-rose-950/30 via-rose-950/10 to-transparent pointer-events-none"
              />

              {/* 2. Sleek Dynamic Island 5-Hearts Floating HUD Tray */}
              <motion.div
                initial={{ opacity: 0, y: -25, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 24, stiffness: 350 }}
                className="fixed top-20 sm:top-22 left-1/2 -translate-x-1/2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-[#090D18]/95 border border-rose-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(244,63,94,0.18)] backdrop-blur-xl flex flex-col items-center gap-2.5 z-50 pointer-events-none"
              >
                {/* Header Warning Tag */}
                <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-300">
                    -1 Serce • Pomyłka
                  </span>
                </div>

                {/* The 5 Heart Containers Tray */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const isRemainingActive = idx < heartFlyAnim.nextHearts;
                    const isDying = idx === heartFlyAnim.nextHearts;
                    const isAlreadyEmpty = idx > heartFlyAnim.nextHearts;

                    return (
                      <div
                        key={idx}
                        className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-slate-950/80 border border-white/10 shadow-inner overflow-hidden"
                      >
                        {/* Empty Vessel Bed (Always present underneath - subtle gray outline) */}
                        <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 absolute pointer-events-none" fill="none">
                          <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            fill="#070A12"
                            stroke="#334155"
                            strokeWidth="1.6"
                            strokeDasharray={isAlreadyEmpty ? "2 2" : undefined}
                            opacity={isAlreadyEmpty ? "0.4" : "0.75"}
                          />
                        </svg>

                        {/* CASE 1: FULL ACTIVE RUBY GEM HEART */}
                        {isRemainingActive && (
                          <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-rose-500/30 rounded-full blur-sm animate-pulse" />
                            <svg viewBox="0 0 24 24" className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(244,63,94,0.85)]">
                              <defs>
                                <linearGradient id={`ruby-active-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#FF4D6D" />
                                  <stop offset="60%" stopColor="#E01E5A" />
                                  <stop offset="100%" stopColor="#A00030" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill={`url(#ruby-active-${idx})`}
                              />
                              <ellipse cx="7.5" cy="6.5" rx="2.5" ry="1.4" fill="rgba(255,255,255,0.45)" transform="rotate(-25 7.5 6.5)" />
                            </svg>
                          </div>
                        )}

                        {/* CASE 2: THE SHATTERING HEART (SPLITS IN HALF WITH SPARKS & DISSOLVES) */}
                        {isDying && (
                          <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                            {/* Left Half Split & Disintegrate */}
                            <motion.svg
                              viewBox="0 0 24 24"
                              className="w-full h-full absolute z-10 pointer-events-none"
                              initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                              animate={{
                                x: [0, -3, 3, -10],
                                y: [0, -2, 2, 8],
                                rotate: [0, -8, 8, -22],
                                scale: [1, 1.2, 1.05, 0.3],
                                opacity: [1, 1, 1, 0]
                              }}
                              transition={{ duration: 0.65, delay: 0.12, times: [0, 0.2, 0.45, 1] }}
                            >
                              <defs>
                                <linearGradient id="ruby-left" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#FF4D6D" />
                                  <stop offset="60%" stopColor="#E01E5A" />
                                  <stop offset="100%" stopColor="#A00030" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09V21.35z"
                                fill="url(#ruby-left)"
                              />
                            </motion.svg>

                            {/* Right Half Split & Disintegrate */}
                            <motion.svg
                              viewBox="0 0 24 24"
                              className="w-full h-full absolute z-10 pointer-events-none"
                              initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                              animate={{
                                x: [0, 3, -3, 10],
                                y: [0, -2, 2, 8],
                                rotate: [0, 8, -8, 22],
                                scale: [1, 1.2, 1.05, 0.3],
                                opacity: [1, 1, 1, 0]
                              }}
                              transition={{ duration: 0.65, delay: 0.12, times: [0, 0.2, 0.45, 1] }}
                            >
                              <defs>
                                <linearGradient id="ruby-right" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#FF4D6D" />
                                  <stop offset="60%" stopColor="#E01E5A" />
                                  <stop offset="100%" stopColor="#A00030" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M12 5.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35V5.09z"
                                fill="url(#ruby-right)"
                              />
                            </motion.svg>

                            {/* Burst Ember Sparks */}
                            {[
                              { dx: -20, dy: -18 },
                              { dx: 18, dy: -20 },
                              { dx: -18, dy: 16 },
                              { dx: 20, dy: 18 },
                              { dx: 0, dy: -24 },
                              { dx: 0, dy: 22 },
                            ].map((spark, sIdx) => (
                              <motion.div
                                key={`spark-${sIdx}`}
                                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                animate={{
                                  opacity: [0, 1, 0],
                                  scale: [0, 1.3, 0.2],
                                  x: [0, spark.dx],
                                  y: [0, spark.dy],
                                }}
                                transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
                                className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-400 to-amber-300 shadow-sm z-20 pointer-events-none"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Status Bottom Count */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <span className="text-slate-400 font-medium">Pozostało:</span>
                  <span className="text-rose-400 font-black text-sm">{heartFlyAnim.nextHearts} z 5</span>
                  <span className="text-slate-400 font-normal">serc</span>
                </div>
              </motion.div>

              {/* 3. Luminous Star Comet Flying from exact slot in HUD to Header Pill */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: startX,
                  y: startY,
                  scale: 0.6,
                  rotate: 0
                }}
                animate={{
                  opacity: [0, 1, 1, 0.95, 0],
                  scale: [0.6, 1.4, 0.95, 0.3],
                  rotate: [0, -18, 24, 0],
                  x: [startX, startX, (startX + targetX) / 2, targetX],
                  y: [startY, startY - 20, Math.min(startY, targetY) - 30, targetY],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.22,
                  times: [0, 0.15, 0.55, 0.85, 1],
                  ease: [0.18, 0.95, 0.28, 1]
                }}
                className="fixed top-0 left-0 flex items-center justify-center pointer-events-none z-50"
              >
                <div className="relative flex items-center justify-center">
                  {/* Outer Pulsing Glow */}
                  <div className="absolute w-12 h-12 rounded-full bg-rose-500/40 blur-lg animate-pulse" />
                  {/* Comet Head */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white via-rose-400 to-rose-600 shadow-sm flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ================= MAIN TASK AREA ================= */}
      <main 
        id="session-task-area"
        ref={taskAreaRef}
        className={`w-full mx-auto flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y flex flex-col justify-start transition-all max-w-3xl lg:max-w-4xl px-4 ${
          isTheoryStep 
            ? 'pb-36 sm:pb-36' 
            : isEvaluated ? 'pb-28 sm:pb-32' : 'pb-24 sm:pb-28'
        }`}
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        {isTheoryStep ? (
          <div id="session-theory-pill-content" className="w-full max-w-3xl lg:max-w-4xl mx-auto space-y-4 pt-3 sm:pt-4">
            {/* Minimalistyczne zakładki z dolnym akcentem (underline tabs) */}
            <div className="w-full border-b border-white/10 flex items-center justify-between gap-1 sm:gap-2 px-1 pb-px">
              {(isPolishSession
                ? [
                    { id: 0, title: (theoryPill as any)?.book_summary ? 'Lektura' : 'W pigułce', icon: (theoryPill as any)?.book_summary ? BookOpen : Compass },
                    { id: 1, title: 'Pojęcia', icon: BookmarkCheck },
                    { id: 2, title: 'Analiza', icon: FileText },
                    { id: 3, title: 'Typowy błąd', icon: ShieldAlert }
                  ]
                : isEnglishSession
                  ? [
                      { id: 0, title: 'Pewniaki', icon: Key },
                      { id: 1, title: 'Przykłady', icon: CheckCircle2 },
                      { id: 2, title: 'Typowy błąd', icon: ShieldAlert }
                    ]
                  : [
                      { id: 0, title: 'W pigułce', icon: Compass },
                      { id: 1, title: 'Wzory', icon: Calculator },
                      { id: 2, title: 'Przykład', icon: CheckCircle2 },
                      { id: 3, title: 'Typowy błąd', icon: ShieldAlert }
                    ]
              ).map((step) => {
                const StepIcon = step.icon;
                const isActive = theorySubStep === step.id;
                const isDone = theorySubStep > step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setTheorySubStep(step.id);
                    }}
                    className={`relative py-2.5 px-2 sm:px-3 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium cursor-pointer transition-colors duration-150 flex-1 outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/40 rounded-lg ${
                      isActive
                        ? 'text-amber-400 font-bold'
                        : isDone
                          ? 'text-slate-300 hover:text-white'
                          : 'text-slate-400 hover:text-slate-200'
                    }`}
                    aria-label={`Przejdź do zakładki: ${step.title}`}
                  >
                    <StepIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${
                      isActive 
                        ? 'text-amber-400' 
                        : isDone 
                          ? 'text-emerald-400/80' 
                          : 'text-slate-500'
                    }`} />
                    <span className="truncate">{step.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTheoryTabUnderline"
                        className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {/* Zakładka 0: Istota & Strategia maturalna */}
              {theorySubStep === 0 && (
                <motion.div
                  key="theory-tab-0"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {isPolishSession ? (() => {
                    const polishTheory = theoryPill?.polishTheory || getPolishLessonDocument((sessionData as any)?.topicId, lessonId)?.theory_pill?.polishTheory;
                    const bookSummary = (theoryPill as any)?.book_summary || getPolishBookSummary(lessonTitle + ' ' + (theoryPill?.title || '') + ' ' + (polishTheory?.lektura || ''));
                    const leadText = polishTheory?.lead || theoryPill?.concept_essence || theoryPill?.intuition || '';
                    const gatekeeper = polishTheory?.gatekeeper;
                    const gatekeeperAns = gatekeeperSelected[lessonId];
                    const isGatekeeperAnswered = typeof gatekeeperAns === 'number';
                    const isGatekeeperCorrect = isGatekeeperAnswered && gatekeeperAns === gatekeeper?.correctIndex;
                    const showHint = Boolean(gatekeeperShowHint[lessonId]);

                    return (
                      <div className="space-y-4">
                        {/* 1. HERO HEADER: Moduł, Epoka, Lektura i Esencja Zagadnienia CKE */}
                        <section className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#101726] via-[#0E1522] to-[#141D2E] border border-amber-500/25 shadow-[0_4px_24px_rgba(255,184,0,0.08)] flex flex-col gap-3.5">
                          {/* Etykiety i metadane */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              {polishTheory?.module || 'Język polski CKE'}
                            </span>
                            {polishTheory?.epoch && (
                              <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-white/10 flex items-center gap-1.5">
                                <Feather size={12} className="text-amber-400" />
                                {polishTheory.epoch}
                              </span>
                            )}
                            {(polishTheory?.lektura || bookSummary?.title) && (
                              <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25 flex items-center gap-1.5">
                                <BookOpen size={12} className="text-rose-400" />
                                {polishTheory?.lektura || bookSummary?.title}
                              </span>
                            )}
                          </div>

                          {/* Tytuł lekcji & Podtytuł */}
                          <div className="flex flex-col gap-1">
                            <h2 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
                              {theoryPill?.title || lessonTitle}
                            </h2>
                            {polishTheory?.subtitle && (
                              <p className="text-xs sm:text-sm font-medium text-amber-300/80">
                                {polishTheory.subtitle}
                              </p>
                            )}
                          </div>

                          {/* Esencja / Główna definicja */}
                          {leadText && (
                            <div className="p-3.5 sm:p-4 rounded-xl border-l-4 border-l-[#FFB800] border border-white/10 bg-black/40 text-slate-200 text-xs sm:text-sm leading-relaxed shadow-inner">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                                Wprowadzenie & Sens Zagadnienia:
                              </span>
                              {renderMicroContent(leadText)}
                            </div>
                          )}
                        </section>

                        {/* 2. CHECKLISTA KOMPETENCJI CKE (Standard wymagań egzaminacyjnych) */}
                        {polishTheory?.objectives && polishTheory.objectives.length > 0 && (
                          <section className="rounded-2xl p-4 sm:p-5 bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>Weryfikowane umiejętności CKE (Standard wymagań)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                              {polishTheory.objectives.map((obj, oIdx) => (
                                <div
                                  key={oIdx}
                                  className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-emerald-500/15 text-xs sm:text-sm text-slate-200 shadow-sm"
                                >
                                  <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check size={12} strokeWidth={3} />
                                  </span>
                                  <span className="leading-snug flex-1">{renderMicroContent(obj)}</span>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        {/* 3. GŁÓWNE FILARY WIEDZY CKE (Bento Grid) */}
                        {polishTheory?.theoryPoints && polishTheory.theoryPoints.length > 0 && (
                          <section className="rounded-2xl p-4 sm:p-5 bg-[#0E1522] border border-amber-500/20 flex flex-col gap-3.5">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                                <BookmarkCheck size={16} className="text-[#FFB800] shrink-0" />
                                <span>Główne filary wiedzy CKE</span>
                              </div>
                              <span className="text-[10px] font-medium text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                {polishTheory.theoryPoints.length} kluczowe aspekty
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {polishTheory.theoryPoints.map((point, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="rounded-xl p-3.5 sm:p-4 bg-slate-950/70 border border-white/10 flex flex-col gap-2 hover:border-amber-500/30 transition-colors shadow-sm"
                                >
                                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                    <span className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                      {String(pIdx + 1).padStart(2, '0')}
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight flex-1">
                                      {point.title}
                                    </h4>
                                  </div>
                                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    {renderMicroContent(point.explanation || point.content)}
                                  </div>
                                  {point.example && (
                                    <div className="mt-1 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex flex-col gap-0.5">
                                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                        <Zap size={11} className="text-amber-400" />
                                        Przykład maturalny:
                                      </span>
                                      <span>{renderMicroContent(point.example)}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        {/* 4. PRZEWODNIK PO LEKTURZE MATURALNEJ (DLA LEKTUR) */}
                        {bookSummary && (
                          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#151D2C] via-[#0E1522] to-[#101726] border border-amber-500/30 shadow-[0_4px_24px_rgba(255,184,0,0.12)] flex flex-col gap-4">
                            {/* Nagłówek lektury */}
                            <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-3 flex-wrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                                  <BookOpen size={16} />
                                </div>
                                <div>
                                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                                    Przewodnik po lekturze i motywach CKE
                                  </span>
                                  {bookSummary.title && (
                                    <h3 className="text-sm sm:text-base font-black text-white">
                                      {bookSummary.title} {bookSummary.author ? `• ${bookSummary.author}` : ''}
                                    </h3>
                                  )}
                                </div>
                              </div>
                              {bookSummary.genre && (
                                <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                                  {bookSummary.genre}
                                </span>
                              )}
                            </div>

                            {/* Streszczenie fabuły */}
                            {bookSummary.plot_overview && (
                              <div className="space-y-1.5">
                                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span>Zwięzłe streszczenie fabuły</span>
                                </span>
                                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/40 p-3.5 sm:p-4 rounded-xl border border-white/5 whitespace-pre-line shadow-inner">
                                  {renderMicroContent(bookSummary.plot_overview)}
                                </div>
                              </div>
                            )}

                            {/* Oś kluczowych wydarzeń */}
                            {bookSummary.key_events && bookSummary.key_events.length > 0 && (
                              <div className="space-y-2 pt-1 border-t border-white/5">
                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Kluczowy ciąg wydarzeń (oś dramatyczna)</span>
                                </span>
                                <div className="space-y-2 pl-0.5">
                                  {bookSummary.key_events.map((ev: string, evIdx: number) => (
                                    <div key={evIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                                      <span className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] font-mono font-bold text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                                        {evIdx + 1}
                                      </span>
                                      <span className="leading-relaxed flex-1">{renderMicroContent(ev)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Bohaterowie i relacje */}
                            {bookSummary.characters && bookSummary.characters.length > 0 && (
                              <div className="space-y-2 pt-1 border-t border-white/5">
                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Kluczowi bohaterowie i ich role</span>
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {bookSummary.characters.map((ch: any, chIdx: number) => (
                                    <div key={chIdx} className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col gap-0.5">
                                      <span className="text-xs font-bold text-rose-300">{ch.name}</span>
                                      <span className="text-[11px] text-slate-400 leading-snug">{ch.role}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Kluczowe sceny maturalne */}
                            {bookSummary.key_scenes && bookSummary.key_scenes.length > 0 && (
                              <div className="space-y-2 pt-1 border-t border-white/5">
                                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span>Sceny o fundamentalnym znaczeniu maturalnym</span>
                                </span>
                                <div className="space-y-2">
                                  {bookSummary.key_scenes.map((sc: any, scIdx: number) => (
                                    <div key={scIdx} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs leading-relaxed">
                                      <span className="font-bold text-amber-300 block mb-0.5">{sc.scene}</span>
                                      <span className="text-slate-300">{sc.significance}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 5. OSTRZEŻENIE PRZED BŁĘDEM KARDYNALNYM (0/35 PKT) */}
                        {(polishTheory?.cardinalWarning || (bookSummary?.cardinal_mistakes && bookSummary.cardinal_mistakes.length > 0)) && (
                          <section className="rounded-2xl p-4 sm:p-5 bg-rose-500/10 border border-rose-500/30 flex flex-col gap-2.5 shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                              <ShieldAlert size={16} className="text-rose-400 shrink-0" />
                              <span>Uwaga: Błąd kardynalny na maturze (0/35 pkt)</span>
                            </div>
                            <p className="text-xs text-rose-300/90 leading-relaxed">
                              Błąd rzeczowy skutkuje jedynie utratą 1 punktu w teście, lecz <strong>błąd kardynalny</strong> (całkowite wypaczenie sensu lub fabuły lektury obowiązkowej) powoduje <strong>natychmiastowe wyzerowanie całego wypracowania</strong>.
                            </p>
                            {polishTheory?.cardinalWarning && (
                              <div className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/20 text-xs sm:text-sm text-slate-200">
                                {renderMicroContent(polishTheory.cardinalWarning)}
                              </div>
                            )}
                            {bookSummary?.cardinal_mistakes && bookSummary.cardinal_mistakes.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                {bookSummary.cardinal_mistakes.map((cm: string, cmIdx: number) => (
                                  <div key={cmIdx} className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2">
                                    <XCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                                    <span>{renderMicroContent(cm)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </section>
                        )}

                        {/* 6. PATENTY I WSKAZÓWKI EGZAMINATORA CKE */}
                        {((polishTheory?.ckeExaminerTips && polishTheory.ckeExaminerTips.length > 0) || theoryPill?.matura_context) && (
                          <section className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#1C170E]/80 via-slate-900/80 to-slate-900/90 border border-amber-500/30 shadow-[0_4px_20px_rgba(255,184,0,0.06)] flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                              <GraduationCap size={16} className="text-[#FFB800] shrink-0" />
                              <span>Patenty i wskazówki egzaminatora CKE</span>
                            </div>
                            <div className="space-y-2">
                              {(polishTheory?.ckeExaminerTips && polishTheory.ckeExaminerTips.length > 0) ? (
                                polishTheory.ckeExaminerTips.map((tip, tIdx) => (
                                  <div key={tIdx} className="p-3 rounded-xl bg-black/40 border border-amber-500/15 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                      {tIdx + 1}
                                    </span>
                                    <span className="flex-1">{renderMicroContent(tip)}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                                  {renderMicroContent(sanitizeExaminerTip(theoryPill?.matura_context || ''))}
                                </div>
                              )}
                            </div>
                          </section>
                        )}

                        {/* 7. MINI-WYZWANIE BRAMKOWE (ACTIVE RECALL) */}
                        {gatekeeper && (
                          <section className="rounded-2xl p-4 sm:p-5 bg-[#0E1522] border border-amber-500/30 shadow-[0_4px_20px_rgba(255,184,0,0.08)] flex flex-col gap-3.5">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                                <Target size={16} className="text-[#FFB800] shrink-0" />
                                <span>Sprawdź zrozumienie (Mini-wyzwanie bramkowe)</span>
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                Active Recall
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                              {renderMicroContent(gatekeeper.question)}
                            </p>

                            {/* Opcje odpowiedzi */}
                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {gatekeeper.options.map((opt, optIdx) => {
                                const isSelected = gatekeeperAns === optIdx;
                                const isThisCorrect = optIdx === gatekeeper.correctIndex;
                                const showResult = isGatekeeperAnswered;

                                let btnStyle = 'bg-slate-950/60 border-white/10 hover:border-amber-500/40 text-slate-200';
                                if (showResult) {
                                  if (isThisCorrect) {
                                    btnStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
                                  } else if (isSelected) {
                                    btnStyle = 'bg-rose-500/15 border-rose-500/50 text-rose-200';
                                  } else {
                                    btnStyle = 'bg-slate-950/40 border-white/5 text-slate-400 opacity-60';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => {
                                      if (isGatekeeperAnswered) return;
                                      triggerHaptic('light');
                                      setGatekeeperSelected(prev => ({ ...prev, [lessonId]: optIdx }));
                                      if (optIdx === gatekeeper.correctIndex) {
                                        playSuccessSound();
                                        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
                                        triggerHaptic('success');
                                      } else {
                                        playErrorSound();
                                        triggerHaptic('error');
                                      }
                                    }}
                                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs sm:text-sm flex items-center justify-between gap-3 ${btnStyle} cursor-pointer`}
                                  >
                                    <div className="flex items-center gap-2.5 flex-1">
                                      <span className="w-5 h-5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <span className="leading-snug">{renderMicroContent(opt)}</span>
                                    </div>
                                    {showResult && isThisCorrect && (
                                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                    )}
                                    {showResult && isSelected && !isThisCorrect && (
                                      <XCircle size={16} className="text-rose-400 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Informacja zwrotna po odpowiedzi */}
                            {isGatekeeperAnswered && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed flex flex-col gap-1 ${
                                  isGatekeeperCorrect
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                                  {isGatekeeperCorrect ? (
                                    <>
                                      <CheckCircle2 size={14} className="text-emerald-400" />
                                      <span className="text-emerald-300">Świetnie! Prawidłowa odpowiedź</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle size={14} className="text-rose-400" />
                                      <span className="text-rose-300">Niedokładnie – sprawdź wyjaśnienie:</span>
                                    </>
                                  )}
                                </div>
                                <p className="text-slate-200">{renderMicroContent(gatekeeper.explanation)}</p>
                              </motion.div>
                            )}

                            {/* Przełącznik podpowiedzi */}
                            {gatekeeper.hint && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerHaptic('light');
                                    setGatekeeperShowHint(prev => ({ ...prev, [lessonId]: !prev[lessonId] }));
                                  }}
                                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Lightbulb size={13} className="text-amber-400" />
                                  <span>{showHint ? 'Ukryj wskazówkę' : 'Pokaż wskazówkę do pytania'}</span>
                                </button>
                                {showHint && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed"
                                  >
                                    {renderMicroContent(gatekeeper.hint)}
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </section>
                        )}

                        {/* 8. ZŁOTA REGUŁA MATURALNA */}
                        {((polishTheory?.goldenRules && polishTheory.goldenRules.length > 0) || theoryPill?.keyTakeaway) && (
                          <section className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-[#0E1522] to-amber-500/10 border border-amber-500/40 shadow-[0_4px_20px_rgba(255,184,0,0.1)] flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Award size={16} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-400">
                                Złota zasada maturalna („Z polskiego na nasze”)
                              </span>
                              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                                {renderMicroContent(polishTheory?.goldenRules?.[0] || theoryPill?.keyTakeaway || '')}
                              </p>
                            </div>
                          </section>
                        )}
                      </div>
                    );
                  })() : isEnglishSession ? (() => {
                    const pewniakData = getDuetDataForLesson(lessonId);
                    return (
                      <div className="space-y-4">
                        {/* 1. HERO HEADER: Etykiety i tytuł */}
                        <section className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#151D2C] via-[#0E1522] to-[#0A0F1A] border border-[#FFB800]/30 shadow-[0_4px_24px_rgba(255,184,0,0.08)] flex flex-col gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFB800]/15 text-[#FFDCA1] border border-[#FFB800]/30 flex items-center gap-1.5 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                              Język angielski CKE
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                              <Flame size={12} className="text-amber-400" />
                              {pewniakData.ckeFrequency}
                            </span>
                            <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-white/10">
                              Poziom B1+ (Formuła 2023)
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <h2 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
                              {theoryPill?.title || lessonTitle}
                            </h2>
                            <p className="text-xs sm:text-sm font-medium text-[#FFDCA1]/90">
                              Pewniaki maturalne, schematy form gramatycznych i kluczowe reguły CKE
                            </p>
                          </div>
                        </section>

                        {/* 2. SFORMATOWANE ZASADY I WZORCE (DUŻE, CZYTELNE KARTY RPG) */}
                        <EnglishConceptFormatter content={theoryPill?.concept_essence || ''} />

                        {/* 3. KONTRAST CKE: DO vs DON'T (STANDARD VS TYPOWY BŁĄD) */}
                        {pewniakData.doVsDont && (
                          <section className="rounded-2xl border-2 border-slate-700/80 bg-[#0B101D] p-4 sm:p-5 shadow-xl space-y-3">
                            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                <span className="text-xs font-black uppercase text-slate-300 tracking-wider">
                                   KONTRAST CKE • STANDARD VS TYPOWY BŁĄD
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-amber-300/80 uppercase">
                                Różnica między 100% a 0 pkt
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
                              <div className="rounded-xl p-3.5 sm:p-4 bg-emerald-950/30 border border-emerald-500/50 flex flex-col justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase mb-1">
                                    <Check className="w-4 h-4 stroke-[3]" />
                                    <span>TAK NA MATURZE (DO)</span>
                                  </div>
                                  <p className="text-sm font-bold text-white font-mono bg-black/40 p-2.5 rounded-lg border border-emerald-500/20">
                                    {pewniakData.doVsDont.doText}
                                  </p>
                                </div>
                                <p className="text-xs text-emerald-200/90 leading-relaxed font-medium">
                                  {pewniakData.doVsDont.doExplanation}
                                </p>
                              </div>

                              <div className="rounded-xl p-3.5 sm:p-4 bg-rose-950/30 border border-rose-500/50 flex flex-col justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-black uppercase mb-1">
                                    <XCircle className="w-4 h-4 stroke-[3]" />
                                    <span>UNIKAJ TEGO (DON'T)</span>
                                  </div>
                                  <p className="text-sm font-bold text-rose-200 line-through font-mono bg-black/40 p-2.5 rounded-lg border border-rose-500/20">
                                    {pewniakData.doVsDont.dontText}
                                  </p>
                                </div>
                                <p className="text-xs text-rose-200/90 leading-relaxed font-medium">
                                  {pewniakData.doVsDont.dontExplanation}
                                </p>
                              </div>
                            </div>
                          </section>
                        )}

                        {/* 4. WSKAZÓWKA EGZAMINATORA */}
                        {Boolean(sanitizeExaminerTip(theoryPill?.matura_context || theoryPill?.keyTakeaway || '').trim()) && (
                          <section className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 shadow-sm border bg-gradient-to-br from-[#1C170E]/80 via-slate-900/80 to-slate-900/90 border-amber-500/30 shadow-[0_4px_20px_rgba(255,184,0,0.06)]">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                              <GraduationCap className="w-4 h-4 shrink-0 text-[#FFB800]" />
                              <span>Wskazówka egzaminatora</span>
                            </div>
                            <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                              {renderMicroContent(sanitizeExaminerTip(theoryPill?.matura_context || theoryPill?.keyTakeaway))}
                            </div>
                          </section>
                        )}

                        {/* 5. ROZGRZEWKA PEWNIAKA: MATURALNY DUET */}
                        <div className="pt-1">
                          <MaturalnyDuetGame lessonId={lessonId} />
                        </div>
                      </div>
                    );
                  })() : (
                    /* Domyślny widok matematyki */
                    <>
                      <section className="flex flex-col gap-2.5">
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                            <span>ESENCJA POJĘCIA CKE</span>
                          </div>
                        </div>
                        {renderConceptEssenceCard(theoryPill?.concept_essence || theoryPill?.intuition, isPolishSession, theoryPill?.diagram, (theoryPill as any)?.numberLine)}
                      </section>

                      {theoryPill?.plain_polish && (
                        <section className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2 border bg-[#1A1811] border-[#FFB800]/25 shadow-sm">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                            <BookOpen className="w-4 h-4 text-[#FFB800]" />
                            <span>Z polskiego na nasze (Intuicja bez żargonu)</span>
                          </div>
                          <div className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-medium">
                            <MathRenderer content={String(theoryPill.plain_polish).replace(/^\s*Z polskiego na nasze\s*[:–-]\s*/i, '')} />
                          </div>
                        </section>
                      )}

                      {theoryPill?.algorithm_steps && theoryPill.algorithm_steps.length > 0 && (
                        <section className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3 border bg-[#121B2C] border-white/10 shadow-sm">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                            <Zap className="w-4 h-4 text-[#FFB800]" />
                            <span>Algorytm postępowania CKE (Krok po kroku)</span>
                          </div>
                          <div className="space-y-2.5">
                            {theoryPill.algorithm_steps.map((st: any, sIdx: number) => (
                              <div key={sIdx} className="p-3.5 rounded-xl bg-[#090D15] border border-white/5 flex items-start gap-3">
                                <span className="w-6 h-6 rounded-lg bg-[#FFB800]/20 text-[#FFB800] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  {st.stepNumber || sIdx + 1}
                                </span>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <h4 className="text-xs font-bold text-white">{st.title}</h4>
                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    <MathRenderer content={st.description} />
                                  </p>
                                  {st.tip && (
                                    <div className="text-[11px] text-[#FFB800] font-medium pt-0.5">
                                      <span>💡 Wskazówka: </span>
                                      <MathRenderer content={st.tip} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {Boolean(sanitizeExaminerTip(theoryPill?.matura_context || theoryPill?.keyTakeaway || '').trim()) && (
                        <section className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 shadow-sm border bg-gradient-to-br from-[#1C170E]/80 via-slate-900/80 to-slate-900/90 border-amber-500/30 shadow-[0_4px_20px_rgba(255,184,0,0.06)]">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                            <GraduationCap className="w-4 h-4 shrink-0 text-[#FFB800]" />
                            <span>Wskazówka egzaminatora</span>
                          </div>
                          <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                            {renderMicroContent(sanitizeExaminerTip(theoryPill?.matura_context || theoryPill?.keyTakeaway))}
                          </div>
                        </section>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {/* Zakładka 1: Wzory / Leksykon Pojęć (wyłączona dla języka angielskiego) */}
              {!isEnglishSession && theorySubStep === 1 && (
                <motion.div
                  key="theory-tab-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {isPolishSession ? (() => {
                    const polishTheory = theoryPill?.polishTheory || getPolishLessonDocument((sessionData as any)?.topicId, lessonId)?.theory_pill?.polishTheory;
                    const rawBento = 
                      (theoryPill?.bentoConcepts && theoryPill.bentoConcepts.length > 0 ? theoryPill.bentoConcepts : null) ||
                      (polishTheory?.bentoConcepts && polishTheory.bentoConcepts.length > 0 ? polishTheory.bentoConcepts : null) ||
                      getPolishBentoConceptsForLesson(lessonId);

                    const bentoConcepts = rawBento && rawBento.length > 0 ? rawBento : [];
                    const keyPoints = theoryPill?.key_points || (theoryPill as any)?.keyPoints || polishTheory?.theoryPoints?.map((tp: any) => `${tp.title}: ${tp.content || tp.explanation || ''}`) || [];

                    return (
                      <div className="space-y-4">
                        {/* Nagłówek sekcji leksykonu Bento */}
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                            <BookmarkCheck className="w-4 h-4 text-[#FFB800]" />
                            <span>Kluczowe pojęcia maturalne (Bento CKE)</span>
                          </div>
                          <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-400" />
                            {bentoConcepts.length} {bentoConcepts.length === 1 ? 'pojęcie' : bentoConcepts.length < 5 ? 'pojęcia' : 'pojęć'}
                          </span>
                        </div>

                        {/* Bento Grid Kart Pojęć */}
                        {bentoConcepts.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
                            {bentoConcepts.map((concept: any, cIdx: number) => {
                              const conceptId = concept.id || `bento-c-${cIdx}`;
                              const isTrapOpen = expandedTraps[conceptId] ?? true;

                              // Wybór koloru taga CKE (delikatne, stonowane akcenty w trybie ciemnym)
                              const tagLower = (concept.tag || '').toLowerCase();
                              let tagStyle = 'bg-amber-500/10 text-amber-300/90 border-amber-500/20';
                              if (tagLower.includes('gwiazdk')) {
                                tagStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
                              } else if (tagLower.includes('pewniak') || tagLower.includes('klucz')) {
                                tagStyle = 'bg-emerald-500/10 text-emerald-300/90 border-emerald-500/20';
                              } else if (tagLower.includes('topos') || tagLower.includes('archetyp')) {
                                tagStyle = 'bg-sky-500/10 text-sky-300/90 border-sky-500/20';
                              } else if (tagLower.includes('pułapka') || tagLower.includes('kryterium')) {
                                tagStyle = 'bg-rose-500/10 text-rose-300/90 border-rose-500/20';
                              }

                              return (
                                <div
                                  key={conceptId}
                                  className="rounded-2xl p-4 sm:p-5 bg-[#0B101D] dark:bg-[#0B101D] border border-slate-800/80 shadow-md flex flex-col gap-3.5 hover:border-amber-500/25 transition-all duration-200"
                                >
                                  {/* Karta Bento: Nagłówek i Ranga */}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                                        {String(cIdx + 1).padStart(2, '0')}
                                      </span>
                                      <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                                        {concept.name}
                                      </h4>
                                    </div>
                                    {concept.tag && (
                                      <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${tagStyle}`}>
                                        {concept.tag}
                                      </span>
                                    )}
                                  </div>

                                  {/* Filar 1: Definicja "Z polskiego na nasze" */}
                                  {concept.simpleDefinition && (
                                    <div className="space-y-1 pl-1">
                                      <div className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider flex items-center gap-1.5">
                                        <Lightbulb className="w-3.5 h-3.5 text-amber-400/90" />
                                        <span>Z polskiego na nasze:</span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pl-5">
                                        {renderMicroContent(concept.simpleDefinition)}
                                      </p>
                                    </div>
                                  )}

                                  {/* Filar 2: Konkretny przykład z lektury / tekstu */}
                                  {concept.contextExample && (
                                    <div className="p-3 sm:p-3.5 rounded-xl bg-sky-950/15 border border-sky-900/30 space-y-1">
                                      <div className="text-[10px] sm:text-[11px] font-bold text-sky-400/90 uppercase tracking-wider flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-sky-400/80 shrink-0" />
                                        <span>W lekturze / arkuszu maturalnym:</span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-sky-200/80 leading-relaxed pl-5">
                                        {renderMicroContent(concept.contextExample)}
                                      </p>
                                    </div>
                                  )}

                                  {/* Filar 3: Pułapka CKE (rozwijana / akcentowana) */}
                                  {concept.ckeTrap && (
                                    <div className="rounded-xl border border-rose-900/30 bg-rose-950/15 overflow-hidden transition-all duration-200">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          triggerHaptic('light');
                                          setExpandedTraps(prev => ({
                                            ...prev,
                                            [conceptId]: !isTrapOpen
                                          }));
                                        }}
                                        className="w-full p-2.5 sm:p-3 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-rose-950/30 transition-colors"
                                      >
                                        <div className="flex items-center gap-2">
                                          <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400/80 shrink-0" />
                                          <span className="text-[11px] sm:text-xs font-bold text-rose-300/90 uppercase tracking-wider">
                                            Pułapka CKE i typowy błąd
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-rose-400/70 font-medium">
                                          <span>{isTrapOpen ? 'Zwiń' : 'Rozwiń'}</span>
                                          <ChevronDown className={`w-3.5 h-3.5 text-rose-400/80 transition-transform duration-200 ${isTrapOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                      </button>
                                      
                                      <AnimatePresence initial={false}>
                                        {isTrapOpen && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="px-3 pb-3 sm:px-3.5 sm:pb-3.5 pt-0 text-xs sm:text-sm text-rose-200/80 leading-relaxed border-t border-rose-950/40"
                                          >
                                            <p className="pt-2">
                                              {renderMicroContent(concept.ckeTrap)}
                                            </p>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-sm">
                            Zapoznaj się z kluczowymi motywami i kontekstami zdefiniowanymi w arkuszu egzaminacyjnym.
                          </div>
                        )}

                        {/* Dolny moduł: Wskaźniki do zapamiętania */}
                        {keyPoints && keyPoints.length > 0 && (
                          <div className="rounded-2xl p-4 sm:p-5 bg-slate-950/60 border border-slate-800/80 space-y-2.5">
                            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                              <Target className="w-3.5 h-3.5 text-amber-400" />
                              <span>Wskaźniki egzaminatora CKE do zapamiętania</span>
                            </span>
                            <ul className="space-y-2 pl-1">
                              {keyPoints.slice(0, 4).map((kp: string, kIdx: number) => (
                                <li key={kIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                  <span className="leading-relaxed">{renderMicroContent(kp)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })() : (() => {
                    const formulas = getCoreFormulas(theoryPill?.core_formulas || theoryPill?.coreFormulaLatex);
                    return (
                      <section className="w-full flex flex-col gap-3.5">
                        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center border shadow-sm shrink-0 bg-amber-500/15 text-[#FFB800] border-amber-500/30">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                              WYBRANE WZORY MATEMATYCZNE CKE
                            </h3>
                          </div>
                        </div>

                        {formulas.length > 0 ? (
                          <div className="space-y-3.5 py-1">
                            {formulas.map((item, fIdx) => {
                              let unifiedExplanation = (item.description || item.mnemonic || '').trim();
                              if (item.description && item.mnemonic && item.description.trim() !== item.mnemonic.trim()) {
                                const desc = item.description.trim();
                                const mnem = item.mnemonic.trim();
                                if (!desc.includes(mnem) && !mnem.includes(desc)) {
                                  unifiedExplanation = `${desc} ${mnem}`;
                                } else {
                                  unifiedExplanation = desc.length >= mnem.length ? desc : mnem;
                                }
                              }

                              const hasDistinctTip = item.matura_tip && 
                                !unifiedExplanation.toLowerCase().includes(item.matura_tip.toLowerCase().slice(0, 25));

                              return (
                                <div
                                  key={fIdx}
                                  className="rounded-2xl p-4 sm:p-5 bg-[#0E1522] border border-white/10 hover:border-[#FFB800]/30 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.35)] flex flex-col gap-3 group"
                                >
                                  {/* Nagłówek: Numer, Tytuł i Karta wzorów */}
                                  {item.title && (
                                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5 flex-wrap">
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-md bg-[#FFB800]/10 border border-[#FFB800]/25 text-[10px] font-mono font-bold text-[#FFB800] flex items-center justify-center shrink-0">
                                          {String(fIdx + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs sm:text-sm font-bold text-slate-100 tracking-wide">
                                          {item.title}
                                        </span>
                                      </div>

                                      {/* Wskaźnik obecności w oficjalnej karcie wzorów */}
                                      {item.in_cke_sheet && item.cke_page ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 shadow-sm shrink-0">
                                          <BookOpen className="w-3 h-3 text-emerald-400" />
                                          <span>Karta wzorów: {typeof item.cke_page === 'number' || !String(item.cke_page).startsWith('str') ? `str. ${item.cke_page}` : item.cke_page}</span>
                                        </span>
                                      ) : item.in_cke_sheet ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 shadow-sm shrink-0">
                                          <BookOpen className="w-3 h-3 text-emerald-400" />
                                          <span>W karcie wzorów</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-300 shadow-sm shrink-0">
                                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                                          <span>Brak w tablicach. Zapamiętaj.</span>
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Kaseton wzoru KaTeX */}
                                  {item.latex && (
                                    <div 
                                      className="w-full px-3 py-1.5 sm:py-2.5 bg-black/40 border border-white/5 rounded-xl overflow-x-auto text-center text-white scrollbar-thin shadow-inner max-w-full"
                                      style={{ WebkitMaskImage: 'linear-gradient(to right, black 88%, transparent 100%)', maskImage: 'linear-gradient(to right, black 88%, transparent 100%)' }}
                                    >
                                      <div className="inline-block w-fit min-w-full mx-auto text-center">
                                        <MathRenderer content={toFormulaBoxContent(item.latex, isPolishSession)} displayMode={true} />
                                      </div>
                                    </div>
                                  )}

                                  {/* Rysunek poglądowy / diagram do wzoru */}
                                  {(item as any).numberLine ? (
                                    <div className="w-full flex justify-center py-2 overflow-x-auto">
                                      <NumberLineDiagram data={(item as any).numberLine} height={56} maxWidth="320px" />
                                    </div>
                                  ) : (item as any).diagram ? (
                                    <div className="w-full flex justify-center py-2 overflow-x-auto">
                                      <MathDiagram diagram={(item as any).diagram} compact borderless />
                                    </div>
                                  ) : null}

                                  {/* Płynne, naturalne wyjaśnienie bez sztucznych ramek */}
                                  {unifiedExplanation && (
                                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pt-0.5">
                                      {renderMicroContent(unifiedExplanation)}
                                    </div>
                                  )}

                                  {/* Przykład jako elegancki nagłówek z wycentrowanym wzorem pod spodem */}
                                  {item.example && (
                                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                                        Przykład zastosowania:
                                      </span>
                                      <div className="w-full py-2.5 px-3 bg-[#070A0F] border border-white/5 rounded-xl text-center overflow-x-auto max-w-full">
                                        <div className="inline-block min-w-full text-center">
                                          <MathRenderer content={item.example} />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Dyskretna uwaga egzaminacyjna CKE */}
                                  {Boolean(hasDistinctTip && sanitizeExaminerTip(item.matura_tip || '').trim()) && (
                                    <div className="rounded-xl px-3.5 py-2.5 bg-amber-500/[0.05] border border-amber-500/20 text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
                                      <div className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <Lightbulb className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="w-full space-y-0.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                                          Patent maturalny
                                        </span>
                                        <div className="text-slate-200 font-normal">
                                          {renderMicroContent(sanitizeExaminerTip(item.matura_tip))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="rounded-2xl p-5 sm:p-6 bg-[#0E1522] border border-amber-500/25 shadow-[0_4px_24px_rgba(0,0,0,0.35)] flex flex-col gap-4">
                            <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-100">
                                  Brak wzorów w tablicach CKE – decyduje wyłącznie analiza rysunku
                                </h3>
                                <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                                  W tym temacie nie ma wzorów algebraicznych. Sukces na maturze to bezbłędny podział ról między osiami.
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {/* Karta Osi OX */}
                              <div className="rounded-xl p-3.5 bg-black/40 border border-sky-500/20 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold">
                                    OŚ OX (POZIOM)
                                  </span>
                                  <span className="text-xs font-semibold text-slate-200">
                                    Argumenty <MathRenderer inline text="$x$" />
                                  </span>
                                </div>
                                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                                  <li><span className="font-semibold text-slate-200">Dziedzina <MathRenderer inline text="$D_f$" />:</span> szerokość wykresu od lewej do prawej</li>
                                  <li><span className="font-semibold text-slate-200">Miejsca zerowe:</span> punkty na osi (<MathRenderer inline text="$y = 0$" />)</li>
                                  <li><span className="font-semibold text-slate-200">Monotoniczność:</span> przedziały <MathRenderer inline text="$x$" />, gdzie rośnie/maleje</li>
                                  <li><span className="font-semibold text-slate-200">Nierówności <MathRenderer inline text="$f(x) > 0$" />:</span> przedziały <MathRenderer inline text="$x$" /> leżące nad osią</li>
                                </ul>
                              </div>

                              {/* Karta Osi OY */}
                              <div className="rounded-xl p-3.5 bg-black/40 border border-emerald-500/20 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                                    OŚ OY (PION)
                                  </span>
                                  <span className="text-xs font-semibold text-slate-200">
                                    Wartości <MathRenderer inline text="$y$" />
                                  </span>
                                </div>
                                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                                  <li><span className="font-semibold text-slate-200">Zbiór wartości <MathRenderer inline text="$ZW_f$" />:</span> wysokość od dołu do góry (min / max)</li>
                                  <li><span className="font-semibold text-slate-200">Wartość <MathRenderer inline text="$f(0)$" />:</span> przecięcie z osią pionową</li>
                                  <li><span className="font-semibold text-slate-200">Równanie <MathRenderer inline text="$f(x) = m$" />:</span> pozioma linijka na wysokości <MathRenderer inline text="$m$" /></li>
                                  <li><span className="font-semibold text-slate-200">Wartości dodatnie:</span> punkty powyżej poziomu <MathRenderer inline text="$y = 0$" /></li>
                                </ul>
                              </div>
                            </div>

                            <div className="rounded-xl px-3.5 py-2.5 bg-amber-500/[0.07] border border-amber-500/20 text-xs text-slate-300 flex items-center gap-2.5">
                              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                              <span><strong className="text-amber-300">Wskazówka:</strong> Przedziały monotoniczności i rozwiązania nierówności odczytujesz ZAWSZE z osi poziomej <MathRenderer inline text="$OX$" />!</span>
                            </div>
                          </div>
                        )}

                        {theoryPill?.formula_notes && (
                          <div className="mt-1 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 pt-3 leading-relaxed">
                            <span className="text-[11px] font-semibold text-[#FFB800] block mb-1">
                              Wskazówka
                            </span>
                            {renderMicroContent(theoryPill.formula_notes)}
                          </div>
                        )}
                      </section>
                    );
                  })()}
                </motion.div>
              )}

              {/* Zakładka Przykłady / Analiza tekstu: Substep 1 dla Angielskiego, Substep 2 dla Mat/Pol */}
              {((isEnglishSession && theorySubStep === 1) || (!isEnglishSession && theorySubStep === 2)) && (
                <motion.div
                  key="theory-tab-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {(() => {
                    const rawExamplesList: any[] = (Array.isArray(theoryPill?.worked_examples) && theoryPill.worked_examples.length > 0)
                      ? theoryPill.worked_examples
                      : (theoryPill?.worked_example ? [theoryPill.worked_example] : []);

                    let normExamples = rawExamplesList
                      .map((rawEx: any) => normalizeWorkedExample(
                        rawEx || 
                        ((theoryPill as any)?.quote ? {
                          quote: (theoryPill as any).quote,
                          title: (theoryPill as any).quote_title,
                          context: (theoryPill as any).quote_context || (theoryPill as any).context,
                          analysis: (theoryPill as any).quote_analysis || (theoryPill as any).analysis,
                          matura_tip: (theoryPill as any).quote_matura_tip || (theoryPill as any).matura_tip
                        } : null)
                      ))
                      .filter((ex): ex is NormalizedWorkedExample => Boolean(ex));

                    if (normExamples.length === 0) {
                      const derived = deriveWorkedExampleFromTasks(tasks, theoryPill, isPolishSession, isEnglishSession);
                      if (derived) normExamples = [derived];
                    }

                    const epochPassport = (theoryPill as any)?.epoch_passport || (theoryPill as any)?.epochPassport;
                    if (normExamples.length === 0 && epochPassport) {
                      const dates = epochPassport.dates_framework;
                      const credo = epochPassport.credo;
                      return (
                        <section className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-slate-800 flex flex-col gap-4 shadow-sm">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center border shadow-sm bg-rose-500/15 text-rose-400 border-rose-500/30">
                                <FileText className="w-4 h-4" />
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                                Ramy kulturowe i credo epoki
                              </h3>
                            </div>
                            <span className="text-[11px] font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                              Kontekst CKE
                            </span>
                          </div>

                          {dates && (
                            <div className="space-y-2">
                              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                                Ramy chronologiczne
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                {Object.entries(dates).map(([key, val]: [string, any], dIdx) => (
                                  <div key={dIdx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                    <span className="font-bold text-slate-200 block mb-1">
                                      {key === 'antiquity' ? 'Antyk grecko-rzymski' : key === 'bible' ? 'Biblia (Stary i Nowy Testament)' : key}:
                                    </span>
                                    <span className="text-slate-300 leading-relaxed">{String(val)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {credo && (
                            <div className="rounded-xl p-4 bg-amber-500/[0.04] border border-amber-500/30 shadow-[0_2px_12px_rgba(255,184,0,0.05)] flex flex-col gap-1.5">
                              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                                Credo i myśl przewodnia epoki
                              </span>
                              <div className="text-sm sm:text-base text-amber-100/90 italic font-serif leading-relaxed">
                                {renderMicroContent(credo)}
                              </div>
                            </div>
                          )}

                          {(theoryPill?.keyTakeaway || (theoryPill as any)?.golden_rule) && (
                            <div className="rounded-xl p-3.5 bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                                <span className="font-bold text-emerald-300 mr-1.5">Złota reguła na wypracowanie:</span>
                                {theoryPill?.keyTakeaway || (theoryPill as any)?.golden_rule}
                              </div>
                            </div>
                          )}
                        </section>
                      );
                    }

                    if (normExamples.length === 0) {
                      return (
                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-sm text-center">
                          {isPolishSession 
                            ? 'Przeanalizuj pojęcia w Leksykonie i przejdź do zadań praktycznych z czytania ze zrozumieniem i analizy językowej.' 
                            : isEnglishSession 
                              ? 'Brak przykładu dla tej pigułki wiedzy.' 
                              : 'Brak przykładu dla tej pigułki wiedzy.'}
                        </div>
                      );
                    }

                    const polishSectionLabel = (() => {
                      const match = String(lessonId).match(/^pol-(?:lesson-|dzial-|topic-)?(\d+)/) || 
                                    String((sessionData as any)?.topicId || '').match(/^pol-(?:dzial-|topic-)?(\d+)/);
                      const num = match ? parseInt(match[1], 10) : undefined;
                      if (num && num <= 4) {
                        return 'Tekst źródłowy i kontekst CKE';
                      }
                      if ((theoryPill as any)?.isLektura || (num && num >= 5 && num <= 16)) {
                        return 'Fragment lektury obowiązkowej & kontekst CKE';
                      }
                      return 'Tekst źródłowy i kontekst CKE';
                    })();

                    return (
                      <section className="w-full flex flex-col gap-5">
                        {normExamples.map((normExample, exIdx) => {
                          const rawItem = rawExamplesList[exIdx];
                          const customTitle = rawItem?.title || (normExamples.length > 1
                            ? (isEnglishSession ? `Przykład ${exIdx + 1} z ${normExamples.length}` : `Zadanie przykładowe ${exIdx + 1}`)
                            : null);

                          const sectionTitle = customTitle || (isPolishSession
                            ? (polishSectionLabel.includes('lektury') ? 'Fragment lektury i analiza CKE' : 'Fragment tekstu i analiza maturalna')
                            : isEnglishSession ? 'Zadanie maturalne z modelowym rozwiązaniem' : 'WZORCOWE ROZWIĄZANIE KROK PO KROKU');

                          const steps = normExample.steps || [];
                          const rawResult = typeof normExample.result === 'string' ? normExample.result.trim() : (normExample.result ? String(normExample.result).trim() : '');
                          const cleanResult = rawResult || (() => {
                            if (steps.length > 0) {
                              const lastText = steps[steps.length - 1]?.text || '';
                              const eqMatch = lastText.match(/=\s*([^=.,;]+)[.,;]?\s*$/);
                              if (eqMatch) {
                                const piece = eqMatch[1].trim();
                                // Wycinek z kroku zapisanego w KaTeX-ie może zgubić otwierający lub zamykający znak $ –
                                // domykamy go, żeby wynik nie wyświetlił się jako surowy LaTeX.
                                const dollars = (piece.match(/\$/g) || []).length;
                                if (dollars % 2 === 1) return piece.endsWith('$') ? `$${piece}` : `${piece}$`;
                                return piece;
                              }
                            }
                            return null;
                          })();

                          const displayResult = cleanResult
                            ? (isPolishSession || isEnglishSession
                                ? cleanResult
                                : cleanResult
                                    .replace(/^(?:(?:ostateczna\s+)?postać\s+(?:iloczynowa|kanoniczna|ogólna)|ostateczna\s+odpowiedź|odpowiedź\s+końcowa|ostateczny\s+wynik|odpowiedź|wynik)\s*:\s*/i, '')
                                    .trim())
                            : null;

                          return (
                            <div 
                              key={exIdx} 
                              className={`rounded-2xl p-4 sm:p-5 border flex flex-col gap-4 shadow-sm ${
                                isEnglishSession
                                  ? 'bg-[#0E1726]/60 border-emerald-500/25'
                                  : 'bg-[#0E1522]/80 border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shadow-sm ${
                                    isPolishSession 
                                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                                      : isEnglishSession 
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                                        : 'bg-amber-500/15 text-[#FFB800] border-amber-500/30'
                                  }`}>
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                                    {sectionTitle}
                                  </h3>
                                </div>
                                {normExample.steps.length > 0 && (
                                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                                    isEnglishSession
                                      ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
                                      : 'text-slate-400 bg-white/[0.04] border-white/10'
                                  }`}>
                                    {normExample.steps.length} {normExample.steps.length === 1 ? 'krok' : normExample.steps.length < 5 ? 'kroki' : 'kroków'}
                                  </span>
                                )}
                              </div>

                              {/* Treść polecenia / Cytat lektury */}
                              {normExample.problem && (
                                <div className={`rounded-xl p-4 sm:p-4.5 border flex flex-col gap-1.5 min-w-0 max-w-full shadow-sm ${
                                  isPolishSession
                                    ? 'bg-amber-500/[0.04] border-amber-500/30'
                                    : isEnglishSession
                                      ? 'bg-[#0E1522] border-[#FFB800]/25'
                                      : 'bg-[#0E1522] border-white/10'
                                }`}>
                                  <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block ${
                                    isPolishSession ? 'text-amber-300' : isEnglishSession ? 'text-[#FFDCA1]' : 'text-[#FFB800]'
                                  }`}>
                                    {isPolishSession ? polishSectionLabel : 'Treść zadania'}
                                  </span>
                                  <div className={`text-sm sm:text-base leading-relaxed min-w-0 max-w-full break-words ${
                                    isPolishSession ? 'text-amber-100/90 italic font-serif' : 'text-slate-100 font-medium'
                                  }`}>
                                    {renderMicroContent(normExample.problem)}
                                  </div>
                                </div>
                              )}

                              {/* Rysunek / Wykres do przykładu */}
                              {((normExample as any).diagram || (normExample as any).plot || (normExample as any).numberLine) && (
                                <div className="w-full flex justify-center py-2 overflow-x-auto">
                                  {(normExample as any).numberLine ? (
                                    <NumberLineDiagram data={(normExample as any).numberLine} height={60} maxWidth="340px" />
                                  ) : (
                                    <MathDiagram diagram={(normExample as any).diagram || (normExample as any).plot} compact borderless />
                                  )}
                                </div>
                              )}

                              {/* Lista kroków rozwiązania */}
                              {normExample.steps.length > 0 && (() => {
                                const formatStepLabel = (label?: string) => {
                                  if (!label) return '';
                                  return label.replace(/^(?:krok|step)\s*\d+[:.\-\s]*/i, '').trim();
                                };

                                return (
                                  <div className="space-y-2.5 pt-1">
                                    {normExample.steps.map((st, sIdx) => {
                                      const cleanLabel = formatStepLabel(st.label);
                                      return (
                                        <div 
                                          key={sIdx} 
                                          className="rounded-xl p-3.5 sm:p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 flex flex-col gap-2 transition-all shadow-sm min-w-0 max-w-full"
                                        >
                                          <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold shrink-0 border ${
                                              isPolishSession 
                                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' 
                                                : isEnglishSession 
                                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                                                  : 'bg-amber-500/15 text-[#FFB800] border-amber-500/30'
                                            }`}>
                                              Krok {st.num}
                                            </span>
                                            {cleanLabel && (
                                              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                                                {cleanLabel}
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal min-w-0 max-w-full break-words">
                                            {renderMicroContent(st.text)}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}

                              {/* Wynik / Odpowiedź końcowa */}
                              {displayResult && (
                                <div className="rounded-xl p-3.5 sm:p-4 bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm mt-1 min-w-0 max-w-full">
                                  <div className="flex items-center gap-2.5 shrink-0">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                                      <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                                      {isPolishSession ? 'Wniosek egzaminatora' : isEnglishSession ? 'Wzorcowa odpowiedź' : 'Odpowiedź końcowa'}
                                    </span>
                                  </div>
                                  <div className="text-base sm:text-lg font-black text-white bg-slate-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-lg shadow-inner self-stretch sm:self-auto text-center sm:text-right min-w-0 max-w-full break-words overflow-x-auto touch-pan-x">
                                    {isPolishSession || isEnglishSession ? (
                                      <span>{displayResult}</span>
                                    ) : (
                                      <MathRenderer content={displayResult} />
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Wskazówka egzaminatora do przykładu */}
                              {Boolean(rawItem?.matura_tip) && (
                                <div className="rounded-xl px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-200 flex items-center gap-2.5">
                                  <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span><strong className="text-emerald-300">Wskazówka CKE:</strong> {renderMicroContent(rawItem.matura_tip)}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </section>
                    );
                  })()}
                </motion.div>
              )}

              {/* Zakładka Pułapka CKE / Typowy błąd: Substep 2 dla Angielskiego, Substep 3 dla Mat/Pol */}
              {((isEnglishSession && theorySubStep === 2) || (!isEnglishSession && theorySubStep === 3)) && (
                <motion.div
                  key="theory-tab-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {isEnglishSession ? (
                    <EnglishTrapInteractive
                      lessonId={String(lessonId || (sessionData as any)?.topicId || 'eng-lesson-1-1')}
                      topicId={String((sessionData as any)?.topicId || 'eng-dzial-1')}
                      onPassed={handleEnglishTrapPassed}
                      isAlreadyPassed={isEnglishTrapPassed}
                    />
                  ) : (
                    <section className="w-full flex flex-col gap-3.5">
                      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                        <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center border shadow-sm bg-rose-500/15 text-rose-400 border-rose-500/30 shrink-0">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                          PUŁAPKA EGZAMINACYJNA CKE
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-500/10 border border-rose-500/25 px-2.5 py-0.5 rounded-full shrink-0">
                        UNIKAJ NA MATURZE
                      </span>
                    </div>

                    {(() => {
                      const trapData = parseExamTrap(theoryPill?.trap_details || (theoryPill as any)?.cke_trap || (theoryPill as any)?.ckeTrap || theoryPill?.exam_trap || theoryPill?.trapAlert || formulaSheet?.ckeTrap);
                      if (trapData && (trapData.error || trapData.correct || trapData.description)) {
                        return (
                          <div className="space-y-3.5">
                            {/* Karta 1: Typowy błąd */}
                            {trapData.error && (
                              <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-rose-950/30 via-slate-900/90 to-slate-950 border border-rose-500/35 flex flex-col gap-2.5 shadow-[0_4px_20px_rgba(244,63,94,0.12)]">
                                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider border-b border-rose-500/20 pb-2.5">
                                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  <span>Częsty błąd maturzystów</span>
                                </div>
                                <div className="text-sm sm:text-base text-rose-100/95 leading-relaxed font-normal">
                                  {renderMicroContent(trapData.error ? String(trapData.error).replace(/^[❌⚠️\s]*(?:typowy\s*błąd(?:\s*cke)?|błąd\s*typowy|błąd)[:\s-]*/i, '').trim() : '')}
                                </div>
                              </div>
                            )}

                            {/* Karta 2: Poprawnie */}
                            {trapData.correct && (
                              <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-emerald-950/30 via-slate-900/90 to-slate-950 border border-emerald-500/35 flex flex-col gap-2.5 shadow-[0_4px_20px_rgba(16,185,129,0.12)]">
                                <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5">
                                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Poprawne podejście</span>
                                  </div>
                                  <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                                    Klucz CKE
                                  </span>
                                </div>
                                <div className="text-sm sm:text-base text-emerald-100/95 leading-relaxed font-normal">
                                  {renderMicroContent(trapData.correct ? String(trapData.correct).replace(/^[✓✔\s]*(?:poprawnie|poprawne\s*podejście|prawidłowo|dobre\s*podejście)[:\s-]*/i, '').trim() : '')}
                                </div>
                              </div>
                            )}

                            {/* Karta Wizualna: Schemat pułapki / oś liczbowa - BEZ zbędnego nagłówka "Ilustracja pułapki egzaminacyjnej:" */}
                            {((trapData as any).numberLine || (theoryPill as any)?.trapNumberLine || (trapData as any).diagram || (theoryPill as any)?.trapDiagram) && (
                              <div className="w-full flex justify-center py-1 overflow-x-auto">
                                {((trapData as any).numberLine || (theoryPill as any)?.trapNumberLine) ? (
                                  <NumberLineDiagram data={(trapData as any).numberLine || (theoryPill as any)?.trapNumberLine} height={60} maxWidth="360px" />
                                ) : (
                                  <MathDiagram diagram={(trapData as any).diagram || (theoryPill as any)?.trapDiagram} compact borderless />
                                )}
                              </div>
                            )}

                            {/* Karta 3: Opcjonalna Wskazówka CKE */}
                            {Boolean(sanitizeExaminerTip(trapData.tip || '').trim()) && (
                              <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-950 border border-amber-500/35 flex flex-col gap-2.5 shadow-[0_4px_20px_rgba(245,158,11,0.12)]">
                                <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2.5">
                                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                                    <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>Wskazówka egzaminatora</span>
                                  </div>
                                  <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full">
                                    CKE Patent
                                  </span>
                                </div>
                                <div className="text-sm sm:text-base text-amber-100/95 leading-relaxed font-normal">
                                  {renderMicroContent(sanitizeExaminerTip(trapData.tip))}
                                </div>
                              </div>
                            )}

                            {/* Dodatkowy opis, jeśli występuje bez podziału */}
                            {trapData.description && !trapData.error && !trapData.correct && (
                              <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-rose-950/30 via-slate-900/90 to-slate-950 border border-rose-500/35 flex flex-col gap-2.5 shadow-[0_4px_20px_rgba(244,63,94,0.12)]">
                                <div className="text-sm sm:text-base text-rose-100/95 leading-relaxed font-normal">
                                  {renderMicroContent(trapData.description ? String(trapData.description).replace(/^[❌⚠️\s]*(?:typowy\s*błąd(?:\s*cke)?|błąd\s*typowy|błąd)[:\s-]*/i, '').trim() : '')}
                                </div>
                              </div>
                            )}

                            {/* Dodatkowy kontekst, jeśli opis występuje obok błędu */}
                            {trapData.description && (trapData.error || trapData.correct) && (
                              <div className="rounded-xl p-3.5 bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 shadow-sm">
                                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                                  {renderMicroContent(trapData.description ? String(trapData.description).replace(/^[❌⚠️\s]*(?:typowy\s*błąd(?:\s*cke)?|błąd\s*typowy|błąd)[:\s-]*/i, '').trim() : '')}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 text-slate-300 text-sm leading-relaxed">
                          {isPolishSession
                            ? 'Zwracaj szczególną uwagę na intencję nadawcy i kontekst wypowiedzi – nie oceniaj tekstu wyłącznie na podstawie pojedynczych słów wyrwanych z akapitu.'
                            : 'Zwracaj szczególną uwagę na dziedzinę wyrażeń i znaki przy redukcji wyrazów podobnych.'}
                        </div>
                      );
                    })()}
                  </section>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Ochronny margines dolny zapobiegający zasłanianiu wzorów/diagramów przez sticky footer */}
            <div className="h-16 w-full shrink-0" aria-hidden="true" />
          </div>
        ) : (
          <>
            {/* Sztywny margines górny: pojedyncza linia metadanych zadania bez powtórzonego tytułu lekcji */}
            <div className="pt-4 pb-2.5 flex items-center justify-between gap-2 shrink-0 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-slate-200">
                  Zadanie {currentQueueIndex + 1} z {tasks?.length || targetCorrectAnswers || 5}
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border font-semibold text-[11px] sm:text-xs shadow-sm ${taskSourceBadge.badgeClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 shadow-sm ${taskSourceBadge.dotClass}`} />
                  <span>{taskSourceBadge.label}</span>
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-300 font-bold text-[11px] sm:text-xs shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-sm" />
                <span>{taskPointsCount}</span>
              </span>
            </div>

            {/* Reading Passages, Audio & Iconography */}
            {(currentTask?.passage || currentTask?.passage2 || currentTask?.image || currentTask?.imageUrl || currentTask?.audio_url || currentTask?.audioUrl) && (
              <div className="space-y-3 mb-3">
                {(currentTask?.audio_url || currentTask?.audioUrl) && (
                  <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-b from-[#0F1E2E] to-[#0A1420] p-4 flex flex-col gap-2.5 shadow-sm">
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-sky-500/20">
                      <div className="flex items-center gap-2">
                        <Headphones size={16} className="text-sky-400 shrink-0" />
                        <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                          Nagranie CKE • Rozumienie ze słuchu
                        </span>
                      </div>
                      <span className="text-[11px] text-sky-400/80 font-mono">
                        Oficjalne audio CKE
                      </span>
                    </div>
                    <audio 
                      controls 
                      src={currentTask.audio_url || currentTask.audioUrl} 
                      className="w-full h-10 rounded-lg accent-sky-500" 
                      preload="metadata"
                    >
                      Twoja przeglądarka nie obsługuje odtwarzacza audio.
                    </audio>
                  </div>
                )}

                {currentTask?.passage && (
                  <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-[#151D2C] to-[#0E1522] p-4 sm:p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                          Tekst źródłowy {currentTask?.passage2 ? '1' : ''}
                        </span>
                      </div>
                      {(currentTask.passage.author || currentTask.passage.sourceTitle) && (
                        <span className="text-xs text-slate-400 italic">
                          {currentTask.passage.author ? `${currentTask.passage.author}, ` : ''}
                          {currentTask.passage.sourceTitle ? `„${currentTask.passage.sourceTitle}”` : ''}
                        </span>
                      )}
                    </div>
                    <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-h-72 overflow-y-auto pr-2 space-y-2 border-l-2 border-amber-500/40 pl-3">
                      {currentTask.passage.paragraphs && currentTask.passage.paragraphs.length > 0 ? (
                        currentTask.passage.paragraphs.map((p: any, idx: number) => (
                          <p key={idx} className="text-slate-300">
                            <span className="text-[11px] font-bold text-amber-400 mr-1.5 select-none">[{p.number || idx + 1}]</span>
                            {p.text}
                          </p>
                        ))
                      ) : (
                        <p className="text-slate-300 whitespace-pre-line">{currentTask.passage.text}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentTask?.passage2 && (
                  <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-[#1B1611] to-[#14100D] p-4 sm:p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                          Tekst źródłowy 2
                        </span>
                      </div>
                      {(currentTask.passage2.author || currentTask.passage2.sourceTitle) && (
                        <span className="text-xs text-slate-400 italic">
                          {currentTask.passage2.author ? `${currentTask.passage2.author}, ` : ''}
                          {currentTask.passage2.sourceTitle ? `„${currentTask.passage2.sourceTitle}”` : ''}
                        </span>
                      )}
                    </div>
                    <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-h-72 overflow-y-auto pr-2 space-y-2 border-l-2 border-amber-500/40 pl-3">
                      {currentTask.passage2.paragraphs && currentTask.passage2.paragraphs.length > 0 ? (
                        currentTask.passage2.paragraphs.map((p: any, idx: number) => (
                          <p key={idx} className="text-slate-300">
                            <span className="text-[11px] font-bold text-amber-400 mr-1.5 select-none">[{p.number || idx + 1}]</span>
                            {p.text}
                          </p>
                        ))
                      ) : (
                        <p className="text-slate-300 whitespace-pre-line">{currentTask.passage2.text}</p>
                      )}
                    </div>
                  </div>
                )}

                {(currentTask?.image || currentTask?.imageUrl) && (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex flex-col items-center gap-2">
                    <img 
                      src={currentTask.image?.imageUrl || currentTask.imageUrl} 
                      alt={currentTask.image?.imageAlt || currentTask.imageCaption || 'Materiał ikonograficzny'}
                      className="max-h-64 rounded-xl object-contain border border-white/10"
                    />
                    {(currentTask.image?.imageCaption || currentTask.imageCaption) && (
                      <span className="text-xs text-slate-400 text-center italic">
                        {currentTask.image?.imageCaption || currentTask.imageCaption}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Task Question Statement - hide for rich writing tasks because WritingWorkspace contains the full CKE prompt & context */}
            {!isRichWritingTask && (
              <div className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm ${isPolishSession ? 'min-h-[88px] sm:min-h-[96px] flex flex-col justify-center' : ''}`}>
                <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed break-words">
                  <MathRenderer content={currentTask?.question || currentTask?.math_statement || currentTask?.content || ''} />
                </div>
                {currentTask?.numberLine ? (
                  <div className="mt-3 flex justify-center">
                    <NumberLineDiagram data={currentTask.numberLine} height={64} maxWidth="360px" />
                  </div>
                ) : (currentTask?.diagram || currentTask?.plot) ? (
                  <div className="mt-3 flex justify-center">
                    <MathDiagram diagram={currentTask.diagram || currentTask.plot} />
                  </div>
                ) : null}
              </div>
            )}

        {/* OPEN TASK WORKSPACE (DWA TRYBY: KLAWIATURA VS TABLICA VS POLSKI TEKST VS PISANIE CKE) */}
        {isOpenTask ? (
          <div className="space-y-4 pt-1">
            {isRichWritingTask ? (
              <WritingWorkspace
                taskId={String(currentTask?.id || '')}
                taskTitle={currentTask?.title}
                taskQuestion={currentTask?.question || currentTask?.math_statement || ''}
                contextText={currentTask?.passage_text || currentTask?.context_text || currentTask?.contextText}
                maxPoints={currentTask?.points || (isPolishEssay ? 35 : isPolishSynthesis ? 4 : 12)}
                subject={isEnglishSession ? 'angielski' : isPolishSession ? 'polski' : 'matematyka'}
                studentText={openAnswerText}
                onChangeText={(val) => setOpenAnswerText(val)}
                onEvaluate={() => handleCheckOpenAnswerWithTutor()}
                isEvaluating={isTutorScanning}
                isPro={getSyncedHearts(userState).isPro}
                onOpenProModal={() => setShowProPopup(true)}
                evaluation={tutorEvaluation}
                onResetEvaluation={handleRetryOpenTask}
                onContinue={handleNextStep}
              />
            ) : (
              <>
                <OpenTaskWorkspace
              task={currentTask}
              isEvaluated={isEvaluated}
              isCorrect={isCorrect}
              value={openAnswerText}
              onChangeValue={(val) => setOpenAnswerText(val)}
              savedCanvasDataUrl={openCanvasDataUrl}
              onSaveCanvasData={handleSaveCanvasData}
              onSubmit={(canvasData) => handleCheckOpenAnswerWithTutor(canvasData)}
              onAskAiTutor={handleToggleOrBuyHint}
              onRetry={handleRetryOpenTask}
              isAiLoading={isTutorScanning || isAiHintLoading}
              inputPlaceholder={isPolishSession 
                ? "Sformułuj swoją odpowiedź, uzasadnienie lub argument na podstawie załączonego tekstu/lektury..." 
                : isEnglishSession
                  ? "Napisz swoją wypowiedź po angielsku (np. e-mail lub wpis na blogu, 80-130 słów)..."
                  : "Zapisz swoje rozwiązanie lub użyj klawiatury..."}
              hideWhiteboard={isPolishSession || isEnglishSession}
              mode={(isPolishSession || isEnglishSession) ? 'text' : 'math'}
            />

            {!isEvaluated && !isTutorScanning && Array.isArray(currentTask?.rubric_stages) && currentTask.rubric_stages.length > 0 && (
              <RubricSelfAssessment
                key={String(currentTask?.id || '')}
                stages={currentTask.rubric_stages}
                zeroRules={currentTask?.zero_rules}
                maxPoints={currentTask?.points || currentTask.rubric_stages[currentTask.rubric_stages.length - 1].points}
                onConfirm={handleRubricSelfAssessment}
              />
            )}

            {/* AI Tutor Scanning State (pulsujący gradient bursztynowy) */}
            {isTutorScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#151D2C] via-[#101726] to-[#0E1420] border border-[#FFB800]/50 shadow-md shadow-black/20 flex flex-col items-center text-center my-3 relative overflow-hidden animate-pulse"
              >
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFB800]/30 to-amber-600/40 border border-[#FFB800]/60 flex items-center justify-center mb-3 shadow-sm">
                  <Loader2 className="w-7 h-7 text-[#FFB800] animate-spin shrink-0" />
                  <div className="absolute inset-0 rounded-2xl border border-[#FFB800]/40 animate-ping opacity-25" />
                </div>
                <h4 className="font-bold text-white text-base sm:text-lg mb-1">
                  Egzaminator AI analizuje Twoje rozwiązanie...
                </h4>
                <p className="text-xs sm:text-sm text-amber-200/90 max-w-md">
                  {isPolishSession
                    ? 'Weryfikuję argumentację, styl i poprawność merytoryczną oraz zgodność z oficjalnymi kryteriami oceniania.'
                    : 'Weryfikuję obliczenia, przekształcenia algebraiczne oraz zgodność ze schematem oceniania.'}
                </p>
              </motion.div>
            )}

            {/* Tutor Feedback Card */}
            {isEvaluated && tutorEvaluation && (
              <motion.div
                ref={evaluationCardRef}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="rounded-3xl bg-[#0E1524] border border-white/10 p-5 sm:p-6 shadow-2xl shadow-black/50 space-y-4"
              >
                {/* Header: Egzaminator CKE + Score Badge */}
                <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFB800]/15 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800] shadow-sm">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">
                        Ocena Egzaminatora CKE
                      </h4>
                      <span className="text-xs text-slate-400">
                        {isPolishSession ? 'Nowa Formuła 2023/2026 • Język polski' : 'Nowa Formuła 2025 • Matematyka'}
                      </span>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className={`px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
                    tutorEvaluation.score === (currentTask?.points || 2)
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                      : tutorEvaluation.score > 0
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                        : 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-sm'
                  }`}>
                    {tutorEvaluation.score === (currentTask?.points || 2) ? (
                      <CheckCircle2 size={16} />
                    ) : tutorEvaluation.score > 0 ? (
                      <Target size={16} />
                    ) : (
                      <AlertTriangle size={16} />
                    )}
                    <span>{tutorEvaluation.gradeTitle || `${tutorEvaluation.score} / ${currentTask?.points || 2} PKT`}</span>
                  </div>
                </div>

                {/* AI Vision OCR Transcription (only shown if real mathematical equations recognized, not placeholder) */}
                {tutorEvaluation.transcription && 
                 !tutorEvaluation.transcription.includes('[Rozwiązanie odręczne') && 
                 tutorEvaluation.transcription.trim().length > 2 && (
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <Scan size={13} className="text-slate-400" />
                      <span>Odczytany zapis:</span>
                    </span>
                    <div className="text-slate-200 px-3 py-1.5 rounded-lg bg-black/30 border border-amber-400/20 font-mono text-xs sm:text-sm">
                      <MathRenderer content={tutorEvaluation.transcription} />
                    </div>
                  </div>
                )}

                {/* 4 CKE Criteria Breakdown for 35-pt Essays */}
                {tutorEvaluation.criteriaBreakdown && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/25 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-300 pb-2 border-b border-rose-500/20">
                      <span className="flex items-center gap-1.5">
                        <Feather size={14} className="text-rose-400" />
                        <span>Karta Oceny CKE (4 Oficjalne Kryteria Egzaminacyjne):</span>
                      </span>
                      <span className="font-mono text-white font-black text-xs sm:text-sm">
                        {tutorEvaluation.score} / 35 PKT
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {tutorEvaluation.criteriaBreakdown.formal && (
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-1">
                          <div className="flex items-center justify-between font-semibold text-slate-300">
                            <span>I. Warunki formalne</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              {tutorEvaluation.criteriaBreakdown.formal.score} / {tutorEvaluation.criteriaBreakdown.formal.max || 1} pkt
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {tutorEvaluation.criteriaBreakdown.formal.comment}
                          </p>
                        </div>
                      )}

                      {tutorEvaluation.criteriaBreakdown.literary_cultural && (
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-1">
                          <div className="flex items-center justify-between font-semibold text-slate-300">
                            <span>II. Lektura i konteksty</span>
                            <span className="font-mono text-rose-400 font-bold">
                              {tutorEvaluation.criteriaBreakdown.literary_cultural.score} / {tutorEvaluation.criteriaBreakdown.literary_cultural.max || 16} pkt
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {tutorEvaluation.criteriaBreakdown.literary_cultural.comment}
                          </p>
                        </div>
                      )}

                      {tutorEvaluation.criteriaBreakdown.composition && (
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-1">
                          <div className="flex items-center justify-between font-semibold text-slate-300">
                            <span>III. Kompozycja tekstu</span>
                            <span className="font-mono text-amber-400 font-bold">
                              {tutorEvaluation.criteriaBreakdown.composition.score} / {tutorEvaluation.criteriaBreakdown.composition.max || 7} pkt
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {tutorEvaluation.criteriaBreakdown.composition.comment}
                          </p>
                        </div>
                      )}

                      {tutorEvaluation.criteriaBreakdown.language_style && (
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-1">
                          <div className="flex items-center justify-between font-semibold text-slate-300">
                            <span>IV. Język i styl</span>
                            <span className="font-mono text-sky-400 font-bold">
                              {tutorEvaluation.criteriaBreakdown.language_style.score} / {tutorEvaluation.criteriaBreakdown.language_style.max || 11} pkt
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {tutorEvaluation.criteriaBreakdown.language_style.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Unified, Clean Feedback Section */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-white/5 space-y-3.5">
                  {/* Commentary */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 tracking-wide">
                      <GraduationCap size={15} className="text-amber-400 shrink-0" />
                      <span>Komentarz egzaminatora:</span>
                    </div>
                    <div className="text-sm text-slate-200 leading-relaxed">
                      <MathRenderer content={tutorEvaluation.mentorComment || tutorEvaluation.ckeFeedback || tutorEvaluation.summary} />
                    </div>
                  </div>

                  {/* Rubric justification if distinct */}
                  {tutorEvaluation.ckeFeedback && 
                   tutorEvaluation.ckeFeedback !== tutorEvaluation.mentorComment && 
                   !tutorEvaluation.mentorComment?.includes(tutorEvaluation.ckeFeedback) && (
                    <div className="pt-2.5 border-t border-white/5 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-[#FFB800]" />
                        <span>Kryteria punktacji CKE:</span>
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        <MathRenderer content={tutorEvaluation.ckeFeedback} />
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {tutorEvaluation.strengths && tutorEvaluation.strengths.length > 0 && (
                    <div className="pt-2.5 border-t border-white/5 space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide block">
                        {isPolishSession ? 'Mocne strony Twojej odpowiedzi:' : 'Zrealizowane etapy rozwiązania:'}
                      </span>
                      <div className="space-y-1">
                        {tutorEvaluation.strengths.map((str: string, sIdx: number) => (
                          <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                            <div className="flex-1 leading-snug">
                              <MathRenderer content={str} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errors / Recommendations */}
                  {tutorEvaluation.errors && tutorEvaluation.errors.length > 0 && (
                    <div className="pt-2.5 border-t border-white/5 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block">
                        Wskazówki do arkusza maturalnego:
                      </span>
                      <div className="space-y-1">
                        {tutorEvaluation.errors.map((err: string, eIdx: number) => (
                          <div key={eIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                            <div className="flex-1 leading-snug">
                              <MathRenderer content={err} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestion banner */}
                  {Boolean(tutorEvaluation.suggestion && tutorEvaluation.suggestion.trim()) && (
                    <div className="pt-2.5 border-t border-white/5 flex items-start gap-2.5 text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                      <Lightbulb size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold text-emerald-300">Wskazówka egzaminatora: </span>
                        <MathRenderer content={tutorEvaluation.suggestion} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Model Solution Dropdown (Clean, Elegant) */}
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowModelSolution(prev => !prev)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen size={16} className="text-[#FFB800]" />
                      <span>Wzorcowe rozwiązanie (krok po kroku)</span>
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      {showModelSolution ? 'Zwiń ▲' : 'Rozwiń ▼'}
                    </span>
                  </button>
                  {showModelSolution && (
                    <div className="p-4 pt-0 border-t border-white/5 text-xs sm:text-sm text-slate-200 space-y-2.5 max-h-64 overflow-y-auto">
                      {currentTask?.modelSolutionSteps && currentTask.modelSolutionSteps.length > 0 ? (
                        <div className="space-y-2 pt-3">
                          {currentTask.modelSolutionSteps.map((step: any, sIdx: number) => (
                            <div key={sIdx} className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
                              <span className="text-xs font-bold text-[#FFB800] block mb-1">
                                Krok {step.step_num}: {step.description}
                              </span>
                              {step.latex && <MathRenderer content={`$${step.latex}$`} />}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 pt-3 mt-3">
                          <MathRenderer content={currentTask?.officialKey || currentTask?.explanation || ''} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Direct Action Button to proceed to the next task or retry */}
                <div className="pt-2 flex items-center justify-end gap-3 flex-wrap">
                  {!isCorrect && (
                    <button
                      type="button"
                      onClick={handleRetryOpenTask}
                      className="w-full sm:w-auto px-4 h-12 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition active:scale-95 shadow-sm cursor-pointer"
                    >
                      <RotateCcw size={16} />
                      <span>Popraw odpowiedź</span>
                    </button>
                  )}
                  <button
                    onClick={handleNextStep}
                    className={`w-full sm:w-auto px-6 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-lg cursor-pointer ${
                      isCorrect
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-rose-500/25'
                    }`}
                  >
                    <span>Przejdź dalej</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
        ) : isNumericTask ? (
          /* 1. NUMERIC INPUT FORMAT (Dedykowana klawiatura matematyczna, bez opcji tablicy) */
          <motion.div

            key={`session-numeric-${currentStep}-${currentTask?.id || ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full space-y-3 pt-1"
          >
            <OpenTaskWorkspace
              task={currentTask}
              isEvaluated={isEvaluated}
              isCorrect={isCorrect}
              value={numericInput}
              onChangeValue={(val) => setNumericInput(val)}
              onSubmit={handleCheckAnswer}
              hideWhiteboard={true}
              inputPlaceholder={currentTask?.input_placeholder || "Wpisz wynik (użyj klawiatury)..."}
            />

            {isEvaluated && !isCorrect && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm text-rose-200 flex items-center justify-between shadow-sm min-h-[52px]">
                <span className="font-medium">Prawidłowy wynik:</span>
                <span className="font-bold text-emerald-400 text-base sm:text-lg inline-flex items-center">
                  <MathRenderer content={formatMathAnswer(currentTask?.correctAnswer || currentTask?.correct_answer || currentTask?.numeric_correct_answer)} />
                </span>
              </div>
            )}
          </motion.div>
        ) : isTrueFalseTask ? (
          /* 2. TRUE_FALSE STATEMENTS FORMAT */
          <motion.div
            key={`session-tf-${currentStep}-${currentTask?.id || ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full space-y-3 pt-1"
          >
            {(!currentTask?.statements || currentTask.statements.length <= 1) ? (
              <div className="space-y-3">
                <div className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center justify-between px-1">
                  <span>Oceń prawdziwość stwierdzenia:</span>
                  <span className="text-[11px] text-slate-500">Wybierz PRAWDA lub FAŁSZ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {[
                    { id: 'P' as const, label: 'PRAWDA', shortcut: 'P / 1', desc: 'Stwierdzenie jest prawdziwe' },
                    { id: 'F' as const, label: 'FAŁSZ', shortcut: 'F / 2', desc: 'Stwierdzenie jest fałszywe' }
                  ].map((item) => {
                    const userChoice = selectedOption || tfSelections['single'];
                    const isOptSelected = userChoice === item.id;
                    const normTarget = resolveTrueFalseTarget(currentTask);
                    const isThisTheCorrectAnswer = normTarget === item.id;

                    let cardClass = 'group relative flex flex-col p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left select-none min-h-[64px] sm:min-h-[72px] justify-center ';
                    if (!isEvaluated) {
                      if (isOptSelected) {
                        cardClass += 'bg-[#FFB800]/10 border-[#FFB800] shadow-sm ring-2 ring-[#FFB800]/20';
                      } else {
                        cardClass += 'bg-[#0E1522]/90 hover:bg-[#141D2E] border-white/[0.06] hover:border-white/[0.14] text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.25)]';
                      }
                    } else {
                      if (isThisTheCorrectAnswer) {
                        cardClass += 'bg-emerald-950/30 border-emerald-500 text-emerald-100 shadow-sm';
                      } else if (isOptSelected && !isThisTheCorrectAnswer) {
                        cardClass += 'bg-rose-950/30 border-rose-500 text-rose-200 shadow-sm';
                      } else {
                        cardClass += 'bg-[#0E1522]/40 border-white/[0.03] opacity-40 cursor-not-allowed';
                      }
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isEvaluated}
                        onClick={() => {
                          if (isEvaluated) return;
                          triggerHaptic('light');
                          setSelectedOption(item.id);
                          setTfSelections({ single: item.id });
                        }}
                        className={cardClass}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center transition-all ${
                              !isEvaluated
                                ? isOptSelected
                                  ? 'bg-[#FFB800] text-[#080B11] font-bold shadow-md'
                                  : 'bg-[#141D2E] border border-white/[0.08] text-slate-300 group-hover:border-white/[0.16]'
                                : isThisTheCorrectAnswer
                                  ? 'bg-emerald-500 text-emerald-950 font-black shadow-md'
                                  : isOptSelected
                                    ? 'bg-rose-500 text-white font-black'
                                    : 'bg-[#141D2E]/40 border border-white/[0.04] text-slate-600'
                            }`}>
                              {item.id}
                            </span>
                            <span className="font-bold text-base sm:text-lg tracking-wide text-white">
                              {item.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isEvaluated && (
                              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                                {item.shortcut}
                              </span>
                            )}
                            {/* Glowing Active Radio Dot when selected */}
                            {isOptSelected && !isEvaluated && (
                              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#FFB800]/20">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800] shadow-[0_0_8px_#FFB800]" />
                              </div>
                            )}
                            {isEvaluated && isThisTheCorrectAnswer && (
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                <Check size={14} className="stroke-[3]" />
                                Poprawna
                              </span>
                            )}
                            {isEvaluated && isOptSelected && !isThisTheCorrectAnswer && (
                              <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                                <X size={14} className="stroke-[3]" />
                                Twój wybór
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 mt-0.5 font-normal">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center justify-between px-1">
                  <span>Oceń prawdziwość zdań:</span>
                  <span className="text-[11px] text-slate-500">Wybierz P lub F dla każdego zdania</span>
                </div>
                <div className="space-y-2.5">
                  {(currentTask?.statements || []).map((stmt: any, idx: number) => {
                    const userSelection = tfSelections[stmt.id];
                    const isStatementCorrect = isEvaluated && userSelection === stmt.correct;

                    return (
                      <div
                        key={stmt.id || idx}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                          isEvaluated
                            ? isStatementCorrect
                              ? 'bg-emerald-950/20 border-emerald-500/40'
                              : 'bg-rose-950/20 border-rose-500/40'
                            : 'bg-[#0E1522]/90 border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
                        } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <span className="shrink-0 w-6 h-6 rounded-lg bg-[#141D2E] border border-white/[0.08] text-[#FFB800] font-bold text-xs flex items-center justify-center mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed break-words flex-1">
                            <MathRenderer content={stmt.text} />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {(['P', 'F'] as const).map((opt) => {
                            const isOptSelected = userSelection === opt;
                            const isThisTheCorrectAnswer = stmt.correct === opt;

                            let btnClass = 'w-11 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all cursor-pointer ';
                            if (!isEvaluated) {
                              if (isOptSelected) {
                                btnClass += 'bg-[#FFB800] text-[#080B11] border border-[#D97706] shadow-sm';
                              } else {
                                btnClass += 'bg-[#141D2E] hover:bg-[#1A2438] text-slate-300 border border-white/[0.08]';
                              }
                            } else {
                              if (isThisTheCorrectAnswer) {
                                btnClass += 'bg-emerald-500 text-emerald-950 border border-emerald-400 font-black shadow-sm';
                              } else if (isOptSelected && !isThisTheCorrectAnswer) {
                                btnClass += 'bg-rose-500 text-white border border-rose-400';
                              } else {
                                btnClass += 'bg-[#0E1522]/40 border-white/[0.03] text-slate-600 opacity-40 cursor-not-allowed';
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
          </motion.div>
        ) : isTwoPartTask ? (
          /* 3. TWO_PART FORMAT */
          <motion.div
            key={`session-twopart-${currentStep}-${currentTask?.id || ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full space-y-4 pt-1"
          >
            {/* Część 1 */}
            <div className="p-4 rounded-2xl bg-[#0E1522]/90 border border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.25)] space-y-2.5">
              <div className="text-xs sm:text-sm font-semibold text-[#FFB800] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FFB800]/20 text-[#FFB800] text-xs flex items-center justify-center font-bold">1</span>
                <span>{currentTask?.part_1?.prompt || 'Wybierz pierwszą część zdania:'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(currentTask?.part_1?.options || []).map((opt: any, optIdx: number) => {
                  const optId = opt.id || opt.key || opt.label || String.fromCharCode(65 + optIdx);
                  const isSelected = twoPart1 === optId;
                  const target1 = (currentTask?.correctAnswer || currentTask?.correct_answer || '')[0];
                  const isOptionCorrect = optId === target1;

                  let btnClass = 'p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs sm:text-sm cursor-pointer ';
                  if (!isEvaluated) {
                    btnClass += isSelected 
                      ? 'bg-[#FFB800]/[0.08] border-[#FFB800] text-amber-100 shadow-[0_0_15px_rgba(255,184,0,0.15)]'
                      : 'bg-[#141D2E]/80 border-white/[0.06] hover:border-white/[0.14] hover:bg-[#141D2E] text-slate-200';
                  } else {
                    if (isOptionCorrect) {
                      btnClass += 'bg-emerald-950/30 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !isOptionCorrect) {
                      btnClass += 'bg-rose-950/30 border-rose-500 text-rose-200';
                    } else {
                      btnClass += 'bg-[#0E1522]/40 border-white/[0.03] opacity-40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={opt.id || `twopart-1-${optIdx}`}
                      type="button"
                      disabled={isEvaluated}
                      onClick={() => {
                        if (isEvaluated) return;
                        triggerHaptic('light');
                        setTwoPart1(optId);
                      }}
                      className={btnClass}
                    >
                      <span className={`font-bold text-xs px-2 py-0.5 rounded border transition-colors ${
                        isSelected && !isEvaluated
                          ? 'bg-[#FFB800] text-[#080B11] border-[#D97706]'
                          : isEvaluated && isOptionCorrect
                            ? 'bg-emerald-500 text-emerald-950 border-emerald-400 font-black'
                            : isEvaluated && isSelected && !isOptionCorrect
                              ? 'bg-rose-500 text-white border-rose-400 font-black'
                              : 'bg-[#141D2E] border-white/[0.08] text-slate-300'
                      }`}>
                        {optId}
                      </span>
                      <span className="flex-1 break-words">
                        <MathRenderer content={opt.text} />
                      </span>
                      {isEvaluated && isOptionCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />}
                      {isEvaluated && isSelected && !isOptionCorrect && <X className="w-4 h-4 text-rose-400 shrink-0 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Część 2 */}
            <div className="p-4 rounded-2xl bg-[#0E1522]/90 border border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.25)] space-y-2.5">
              <div className="text-xs sm:text-sm font-semibold text-[#FFB800] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FFB800]/20 text-[#FFB800] text-xs flex items-center justify-center font-bold">2</span>
                <span>{currentTask?.part_2?.prompt || 'Wybierz drugą część zdania / uzasadnienie:'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(currentTask?.part_2?.options || []).map((opt: any, optIdx: number) => {
                  const optId = opt.id || opt.key || opt.label || String(optIdx + 1);
                  const isSelected = twoPart2 === optId;
                  const target2 = (currentTask?.correctAnswer || currentTask?.correct_answer || '')[1];
                  const isOptionCorrect = optId === target2;

                  let btnClass = 'p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs sm:text-sm cursor-pointer ';
                  if (!isEvaluated) {
                    btnClass += isSelected 
                      ? 'bg-[#FFB800]/[0.08] border-[#FFB800] text-amber-100 shadow-[0_0_15px_rgba(255,184,0,0.15)]'
                      : 'bg-[#141D2E]/80 border-white/[0.06] hover:border-white/[0.14] hover:bg-[#141D2E] text-slate-200';
                  } else {
                    if (isOptionCorrect) {
                      btnClass += 'bg-emerald-950/30 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !isOptionCorrect) {
                      btnClass += 'bg-rose-950/30 border-rose-500 text-rose-200';
                    } else {
                      btnClass += 'bg-[#0E1522]/40 border-white/[0.03] opacity-40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={opt.id || `twopart-2-${optIdx}`}
                      type="button"
                      disabled={isEvaluated}
                      onClick={() => {
                        if (isEvaluated) return;
                        triggerHaptic('light');
                        setTwoPart2(optId);
                      }}
                      className={btnClass}
                    >
                      <span className={`font-bold text-xs px-2 py-0.5 rounded border transition-colors ${
                        isSelected && !isEvaluated
                          ? 'bg-[#FFB800] text-[#080B11] border-[#D97706]'
                          : isEvaluated && isOptionCorrect
                            ? 'bg-emerald-500 text-emerald-950 border-emerald-400 font-black'
                            : isEvaluated && isSelected && !isOptionCorrect
                              ? 'bg-rose-500 text-white border-rose-400 font-black'
                              : 'bg-[#141D2E] border-white/[0.08] text-slate-300'
                      }`}>
                        {optId}
                      </span>
                      <span className="flex-1 break-words">
                        <MathRenderer content={opt.text} />
                      </span>
                      {isEvaluated && isOptionCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />}
                      {isEvaluated && isSelected && !isOptionCorrect && <X className="w-4 h-4 text-rose-400 shrink-0 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (() => {
          const rawOptions = (randomizedOptions.length > 0 ? randomizedOptions : (currentTask?.options || []));
          const hasLargeDiagram = rawOptions.some((opt: any) => opt?.diagram || opt?.numberLine);
          const isLongText = rawOptions.some((opt: any) => {
            const content = typeof opt === 'string' ? opt : (opt?.content_latex || opt?.text || opt?.content || '');
            return content.length > 80;
          });
          const useTwoColumns = !isPolishSession && rawOptions.length <= 4 && !hasLargeDiagram && !isLongText;

          return (
            /* 4. STANDARD SINGLE CHOICE (A, B, C, D) - ANSWERS ALWAYS VISIBLE */
            <motion.div 
              key={`session-options-${currentStep}-${currentTask?.id || ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={useTwoColumns ? "grid grid-cols-1 md:grid-cols-2 gap-3 pt-1" : "space-y-3 pt-1"}
            >
              {rawOptions.map((option: any, optIdx: number) => {
                const isString = typeof option === 'string';
                const defaultLetter = String.fromCharCode(65 + optIdx);
                let optId = defaultLetter;
                let optContent = '';

                if (isString) {
                  const letterMatch = option.match(/^([A-D1-4])[\.\)]\s*(.*)$/);
                  optId = letterMatch ? letterMatch[1].toUpperCase() : defaultLetter;
                  optContent = letterMatch ? letterMatch[2].trim() : option;
                } else {
                  optId = option.id || option.key || option.label || defaultLetter;
                  optContent = option.content_latex || option.text || option.content || '';
                }

                const isSelected = selectedOption === optId;
                const isOptionCorrect = Boolean(option.is_correct);

                // Craftsmanship Nocturne Luminary styles (Linear / Brilliant grade)
                let cardStyle = 'bg-[#0E1522]/90 border-white/[0.06] hover:border-white/[0.14] hover:bg-[#141D2E] shadow-[0_4px_20px_rgba(0,0,0,0.25)] text-slate-100';
                if (isSelected && !isEvaluated) {
                  cardStyle = isPolishSession
                    ? 'bg-[#F43F5E]/[0.08] border-[#F43F5E] shadow-[0_0_20px_rgba(244,63,94,0.18)] text-white'
                    : 'bg-[#FFB800]/[0.08] border-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.18)] text-white';
                } else if (isEvaluated) {
                  if (isOptionCorrect) {
                    cardStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
                  } else if (isSelected && !isOptionCorrect) {
                    cardStyle = 'border-rose-500 bg-rose-950/40 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
                  } else {
                    cardStyle = 'border-white/[0.03] opacity-40 bg-[#0E1522]/40 text-slate-500';
                  }
                }

                return (
                  <motion.button
                    key={option.id || `session-opt-${optIdx}`}
                    id={`session-option-${optId}`}
                    onClick={() => handleSelectOption(optId)}
                    disabled={isEvaluated}
                    whileHover={!isEvaluated ? { scale: 1.008 } : undefined}
                    whileTap={!isEvaluated ? { scale: 0.985 } : undefined}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`relative w-full min-h-[58px] p-3 sm:p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-colors duration-150 overflow-hidden cursor-pointer select-none ${cardStyle}`}
                  >
                    {/* Subtelny refleks Apple-style na górnej krawędzi */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <span 
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border transition-colors ${
                          isSelected && !isEvaluated
                            ? isPolishSession
                              ? 'bg-[#F43F5E] border-[#E11D48] text-white font-bold shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                              : 'bg-[#FFB800] border-[#D97706] text-[#080B11] font-bold shadow-[0_0_10px_rgba(255,184,0,0.5)]'
                            : isEvaluated && isOptionCorrect
                              ? 'bg-emerald-500 border-emerald-400 text-emerald-950 font-black'
                              : isEvaluated && isSelected && !isOptionCorrect
                                ? 'bg-rose-500 border-rose-400 text-white font-black'
                                : 'bg-[#141D2E] border-white/[0.08] text-slate-300'
                        }`}
                      >
                        {optId}
                      </span>
                      <div className="text-sm sm:text-base font-medium break-words flex-1">
                        {option?.numberLine ? (
                          <NumberLineDiagram data={option.numberLine} />
                        ) : option?.diagram ? (
                          <MathDiagram diagram={option.diagram} />
                        ) : (
                          <MathRenderer content={optContent || (typeof option === 'string' ? option : (option?.text || option?.content_latex || ''))} />
                        )}
                      </div>
                    </div>

                    {/* Keyboard badge for desktop */}
                    {!isEvaluated && (
                      <span className="hidden md:inline-flex items-center text-[11px] font-mono font-bold text-slate-400 bg-[#141D2E] border border-white/[0.08] px-2 py-0.5 rounded shrink-0 mr-1">
                        {optId}
                      </span>
                    )}

                    {/* Selection / Status Icon */}
                    {isSelected && !isEvaluated && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#FFB800]/20">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
                      </div>
                    )}
                    {isEvaluated && isOptionCorrect && (
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 stroke-[3]" />
                    )}
                    {isEvaluated && isSelected && !isOptionCorrect && (
                      <X className="w-5 h-5 text-rose-400 shrink-0 stroke-[3]" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          );
        })()}
          </>
        )}

        {/* Sesja nauki jest strefą skupienia: żadnych banerów sprzedażowych obok zadania.
            Oferta PRO pojawia się na Dashboardzie i raz po ukończonej sesji. */}
      </main>

      {/* ================= STICKY BOTTOM CTA FOR THEORY STEP ================= */}
      {isTheoryStep && (
        <footer 
          id="session-theory-sticky-cta"
          className="w-full shrink-0 sticky bottom-0 z-30 bg-[#070A0F]/95 backdrop-blur-md border-t border-white/[0.06] px-4 py-3 relative"
        >
          {/* Subtelny gradient maskujący na krawędzi górnej paska CTA */}
          <div className="absolute -top-6 left-0 right-0 h-6 pointer-events-none bg-gradient-to-t from-[#070A0F]/95 to-transparent" aria-hidden="true" />
          <div className="w-full max-w-3xl lg:max-w-4xl mx-auto flex items-center gap-2">
            {theorySubStep > 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setTheorySubStep(prev => Math.max(0, prev - 1));
                }}
                className="h-[48px] px-4 rounded-xl font-semibold text-slate-300 bg-[#0E1522] hover:bg-[#141D2E] border border-white/[0.08] flex items-center justify-center gap-1.5 text-sm shrink-0 cursor-pointer active:scale-95 transition"
                aria-label="Wróć do poprzedniej karty"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Wróć</span>
              </button>
            )}

            {theorySubStep < (isEnglishSession ? 2 : 3) ? (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setTheorySubStep(prev => Math.min(isEnglishSession ? 2 : 3, prev + 1));
                }}
                className="flex-1 h-[50px] px-4 rounded-xl font-bold active:scale-[0.98] transition flex items-center justify-center gap-2 text-sm cursor-pointer tracking-wide bg-[#FFB800] hover:bg-[#FFC72C] text-[#080B11] shadow-sm"
              >
                <span>
                  {isEnglishSession
                    ? (theorySubStep === 0 ? 'Dalej: Przykłady' : 'Dalej: Typowy błąd')
                    : theorySubStep === 0 
                      ? (isPolishSession ? 'Dalej: Pojęcia' : 'Dalej: Wzory')
                      : theorySubStep === 1
                        ? (isPolishSession ? 'Dalej: Analiza' : 'Dalej: Przykład')
                        : 'Dalej: Typowy błąd'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                id="session-start-tasks-button"
                disabled={isEnglishSession && !isEnglishTrapPassed}
                onClick={() => {
                  if (isEnglishSession && !isEnglishTrapPassed) {
                    triggerHaptic('heavy');
                    return;
                  }
                  triggerHaptic('medium');
                  playSuccessSound();
                  setCurrentStep(1);
                }}
                className={`flex-1 h-[50px] px-4 rounded-xl font-bold active:scale-[0.98] transition flex items-center justify-center gap-2 text-sm tracking-wide shadow-sm ${
                  isEnglishSession && !isEnglishTrapPassed
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-80'
                    : 'bg-[#FFB800] hover:bg-[#FFC72C] text-[#080B11] cursor-pointer'
                }`}
              >
                <span>
                  {isEnglishSession && !isEnglishTrapPassed
                    ? 'Rozwiąż mini-trening, aby odblokować zadania'
                    : 'Przejdź do zadań'}
                </span>
                {isEnglishSession && !isEnglishTrapPassed ? (
                  <Lock className="w-4 h-4 text-slate-400" />
                ) : (
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>
            )}
          </div>
        </footer>
      )}

      {/* ================= BOTTOM ACTION & FEEDBACK BAR (ELEGANT 90-110PX BAR) ================= */}
      {!isTheoryStep && (
        <footer 
          id="session-footer-drawer"
          className="w-full shrink-0 sticky bottom-0 z-30"
        >
        <AnimatePresence mode="wait">
          {!isEvaluated ? (
            /* Normal Action Bar */
            <div 
              id="session-check-bar"
              className="w-full bg-[#070A0F]/95 backdrop-blur-md border-t border-white/[0.06] px-4 py-3 sm:py-4"
            >
              <div className="w-full max-w-3xl lg:max-w-4xl mx-auto flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 w-full">
                  {/* Hint Button (Square Left) */}
                  {currentTask && (
                    <button
                      type="button"
                      id="session-bottom-hint-button"
                      onClick={handleToggleOrBuyHint}
                      disabled={isAiHintLoading || (!isHintUnlocked && currentCoins < currentTaskHintCost)}
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all shrink-0 select-none cursor-pointer active:scale-95 ${
                        isHintUnlocked
                          ? 'border-amber-400/60 bg-amber-500/20 hover:bg-amber-500/30 shadow-sm'
                          : currentCoins >= currentTaskHintCost
                            ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
                            : 'border-white/[0.06] bg-[#0E1522]/60 opacity-50 cursor-not-allowed'
                      }`}
                      title={
                        isHintUnlocked
                          ? 'Zobacz podpowiedź (odblokowana)'
                          : currentCoins >= currentTaskHintCost
                            ? `Podpowiedź (-${currentTaskHintCost} monet)`
                            : `Za mało monet (${currentCoins}/${currentTaskHintCost})`
                      }
                      aria-label="Podpowiedź do zadania"
                    >
                      {isAiHintLoading ? (
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                      ) : (
                        <>
                          <Lightbulb
                            className={`w-5 h-5 transition-transform ${
                              isHintUnlocked
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-amber-400/90'
                            }`}
                          />
                          {isHintUnlocked ? (
                            <span className="text-[10px] font-bold text-amber-300 leading-none mt-1">FREE</span>
                          ) : (
                            <div className="flex items-center gap-0.5 mt-0.5">
                              <Coins className="w-2.5 h-2.5 text-amber-400/80" />
                              <span className="text-[10px] font-black text-amber-300/90 leading-none">
                                {currentTaskHintCost}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  )}

                  {/* Main Action Button (Check / AI Tutor) */}
                  {isOpenTask ? (
                    <button
                      id="session-check-tutor-button"
                      onClick={() => handleCheckOpenAnswerWithTutor()}
                      disabled={(!openAnswerText.trim() && openCanvasDataUrl.length <= 50) || isTutorScanning}
                      className={`flex-1 h-14 px-6 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                        (openAnswerText.trim() || openCanvasDataUrl.length > 50) && !isTutorScanning
                          ? isPolishSession
                            ? 'bg-gradient-to-r from-[#F43F5E] to-rose-600 hover:from-[#FB7185] hover:to-rose-500 text-white shadow-sm active:scale-[0.99] cursor-pointer'
                            : 'bg-gradient-to-r from-[#FFB800] to-amber-500 hover:from-[#FFC72C] hover:to-amber-400 text-[#080B11] shadow-sm active:scale-[0.99] cursor-pointer'
                          : 'bg-[#141D2E]/60 text-slate-500 cursor-not-allowed border border-white/[0.06]'
                      }`}
                    >
                      <GraduationCap className={`w-5 h-5 stroke-[2.2] ${isPolishSession ? 'text-white' : 'text-slate-950'}`} />
                      <span>{isTutorScanning ? 'AI EGZAMINATOR OCENIA...' : 'OCEŃ Z EGZAMINATOREM AI'}</span>
                    </button>
                  ) : (
                    <button
                      id="session-check-button"
                      onClick={handleCheckAnswer}
                      disabled={!isReadyToCheck}
                      className={`flex-1 h-14 px-6 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                        isReadyToCheck
                          ? isPolishSession
                            ? 'bg-[#F43F5E] hover:bg-[#FB7185] text-white shadow-sm active:scale-[0.99]'
                            : 'bg-[#FFB800] hover:bg-[#FFC72C] text-[#080B11] shadow-sm active:scale-[0.99]'
                          : 'bg-[#141D2E]/60 text-slate-500 cursor-not-allowed border border-white/[0.06]'
                      }`}
                    >
                      <span>{isNumericTask ? 'SPRAWDŹ ODPOWIEDŹ' : 'SPRAWDŹ'}</span>
                      <span className="hidden md:inline-flex text-[10px] font-mono font-bold opacity-75 bg-black/25 px-1.5 py-0.5 rounded">Enter ↵</span>
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
                  <Info className="w-3.5 h-3.5" />
                  <span>
                    {isPolishInteractiveTask
                      ? 'Wykonaj zadanie na powyższej karcie lekturowej'
                      : isOpenTask 
                        ? (isPolishSession ? 'Naciśnij Enter aby ocenić odpowiedź z Egzaminatorem AI' : 'Naciśnij Enter aby ocenić dowód z Egzaminatorem AI') 
                        : isNumericTask 
                          ? 'Wpisz wynik i naciśnij Enter aby sprawdzić' 
                          : isTrueFalseTask
                            ? 'Oceń wszystkie zdania i naciśnij Enter'
                            : isTwoPartTask
                              ? 'Zaznacz obie części zdania i naciśnij Enter'
                              : 'Wybierz opcję klawiszami 1-4 / A-D lub kliknij'}
                  </span>
                </div>

              </div>
            </div>
          ) : (
            /* Compact Bottom Summary Bar - Answers stay 100% visible, zero truncation */
            <motion.div
              key="feedback-bottom-bar"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className={`w-full border-t-2 px-4 py-3 sm:py-3.5 min-h-[88px] flex items-center backdrop-blur-md shadow-2xl ${
                isCorrect 
                  ? 'bg-[#0B1A16]/95 border-emerald-500 shadow-[0_-8px_25px_rgba(16,185,129,0.2)]' 
                  : 'bg-[#1C0F14]/95 border-rose-500 shadow-[0_-8px_25px_rgba(244,63,94,0.2)]'
              }`}
            >
              <div className="w-full max-w-3xl lg:max-w-4xl mx-auto flex items-center justify-between gap-3">
                {/* Status Section (Left) - Bez ucinania tekstu */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border ${
                    isCorrect 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                      : 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  }`}>
                    {isCorrect ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                    ) : (
                      <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`font-bold text-sm sm:text-base leading-snug whitespace-normal ${
                        isCorrect ? 'text-emerald-300' : 'text-rose-300'
                      }`}>
                        {isCorrect ? 'Świetnie! Poprawna odpowiedź' : 'Niepoprawna odpowiedź'}
                      </div>
                    </div>
                    {!isCorrect && (() => {
                      const rawLabel = correctAnswerLabel || (isOpenTask ? 'Dowód algebraiczny CKE' : '');
                      const letterMatch = rawLabel.match(/^([A-D])\s*[:\.\-]?\s*(.*)$/);
                      const optionLetter = letterMatch ? letterMatch[1] : null;
                      const restText = letterMatch ? letterMatch[2].trim() : rawLabel;

                      return (
                        <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>{isOpenTask ? 'Wymóg CKE:' : 'Prawidłowa:'}</span>
                          {optionLetter ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-400/60 text-emerald-300 font-display font-black text-xs shadow-sm">
                                {optionLetter}
                              </span>
                              {restText && (
                                <span className="font-medium text-white/95">
                                  <MathRenderer content={restText} />
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="font-bold text-white font-mono bg-white/10 px-1.5 py-0.5 rounded inline-flex items-center">
                              <MathRenderer content={rawLabel} />
                            </span>
                          )}
                        </div>
                      );
                    })()}
                    {/* View Explanation Trigger */}
                    <button
                      type="button"
                      onClick={() => setShowExplanation(prev => !prev)}
                      className="mt-1 text-xs font-semibold text-[#FFB800] hover:text-[#FFC72C] flex items-center gap-1 cursor-pointer transition underline underline-offset-2 whitespace-nowrap"
                    >
                      <BookOpen size={13} />
                      <span>Zobacz wyjaśnienie {showExplanation ? '▴' : '▾'}</span>
                    </button>
                  </div>
                </div>

                {/* Primary CTA (Right): Dalej → lub Ukończ lekcję */}
                <button
                  id="session-next-step-button"
                  onClick={handleNextStep}
                  className={`h-11 sm:h-12 px-5 sm:px-6 rounded-xl font-black text-sm flex items-center justify-center gap-1.5 transition active:scale-[0.98] shadow-lg cursor-pointer shrink-0 ${
                    isCorrect
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black shadow-sm'
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-sm'
                  }`}
                >
                  <span>
                    {isCorrect && correctAnswersCount >= targetCorrectAnswers
                      ? 'Ukończ lekcję'
                      : 'Dalej'}
                  </span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
      )}

      {/* ================= EXPLANATION & MATURA TRAP MODAL (ON-DEMAND) ================= */}
      <AnimatePresence>
        {showExplanation && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowExplanation(false);
            }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="w-full sm:max-w-xl max-h-[85vh] bg-[#0E1522] border-t sm:border border-white/[0.08] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Wskaźnik Gestu (Drag Handle) na Mobile */}
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto my-2 sm:hidden shrink-0" aria-hidden="true" />

              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between bg-[#070A0F]/60 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-[#FFB800]">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Wyjaśnienie i typowy błąd</h3>
                    <div className="text-xs text-slate-400">
                      <MathRenderer content={sanitizeLessonHeading(currentTask?.title) || 'Zadanie maturalne'} />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExplanation(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                {/* Typowy błąd (tylko autentyczna pułapka) */}
                {modalExamTrap && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle size={15} />
                      <span>Typowy błąd</span>
                    </div>
                    <div className="text-xs sm:text-sm text-amber-100/90 leading-relaxed break-words overflow-x-auto">
                      <MathRenderer content={modalExamTrap} />
                    </div>
                  </div>
                )}

                {/* Schemat wektorowy / Wykres do zadania */}
                {(currentTask?.explanationPlot || currentTask?.explanationDiagram || currentTask?.explanationNumberLine) && (
                  <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider self-start flex items-center gap-1.5">
                      <Target size={14} className="text-[#FFB800]" />
                      <span>Wykres wyjaśniający (rozwiązanie CKE):</span>
                    </span>
                    <div className="w-full flex justify-center overflow-x-auto py-1">
                      {currentTask?.explanationNumberLine ? (
                        <NumberLineDiagram data={currentTask.explanationNumberLine} height={60} maxWidth="360px" />
                      ) : (
                        <MathDiagram diagram={currentTask?.explanationDiagram || currentTask?.explanationPlot} compact />
                      )}
                    </div>
                  </div>
                )}

                {/* Metodyczne wyjaśnienie zadania */}
                {currentTask?.explanation && (
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block">
                      Krok po kroku:
                    </span>
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto max-w-full">
                      <MathRenderer content={currentTask.explanation} />
                    </div>
                  </div>
                )}

                {/* Transkrypcja nagrania dla zadań ze słuchu */}
                {currentTask?.transcript_snippet && (
                  <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-1.5">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Headphones size={14} />
                      Transkrypcja nagrania CKE (kluczowy fragment):
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed pl-2 border-l-2 border-sky-400/50">
                      "{currentTask.transcript_snippet}"
                    </p>
                  </div>
                )}

                {/* Schemat oceniania CKE dla zadań otwartych */}
                {isOpenTask && (currentTask?.scoring_key || currentTask?.official_solution_steps) && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Award size={15} />
                        Kryteria punktowania CKE (Formuła 2025):
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {currentTask.points || 2} pkt max
                      </span>
                    </div>
                    {Array.isArray(currentTask.scoring_key) && currentTask.scoring_key.length > 0 ? (
                      <div className="space-y-1.5">
                        {currentTask.scoring_key.map((step: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-emerald-100/90 bg-emerald-900/25 p-2.5 rounded-xl border border-emerald-500/20">
                            <span className="shrink-0 font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded text-[11px]">
                              {idx + 1} pkt
                            </span>
                            <div className="flex-1">
                              <MathRenderer content={step} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm text-emerald-200">
                        <MathRenderer content={currentTask.officialKey || currentTask.explanation} />
                      </div>
                    )}
                  </div>
                )}

                {/* Poprawna odpowiedź / Wynik dowodu */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs sm:text-sm flex-wrap">
                  <span className="text-slate-400 font-medium">
                    {isOpenTask ? 'Wynik / Teza dowodu:' : 'Poprawna odpowiedź:'}
                  </span>
                  {(() => {
                    const rawLabel = correctAnswerLabel || (isOpenTask ? 'Dowód wykazany wg schematu CKE' : 'Brak');
                    const letterMatch = rawLabel.match(/^([A-D])\s*[:\.\-]?\s*(.*)$/);
                    if (letterMatch) {
                      return (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-400/60 text-emerald-300 font-display font-black text-xs shadow-sm">
                            {letterMatch[1]}
                          </span>
                          {letterMatch[2].trim() && (
                            <span className="font-bold text-emerald-400 text-sm sm:text-base">
                              <MathRenderer content={letterMatch[2].trim()} />
                            </span>
                          )}
                        </span>
                      );
                    }
                    return (
                      <span className="font-mono font-bold text-emerald-400 text-sm sm:text-base inline-flex items-center">
                        <MathRenderer content={rawLabel} />
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setShowExplanation(false)}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                >
                  Zamknij wyjaśnienie
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= HINT BOTTOM SHEET / DRAWER ================= */}
      <AnimatePresence>
        {isHintSheetOpen && currentTask && (unlockedHints[currentTask.id] || isAiHintLoading) && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsHintSheetOpen(false);
            }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="w-full sm:max-w-xl max-h-[85vh] bg-[#0B0F19] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Sheet Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isAiHintTask 
                      ? 'bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800]' 
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  }`}>
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {isAiHintTask ? 'Wskazówka Egzaminatora AI' : 'Podpowiedź do zadania'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Wykorzystaj wskazówkę, aby samodzielnie dojść do wyniku
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  id="session-hint-close-button"
                  onClick={() => setIsHintSheetOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  aria-label="Zamknij podpowiedź"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sheet Content */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                {isAiHintLoading ? (
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-[#FFB800]/30 flex flex-col items-center justify-center gap-3 text-center">
                    <Loader2 className="w-7 h-7 text-[#FFB800] animate-spin" />
                    <p className="text-sm text-amber-200/90 font-medium">AI Tutor analizuje Twój tok myślenia...</p>
                  </div>
                ) : isAiHintTask ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-amber-950/20 border border-[#FFB800]/30 shadow-lg space-y-3">
                    <div className="flex items-center gap-2 text-[#FFB800] text-xs font-bold uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-[#FFB800] shrink-0" />
                      <span>Tok myślenia & Wskazówka</span>
                    </div>
                    <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                      <MathRenderer content={unlockedHints[currentTask.id]} />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Klucz do rozwiązania</span>
                    </div>
                    <div className="text-sm sm:text-base text-amber-100/95 leading-relaxed font-normal">
                      <MathRenderer content={unlockedHints[currentTask.id]} />
                    </div>
                  </div>
                )}
              </div>

              {/* Sheet Footer */}
              <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end shrink-0">
                <button
                  type="button"
                  id="session-hint-dismiss-button"
                  onClick={() => setIsHintSheetOpen(false)}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                >
                  Rozumiem, wracam do zadania
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= EXIT CONFIRMATION MODAL ================= */}
      <AnimatePresence>
        {showExitModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowExitModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Przerwać sesję?</h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Postęp z tej sesji nie zostanie zapisany w Twoim profilu. Czy na pewno chcesz wyjść do menu?
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  id="session-modal-stay-button"
                  onClick={() => setShowExitModal(false)}
                  className="w-full py-3.5 px-4 rounded-xl font-bold bg-[#FFB800] text-[#080B11] hover:bg-[#FFC72C] transition shadow-sm"
                >
                  WRÓĆ DO SESJI
                </button>
                <button
                  id="session-modal-quit-button"
                  onClick={() => {
                    isClearedRef.current = true;
                    clearSessionState(sessionId).catch(err => {
                      console.warn('[SessionRecovery] Error clearing session on cancel:', err);
                    });
                    setShowExitModal(false);
                    onCancelSession();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition text-sm"
                >
                  PRZERWIJ I WYJDŹ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= FORMULA SHEET DRAWER ================= */}
      <AnimatePresence>
        {showFormulaSheet && (
          <div 
            id="session-formula-sheet-backdrop"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-0 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowFormulaSheet(false);
            }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-[#0B0F17] border border-white/10 rounded-t-[28px] sm:rounded-3xl w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Mobile Swipe / Drag indicator handle */}
              <div className="w-full flex justify-center pt-2.5 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-slate-700/80 rounded-full" />
              </div>

              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#111724]/90 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-[#FFB800]/15 border border-[#FFB800]/30 text-[#FFB800]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-base sm:text-lg tracking-tight truncate">
                        {isPolishSession ? 'Leksykon Pojęć & Złote Zasady' : `Karta Wzorów • ${departmentNameOnly}`}
                      </h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/25">
                        Formuła 2023
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      <MathRenderer content={sanitizeLessonHeading(lessonTitleClean || rawLessonTitle || formulaSheet?.title || (isPolishSession ? 'Definicje i motywy literackie' : 'Wybrane wzory matematyczne CKE'))} />
                    </div>
                  </div>
                </div>
                <button
                  id="session-formulas-close-button"
                  onClick={() => setShowFormulaSheet(false)}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0 ml-2"
                  aria-label="Zamknij"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search & Topic Tabs (for Math) */}
              {!isPolishSession && (
                <div className="px-4 sm:px-5 py-3 bg-[#0B0F17] border-b border-white/5 flex flex-col gap-2.5 shrink-0">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setFormulaViewMode('department')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        formulaViewMode === 'department'
                          ? 'bg-[#FFB800] text-slate-950 font-bold shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                      }`}
                      title={`${departmentNameOnly} (${departmentFormulas.length})`}
                    >
                      {departmentNameOnly} ({departmentFormulas.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormulaViewMode('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        formulaViewMode === 'all'
                          ? 'bg-[#FFB800] text-slate-950 font-bold shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                      }`}
                    >
                      Wszystkie działy CKE
                    </button>
                  </div>
                  <div className="relative w-full">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={formulaSearchQuery}
                      onChange={e => setFormulaSearchQuery(e.target.value)}
                      placeholder={
                        formulaViewMode === 'department' 
                          ? `Szukaj we wzorach z: ${departmentNameOnly}...` 
                          : 'Szukaj we wszystkich wzorach CKE (np. delta, potęgi, sinus)...'
                      }
                      className="w-full bg-[#111724] border border-white/10 focus:border-[#FFB800]/50 rounded-xl pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                    {formulaSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setFormulaSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Filtr działów CKE (wyświetlany przy przełączeniu na "Wszystkie działy CKE") */}
                  {formulaViewMode === 'all' && (
                    <div className="relative flex items-center group/cke-filter w-full">
                      {/* Przewijanie w lewo dla komputerów */}
                      <button
                        type="button"
                        onClick={() => ckeChipsScrollRef.current?.scrollBy({ left: -150, behavior: 'smooth' })}
                        className="hidden sm:flex absolute left-0 z-10 w-6 h-6 items-center justify-center rounded-full bg-[#0E1522]/95 border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer transition -translate-x-1"
                        aria-label="Przewiń działy w lewo"
                        title="Przewiń w lewo"
                      >
                        <ChevronLeft size={13} />
                      </button>

                      <div
                        ref={ckeChipsScrollRef}
                        onWheel={(e) => {
                          if (e.deltaY !== 0) {
                            e.currentTarget.scrollLeft += e.deltaY;
                          }
                        }}
                        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-0.5 px-0.5 sm:px-6 scroll-smooth w-full"
                      >
                        <Filter size={13} className="text-slate-500 shrink-0 mr-1 ml-0.5" />
                        {availableCkeTopics.map(topic => {
                          const isSelected = selectedFormulaCkeTopic === topic.id;
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => {
                                triggerHaptic('light');
                                setSelectedFormulaCkeTopic(topic.id);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                                isSelected
                                  ? 'bg-[#FFB800] text-[#080B11] font-bold shadow-[0_0_12px_rgba(255,184,0,0.35)]'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                              }`}
                            >
                              {topic.name}
                            </button>
                          );
                        })}
                      </div>

                      {/* Przewijanie w prawo dla komputerów */}
                      <button
                        type="button"
                        onClick={() => ckeChipsScrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' })}
                        className="hidden sm:flex absolute right-0 z-10 w-6 h-6 items-center justify-center rounded-full bg-[#0E1522]/95 border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer transition translate-x-1"
                        aria-label="Przewiń działy w prawo"
                        title="Przewiń w prawo"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Drawer Content */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1 pb-16 sm:pb-8">
                {/* Formulas List */}
                {drawerFormulas.length > 0 ? (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                        {isPolishSession
                          ? 'Pojęcia Kluczowe i Definicje' 
                          : (formulaViewMode === 'department'
                              ? `Wzory i Tożsamości: ${departmentNameOnly}` 
                              : (selectedFormulaCkeTopic !== 'all'
                                  ? `Wzory CKE: ${availableCkeTopics.find(t => t.id === selectedFormulaCkeTopic)?.name || 'Wybrany dział'}`
                                  : 'Tablice i Wzory CKE'
                                )
                            )
                        }
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {isPolishSession
                          ? `${drawerFormulas.length} ${drawerFormulas.length === 1 ? 'pojęcie' : drawerFormulas.length < 5 ? 'pojęcia' : 'pojęć'}`
                          : `${drawerFormulas.length} ${drawerFormulas.length === 1 ? 'wzór' : drawerFormulas.length < 5 ? 'wzory' : 'wzorów'}`}
                      </span>
                    </div>

                    {drawerFormulas.map((f, i) => (
                      <div 
                        key={f.id || i} 
                        className="formula-sheet-card bg-[#111726]/80 hover:bg-[#141C2E] border border-white/5 hover:border-[#FFB800]/30 rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col gap-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center shrink-0 bg-[#FFB800]/10 border border-[#FFB800]/25 text-[#FFB800]">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-100 tracking-wide">
                              {f.title}
                            </span>
                          </div>
                          {f.cke_page ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 shadow-sm shrink-0">
                              <BookOpen className="w-3 h-3 text-emerald-400" />
                              <span>Karta wzorów: {typeof f.cke_page === 'number' || !String(f.cke_page).startsWith('str') ? `str. ${f.cke_page}` : f.cke_page}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 text-[#FFB800]/80 bg-[#FFB800]/10 border border-[#FFB800]/20">
                              {isPolishSession ? 'Leksykon' : 'Wzór maturalny'}
                            </span>
                          )}
                        </div>

                        {f.latex && (
                          <div 
                            className="bg-[#080C14] border border-white/5 rounded-xl px-3 py-1.5 sm:py-2.5 text-center overflow-x-auto custom-scrollbar touch-pan-x max-w-full"
                            style={{ WebkitMaskImage: 'linear-gradient(to right, black 88%, transparent 100%)', maskImage: 'linear-gradient(to right, black 88%, transparent 100%)' }}
                          >
                            <div className="inline-block w-fit min-w-full mx-auto text-center font-mono text-amber-200 font-bold text-base sm:text-lg leading-relaxed tracking-wide">
                              <MathRenderer content={toFormulaBoxContent(f.latex, isPolishSession)} displayMode={!isPolishSession} />
                            </div>
                          </div>
                        )}

                        {f.subFormulas && f.subFormulas.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-0.5">
                            {f.subFormulas.map((sub, sIdx) => (
                              <div key={sIdx} className="bg-[#0A0E18] border border-white/5 rounded-xl p-2.5 flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                  {sub.label}
                                </span>
                                <div className="text-amber-200 text-xs sm:text-sm font-mono overflow-x-auto custom-scrollbar">
                                  <MathRenderer content={toFormulaBoxContent(sub.formula, isPolishSession)} displayMode={!isPolishSession} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {(f.description || f.mnemonic) && (
                          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#080C14]/40 border border-white/5 rounded-xl p-3">
                            <MathRenderer content={f.description || f.mnemonic} />
                          </div>
                        )}

                        {f.example && (
                          <div className="text-xs text-slate-400 bg-amber-500/5 border border-amber-500/15 rounded-xl p-2.5 flex items-start gap-2">
                            <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mt-0.5">Przykład:</span>
                            <div className="text-slate-300 overflow-x-auto custom-scrollbar">
                              <MathRenderer content={f.example} />
                            </div>
                          </div>
                        )}

                        {Boolean(f.matura_tip && f.matura_tip.trim()) && (
                          <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-start gap-2">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-300">Wskazówka egzaminatora: </span>
                              <MathRenderer content={f.matura_tip} />
                            </div>
                          </div>
                        )}

                        {/* Szkic geometryczny (opcjonalny, bezpośrednie renderowanie CKE) */}
                        {f.diagram && (
                          <div className="pt-2">
                            <div className="rounded-xl border border-white/10 bg-[#070A0F] p-2.5 sm:p-3 shadow-inner overflow-hidden">
                              {'intervals' in f.diagram ? (
                                <NumberLineDiagram data={f.diagram as any} height={120} />
                              ) : (
                                <MathDiagram diagram={f.diagram as any} compact borderless />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center flex flex-col items-center justify-center">
                    <BookOpen className="w-10 h-10 text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-300">Nie znaleziono pasujących wzorów</p>
                    <p className="text-xs text-slate-500 mt-1">Zmień zapytanie lub przełącz na wszystkie wzory CKE.</p>
                  </div>
                )}

                {/* Golden Rule */}
                {(theoryPill?.keyTakeaway || formulaSheet?.goldenRule) && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/25 to-[#071612]/60 border border-emerald-500/25 shadow-lg shadow-emerald-950/20 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                      <Compass className="w-4 h-4" />
                      <span>{isPolishSession ? 'Złota Zasada Egzaminatora' : 'Złota Strategia Maturalna'}</span>
                    </div>
                    <div className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed pl-0.5">
                      <MathRenderer content={theoryPill?.keyTakeaway || formulaSheet?.goldenRule} />
                    </div>
                  </div>
                )}

                {/* Exam Trap */}
                {(theoryPill?.trapAlert || formulaSheet?.ckeTrap) && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 to-[#181108]/60 border border-amber-500/25 shadow-lg shadow-amber-950/20 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Uwaga na Pułapkę Egzaminacyjną!</span>
                    </div>
                    {theoryPill?.trapAlert ? (
                      <div className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                        <MathRenderer content={theoryPill.trapAlert} />
                      </div>
                    ) : formulaSheet?.ckeTrap ? (() => {
                      const trap = formulaSheet.ckeTrap;
                      const hasRealError = Boolean(trap.error && !/błąd typowy/i.test(trap.error));
                      const hasRealCorrect = Boolean(trap.correct && !/poprawna metoda/i.test(trap.correct));
                      const showMathBoxes = hasRealError || hasRealCorrect;

                      return (
                        <div className="space-y-2.5">
                          {showMathBoxes && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                              {hasRealError && (
                                <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3">
                                  <span className="font-bold text-rose-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Typowy błąd</span>
                                  </span>
                                  <div className="text-rose-200 overflow-x-auto custom-scrollbar py-0.5">
                                    <MathRenderer content={trap.error.replace(/^[❌⚠️\s]*(?:błąd\s*typowy|typowy\s*błąd)[:\s-]*/i, '')} />
                                  </div>
                                </div>
                              )}
                              {hasRealCorrect && (
                                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3">
                                  <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Poprawnie</span>
                                  </span>
                                  <div className="text-emerald-200 overflow-x-auto custom-scrollbar py-0.5">
                                    <MathRenderer content={trap.correct.replace(/^[✓✔\s]*(?:poprawnie|prawidłowo)[:\s-]*/i, '')} />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {trap.description && (
                            <div className="text-slate-300 text-xs sm:text-xs leading-relaxed bg-black/40 border border-white/5 rounded-xl p-3">
                              <MathRenderer content={trap.description} />
                            </div>
                          )}
                        </div>
                      );
                    })() : null}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0B0F17]/95 backdrop-blur-md flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Naciśnij Esc lub kliknij w tło, aby zamknąć
                </span>
                <button
                  id="session-formulas-close-drawer-button"
                  onClick={() => setShowFormulaSheet(false)}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FF8800] to-[#FFB800] hover:from-[#FFA000] hover:to-[#FFC833] text-slate-950 shadow-sm hover:shadow-md active:scale-98 transition cursor-pointer"
                >
                  Wróć do rozwiązywania zadania
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= HEARTS & SPONSOR MODALS ================= */}
      <OutOfHeartsModal
        isOpen={showOutOfHeartsModal}
        onClose={() => setShowOutOfHeartsModal(false)}
        onRefillWithCoins={handleRefillHeartsWithCoins}
        onOpenParentSponsor={() => {
          setShowOutOfHeartsModal(false);
          if (onOpenParentSponsor) {
            onOpenParentSponsor();
          } else {
            setShowParentSponsorModal(true);
          }
        }}
        onOpenProPopup={() => {
          setShowOutOfHeartsModal(false);
          if (onOpenProPopup) {
            onOpenProPopup();
          } else {
            setShowProPopup(true);
          }
        }}
        coins={userState?.coins ?? currentCoins}
        onOpenBlikModal={() => {
          setShowOutOfHeartsModal(false);
          onOpenBlikModal?.();
        }}
        initialTimeToNextRegenMs={heartsData.timeToNextRegenMs}
      />

      <ParentSponsorModal
        isOpen={showParentSponsorModal}
        onClose={() => setShowParentSponsorModal(false)}
        onActivatePro={handleActivatePro}
        studentName="Twój maturzysta"
      />

      <ProPopup
        isOpen={showProPopup}
        onClose={() => setShowProPopup(false)}
        onOpenParentSponsor={() => {
          setShowProPopup(false);
          if (onOpenParentSponsor) {
            onOpenParentSponsor();
          } else {
            setShowParentSponsorModal(true);
          }
        }}
        onActivatePro={handleActivatePro}
      />


      {/* Ocena policzona rubryką/heurystyką zamiast AI — jasna informacja dla ucznia */}
      {isApproximateEvaluation && isEvaluated && (
        <div className="fixed inset-x-0 top-2 z-[120] flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-none rounded-full border border-amber-500/30 bg-[#1A1408]/90 px-3 py-1 text-[11px] font-semibold text-amber-200/90 backdrop-blur">
            Ocena przybliżona — egzaminator AI był chwilowo niedostępny
          </div>
        </div>
      )}

      {/* Komunikat braku ewaluatora — bez utraty serca, z możliwością ponowienia */}
      {evaluationUnavailable && (
        <div className="fixed inset-x-0 bottom-24 z-[120] flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#1A1408]/95 backdrop-blur px-4 py-3.5 shadow-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-200">Egzaminator AI jest chwilowo niedostępny</p>
                <p className="mt-0.5 text-xs leading-relaxed text-amber-100/70">
                  Twoja odpowiedź <span className="font-semibold">nie została oceniona</span> i nie stracisz za nią serca.
                  {Array.isArray(currentTask?.rubric_stages) && currentTask.rubric_stages.length > 0
                    ? ' Możesz spróbować ponownie albo użyć samooceny etapami CKE.'
                    : ' Spróbuj ponownie za moment.'}
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEvaluationUnavailable(false);
                      triggerHaptic('medium');
                      handleCheckOpenAnswerWithTutor();
                    }}
                    className="rounded-xl bg-[#FFB800] hover:bg-amber-400 px-3.5 py-1.5 text-xs font-black text-amber-950 transition active:scale-95 cursor-pointer shadow-md"
                  >
                    Ponów sprawdzenie
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEvaluationUnavailable(false);
                      triggerHaptic('light');
                    }}
                    className="rounded-xl bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 transition active:scale-95 cursor-pointer"
                  >
                    Zamknij
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Immersive Cyber AI Tutor Neural Scanner Overlay */}
      {isTutorScanning && (
        <AiTutorScanOverlay
          isPolish={isPolishSession}
          isFinished={isScanFinished}
          onAnimationComplete={handleScanAnimationComplete}
          onCancel={() => {
            setIsTutorScanning(false);
            setIsScanFinished(false);
          }}
        />
      )}
      </div>
    </div>
  );
};

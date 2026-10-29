import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Hash,
  Maximize2,
  Minimize2,
  ArrowRight,
  Clock,
  FileText,
  CheckCircle2,
  Type,
  Flame
} from 'lucide-react';
import { PolishTask } from '../../types/maturaTypes';
import { CKE_READING_PAIRS } from '../../data/tasks_polski/part1_jezyk_w_uzyciu';

export interface PartOneReadingRoomProps {
  task?: PolishTask | null;
  className?: string;
  isPreReadingView?: boolean;
  onStartTasks?: () => void;
  onClosePreReading?: () => void;
  currentTaskNumber?: number;
}

interface ParsedParagraph {
  number: number;
  text: string;
}

function cleanParagraphContent(text: string): string {
  // Usuń zdublowany numer na początku np. "1. " lub "1) "
  return text.replace(/^\s*\d+[\.\)]\s*/, '').trim();
}

function parseParagraphs(passage?: { text?: string; paragraphs?: Array<{ number: number; text: string }> } | null): ParsedParagraph[] {
  if (!passage || !passage.text) return [];
  if (passage.paragraphs && passage.paragraphs.length > 0) {
    return passage.paragraphs;
  }
  // Podział na akapity wg numerów "1. ...", "2. ..." lub podwójnych enterów
  const rawBlocks = passage.text.split(/\n\s*\n/);
  return rawBlocks.map((block, idx) => {
    const match = block.match(/^\s*(\d+)\.\s*([\s\S]+)$/);
    if (match) {
      return { number: parseInt(match[1], 10), text: cleanParagraphContent(match[2]) };
    }
    return { number: idx + 1, text: cleanParagraphContent(block) };
  });
}

export const PartOneReadingRoom: React.FC<PartOneReadingRoomProps> = ({
  task,
  className = '',
  isPreReadingView = false,
  onStartTasks,
  onClosePreReading,
  currentTaskNumber = 1
}) => {
  const [tab, setTab] = useState<'p1' | 'p2' | 'both'>('p1');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [highlightedPara, setHighlightedPara] = useState<string | null>(null);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);

  // Domyślna para tekstów ćwiczeniowych JASNE w formacie CKE (Anna Zielińska vs Ewa Nowicka)
  const defaultPair = (typeof CKE_READING_PAIRS !== 'undefined' && Array.isArray(CKE_READING_PAIRS) && CKE_READING_PAIRS.length > 0)
    ? CKE_READING_PAIRS[0]
    : {
        id: 'para-1-turystyka',
        theme: 'Turystyka masowa a autentyzm i tożsamość kulturowa',
        text1: { author: 'Anna Zielińska', sourceTitle: 'W pogoni za autentyzmem', text: '', paragraphs: [] },
        text2: { author: 'Ewa Nowicka', sourceTitle: 'Pochwała spotkania z Innym', text: '', paragraphs: [] }
      };

  // Tekst 1: z zadania lub fallback
  const passage1 = (task?.passage && task.passage.text && task.passage.text.length > 50) ? task.passage : {
    author: defaultPair.text1.author,
    sourceTitle: defaultPair.text1.sourceTitle,
    text: defaultPair.text1.text,
    paragraphs: defaultPair.text1.paragraphs
  };

  // Tekst 2: z zadania lub fallback z pary CKE (zawsze dostępny w Części 1)
  const isSynthesisOrConfrontation =
    task?.taskType === 'synthesis_note' ||
    task?.granularType === 'T5_konfrontacja_stanowisk' ||
    Boolean(task?.passage2);

  const passage2 = (task?.passage2 && task.passage2.text && task.passage2.text.length > 50) ? task.passage2 : {
    author: defaultPair.text2.author,
    sourceTitle: defaultPair.text2.sourceTitle,
    text: defaultPair.text2.text,
    paragraphs: defaultPair.text2.paragraphs
  };

  useEffect(() => {
    if (isPreReadingView || isSynthesisOrConfrontation) {
      setTab('both');
    } else {
      setTab('p1');
    }
  }, [task?.id, isSynthesisOrConfrontation, isPreReadingView]);

  const fontClasses = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-loose'
  };

  const countWords = (str?: string) => {
    if (!str) return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const paras1 = parseParagraphs(passage1);
  const paras2 = parseParagraphs(passage2);

  const scrollToParagraph = (prefix: 'p1' | 'p2', paraNumber: number) => {
    const targetId = `${prefix}-para-${paraNumber}`;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedPara(targetId);
      setTimeout(() => {
        setHighlightedPara((curr) => (curr === targetId ? null : curr));
      }, 2500);
    }
  };

  // Renderowanie pełnego, płynnego artykułu (nie jako kafelków, lecz jako całego tekstu)
  const renderContinuousArticle = (
    passage: { author?: string; sourceTitle?: string; text: string; paragraphs?: Array<{ number: number; text: string }> },
    label: string,
    prefix: 'p1' | 'p2',
    themeColor: 'amber' | 'rose'
  ) => {
    const paras = prefix === 'p1' ? paras1 : paras2;
    const wordCount = countWords(passage.text);
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 160));

    const colorClasses = {
      badge: themeColor === 'amber'
        ? 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30'
        : 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/30',
      paraBadge: themeColor === 'amber'
        ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
        : 'bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
      activeJump: themeColor === 'amber'
        ? 'bg-amber-500 text-slate-950 font-bold shadow-md ring-1 ring-amber-400'
        : 'bg-rose-500 text-white font-bold shadow-md ring-1 ring-rose-400',
      highlighted: themeColor === 'amber'
        ? 'bg-amber-100/70 dark:bg-amber-500/20 text-slate-900 dark:text-amber-50 ring-2 ring-amber-500/60 rounded-xl p-3.5 -mx-2.5 shadow-lg shadow-amber-500/10'
        : 'bg-rose-100/70 dark:bg-rose-500/20 text-slate-900 dark:text-rose-50 ring-2 ring-rose-500/60 rounded-xl p-3.5 -mx-2.5 shadow-lg shadow-rose-500/10'
    };

    return (
      <article
        className={`p-5 sm:p-7 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 shadow-md dark:shadow-xl space-y-5 transition-all ${
          fontFamily === 'serif' ? 'font-serif' : 'font-sans'
        }`}
      >
        {/* Metadane dzieła (Autor, Tytuł, Źródło) */}
        <header className="pb-4 border-b border-slate-200 dark:border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${colorClasses.badge}`}>
              {label} • Tekst Źródłowy CKE
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                ok. {readingMinutes} min lektury
              </span>
              <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {wordCount} słów
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {passage.sourceTitle ? `„${passage.sourceTitle}”` : 'Tekst nieliteracki'}
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400/90 mt-0.5">
              Autor: {passage.author || 'Autor artykułu'}
            </p>
          </div>
        </header>

        {/* Pasek szybkiego skoku do akapitów */}
        {paras.length > 1 && (
          <nav
            aria-label={`Spis akapitów tekstu: ${passage.sourceTitle}`}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin text-xs"
          >
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Hash className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Akapity:
            </span>
            {paras.map((p) => {
              const isTarget = highlightedPara === `${prefix}-para-${p.number}`;
              return (
                <button
                  key={p.number}
                  type="button"
                  onClick={() => scrollToParagraph(prefix, p.number)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isTarget
                      ? colorClasses.activeJump
                      : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                  title={`Przewiń do akapitu ${p.number}`}
                >
                  §{p.number}
                </button>
              );
            })}
          </nav>
        )}

        {/* Płynne ciało całego tekstu (ciągły tekst z wcięciami i markerami akapitów) */}
        <div className="space-y-4 text-slate-700 dark:text-slate-200">
          {paras.map((p) => {
            const targetId = `${prefix}-para-${p.number}`;
            const isTarget = highlightedPara === targetId;
            return (
              <p
                key={p.number}
                id={targetId}
                className={`${fontClasses[fontSize]} text-justify leading-relaxed transition-all duration-300 relative ${
                  isTarget
                    ? colorClasses.highlighted
                    : 'hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center font-mono font-bold text-[11px] rounded px-1.5 py-0.5 mr-2 select-none align-baseline border ${colorClasses.paraBadge}`}
                  title={`Akapit ${p.number}`}
                >
                  §{p.number}
                </span>
                {cleanParagraphContent(p.text)}
              </p>
            );
          })}
        </div>

        {/* Stopka źródłowa */}
        <footer className="pt-3 border-t border-slate-200 dark:border-slate-800/70 text-[11px] text-slate-500 dark:text-slate-400 italic flex flex-wrap items-center justify-between gap-2">
          <span>Formuła 2023 • Egzamin maturalny z języka polskiego (poziom podstawowy)</span>
          <span>{passage.author}, {passage.sourceTitle}</span>
        </footer>
      </article>
    );
  };

  // =========================================================================
  // 1. WIDOK WSTĘPNEJ CZYTELNI (PRE-READING ONBOARDING PRZED ZADANIAMI)
  // =========================================================================
  if (isPreReadingView) {
    return (
      <div className={`space-y-6 animate-fadeIn ${className}`}>
        {/* Baner Wstępny CKE */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1522] border border-[#141d2e] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffb800]/15 border border-[#ffb800]/30 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-[#ffb800]" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffb800]">
                  Część I: Język polski w użyciu • Etap 1/2
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Zapoznaj się z tekstami przed rozpoczęciem zadań
                </h2>
              </div>
            </div>

            {onStartTasks && (
              <button
                type="button"
                onClick={onStartTasks}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffdca1] to-[#ffb800] hover:brightness-110 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ffb800]/20 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <span>Rozpocznij rozwiązywanie zadań (Zadanie {currentTaskNumber})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-4xl">
            Zgodnie ze standardem CKE Formuła 2023, wszystkie pytania Części 1 (prawda/fałsz, analiza funkcji językowych, wyjaśnienie metafor, konfrontacja stanowisk oraz notatka syntetyzująca za 4 pkt) opierają się na poniższych tekstach źródłowych. Przeczytaj je uważnie, aby bez trudu odpowiadać na pytania.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-xl bg-[#070a0f] border border-[#141d2e] text-[#dfe2f1] flex items-center gap-1.5 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#ffb800]" />
              Zalecany czas czytania: <strong>6–8 minut</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#070a0f] border border-[#141d2e] text-[#dfe2f1] flex items-center gap-1.5 shadow-xs">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Łączna objętość: <strong>{countWords(passage1.text) + countWords(passage2?.text)} słów</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#070a0f] border border-[#ffb800]/20 text-[#ffdca1] flex items-center gap-1.5 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Po rozpoczęciu zadań teksty będą cały czas dostępne w oknie bocznym
            </span>
          </div>
        </div>

        {/* Pasek Narzędziowy Czytelni (Zakładki + Rozmiar i Rodzaj Czcionki) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0e1522] border border-[#141d2e] shadow-sm">
          {/* Przełącznik Tekstów */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTab('p1')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                tab === 'p1'
                  ? 'bg-[#ffb800] text-slate-950 font-bold shadow-md'
                  : 'bg-[#070a0f] text-[#94a3b8] hover:text-white border border-[#141d2e]'
              }`}
            >
              Tekst 1: {passage1.author}
            </button>
            {passage2 && (
              <button
                type="button"
                onClick={() => setTab('p2')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  tab === 'p2'
                    ? 'bg-rose-500 text-white font-bold shadow-md'
                    : 'bg-[#070a0f] text-[#94a3b8] hover:text-white border border-[#141d2e]'
                }`}
              >
                Tekst 2: {passage2.author}
              </button>
            )}
            {passage2 && (
              <button
                type="button"
                onClick={() => setTab('both')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  tab === 'both'
                    ? 'bg-indigo-600 text-white font-bold shadow-md'
                    : 'bg-[#070a0f] text-[#94a3b8] hover:text-white border border-[#141d2e]'
                }`}
              >
                Widok Porównawczy (Oba teksty)
              </button>
            )}
          </div>

          {/* Kontrolki Typograficzne */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#070a0f] p-1 rounded-xl border border-[#141d2e] text-xs">
              <button
                type="button"
                onClick={() => setFontFamily('serif')}
                className={`px-2.5 py-1 rounded-lg font-serif transition-all cursor-pointer ${
                  fontFamily === 'serif'
                    ? 'bg-[#ffb800]/20 text-[#ffdca1] font-bold'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
                title="Czcionka szeryfowa (tradycyjny druk CKE)"
              >
                Druk CKE
              </button>
              <button
                type="button"
                onClick={() => setFontFamily('sans')}
                className={`px-2.5 py-1 rounded-lg font-sans transition-all cursor-pointer ${
                  fontFamily === 'sans'
                    ? 'bg-[#ffb800]/20 text-[#ffdca1] font-bold'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
                title="Czcionka bezszeryfowa"
              >
                Sans
              </button>
            </div>

            <div className="flex items-center bg-[#070a0f] p-1 rounded-xl border border-[#141d2e] text-xs">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  fontSize === 'sm' ? 'bg-[#ffb800]/20 text-[#ffdca1] font-bold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  fontSize === 'base' ? 'bg-[#ffb800]/20 text-[#ffdca1] font-bold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  fontSize === 'lg' ? 'bg-[#ffb800]/20 text-[#ffdca1] font-bold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Prezentacja Tekstów */}
        {tab === 'both' && passage2 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {renderContinuousArticle(passage1, 'Tekst 1', 'p1', 'amber')}
            {renderContinuousArticle(passage2, 'Tekst 2', 'p2', 'rose')}
          </div>
        ) : tab === 'p2' && passage2 ? (
          renderContinuousArticle(passage2, 'Tekst 2', 'p2', 'rose')
        ) : (
          renderContinuousArticle(passage1, 'Tekst 1', 'p1', 'amber')
        )}

        {/* Dolny Pasek Akcji */}
        {onStartTasks && (
          <div className="sticky bottom-4 z-20 p-4 sm:p-5 rounded-2xl bg-[#0e1522]/95 backdrop-blur-md border border-[#ffb800]/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-[#dfe2f1]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Teksty przeczytane? Możesz teraz przejść do rozwiązywania pytań z pełnym kontekstem.</span>
            </div>
            <button
              type="button"
              onClick={onStartTasks}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#ffdca1] to-[#ffb800] hover:brightness-110 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ffb800]/25 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <span>Rozpocznij rozwiązywanie zadań CKE →</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. WIDOK CZYTELNI BOCZNEJ (SPLIT-SCREEN OBOK PYTAŃ)
  // =========================================================================
  return (
    <>
      <aside
        aria-label="Czytelnia Tekstów Źródłowych CKE"
        className={`bg-[#0e1522] border border-[#141d2e] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col max-h-[calc(100vh-3rem)] ${className}`}
      >
        {/* Nagłówek Czytelni */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#141d2e] gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffb800]/10 border border-[#ffb800]/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#ffb800]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Czytelnia Tekstów CKE</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ffb800]/15 text-[#ffdca1] font-mono">
                  Pełny tekst
                </span>
              </h3>
              <p className="text-[10px] text-[#94a3b8]">Część I: Język polski w użyciu</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Przycisk Pełnego Ekranu */}
            <button
              type="button"
              onClick={() => setIsFullscreenModal(true)}
              className="p-1.5 rounded-lg bg-[#070a0f] hover:bg-[#141d2e] border border-[#141d2e] text-[#94a3b8] hover:text-[#ffdca1] transition-colors cursor-pointer"
              title="Otwórz pełny widok czytelni"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Rozmiar czcionki */}
            <div className="flex items-center bg-[#070a0f] p-0.5 rounded-lg border border-[#141d2e] text-[11px]">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                  fontSize === 'sm' ? 'bg-[#ffb800]/20 text-[#ffdca1] font-bold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                  fontSize === 'base' ? 'bg-[#ffb800]/20 text-[#ffdca1] font-bold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                  fontSize === 'lg' ? 'bg-[#ffb800]/20 text-[#ffdca1] font-bold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Zakładki Tekst 1 / Tekst 2 / Oba teksty */}
        {passage2 && (
          <div className="grid grid-cols-3 gap-1 bg-[#070a0f] p-1 rounded-xl border border-[#141d2e] text-xs font-medium my-3 shrink-0">
            <button
              type="button"
              onClick={() => setTab('p1')}
              className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                tab === 'p1'
                  ? 'bg-[#ffb800] text-slate-950 font-bold shadow-xs'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Tekst 1
            </button>
            <button
              type="button"
              onClick={() => setTab('p2')}
              className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                tab === 'p2'
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Tekst 2
            </button>
            <button
              type="button"
              onClick={() => setTab('both')}
              className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                tab === 'both'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Oba teksty
            </button>
          </div>
        )}

        {/* Przewijana przestrzeń czytelnicza z pełnymi tekstami */}
        <div className="overflow-y-auto pr-1 space-y-4 pt-2 flex-1 scrollbar-thin reading-room-scroll">
          {(tab === 'p1' || tab === 'both' || !passage2) && (
            renderContinuousArticle(passage1, 'Tekst 1', 'p1', 'amber')
          )}

          {(tab === 'p2' || tab === 'both') && passage2 && (
            renderContinuousArticle(passage2, 'Tekst 2', 'p2', 'rose')
          )}

          {/* Notatka CKE o rygorze merytorycznym */}
          <div className="p-3.5 rounded-xl bg-[#070a0f] border border-[#141d2e] text-[11px] text-[#94a3b8] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Wszystkie odpowiedzi w Części 1 formułuj na podstawie powyższych tekstów. Kliknij numer §1–§5, aby natychmiast odnaleźć fragment wskazywany w poleceniu.
            </span>
          </div>
        </div>
      </aside>

      {/* Modal Pełnoekranowy Czytelni na żądanie */}
      {isFullscreenModal && (
        <div className="fixed inset-0 z-50 bg-[#070a0f]/95 backdrop-blur-md p-4 sm:p-8 overflow-y-auto animate-fadeIn">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#141d2e]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#ffb800]" />
                <h3 className="text-lg font-bold text-white">Pełna Czytelnia Tekstów CKE</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreenModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0e1522] hover:bg-[#141d2e] border border-[#141d2e] text-[#dfe2f1] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Zamknij pełny ekran</span>
              </button>
            </div>

            <div className="space-y-6">
              {renderContinuousArticle(passage1, 'Tekst 1', 'p1', 'amber')}
              {passage2 && renderContinuousArticle(passage2, 'Tekst 2', 'p2', 'rose')}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

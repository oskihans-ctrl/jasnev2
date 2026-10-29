/**
 * Buduje kurs matematyki PP: 15 działów × 5 lekcji (teoria Core-4) + 20 unikalnych zadań na lekcję:
 * 16 zamkniętych / krótkich (gens) i 4 otwarte oceniane etapami CKE (open) – jak w kursie rozszerzonym.
 * Każda lekcja deklaruje wymagania podstawy programowej 2024 (requirements), sprawdzane z wymagania_2024.json.
 * Wyjście:
 *   src/data/math/generated/math_blueprints.json  – działy i lekcje (pigułki teorii)
 *   src/data/math/generated/all_1500_tasks.json   – zadania przypisane do lekcji
 * Uruchomienie: node scripts/math_pp/build.js [--only=3] [--sample=plik.txt]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { makeR, finalize, Retry, evalTex, close } from './lib.js';
import { OPEN } from './open.js';
import { LESSON_REQUIREMENTS } from './requirements.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../../src/data/math/generated');
const TASKS_PER_LESSON = 20;
// Na arkuszach PP od grudnia 2024 r. połowa punktów to zadania otwarte (ok. 10 zadań po 2–4 pkt),
// dlatego każda lekcja ma w puli 4 zadania otwarte z etapami z zasad oceniania CKE.
const OPEN_PER_LESSON = 4;
const REQS_PP = new Set(
  JSON.parse(fs.readFileSync(path.join(__dirname, '../../docs/curriculum/matematyka_pr/wymagania_2024.json'), 'utf8'))
    .filter((q) => q.level === 'PP')
    .map((q) => q.code)
);

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const only = args.only ? args.only.split(',').map(Number) : null;

const topics = [];
for (let d = 1; d <= 15; d++) {
  const file = path.join(__dirname, `dzial_${String(d).padStart(2, '0')}.js`);
  if (!fs.existsSync(file)) continue;
  if (only && !only.includes(d)) continue;
  const mod = await import(`file://${file.replace(/\\/g, '/')}`);
  topics.push(mod.default);
}

const errors = [];
const fail = (msg) => errors.push(msg);

function lintText(id, text, where) {
  const dollars = (text.match(/(?<!\\)\$/g) || []).length;
  if (dollars % 2 !== 0) fail(`${id}: nieparzysta liczba $ (${where})`);
  const checks = [
    [/undefined|NaN|Infinity|\[object/, 'śmieci JS'],
    [/\\\\[a-zA-Z]/, 'podwójny backslash przed poleceniem LaTeX'],
    [/(?<![\d,}])1\\sqrt/, 'współczynnik 1 przed pierwiastkiem'],
    [/\+\s*-|-\s*-\s*\d|\+\s*\+/, 'podwójny znak'],
    [/(?<![\d,{}])\b1(x|n|a|y)\b(?!\w)/, 'współczynnik 1 przed zmienną'],
    [/\d\.\d/, 'kropka dziesiętna zamiast przecinka'],
    [/\d{,}\d*0{6,}|\d{,}\d*9{6,}/, 'artefakt zmiennoprzecinkowy'],
    [/\\iff|\\vee|\\wedge|\\forall|\\exists|\\implies|\\Rightarrow|\\Leftrightarrow/, 'formalizm logiczny zakazany na PP'],
    [/\{0\}\{|\\frac\{[^{}]*\}\{0\}/, 'zero w ułamku']
  ];
  for (const [re, name] of checks) {
    const mm = text.match(re);
    if (mm) fail(`${id}: ${name} „${mm[0]}” (${where}): ${text.slice(Math.max(0, mm.index - 40), mm.index + 40).replace(/\n/g, ' ')}`);
  }
}

const allTasks = [];
const blueprints = [];
const sample = [];

for (const t of topics) {
  const d = t.numericId;
  const topicId = `dzial-${d}`;
  if (t.lessons.length !== 5) fail(`${topicId}: liczba lekcji ${t.lessons.length} != 5`);
  const bpLessons = [];
  t.lessons.forEach((l, li) => {
    const order = li + 1;
    const lessonId = `math-lesson-${d}-${order}`;
    const lessonKey = `${d}.${order}`;
    const archetypeCode = `L${d}.${order}`;
    const r = makeR(d * 1000 + order * 37);
    const seen = new Set();
    const perGen = l.gens.map(() => 0);
    const quota = Math.ceil(TASKS_PER_LESSON / l.gens.length);
    const lessonTasks = [];
    let attempts = 0;
    let gi = 0;
    // Najpierw zadania zamknięte: ta sama sekwencja losowań co wcześniej, więc pozycje 01–16 się nie zmieniają.
    const closedTarget = TASKS_PER_LESSON - OPEN_PER_LESSON;
    while (lessonTasks.length < closedTarget && attempts < 20000) {
      attempts++;
      const g = gi % l.gens.length;
      gi++;
      if (perGen[g] >= quota + 2) continue;
      let raw;
      try {
        raw = l.gens[g](r);
      } catch (e) {
        if (e instanceof Retry) continue;
        throw new Error(`${lessonKey} gen#${g}: ${e.message}`);
      }
      const uniqKey = raw.q + (raw.diagram ? JSON.stringify(raw.diagram) : '');
      if (!raw || seen.has(uniqKey)) continue;
      seen.add(uniqKey);
      perGen[g]++;
      const n = lessonTasks.length + 1;
      const task = finalize(
        raw,
        {
          id: `mat-pp-${d}-${order}-${String(n).padStart(2, '0')}`,
          lessonId,
          lessonKey,
          topicId,
          sectionTitle: `Dział ${d}: ${t.title}`,
          archetypeCode,
          category: t.short_title
        },
        r
      );
      lessonTasks.push(task);
    }
    // Potem zadania otwarte (pozycje 17–20) z generatorów `open` lekcji
    const openGens = l.open || OPEN[lessonKey] || [];
    if (!openGens.length) fail(`${lessonKey} „${l.title}”: brak generatorów zadań otwartych (open)`);
    const perOpen = openGens.map(() => 0);
    let oi = 0;
    while (openGens.length && lessonTasks.length < TASKS_PER_LESSON && attempts < 40000) {
      attempts++;
      const g = oi % openGens.length;
      oi++;
      if (perOpen[g] >= Math.ceil(OPEN_PER_LESSON / openGens.length) + 1) continue;
      let raw;
      try {
        raw = openGens[g](r);
      } catch (e) {
        if (e instanceof Retry) continue;
        throw new Error(`${lessonKey} open#${g}: ${e.message}`);
      }
      if (raw.kind !== 'open') throw new Error(`${lessonKey} open#${g}: generator nie zwraca zadania otwartego`);
      if (seen.has(raw.q)) continue;
      seen.add(raw.q);
      perOpen[g]++;
      const n = lessonTasks.length + 1;
      lessonTasks.push(finalize(raw, { id: `mat-pp-${d}-${order}-${String(n).padStart(2, '0')}`, lessonId, lessonKey, topicId, sectionTitle: `Dział ${d}: ${t.title}`, archetypeCode, category: t.short_title }, r));
    }
    if (lessonTasks.length < TASKS_PER_LESSON) {
      fail(`${lessonKey} „${l.title}”: tylko ${lessonTasks.length} unikalnych zadań (zamknięte: ${perGen.join(',')}; otwarte: ${perOpen.join(',')})`);
    }
    // wymagania podstawy programowej 2024
    const reqs = l.requirements || LESSON_REQUIREMENTS[lessonKey] || [];
    l.requirements = reqs;
    if (!reqs.length) fail(`${lessonKey}: brak wymagań podstawy programowej (requirements)`);
    for (const c of reqs) if (!REQS_PP.has(c)) fail(`${lessonKey}: wymaganie ${c} nie należy do podstawy PP 2024`);
    for (const task of lessonTasks) task.requirements = reqs;
    // kontrole zadań
    for (const task of lessonTasks) {
      lintText(task.id, task.content, 'treść');
      lintText(task.id, task.explanation, 'wyjaśnienie');
      lintText(task.id, task.matura_tip || '', 'wskazówka');
      if (!task.matura_tip) fail(`${task.id}: brak wskazówki`);
      if (task.type === 'TRUE_FALSE') {
        if (task.statements?.length !== 2 || !/^[PF]{2}$/.test(task.correct_answer)) fail(`${task.id}: zadanie P/F wymaga 2 stwierdzeń i klucza typu PF`);
        (task.statements || []).forEach((st) => lintText(task.id, st.text, 'stwierdzenie'));
      }
      if (task.type === 'SINGLE_CHOICE') {
        task.options.forEach((o) => lintText(task.id, o, 'opcja'));
        if (new Set(task.options.map((o) => o.replace(/\s+/g, ''))).size !== 4) fail(`${task.id}: powtórzone opcje`);
        const vals = task.options.map(evalTex);
        for (let i = 0; i < 4; i++)
          for (let j = i + 1; j < 4; j++)
            if (vals[i] !== null && vals[j] !== null && close(vals[i], vals[j])) fail(`${task.id}: dwie opcje o tej samej wartości (${task.options[i]} / ${task.options[j]})`);
        if (!'ABCD'.includes(task.correct_answer)) fail(`${task.id}: zły klucz`);
      }
      if (/rysunk|wykres(?:ie)? przedstawion/i.test(task.content) && !task.diagram && !task.numberLine) fail(`${task.id}: odwołanie do rysunku bez rysunku`);
      if (/^OPEN_/.test(task.type)) {
        const st = task.rubric_stages || [];
        if (st.length < 2 || st[st.length - 1].points !== task.points) fail(`${task.id}: etapy oceniania (${st.length}) niezgodne z punktacją ${task.points}`);
        if (task.points > 5) fail(`${task.id}: zadanie otwarte PP za więcej niż 5 pkt`);
        st.forEach((x) => lintText(task.id, x.criterion, 'etap'));
      }
    }
    // kontrole pigułki
    const pl = l.pill;
    const pillText = JSON.stringify({ ...pl, reading_time_minutes: undefined });
    lintText(`${lessonKey}/teoria`, pillText.replace(/\\\\/g, '\\').replace(/\\n/g, '\n').replace(/\\"/g, '"'), 'teoria');
    for (const k of ['concept_essence', 'matura_context', 'plain_polish', 'exam_trap']) if (!pl[k] || pl[k].length < 30) fail(`${lessonKey}: brak ${k}`);
    if (!pl.core_formulas.length) fail(`${lessonKey}: brak core_formulas`);
    if (!pl.worked_examples.length) fail(`${lessonKey}: brak worked_examples`);
    // SessionRunner czyta kroki z pola `steps`, a MathStudyHub – z `worked_example.solution`:
    // uzupełniamy oba warianty, żeby żaden widok nie musiał „dorabiać” przykładu z zadań lekcji.
    pl.worked_examples = pl.worked_examples.map((ex) => ({
      ...ex,
      steps:
        ex.steps ||
        String(ex.solution || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, i) => ({ num: i + 1, text: line.replace(/^\d+[.)]\s*/, '') }))
    }));
    // „Odpowiedź końcowa” przykładu: jawne pole `result`, żeby widok nie musiał wycinać wyniku z ostatniego kroku
    // (psuło to ograniczniki $...$ i gubiło część odpowiedzi, np. jeden z dwóch pierwiastków równania).
    // Ostatni krok rozwiązania w całości staje się odpowiedzią końcową.
    pl.worked_examples = pl.worked_examples.map((ex) => {
      if (ex.result || ex.steps.length < 2) return ex;
      const last = ex.steps[ex.steps.length - 1];
      return { ...ex, steps: ex.steps.slice(0, -1), result: String(last.text).replace(/^Krok \d+:\s*/, '') };
    });
    for (const ex of pl.worked_examples) if (!ex.problem || !ex.steps.length) fail(`${lessonKey}: przykład bez treści lub kroków`);
    pl.worked_example = pl.worked_examples[0];

    allTasks.push(...lessonTasks);
    bpLessons.push({
      id: lessonId,
      order,
      title: l.title,
      short_title: l.short_title,
      badge: `Lekcja ${lessonKey}`,
      archetypeCode,
      requirements: l.requirements || [],
      estimated_time_formatted: l.time || '~5 min',
      theory_pill: pl
    });
    // próbka do przeglądu: po 2 zadania z każdego generatora
    const byTitle = {};
    for (const task of lessonTasks) (byTitle[task.title] = byTitle[task.title] || []).push(task);
    sample.push(`\n=== ${lessonKey} ${l.title} (${Object.entries(byTitle).map(([k, v]) => `${k}: ${v.length}`).join('; ')})`);
    for (const list of Object.values(byTitle))
      for (const task of list.slice(0, args.n ? Number(args.n) : 2)) {
        sample.push(
          `[${task.id}] ${task.content.replace(/^Dokończ zdanie\. Wybierz właściwą odpowiedź spośród podanych\.\s*/, '').replace(/\n+/g, ' ⏎ ')}\n   ${
            task.options ? task.options.map((o, i) => 'ABCD'[i] + ') ' + o).join('   ') : ''
          } => ${task.correct_answer}\n   ${task.explanation.replace(/\*\*/g, '').replace(/\n+/g, ' ⏎ ')}\n   TIP: ${task.matura_tip}${task.diagram ? '\n   DIAGRAM: ' + JSON.stringify(task.diagram.plotData ? task.diagram.plotData.segments.map((s) => [s.from, s.to, s.startDot, s.endDot]) : task.diagram).slice(0, 300) : ''}`
        );
      }
  });
  blueprints.push({
    id: topicId,
    numericId: d,
    title: t.title,
    short_title: t.short_title,
    description: t.description,
    icon: t.icon,
    color: t.color,
    matura_points_range: t.matura_points_range,
    importance: t.importance,
    cke_formula_page: t.cke_formula_page,
    lessons: bpLessons
  });
}

// globalne kontrole
const ids = new Set();
const contents = new Set();
for (const task of allTasks) {
  if (ids.has(task.id)) fail(`duplikat id ${task.id}`);
  ids.add(task.id);
  const ck = task.content + (task.statements ? JSON.stringify(task.statements.map((st) => st.text)) : '') + (task.diagram ? JSON.stringify(task.diagram) : '');
  if (contents.has(ck)) fail(`duplikat treści ${task.id}`);
  contents.add(ck);
}
const dist = { A: 0, B: 0, C: 0, D: 0 };
allTasks.filter((x) => x.type === 'SINGLE_CHOICE').forEach((x) => dist[x.correct_answer]++);

if (args.sample) fs.writeFileSync(args.sample, sample.join('\n'), 'utf8');

console.log(`Działy: ${blueprints.length}, lekcje: ${blueprints.reduce((s, b) => s + b.lessons.length, 0)}, zadania: ${allTasks.length} (unikalne treści: ${contents.size})`);
console.log('Rozkład klucza:', dist, '| NUMERIC_INPUT:', allTasks.filter((x) => x.type === 'NUMERIC_INPUT').length);
if (errors.length) {
  console.error(`\nBŁĘDY (${errors.length}):\n` + errors.slice(0, 60).join('\n'));
  process.exit(1);
}
if (!only) {
  if (blueprints.length !== 15 || allTasks.length !== 1500) {
    console.error('Niepełny kurs – nie zapisuję plików wynikowych.');
    process.exit(1);
  }
  // Punktacja działów: rzeczywisty rozkład z 6 arkuszy CKE 2023–2024 (seed/curriculum/cke_weights.json –
  // ta sama tabela zasila predyktor wyniku), a nie szacunek wpisany ręcznie w pliku działu.
  const weightsPath = path.resolve(OUT_DIR, '..', '..', '..', '..', 'seed', 'curriculum', 'cke_weights.json');
  const weights = JSON.parse(fs.readFileSync(weightsPath, 'utf8')).subjects['matematyka-podstawowa'].topics;
  for (const bp of blueprints) {
    const w = weights[bp.id];
    if (!w) fail(`${bp.id}: brak wag CKE w cke_weights.json`);
    else {
      bp.matura_points_range = w.minPoints === w.maxPoints ? `${w.maxPoints} pkt` : `${w.minPoints}–${w.maxPoints} pkt`;
      bp.importance = w.importance === 'CRITICAL_PEWNIAK' ? 'CRITICAL_PEWNIAK' : 'HIGH';
    }
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'math_blueprints.json'), JSON.stringify(blueprints, null, 1), 'utf8');

  // Ten sam kurs w schemacie zasilającym Firestore (scripts/seed_database.cjs):
  // subjects/matematyka-podstawowa/topics/{dzial}/lessons/{lekcja} z pigułką i pełną pulą 20 zadań.
  const seedTask = (t) => ({
    id: t.id,
    type: t.type,
    points: t.points,
    maxPoints: t.points,
    title: t.title,
    source: 'JASNE • zadanie autorskie w stylu CKE',
    badge: `Lekcja ${t.lessonKey}`,
    question: t.content,
    content: t.content,
    math_statement: t.content,
    ...(t.options ? { options: t.options.map((text, i) => ({ id: 'ABCD'[i], text, content_latex: text, is_correct: 'ABCD'[i] === t.correct_answer })) } : {}),
    ...(t.statements ? { statements: t.statements } : {}),
    correct_answer: t.correct_answer,
    ...(t.type === 'NUMERIC_INPUT' ? { numeric_correct_answer: t.correct_answer } : {}),
    explanation: t.explanation,
    matura_tip: t.matura_tip,
    hints: { level_1: t.matura_tip, level_2: (t.explanation.match(/\*\*Krok 1:\*\*\s*([\s\S]*?)(?:\n\n|$)/) || [])[1] || '' },
    ...(t.diagram ? { diagram: t.diagram } : {}),
    ...(t.numberLine ? { numberLine: t.numberLine } : {})
  });
  const seedCurriculum = {
    module_id: 'matematyka-podstawowa',
    module_title: 'Matematyka – poziom podstawowy (wymagania CKE od 2025 r.)',
    module_description: 'Kurs generowany przez scripts/math_pp/build.js – nie edytuj ręcznie.',
    total_topics: blueprints.length,
    total_lessons: blueprints.reduce((n, b) => n + b.lessons.length, 0),
    total_tasks: allTasks.length,
    topics: blueprints.map((bp) => ({
      id: bp.id,
      numericId: bp.numericId,
      topic_number: bp.numericId,
      order: bp.numericId,
      title: bp.title,
      short_title: bp.short_title,
      description: bp.description,
      icon: bp.icon,
      color: bp.color,
      importance: bp.importance,
      matura_points_range: bp.matura_points_range,
      cke_formula_page: bp.cke_formula_page,
      lessons: bp.lessons.map((l) => ({
        id: l.id,
        topic_id: bp.id,
        title: l.title,
        estimated_time_minutes: Number(String(l.estimated_time_formatted).replace(/\D/g, '')) || 5,
        estimated_time_formatted: l.estimated_time_formatted,
        required_correct_tasks: 3,
        theory_pill: l.theory_pill,
        tasks: allTasks.filter((t) => t.lessonId === l.id).map(seedTask)
      }))
    }))
  };
  fs.writeFileSync(path.resolve(path.dirname(weightsPath), 'curriculum_matematyka_pp.json'), JSON.stringify(seedCurriculum, null, 1) + '\n', 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'all_1500_tasks.json'), JSON.stringify(allTasks, null, 1), 'utf8');
  console.log('Zapisano math_blueprints.json, all_1500_tasks.json i seed/curriculum/curriculum_matematyka_pp.json');
}

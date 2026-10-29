/**
 * Audyt zgodności kursu matematyki z założeniami CKE / Core-4.
 * Sprawdza wygenerowane zadania i pigułki (PP albo PR) niezależnie od generatora:
 *  - klucz: poprawna odpowiedź istnieje, opcje są unikalne, wyjaśnienie wskazuje tę samą literę;
 *  - KaTeX: każdy fragment $...$ / $$...$$ renderuje się bez błędu;
 *  - Core-4: 5 sekcji Bento, „Z polskiego na nasze”, przykład liczbowy, brak formalizmu logicznego (PP);
 *  - zakres: treści spoza podstawy programowej 2024 dla danego poziomu;
 *  - formaty: rozkład typów zadań w lekcji i w całym kursie.
 * Uruchomienie: node scripts/math_pp/audit.js [pp|pr] [--json=plik]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import katex from 'katex';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const level = (process.argv[2] || 'pp').toLowerCase();
const args = Object.fromEntries(process.argv.slice(3).map((a) => a.replace(/^--/, '').split('=')));
const GEN = path.join(__dirname, '../../src/data/math/generated');
const tasks = JSON.parse(fs.readFileSync(path.join(GEN, level === 'pr' ? 'pr_tasks.json' : 'all_1500_tasks.json'), 'utf8'));
const blueprints = JSON.parse(fs.readFileSync(path.join(GEN, level === 'pr' ? 'pr_blueprints.json' : 'math_blueprints.json'), 'utf8'));

const issues = [];
const add = (kind, id, msg) => issues.push({ kind, id, msg });

// ---------- KaTeX ----------
function mathChunks(text) {
  const s = String(text || '');
  const out = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let m;
  while ((m = re.exec(s))) out.push({ tex: m[1] ?? m[2], display: m[1] !== undefined });
  return out;
}
function checkKatex(id, text, where) {
  for (const { tex, display } of mathChunks(text)) {
    try {
      katex.renderToString(tex, { throwOnError: true, displayMode: display, strict: 'ignore' });
    } catch (e) {
      add('katex', id, `${where}: ${String(e.message).slice(0, 90)} | ${tex.slice(0, 60)}`);
    }
  }
}

// ---------- zakres podstawy 2024 ----------
const LOGIC = /\\iff|\\vee|\\wedge|\\forall|\\exists|\\implies|\\Rightarrow|\\Leftrightarrow/;
const OUT_OF_SCOPE_PP = [
  // „bez odchylenia standardowego” w uwagach o zakresie nie jest treścią PR
  [/(?<!bez )odchyleni[ea] standardow|\\sigma\b/i, 'odchylenie standardowe (usunięte z podstawy 2024, XII.2)'],
  // tylko proste prostopadłe w geometrii analitycznej; prostopadłość w planimetrii i stereometrii (X.1) jest w PP
  [/prost[aąeyi]\w*\s+prostopadł\w*\s+do\s+prostej|a_1 \\cdot a_2 = -1/i, 'prosta prostopadła (w 2024 wymaganie PR: IX.R4)'],
  [/\\binom|symbol Newtona|kombinacj|wariacj|permutacj/i, 'symbol Newtona / kombinacje (PR: XI.R1, XI.R2)'],
  [/prawdopodobieństw[oa] warunkow|wzór Bayesa|całkowit[ey]m prawdopodob/i, 'prawdopodobieństwo warunkowe (PR: XII.R1)'],
  [/\\lim|granic[aęy] (funkcji|ciągu)|pochodn/i, 'granica / pochodna (PR)'],
  // wartość funkcji logarytmicznej jest w PP (V.14); PR to równania i nierówności z niewiadomą pod logarytmem
  [/(rozwiąż|równani|nierówno)[^.]*\\log[^$]*x|logarytm[a-z]* nierówno|nierówności? logarytm/i, 'równanie/nierówność logarytmiczna z niewiadomą (PR)'],
];
const DOT_DECIMAL = /(?<![\d{}.])\d+\.\d+(?![\d.])/;

// ---------- zadania ----------
const byLesson = new Map();
const typeCount = {};
for (const t of tasks) {
  const id = t.id;
  typeCount[t.type] = (typeCount[t.type] || 0) + 1;
  if (!byLesson.has(t.lessonId)) byLesson.set(t.lessonId, []);
  byLesson.get(t.lessonId).push(t);

  const texts = [t.content, ...(t.options || []), t.explanation, t.matura_tip];
  texts.forEach((x, i) => checkKatex(id, x, ['treść', ...(t.options || []).map((_, k) => `opcja ${'ABCD'[k]}`), 'wyjaśnienie', 'wskazówka'][i]));

  const all = texts.join(' \n ');
  if (level === 'pp' && LOGIC.test(all)) add('formalizm', id, `zakazany formalizm logiczny: ${all.match(LOGIC)[0]}`);
  if (level === 'pp') for (const [re, name] of OUT_OF_SCOPE_PP) if (re.test(all)) add('zakres', id, `${name} | ${t.lessonId} | ${t.title}`);
  for (const x of texts) for (const { tex } of mathChunks(x)) if (DOT_DECIMAL.test(tex)) add('kropka', id, `kropka dziesiętna: ${tex.slice(0, 50)}`);

  if (t.type === 'SINGLE_CHOICE') {
    const opts = (t.options || []).map((o) => String(o).replace(/\s+/g, ''));
    const idx = String(t.correct_answer).charCodeAt(0) - 65;
    if (opts.length !== 4) add('klucz', id, `liczba opcji ${opts.length}`);
    if (!(idx >= 0 && idx < opts.length)) add('klucz', id, `klucz ${t.correct_answer} poza opcjami`);
    if (new Set(opts).size !== opts.length) add('klucz', id, 'powtórzone opcje');
    const said = String(t.explanation || '').match(/odpowiedzią jest \*\*([A-D])\*\*/);
    if (said && said[1] !== t.correct_answer) add('klucz', id, `wyjaśnienie wskazuje ${said[1]}, klucz ${t.correct_answer}`);
  }
  if (t.type === 'TRUE_FALSE') {
    if (!Array.isArray(t.statements) || !t.statements.length) add('klucz', id, 'P/F bez stwierdzeń');
    else if (t.statements.map((s) => s.correct).join('') !== String(t.correct_answer)) add('klucz', id, `P/F klucz ${t.correct_answer} ≠ stwierdzenia`);
  }
  if (t.type === 'NUMERIC_INPUT' && !String(t.correct_answer ?? '').trim()) add('klucz', id, 'brak wyniku liczbowego');
  if (/^OPEN_/.test(t.type)) {
    const st = t.rubric_stages || [];
    if (!st.length) add('rubryka', id, 'zadanie otwarte bez etapów oceniania');
    else if (st[st.length - 1].points !== t.points) add('rubryka', id, `ostatni etap ${st[st.length - 1].points} ≠ punkty zadania ${t.points}`);
  }
  if (!/Pułapka/i.test(t.explanation || '')) add('core4', id, 'wyjaśnienie bez pułapki (trap-driven)');
}

// ---------- lekcje ----------
const lessonRows = [];
for (const bp of blueprints) {
  for (const l of bp.lessons) {
    const pill = l.theory_pill || {};
    const missing = ['concept_essence', 'matura_context', 'core_formulas', 'worked_example', 'exam_trap'].filter((k) => {
      const v = pill[k];
      return v === undefined || v === null || (Array.isArray(v) ? v.length === 0 : typeof v === 'object' ? !Object.keys(v).length : !String(v).trim());
    });
    if (missing.length) add('bento', l.id, `brak sekcji: ${missing.join(', ')}`);
    if (!String(pill.plain_polish || '').trim()) add('bento', l.id, 'brak „Z polskiego na nasze”');
    const pillText = JSON.stringify(pill);
    if (level === 'pp' && LOGIC.test(pillText.replace(/\\\\/g, '\\'))) add('formalizm', l.id, 'formalizm logiczny w pigułce');
    if (level === 'pp') for (const [re, name] of OUT_OF_SCOPE_PP) if (re.test(pillText) || re.test(l.title)) add('zakres', l.id, `pigułka: ${name}`);
    for (const f of pill.core_formulas || []) checkKatex(l.id, `$${f.latex || f.formula || ''}$`, 'wzór');
    const ts = byLesson.get(l.id) || [];
    const types = {};
    ts.forEach((t) => (types[t.type] = (types[t.type] || 0) + 1));
    if (ts.length !== 20) add('pula', l.id, `zadań: ${ts.length}`);
    // to samo polecenie z innym wykresem lub innymi stwierdzeniami P/F to inne zadanie
    const taskKey = (t) => t.content + JSON.stringify(t.statements || t.options || []) + JSON.stringify(t.diagram || '');
    if (new Set(ts.map(taskKey)).size !== ts.length) add('pula', l.id, 'powtórzona treść zadania');
    if (!Object.keys(types).some((k) => k !== 'SINGLE_CHOICE')) add('format', l.id, 'tylko zadania ABCD (Format Matrix)');
    if (!Object.keys(types).some((k) => /^OPEN_/.test(k))) add('format', l.id, 'brak zadania otwartego');
    lessonRows.push({ id: l.id, title: l.title, requirements: l.requirements || [], types });
  }
}

// ---------- raport ----------
const byKind = {};
for (const i of issues) (byKind[i.kind] ||= []).push(i);
console.log(`Poziom: ${level.toUpperCase()} | zadań: ${tasks.length} | lekcji: ${lessonRows.length}`);
console.log('Typy zadań:', typeCount);
console.log('Lekcje z przypisanymi wymaganiami:', lessonRows.filter((l) => l.requirements.length).length);
for (const [k, list] of Object.entries(byKind)) {
  const ids = new Set(list.map((i) => i.id));
  console.log(`\n[${k}] ${list.length} uwag (${ids.size} obiektów)`);
  list.slice(0, 12).forEach((i) => console.log(`  ${i.id}: ${i.msg}`));
  if (list.length > 12) console.log(`  … +${list.length - 12}`);
}
if (args.json) fs.writeFileSync(args.json, JSON.stringify({ level, typeCount, issues, lessons: lessonRows }, null, 1));

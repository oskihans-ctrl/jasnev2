import { describe, it, expect } from 'vitest';
import rawTasks from '../math/generated/all_1500_tasks.json';
import {
  MATH_TOPIC_BLUEPRINTS,
  MATH_CURRICULUM_TOPICS,
  ALL_MATH_LESSONS,
  MATH_LESSON_SESSION_SIZE,
  getMathLessonDocument,
  getMathLessonTaskPool,
  getMathLessonSessionTasks,
  loadMathTopicBossExam
} from '../mathCurriculumData';
import { MATH_SECTIONS } from '../../types/mathTypes';

const tasks = rawTasks as any[];
// Symbole formalnej logiki zakazane na poziomie podstawowym (Core-4, pkt 5)
const FORBIDDEN_LOGIC = /\\(iff|vee|wedge|forall|exists|implies|Rightarrow|Leftrightarrow)\b/;

describe('Kurikulum matematyki PP – spójność danych z generatora scripts/math_pp', () => {
  it('ma 15 działów po 5 lekcji, zgodnych z MATH_SECTIONS', () => {
    expect(MATH_TOPIC_BLUEPRINTS).toHaveLength(15);
    expect(ALL_MATH_LESSONS).toHaveLength(75);
    MATH_TOPIC_BLUEPRINTS.forEach((bp, i) => {
      expect(bp.id).toBe(`dzial-${i + 1}`);
      expect(bp.lessons).toHaveLength(5);
      const section = MATH_SECTIONS[i];
      expect(section.id).toBe(bp.id);
      expect(section.title).toBe(`Dział ${i + 1}: ${bp.title}`);
      expect(section.cke_formula_page).toBe(bp.cke_formula_page);
      expect(section.points_range).toBe(bp.matura_points_range);
      expect(section.description).toBe(bp.description);
    });
  });

  it('każda lekcja ma kompletną pigułkę Bento z prawdziwymi wzorami', () => {
    ALL_MATH_LESSONS.forEach(lesson => {
      const pill: any = lesson.theory_pill;
      expect(pill.concept_essence.length, lesson.id).toBeGreaterThan(80);
      expect(pill.matura_context.length, lesson.id).toBeGreaterThan(10);
      expect(pill.plain_polish, lesson.id).toMatch(/^Z polskiego na nasze: /);
      expect(pill.core_formulas.length, lesson.id).toBeGreaterThanOrEqual(1);
      pill.core_formulas.forEach((f: any) => expect(f.formula, lesson.id).not.toMatch(/Standard CKE/));
      expect(pill.exam_trap.length, lesson.id).toBeGreaterThan(20);
      expect(pill.worked_example, lesson.id).toBeTruthy();
      expect(pill.worked_example.steps.length, lesson.id).toBeGreaterThan(0);
      const text = JSON.stringify(pill);
      expect(text, lesson.id).not.toMatch(/Standard CKE/);
      expect(text, lesson.id).not.toMatch(FORBIDDEN_LOGIC);
    });
  });

  it('każda lekcja ma własną pulę 20 unikalnych zadań, a zestaw sesji liczy 5 zadań z tej lekcji', () => {
    expect(tasks).toHaveLength(1500);
    expect(new Set(tasks.map(t => t.id)).size).toBe(1500);
    expect(new Set(tasks.map(t => t.content + JSON.stringify(t.statements || null) + JSON.stringify(t.diagram || null))).size).toBe(1500);

    ALL_MATH_LESSONS.forEach(lesson => {
      const pool = getMathLessonTaskPool(lesson.id);
      expect(pool, lesson.id).toHaveLength(20);
      pool.forEach(t => {
        expect(t.lessonId).toBe(lesson.id);
        expect(t.topicId).toBe(lesson.topicId);
      });

      // dokument lekcji niesie pełną pulę (silnik sesji losuje z niej 5 i dobiera powtórki)
      const doc = getMathLessonDocument(lesson.topicId, lesson.id);
      expect(doc, lesson.id).not.toBeNull();
      expect(doc!.tasks, lesson.id).toHaveLength(20);
      const poolIds = new Set(pool.map(t => t.id));
      const session = getMathLessonSessionTasks(lesson.id);
      expect(session, lesson.id).toHaveLength(MATH_LESSON_SESSION_SIZE);
      session.forEach((t: any) => expect(poolIds.has(t.id)).toBe(true));
    });

    MATH_CURRICULUM_TOPICS.forEach(topic => {
      expect((topic as any).tasks).toHaveLength(100);
    });
  });

  it('zadania mają poprawny klucz, 4 różne opcje, wyjaśnienie z pułapką i polski zapis liczb', () => {
    tasks.forEach(t => {
      expect(t.content.length, t.id).toBeGreaterThan(20);
      expect(t.explanation, t.id).toMatch(/\*\*Krok 1:\*\*/);
      expect(t.explanation, t.id).toMatch(/\*\*Pułapka CKE:\*\*/);
      const text = [t.content, t.explanation, t.matura_tip, ...(t.options || []), ...(t.statements || []).map((s: any) => s.text)].join('\n');
      expect(text, t.id).not.toMatch(FORBIDDEN_LOGIC);
      expect(text, t.id).not.toMatch(/undefined|NaN|Infinity|\[object/);
      expect(text, t.id).not.toMatch(/\d\.\d/); // przecinek dziesiętny, nie kropka
      expect(text, t.id).not.toMatch(/Tablice CKE str\./); // żadnych zmyślonych odwołań do stron
      // parzysta liczba znaków $ (domknięte wzory KaTeX)
      expect((text.match(/\$/g) || []).length % 2, t.id).toBe(0);

      if (t.type === 'SINGLE_CHOICE') {
        expect(t.options, t.id).toHaveLength(4);
        expect(new Set(t.options).size, t.id).toBe(4);
        expect(['A', 'B', 'C', 'D'], t.id).toContain(t.correct_answer);
      } else if (t.type === 'TRUE_FALSE') {
        // Format Matrix (Core-4): stwierdzenia oceniane osobno jako prawda/fałsz
        expect(t.statements, t.id).toHaveLength(2);
        expect(t.correct_answer, t.id).toBe(t.statements.map((s: any) => s.correct).join(''));
        expect(t.options, t.id).toBeUndefined();
      } else if (t.type === 'OPEN_CALCULATION' || t.type === 'OPEN_PROOF') {
        // zadanie otwarte oceniane etapami jak w zasadach oceniania CKE (od 2 etapów, ostatni = komplet punktów)
        const stages = t.rubric_stages || [];
        expect(stages.length, t.id).toBeGreaterThanOrEqual(2);
        expect(stages[stages.length - 1].points, t.id).toBe(t.points);
        expect(t.points, t.id).toBeLessThanOrEqual(5);
        stages.forEach((s: any, i: number) => {
          expect(s.criterion.length, t.id).toBeGreaterThan(10);
          if (i) expect(s.points, t.id).toBeGreaterThan(stages[i - 1].points);
        });
        expect(t.scoring_key, t.id).toMatch(/Odpowiedź:/);
        expect(t.requirements.length, t.id).toBeGreaterThan(0);
      } else {
        expect(t.type, t.id).toBe('NUMERIC_INPUT');
        expect(String(t.correct_answer), t.id).toMatch(/^-?\d+(,\d+)?$/);
      }
    });
  });

  it('pula zadań realizuje Format Matrix: wybór ABCD, prawda/fałsz, wynik liczbowy i zadania otwarte', () => {
    const count = (type: string) => tasks.filter(t => t.type === type).length;
    expect(count('SINGLE_CHOICE')).toBeGreaterThan(1100);
    expect(count('TRUE_FALSE')).toBeGreaterThanOrEqual(40);
    expect(count('NUMERIC_INPUT')).toBeGreaterThanOrEqual(30);
    // arkusze PP od grudnia 2024 r.: ok. połowa punktów za zadania otwarte – każda lekcja ma 4 takie zadania
    expect(count('OPEN_CALCULATION') + count('OPEN_PROOF')).toBe(300);
    expect(count('OPEN_PROOF')).toBeGreaterThan(0);
    ALL_MATH_LESSONS.forEach(lesson => {
      const open = getMathLessonTaskPool(lesson.id).filter((t: any) => t.type === 'OPEN_CALCULATION' || t.type === 'OPEN_PROOF');
      expect(open, lesson.id).toHaveLength(4);
    });
    // zadania P/F trafiają do silnika sesji w formacie natywnym (bez sztucznych opcji A–D)
    const pool = getMathLessonTaskPool('math-lesson-13-2');
    const tf = pool.find(t => t.type === 'TRUE_FALSE');
    expect(tf.statements).toHaveLength(2);
    expect(tf.options).toBeUndefined();
  });

  it('sprawdzian działowy losuje po jednym zadaniu z każdej lekcji działu', () => {
    for (let d = 1; d <= 15; d++) {
      const exam = loadMathTopicBossExam(`dzial-${d}`);
      expect(exam.tasks).toHaveLength(5);
      const lessonKeys = exam.tasks.map((t: any) => String(t.id).match(/^mat-pp-(\d+)-(\d+)-/));
      lessonKeys.forEach((m: RegExpMatchArray | null) => {
        expect(m).not.toBeNull();
        expect(m![1]).toBe(String(d));
      });
      expect(new Set(lessonKeys.map((m: any) => m[2])).size).toBe(5);
    }
  });
});

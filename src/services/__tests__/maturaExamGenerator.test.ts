import { describe, it, expect } from 'vitest';
import {
  generateFullMaturaExam,
  generateMiniMaturaExam,
  FLAGSHIP_JASNE_EXAMS,
  getAll1500MaturaTasks,
  getAll1500MathTasks
} from '../maturaExamGenerator';

describe('MaturaExamGenerator Service (CKE Formuła 2023)', () => {
  it('loads all 1500 generated tasks with complete metadata', () => {
    const tasks = getAll1500MaturaTasks();
    expect(tasks).toHaveLength(1500);

    const closed = tasks.filter(t => t.isClosed);
    const open = tasks.filter(t => !t.isClosed);

    // Zadania otwarte w puli: wynik liczbowy albo zadanie oceniane etapami CKE (4 na lekcję)
    expect(closed.length + open.length).toBe(1500);
    expect(closed.length).toBeGreaterThanOrEqual(1150);
    open.forEach(t => {
      if (t.type === 'NUMERIC_INPUT') {
        expect(String(t.correctAnswer)).toMatch(/^-?\d+(,\d+)?$/);
      } else {
        expect(['OPEN_CALCULATION', 'OPEN_PROOF']).toContain(t.type);
        const stages = (t as any).rubric_stages;
        expect(stages.length, t.id).toBeGreaterThanOrEqual(2);
        expect(stages[stages.length - 1].points, t.id).toBe(t.points);
      }
    });
    expect(open.filter(t => t.type !== 'NUMERIC_INPUT')).toHaveLength(300);

    // Zadania generowane są autorskie – nie mogą udawać oficjalnych zadań CKE
    tasks.forEach(t => {
      expect(t.isCke).toBe(false);
    });

    // Answer distribution across A, B, C, D is balanced (~25% each)
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    const abcd = closed.filter(t => t.type === 'SINGLE_CHOICE');
    const trueFalse = closed.filter(t => t.type === 'TRUE_FALSE');
    expect(abcd.length + trueFalse.length).toBe(closed.length);
    abcd.forEach(t => {
      counts[t.correctAnswer as 'A' | 'B' | 'C' | 'D']++;
    });
    // zadania prawda/fałsz: dwa stwierdzenia i klucz typu "PF" zamiast opcji A–D
    trueFalse.forEach(t => {
      expect((t as any).statements).toHaveLength(2);
      expect(t.correctAnswer).toMatch(/^[PF]{2}$/);
    });

    // każda litera to co najmniej 22% kluczy ABCD
    const minShare = Math.floor(abcd.length * 0.22);
    expect(counts.A).toBeGreaterThanOrEqual(minShare);
    expect(counts.B).toBeGreaterThanOrEqual(minShare);
    expect(counts.C).toBeGreaterThanOrEqual(minShare);
    expect(counts.D).toBeGreaterThanOrEqual(minShare);

    // No duplicate options in any closed task
    abcd.forEach(t => {
      expect(t.options).toHaveLength(4);
      const unique = new Set(t.options);
      expect(unique.size).toBe(4);
    });
  });

  it('generates a full authentic Matura exam with exactly 35 tasks and 50 points (CKE Standard 2025)', () => {
    const exam = generateFullMaturaExam(12345, 'Matura Testowa CKE');

    expect(exam.tasks).toHaveLength(35);
    expect(exam.totalPoints).toBe(50);
    expect(exam.durationMinutes).toBe(180);

    // Verify task IDs are distinct
    const ids = new Set(exam.tasks.map(t => t.id));
    expect(ids.size).toBe(35);

    // Verify points breakdown (50% closed, 50% open)
    const p1 = exam.tasks.filter(t => t.points === 1);
    const p2 = exam.tasks.filter(t => t.points === 2);
    const p3 = exam.tasks.filter(t => t.points === 3);
    const p4 = exam.tasks.filter(t => t.points === 4);

    expect(p1).toHaveLength(25); // 25 pkt (50%)
    expect(p2).toHaveLength(7);  // 14 pkt
    expect(p3).toHaveLength(1);  // 3 pkt
    expect(p4).toHaveLength(2);  // 8 pkt

    const sum = 25 * 1 + 7 * 2 + 1 * 3 + 2 * 4;
    expect(sum).toBe(50);

    // Last task is optimization task (4 pkt)
    expect(exam.tasks[34].points).toBe(4);
    expect(exam.tasks[34].isClosed).toBe(false);
    expect(exam.tasks[34].topicId).toBe('dzial-15');

    // Zadania zamknięte mają 4 opcje i klucz A–D; otwarte nie mają opcji,
    // a ich odpowiedzią jest treść wyniku (nie litera po usuniętych opcjach)
    exam.tasks.forEach(t => {
      if (t.isClosed && t.type === 'TRUE_FALSE') {
        expect((t as any).statements).toHaveLength(2);
      } else if (t.isClosed) {
        expect(t.options).toHaveLength(4);
        expect(['A', 'B', 'C', 'D']).toContain(t.correctAnswer);
      } else {
        expect(t.options).toHaveLength(0);
        expect(['A', 'B', 'C', 'D']).not.toContain(t.correctAnswer);
        expect(t.content).not.toMatch(/Wybierz właściwą odpowiedź/);
      }
    });
  });

  it('generates a Standard Mini Matura (35 min) with exactly 18 tasks and 25 points (50% CKE)', () => {
    const mini = generateMiniMaturaExam('standard', 'Wszystkie działy', 9999);

    expect(mini.tasks).toHaveLength(18);
    expect(mini.totalPoints).toBe(25);
    expect(mini.durationMinutes).toBe(35);

    // 13 closed @ 1 pkt + 4 open @ 2 pkt + 1 opt @ 4 pkt = 25 pkt
    const p1 = mini.tasks.filter(t => t.points === 1);
    const p2 = mini.tasks.filter(t => t.points === 2);
    const p4 = mini.tasks.filter(t => t.points === 4);

    expect(p1).toHaveLength(13);
    expect(p2).toHaveLength(4);
    expect(p4).toHaveLength(1);

    const sum = 13 * 1 + 4 * 2 + 1 * 4;
    expect(sum).toBe(25);
  });

  it('generates an Express Mini Matura (20 min) with exactly 15 points (30% threshold)', () => {
    const mini = generateMiniMaturaExam('express', 'Wszystkie działy', 8888);

    expect(mini.totalPoints).toBe(15);
    expect(mini.durationMinutes).toBe(20);
    expect(mini.tasks.length).toBeGreaterThanOrEqual(11);
  });

  it('provides pre-generated flagship mock exams (Arkusze Wzorcowe A, B, C with 50 pkt)', () => {
    expect(FLAGSHIP_JASNE_EXAMS).toHaveLength(3);
    FLAGSHIP_JASNE_EXAMS.forEach(sheet => {
      expect(sheet.tasks).toHaveLength(35);
      expect(sheet.totalPoints).toBe(50);
      expect(sheet.durationMinutes).toBe(180);
    });
  });

  it('formats all 1500 tasks as MathTask with canonical sections dzial-1 to dzial-15', () => {
    const mathTasks = getAll1500MathTasks();
    expect(mathTasks).toHaveLength(1500);

    const topicIds = new Set(mathTasks.map(t => t.topicId));
    // All 15 sections are covered
    for (let i = 1; i <= 15; i++) {
      expect(topicIds.has(`dzial-${i}`)).toBe(true);
    }
  });
});

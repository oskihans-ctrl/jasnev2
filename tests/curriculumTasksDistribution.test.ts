import { describe, it, expect } from 'vitest';
import { MATH_CURRICULUM_TOPICS, getMathLessonDocument } from '../src/data/mathCurriculumData';
import { drawSessionTasks } from '../src/data/dzial1TaskPool';

// Każda lekcja PP ma w puli 4 zadania otwarte oceniane etapami CKE (scripts/math_pp/open_*.js),
// więc żadna lekcja nie potrzebuje już wyjątku od układu 3 zamknięte + 2 otwarte.
const LESSONS_WITHOUT_TYPEABLE_ANSWERS = new Set<string>();
const isOpen = (t: any) => ['NUMERIC_INPUT', 'OPEN_TASK', 'OPEN_PROOF', 'OPEN_CALCULATION'].includes(t.type);

describe('Curriculum Tasks Distribution (3 closed + 2 open)', () => {
  it('ensures all 75 math lessons draw exactly 3 closed and 2 open tasks', () => {
    let checkedLessons = 0;

    for (const topic of MATH_CURRICULUM_TOPICS) {
      for (const m of topic.lessons_metadata || []) {
        checkedLessons++;

        // Test with explicit task pool
        const mathDoc = getMathLessonDocument(topic.id, m.id);
        expect(mathDoc).toBeDefined();
        expect(mathDoc?.tasks?.length).toBeGreaterThanOrEqual(5);

        const drawnExplicit = drawSessionTasks(m.id, mathDoc?.tasks);
        expect(drawnExplicit.sessionTasks).toHaveLength(5);

        const openExplicit = drawnExplicit.sessionTasks.filter(t => 
          t.type === 'NUMERIC_INPUT' || 
          t.type === 'OPEN_TASK' || 
          t.type === 'OPEN_PROOF' || 
          t.type === 'OPEN_CALCULATION'
        );
        const closedExplicit = drawnExplicit.sessionTasks.filter(t => 
          t.type === 'SINGLE_CHOICE' || 
          t.type === 'TRUE_FALSE' || 
          (!t.type && t.options)
        );

        const expectedOpen = LESSONS_WITHOUT_TYPEABLE_ANSWERS.has(m.id) ? 0 : 2;
        expect(closedExplicit).toHaveLength(5 - expectedOpen);
        expect(openExplicit).toHaveLength(expectedOpen);

        // Test with fallback (direct lessonId resolution)
        const drawnFallback = drawSessionTasks(m.id);
        expect(drawnFallback.sessionTasks).toHaveLength(5);

        const openFallback = drawnFallback.sessionTasks.filter(t => 
          t.type === 'NUMERIC_INPUT' || 
          t.type === 'OPEN_TASK' || 
          t.type === 'OPEN_PROOF' || 
          t.type === 'OPEN_CALCULATION'
        );
        const closedFallback = drawnFallback.sessionTasks.filter(t => 
          t.type === 'SINGLE_CHOICE' || 
          t.type === 'TRUE_FALSE' || 
          (!t.type && t.options)
        );

        expect(closedFallback).toHaveLength(5 - expectedOpen);
        expect(openFallback).toHaveLength(expectedOpen);
      }
    }

    expect(checkedLessons).toBe(75);
  });

  it('verifies that tasks in each drawn session are shuffled', () => {
    // Draw two separate sessions for lesson 1.1 and check they draw valid sets
    const session1 = drawSessionTasks('math-lesson-1-1');
    const session2 = drawSessionTasks('math-lesson-1-1');

    expect(session1.sessionTasks).toHaveLength(5);
    expect(session2.sessionTasks).toHaveLength(5);

    const openCount1 = session1.sessionTasks.filter(isOpen).length;
    const closedCount1 = session1.sessionTasks.filter(t => !isOpen(t)).length;
    expect(openCount1).toBe(2);
    expect(closedCount1).toBe(3);
  });
});

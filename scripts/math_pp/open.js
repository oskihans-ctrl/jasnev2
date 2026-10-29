/**
 * Generatory zadań otwartych kursu PP (pozycje 17–20 każdej lekcji), klucz: numer lekcji „dział.lekcja”.
 */
import { OPEN_A } from './open_a.js';
import { OPEN_B } from './open_b.js';
import { OPEN_C } from './open_c.js';

export const OPEN = { ...OPEN_A, ...OPEN_B, ...OPEN_C };

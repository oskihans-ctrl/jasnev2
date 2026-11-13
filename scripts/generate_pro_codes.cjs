/**
 * Generator jednorazowych kodów aktywacyjnych PRO.
 *
 * Reguły Firestore nie pozwalają włączyć PRO bez kodu z `system/proCodes/items/{kod}`,
 * więc ten skrypt jest jedynym oficjalnym źródłem kodów. Uruchamiaj wyłącznie
 * lokalnie / w CI z kluczem Service Account (Admin SDK omija reguły).
 *
 * Użycie:
 *   node scripts/generate_pro_codes.cjs            # 10 kodów
 *   node scripts/generate_pro_codes.cjs 25         # 25 kodów
 *   node scripts/generate_pro_codes.cjs 25 PARTIA-1
 *
 * Format kodu: JASNE-XXXX-XXXX (bez znaków mylących: 0/O, 1/I/L).
 */

process.env.FIRESTORE_PREFER_REST = 'true';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

try {
  require('dotenv').config();
} catch (e) {}

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'jasne-7efe7';
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function randomBlock(length = 4) {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHABET[crypto.randomInt(0, ALPHABET.length)];
  }
  return out;
}

function generateCode() {
  return `JASNE-${randomBlock()}-${randomBlock()}`;
}

async function main() {
  const count = Math.max(1, Math.min(500, parseInt(process.argv[2], 10) || 10));
  const batchLabel = process.argv[3] || `batch-${new Date().toISOString().slice(0, 10)}`;

  console.log('====================================================');
  console.log('  GENERATOR KODÓW AKTYWACYJNYCH PRO                ');
  console.log(`  Projekt: ${PROJECT_ID} | liczba kodów: ${count}`);
  console.log('====================================================\n');

  let admin;
  try {
    admin = require('firebase-admin');
  } catch (err) {
    console.error('[ERROR] Wymagany pakiet firebase-admin. Uruchom: npm install firebase-admin');
    process.exit(1);
  }

  const keyLocations = [
    process.env.SERVICE_ACCOUNT_KEY_PATH,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    path.resolve(__dirname, '..', 'serviceAccountKey.json'),
    path.resolve(__dirname, '..', 'service-account.json'),
    path.resolve(__dirname, '..', `${PROJECT_ID}-firebase-adminsdk.json`)
  ].filter(Boolean);

  const serviceAccountPath = keyLocations.find(p => fs.existsSync(p));
  if (!serviceAccountPath) {
    console.error('[ERROR] Nie znaleziono klucza Service Account (serviceAccountKey.json).');
    process.exit(1);
  }

  const serviceAccount = require(path.resolve(serviceAccountPath));
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: PROJECT_ID
    });
  }

  const db = admin.firestore();
  try {
    db.settings({ preferRest: true });
  } catch (e) {}

  const codes = new Set();
  while (codes.size < count) codes.add(generateCode());

  const createdAt = new Date().toISOString();
  let batch = db.batch();
  let operations = 0;
  let written = 0;
  const output = [];

  // Kody leżą w system/proCodes/items/{kod} — ścieżka musi być zgodna z
  // proCodeRef() w firestore.rules i activateProWithCode() w heartsManager.ts.
  for (const code of codes) {
    batch.set(db.collection('system').doc('proCodes').collection('items').doc(code), {
      code,
      active: true,
      batch: batchLabel,
      createdAt
    }, { merge: true });
    operations++;
    output.push(code);

    if (operations >= 400) {
      await batch.commit();
      written += operations;
      batch = db.batch();
      operations = 0;
    }
  }

  if (operations > 0) {
    await batch.commit();
    written += operations;
  }

  const outPath = path.resolve(__dirname, '..', `pro_codes_${batchLabel.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`);
  fs.writeFileSync(outPath, `${output.join('\n')}\n`, 'utf8');

  console.log(`✓ Zapisano ${written} kodów w system/proCodes (partia: ${batchLabel})`);
  console.log(`✓ Lista kodów: ${outPath}`);
  console.log('\nUWAGA: plik z kodami zawiera dane sprzedażowe — nie commituj go do repozytorium.\n');
  output.forEach(code => console.log(code));
  console.log('');
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});

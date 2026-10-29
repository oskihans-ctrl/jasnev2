# Analiza arkuszy CKE z matematyki – poziom podstawowy (Formuła 2023).
# Wejście: katalog z tekstem arkuszy i zasad oceniania (scripts/math_pr/analysis/pdftext.py).
# Wyjście: JSON z zadaniami: arkusz, numer, punkty, kody wymagań (numeracja z klucza), format odpowiedzi.
# Uruchomienie: python scripts/math_pp/analysis/analyze.py <katalog_txt> <wyjscie.json>
import sys, os, re, json
from collections import defaultdict, Counter

d = sys.argv[1]; out = sys.argv[2]
HDR = re.compile(r'^Zadanie (\d+(?:\.\d+)?)\.? ?\(0[–-](\d)\)', re.M)
CODE = re.compile(r'\b([IVX]{1,4})\.(R?)(\d{0,2})\)')
GEN = re.compile(r'^(I|II|III|IV)\. (Sprawność|Wykorzystanie i tworzenie|Wykorzystanie i interpretowanie|Rozumowanie)', re.M)


def answer_format(block, points):
    """Format odpowiedzi z sekcji „Rozwiązanie” klucza CKE."""
    # Arkusze w dwóch wersjach: „Wersja A / Wersja B” i dwie odpowiedzi – bierzemy wersję A
    mv = re.search(r'Wersja A\s*\n\s*Wersja B\s*\n\s*(\S+)', block)
    m = re.search(r'Rozwiązanie\s*\n\s*(.{1,40})', block)
    sol = mv.group(1) if mv else (re.sub(r'\s+', '', m.group(1)) if m else '')
    if re.fullmatch(r'[A-D]', sol):
        return 'ABCD', sol
    if re.fullmatch(r'[PF]{2,4}', sol):
        return 'PRAWDA_FALSZ', sol
    if re.fullmatch(r'([A-F][1-4]|[A-F]{2}|[1-4][A-F])', sol):
        return 'DOBIERANIE', sol
    if re.search(r'\b[A-D]\b', sol) and len(sol) <= 3:
        return 'ABCD', sol
    return ('OTWARTE_ROZSZERZONE' if points >= 2 else 'OTWARTE_KROTKIE'), sol[:20]


rows = []
for fn in sorted(os.listdir(d)):
    if not fn.endswith('-podstawowa-odpowiedzi.txt') or 'politechnika' in fn:
        continue
    exam = fn.replace('-podstawowa-odpowiedzi.txt', '').replace('matematyka-', '')
    key = open(os.path.join(d, fn), encoding='utf8').read()
    sheet_fn = os.path.join(d, fn.replace('-odpowiedzi', ''))
    sheet = open(sheet_fn, encoding='utf8').read() if os.path.exists(sheet_fn) else ''
    hs = list(HDR.finditer(key))
    for i, h in enumerate(hs):
        block = key[h.end(): hs[i + 1].start() if i + 1 < len(hs) else len(key)]
        req = block.split('Zasady oceniania')[0]
        codes = sorted({f"{r}.{'R' if R else ''}{n or '1'}" for r, R, n in CODE.findall(req)})
        gens = sorted(set(GEN.findall(req)), key=lambda x: x[0])
        no = h.group(1); pts = int(h.group(2))
        m = re.search(r'Zadanie ' + re.escape(no) + r'\.?\s*\(0[–-](\d)\)(.{0,700})', sheet, re.S)
        stmt = re.sub(r'\s+', ' ', m.group(2)).strip()[:400] if m else ''
        if m:
            pts = int(m.group(1))  # punktacja z arkusza (klucz grudnia 2023 ma w dwóch zadaniach 0–1 zamiast 0–2)
        fmt, sol = answer_format(block, pts)
        proof = bool(re.search(r'\b(Wykaż|Udowodnij|Uzasadnij)', stmt))
        if any(r['exam'] == exam and r['task'] == no for r in rows):
            continue  # klucz powtarza część zadań (np. druga wersja arkusza)
        rows.append(dict(exam=exam, task=no, points=pts, codes=codes, general=[g[0] for g in gens],
                         format=fmt, solution=sol, proof=proof, statement=stmt))

json.dump(rows, open(out, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
per = defaultdict(int)
for r in rows:
    per[r['exam']] += r['points']
print('punkty/arkusz:', dict(per))
print('zadań:', len(rows), '| dowodów:', sum(r['proof'] for r in rows))
print('bez kodów:', [(r['exam'], r['task']) for r in rows if not r['codes']])
print('formaty (zadania):', Counter(r['format'] for r in rows))
print('formaty (pkt):', {k: sum(r['points'] for r in rows if r['format'] == k) for k in sorted({r['format'] for r in rows})})

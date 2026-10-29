# Porównuje arkusze CKE w aplikacji (seed/curriculum/exams/*.json) z kluczami odczytanymi z PDF CKE
# (wynik analyze.py). Zgłasza różnice punktów, formatu i odpowiedzi zamkniętych.
# Uruchomienie: python scripts/math_pp/analysis/compare_keys.py <pp_tasks.json>
import sys, os, json, re

FMT_APP = {
    'SINGLE_CHOICE': 'ABCD', 'TRUE_FALSE': 'PRAWDA_FALSZ', 'TWO_PART': 'DOBIERANIE', 'MATCHING': 'DOBIERANIE',
    'NUMERIC_INPUT': 'OTWARTE_KROTKIE', 'OPEN_CALCULATION': 'OTWARTE_ROZSZERZONE', 'OPEN_PROOF': 'OTWARTE_ROZSZERZONE',
}
MONTH = {'maj': 'maj-matura', 'czerwiec': 'czerwiec-matura', 'sierpien': 'sierpien-poprawkowa'}

cke = {(r['exam'], r['task']): r for r in json.load(open(sys.argv[1], encoding='utf8'))}
root = os.path.join(os.path.dirname(__file__), '../../../seed/curriculum/exams')
diffs = []
total = 0
for fn in sorted(os.listdir(root)):
    m = re.match(r'matura-(maj|czerwiec|sierpien)-(\d{4})\.json$', fn)
    if not m:
        continue
    exam = f"{m.group(2)}-{MONTH[m.group(1)]}"
    tasks = json.load(open(os.path.join(root, fn), encoding='utf8'))
    pts_app = 0
    for t in tasks:
        total += 1
        no = str(t.get('taskNumber'))
        pts_app += t.get('points', 1)
        ref = cke.get((exam, no))
        if not ref:
            diffs.append((exam, no, 'brak zadania w kluczu CKE'))
            continue
        app_fmt = FMT_APP.get(t['type'], t['type'])
        key = str(t.get('correct_answer') or t.get('correctAnswer') or '').replace(' ', '')
        if t.get('points', 1) != ref['points']:
            diffs.append((exam, no, f"punkty: aplikacja {t.get('points', 1)}, CKE {ref['points']}"))
        same_family = app_fmt == ref['format'] or {app_fmt, ref['format']} <= {'OTWARTE_KROTKIE', 'OTWARTE_ROZSZERZONE'}
        if not same_family:
            diffs.append((exam, no, f"format: aplikacja {t['type']}, CKE {ref['format']} ({ref['solution']})"))
        if ref['format'] in ('ABCD', 'PRAWDA_FALSZ', 'DOBIERANIE') and key and key != ref['solution']:
            diffs.append((exam, no, f"klucz: aplikacja {key}, CKE {ref['solution']}"))
    ref_pts = sum(r['points'] for (e, _), r in cke.items() if e == exam)
    if pts_app != ref_pts:
        diffs.append((exam, '-', f'suma punktów: aplikacja {pts_app}, CKE {ref_pts}'))
    missing = [no for (e, no) in cke if e == exam and no not in {str(t.get('taskNumber')) for t in tasks}]
    if missing:
        diffs.append((exam, '-', f'w aplikacji brak zadań: {missing}'))

print(f'zadań w aplikacji: {total}, różnic: {len(diffs)}')
for d in diffs:
    print('  ', *d)

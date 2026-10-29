# Audyt treści z języka polskiego względem arkuszy CKE (poziom podstawowy, Formuła 2023).
# 1) Teksty z przypisanym autorem: czy to oryginał z arkusza CKE (wspólne 6-wyrazowe fragmenty), czy tekst własny.
# 2) Zadania: deklarowane źródło („CKE …”) vs. obecność treści w arkuszach, klucze P/F, punkty.
# Wejście: zrzut danych aplikacji (JSON) i katalog z tekstem arkuszy (pdftext.py).
# Uruchomienie: python scripts/polish_audit.py <dump.json> <katalog_txt>
import sys, os, re, json
from collections import Counter

dump = json.load(open(sys.argv[1], encoding='utf8'))
d = sys.argv[2]
corpus = ''
for fn in os.listdir(d):
    if 'jezyk-polski' in fn and fn.endswith('.txt') and 'odpowiedzi' not in fn:
        corpus += ' ' + open(os.path.join(d, fn), encoding='utf8').read()


def words(s):
    return re.findall(r'[a-ząćęłńóśźż]+', str(s).lower())


cw = words(corpus)
SH = 6
corpus_sh = {' '.join(cw[i:i + SH]) for i in range(len(cw) - SH)}


def overlap(text):
    w = words(text)
    sh = [' '.join(w[i:i + SH]) for i in range(len(w) - SH)]
    return (sum(s in corpus_sh for s in sh) / len(sh)) if sh else 0.0


print('== Teksty z przypisanym autorem')
for p in dump['passages']:
    ov = overlap(p['text'])
    verdict = 'ORYGINAŁ CKE' if ov > 0.6 else 'częściowo' if ov > 0.15 else 'TEKST WŁASNY (nie z arkusza)'
    print(f"  {ov:5.0%}  {verdict:30} {p['author']} – {p['title']} [{p['key']}]")

print('\n== Zadania z deklarowanym źródłem CKE')
rows = []
for t in dump['tasks'] + dump['tasks800']:
    src = str(t.get('sourceYear') or t.get('source') or t.get('sourceCkeSession') or '')
    body = ' '.join(str(t.get(k) or '') for k in ('question',)) + ' ' + ' '.join(s.get('text', '') if isinstance(s, dict) else str(s) for s in t.get('trueFalseStatements') or [])
    passage = t.get('passage') or {}
    ptxt = passage.get('text', '') if isinstance(passage, dict) else str(passage)
    rows.append(dict(id=t['id'], src=src, ov_q=overlap(body), ov_p=overlap(ptxt) if ptxt else None, type=t.get('taskType'), pts=t.get('points')))
# „Ćwiczenie JASNE w formacie CKE” to jawna etykieta zadania własnego, nie deklaracja źródła
claims = [r for r in rows if re.search(r'CKE|matura|20(2[2-6])', r['src'], re.I) and not r['src'].startswith('Ćwiczenie JASNE')]
print(f"  zadań: {len(rows)}, z deklaracją CKE w polu źródła: {len(claims)}")
for r in claims:
    flag = '' if r['ov_q'] > 0.3 or (r['ov_p'] or 0) > 0.3 else '  <- brak treści w arkuszach'
    print(f"  {r['id']}: źródło „{r['src']}”, treść {r['ov_q']:.0%}, tekst {'' if r['ov_p'] is None else f'{r[chr(111)+chr(118)+chr(95)+chr(112)]:.0%}'}{flag}")

print('\n== Typy zadań (wszystkie)')
print(' ', Counter(r['type'] for r in rows))
tf_bad = [t['id'] for t in dump['tasks'] + dump['tasks800'] if t.get('trueFalseStatements') and any(
    (s.get('isTrue', s.get('correct')) if isinstance(s, dict) else None) not in ('P', 'F', True, False, 'TRUE', 'FALSE') for s in t['trueFalseStatements'])]
print('  P/F z niepoprawnym kluczem stwierdzenia:', len(tf_bad), tf_bad[:10])

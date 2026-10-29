# Dopasowuje wymagania cytowane w kluczach CKE (poziom podstawowy, różne wersje numeracji) do podstawy 2024 po treści.
import sys, os, re, json
rows = json.load(open(sys.argv[1], encoding='utf8')); d = sys.argv[2]
reqs = json.load(open(sys.argv[3], encoding='utf8'))
STOP = set('i w z na do oraz a się od dla lub jak np też także przy tym typu jego ich'.split())
def toks(s):
    return {w[:5] for w in re.findall(r'[a-ząćęłńóśźż]{3,}', s.lower()) if w not in STOP}
RT = [(r, toks(r['text'])) for r in reqs]
RT_BY = {q['code']: t for q, t in RT}
NEW_ERA = lambda e: e.startswith(('2024-grudzien', '2025', '2026'))
CITE = re.compile(r'\b([IVX]{1,4})\.(R?)(\d{0,2})\)\s*(\(R\))?\s*(.*?)(?=\b[IVX]{1,4}\.R?\d{0,2}\)|$)', re.S)
low = []
for r in rows:
    key = open(os.path.join(d, f"matematyka-{r['exam']}-podstawowa-odpowiedzi.txt"), encoding='utf8').read()
    m = re.search(r'^Zadanie ' + re.escape(r['task']) + r'\.? ?\(0.*?(?=Zasady oceniania)', key, re.S | re.M)
    block = re.sub(r'\s+', ' ', m.group(0)) if m else ''
    block = block[block.find('Zdający:'):] if 'Zdający:' in block else block
    out = []
    for sec, R, n, rflag, txt in CITE.findall(block):
        tt = toks(txt)
        cands = [(len(tt & rt) / (len(tt) or 1), q) for q, rt in RT if q['section'] == sec and q['level'] == 'PP']
        if not cands: continue
        score, best = max(cands, key=lambda x: x[0])
        cited = f"{sec}.{'R' if (R or rflag) else ''}{n or '1'}"
        own = [(sc, q) for sc, q in cands if q['code'] == cited]
        # numeracja 2024 (arkusze od grudnia 2024) albo cytowany kod nadal pasuje treścią
        if own and (NEW_ERA(r['exam']) or own[0][0] >= 0.5):
            score, best = own[0]
        novel = sorted(tt - RT_BY[best['code']])
        out.append(dict(cited=cited, now=best['code'], level=best['level'], score=round(score, 2), novel=novel, text=txt.strip()[:200]))
        if score < 0.5: low.append((r['exam'], r['task'], out[-1]))
    r['requirements'] = out
    r['codes_2024'] = sorted({o['now'] for o in out})
    r['pr_only'] = any(o['level'] == 'PR' for o in out)  # na PP powinno być zawsze False
json.dump(rows, open(sys.argv[1], 'w', encoding='utf8'), ensure_ascii=False, indent=1)
changed = [(r['exam'], r['task'], o['cited'], o['now']) for r in rows for o in r['requirements'] if o['cited'] != o['now']]
print('przenumerowane:', len(changed)); [print('  ', c) for c in changed]
print('MOŻLIWE ZAWĘŻENIA (słowa spoza wymagania 2024):')
seen=set()
for r in rows:
    for o in r['requirements']:
        k=(o['now'], tuple(o['novel']))
        if len(o['novel'])>=2 and not NEW_ERA(r['exam']) and k not in seen:
            seen.add(k); print('  ', r['exam'], r['task'], o['cited'], '->', o['now'], o['novel'], '|', o['text'][:120])
print('niska pewność:', len(low)); [print('  ', l[0], l[1], l[2]['cited'], '->', l[2]['now'], l[2]['score'], l[2]['text'][:90]) for l in low]

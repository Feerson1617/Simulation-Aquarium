"""Apply the reviewed UI edits to the large, bundled HTML without touching assets."""
from pathlib import Path

path = Path('index.html')
source = path.read_text()
replacements = [
    ('${xt(e.icon,70)}</div><div class="latin-large">', '${catalogImage(e)}</div><div class="latin-large">'),
    ('${xt(e.icon,88)}</div><div class="latin-large">', '${catalogImage(e)}</div><div class="latin-large">'),
    ('<div class="section-title">Position & Größe</div>${Ja("x","Links ↔ rechts",-3.1,3.1,.1,i.x)}${Ja("z","Hinten ↔ vorne",-1.3,1.3,.1,i.z)}', '<div class="section-title">Drehung & Größe</div>'),
    ('Fische schwimmen um die gewählte Position.', 'Fische bewegen sich selbstständig im Becken.'),
    (':\'<button class="secondary" data-act="place-selected" style="width:100%;margin-bottom:13px">Im Becken durch Antippen versetzen</button>\'', ':\'\''),
    ('n==="place-selected"&&(vt?.beginPlacement(li),ot=null,$e(),Ft("Tippe auf die gewünschte Stelle im Becken.")),', ''),
    ('if(t.entitySetting){const n=I.entities.find(s=>s.uid===li);', 'if(t.entitySetting){if(!["rotation","scale"].includes(t.entitySetting))return;const n=I.entities.find(s=>s.uid===li);'),
]
for before, after in replacements:
    count = source.count(before)
    if count == 0 and after and after in source:
        continue
    if count == 0 and not after and before not in source:
        continue
    if count != 1:
        raise SystemExit(f'Expected one reviewed source fragment, got {count}: {before[:100]}')
    source = source.replace(before, after, 1)
assert '${Ja("x",' not in source and '${Ja("z",' not in source
assert 'data-act="place-selected"' not in source
assert source.count('${catalogImage(e)}</div><div class="latin-large">') == 2
if source != path.read_text():
    path.write_text(source)
    print('Applied species/individual catalog images and removed coordinate controls and click placement.')
else:
    print('Reviewed UI patch is already applied.')

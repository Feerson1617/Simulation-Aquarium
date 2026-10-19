"""Print bounded UI excerpts without dumping embedded model bytes."""
import re
from pathlib import Path

source = Path('index.html').read_text()
pattern = re.compile(r'catalogImage\(|catalogCredit\(|shopFishFields\(|individualCard\(|type=["\']range|Farbe[^<>]{0,80}(?:Vererb|wählen)|data-(?:pos|entity-[xz])|Position im Aquarium|entitySetting|place-selected|tweezers-selected|detail-visual|aquarium[A-Z]\\w*\\s*=|class g1|specimen-stage')
spans = []
for match in pattern.finditer(source):
    start, end = max(0, match.start() - 1100), min(len(source), match.end() + 1500)
    if spans and start <= spans[-1][1]:
        spans[-1] = (spans[-1][0], max(end, spans[-1][1]))
    else:
        spans.append((start, end))
for start, end in spans:
    excerpt = source[start:end]
    excerpt = re.sub(r'[A-Za-z0-9+/=]{2000,}', '[embedded bytes omitted]', excerpt)
    print(f'UI SOURCE OFFSET {start}..{end}\n{excerpt}\n')
print(f'Total source bytes: {len(source.encode())}; matching regions: {len(spans)}')

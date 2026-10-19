"""Print bounded UI source excerpts; never dump embedded model bytes."""
import re
from pathlib import Path

source = Path('index.html').read_text()
lines = source.splitlines()
pattern = re.compile(r'catalogImage|catalogCredit|shopFishFields|individualCard|type=["\']range|data-(?:position|entity|prop)|Farbe.*(?:Vererb|wählen)|function (?:render|show|open).*?(?:Species|Entity|Detail)|pos-[xz]|position-[xz]|Links.*Rechts|Vorne.*Hinten', re.I)
seen = set()
for index, line in enumerate(lines):
    if len(line) > 8000 or not pattern.search(line):
        continue
    for cursor in range(max(0, index - 2), min(len(lines), index + 3)):
        if cursor in seen or len(lines[cursor]) > 8000:
            continue
        seen.add(cursor)
        print(f'{cursor + 1}: {lines[cursor]}')

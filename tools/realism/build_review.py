"""Build the honest catalog review from real browser inventory and local previews.

Usage: python3 tools/realism/build_review.py /tmp/aquarium-graphics-results/<run>
This records technical coverage, not automatic photographic approval.
"""
import argparse, collections, json, shutil
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/realism'
LABELS = {
    'original': 'Originales oder ausreichend detailliertes realistisches 3D-Modell integriert',
    'improved': 'Bestehendes Modell wesentlich verbessert',
    'simplified': 'Noch deutlich vereinfachtes Modell vorhanden',
    'unavailable': 'Kein geeignetes Modell verfügbar',
}
CHANGES = {
    'fish': 'Artspezifischer Körperquerschnitt mit Kopf, Rumpf und Schwanzstiel; feinere Flossen, Kiemendeckel und PBR-Schuppendetail; körperbezogene Größen und geglättete Schwimmbewegung.',
    'plant': 'Feiner unterteilte artspezifische Blätter und Stängel, zugespitzte Bandblätter, lokale Blattnormalen und Strömungsverformung.',
    'invert': 'Vorhandene artspezifische Geometrie feiner unterteilt; PBR-Panzer-/Schalendetail. Kein neuer anatomischer Sculpt.',
    'coral': 'Vorhandene Kolonie-/Polypengeometrie feiner unterteilt; PBR-Oberflächen und Strömungsverformung weicher Kolonien. Kein neuer Korallitensculpt.',
    'decor': 'Bisherige Geometrie durch eigenes Blender-GLB mit geglätteten organischen Formen, Vertexfarben, Oberflächendetail und zwei LODs ersetzt.',
    'tank': 'Produktmodell mit konkreten Abmessungen und einzelnen Scheiben; laufendes Becken mit klarer dünner Glasapproximation und profilabhängiger Wasseroberfläche.',
    'filter': 'Gemeinsame Produkt-/Szenengeometrie mit Gehäuse, Ansaug-/Auslassdetails, Schläuchen und differenzierten Materialien.',
    'light': 'Gemeinsame Leuchtengeometrie mit Gehäuse, Trägern und LED-Zellen beziehungsweise zwei T5-Röhren.',
    'equipment': 'Gemeinsame Technikmodelle mit Gehäuse, Saugnäpfen, Spule beziehungsweise Schlauchdetails und differenzierten Materialien.',
    'substrate': 'Eigenes Körnungs-/Normalenmaterial im Becken; lokale Produktverpackung mit Sichtfenster desselben Materials.',
    'additive': 'Lokale schematische Produktverpackung mit gedrucktem Etikett; keine Herstellerfotografie und kein dauerhaft platziertes Beckenobjekt.',
    'food': 'Lokale schematische Produktverpackung; Frostfutter mit Blistermulden. Kein dauerhaft platziertes Beckenobjekt.',
}
GAPS = {
    'fish': 'Artbezogene Kopf-/Maul- und Flossenstrahlanatomie, Mikroschuppen und Farbvarianten anhand weiterer Fotos modellieren; native Flächen wirken weiterhin künstlich.',
    'plant': 'Blattnerven, Blattdicke, unregelmäßige Wuchsvarianten und artspezifisch gescannte/handgemalte Texturen fehlen; Nahansichten noch vereinfacht.',
    'invert': 'Segmentübergänge, Gelenke, Mundwerkzeuge und transparente innere Strukturen artspezifisch neu modellieren; derzeit deutlich primitive Teilformen.',
    'coral': 'Koralliten, Polypenverteilung, echte Skelettporen und artspezifische Tentakel verfeinern; wiederholte Grundformen bleiben erkennbar.',
    'decor': 'Hochwertige Makro-/Mikrostruktur und echte Holz-/Gesteinsreferenzoberflächen fehlen; geglättete Formen wirken teilweise zu weich.',
    'tank': 'Silikonnähte und reale Scheibenstärke fehlen; Glas ist eine dünne Reflexionsapproximation. Die laufende Welt ist nicht für alle Beckentypen in Zentimetern kalibriert.',
    'filter': 'Feine Bauteilverbindungen, Beschriftung und Gebrauchsspuren fehlen; funktionale Geometrie bleibt vereinfacht.',
    'light': 'Feine Bauteile, reale photometrische Lichtverteilung und Herstellerdetails fehlen; keine Produktreplik.',
    'equipment': 'Feine Bauteile, Beschriftung und transparente Innenaufbauten fehlen; technische Form bleibt vereinfacht.',
    'substrate': 'Körnung ist eine PBR-Normalenapproximation; keine einzelnen räumlichen Kiesel oder volumetrische Sandschicht.',
    'additive': 'Schematische Verpackung, kein hochwertig modelliertes reales Produkt. Verbrauch bleibt eine biologische Aktion.',
    'food': 'Schematische Verpackung, kein hochwertig modelliertes reales Produkt; keine individuellen Futterpartikel.',
}


def build(run):
    manifest = json.loads((ROOT / 'assets/catalog/manifest.json').read_text())
    inventory = json.loads((run / 'anatomy-inventory.json').read_text())
    audits = json.loads((run / 'model-audit-ipad.json').read_text())
    audit = {item['id']: item for item in audits}
    assert len(manifest) == len(inventory) == 181 and len(audit) == 144
    rows = []
    for item in inventory:
        id, category = item['id'], item['category']
        source = manifest[id]['provenance']
        status = 'original' if id == 'betta' else 'simplified' if category in ['invert', 'coral', 'tank', 'food', 'additive'] else 'improved'
        change, gap = CHANGES[category], GAPS[category]
        if source.get('kind') == 'photo':
            change = 'Vorhandenes fototexturiertes 3D-Volumenmodell erhalten; Desktop-Unterteilung für weiche Verformung, PBR und gemeinsame Größen-/Strömungsdarstellung ergänzt.'
            gap = 'Vorhandene Fototextur begrenzt Perspektivtreue, Schärfe und Motivvarianten; Unterteilung allein verbessert die anatomische Silhouette nicht.'
        elif id == 'betta':
            change = 'Vorhandenes BlueMesh-Original mit Rig, Texturen und Künstlermaterialien erhalten; gemeinsame Größen-, Wasser- und Profilanbindung.'
            gap = 'Keine neue Modellierung; vorhandene Zuchtform repräsentiert nicht alle Geschlechter/Farbformen. Gesamtlicht und Nahansicht noch nicht im angestrebten AAA-Niveau abgenommen.'
        features = source.get('features') or (item.get('anatomy') or {}).get('features') or []
        rows.append({
            'id': id, 'name': item['name'], 'category': category,
            'statusCode': status, 'status': LABELS[status], 'change': change,
            'retainedSpeciesFeatures': features, 'source': source,
            'references': source.get('references') or ([source['sourceUrl']] if source.get('sourceUrl') else []),
            'desktop': {'catalogHighRendered': True, 'revision': manifest[id]['renderRevision'], 'maximumIndividuallyReviewed': id in ['neon', 'anubias', 'amanoshrimp', 'softleather']},
            'ipad': audit.get(id) or {'modelPath': 'product-only', 'note': 'Produktvorschau Hoch; Technik/Bodengrund über gemeinsamen Szenenbau geprüft, kein Einzelmodell-Audit aller Produkte.'},
            'remainingWork': gap, 'photorealisticAccepted': False,
        })
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'catalog-inventory.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
    counts = collections.Counter(row['statusCode'] for row in rows)
    text = '# Bearbeitungsstand aller 181 Katalogeinträge\n\n'
    text += '**Technisch berücksichtigt: 181/181. Vollständig nach dem gewünschten Fotorealismusmaßstab abgenommen: 0/181.** '
    text += '„Wesentlich verbessert“ beschreibt den Eingriff gegenüber dem Bestand, nicht erreichten Fotorealismus. Das eine erhaltene Künstlermodell ist kein neuer Ersatz.\n\n'
    text += '| Klasse | Anzahl |\n| --- | ---: |\n'
    text += ''.join(f'| {label} | {counts[code]} |\n' for code, label in LABELS.items())
    text += '\nAlle 181 Vorschaubilder wurden aus dem realen Modell-/Produktrenderpfad unter **Hoch** erzeugt und als Kontaktbögen gesichtet. Alle 144 Organismen-/Dekorationspfade wurden einzeln unter **iPad** auf Geometrie und endliche Grenzen geprüft. Maximum wurde mit eingerichteten Süß-/Meerwasserbecken und vier Live-Nahansichten geprüft, nicht mit 181 einzelnen Maximum-Abnahmen. Keine unabhängige zoologische Vollabnahme.\n\n'
    text += 'Die [JSON-Matrix](catalog-inventory.json) enthält Quellen, artbezogene Bestandsmerkmale und tatsächlich gemessene iPad-Geometrien. Quellenlinks der Bestandsmodelle sind keine Behauptung, dass alle externen Webseiten neu abgerufen wurden.\n\n'
    text += '| ID · Eintrag | Gruppe | Klasse | Tatsächliche Änderung | Noch erforderlich |\n| --- | --- | --- | --- | --- |\n'
    for row in rows:
        esc = lambda value: str(value).replace('|', '\\|').replace('\n', ' ')
        text += '| ' + ' | '.join(esc(value) for value in [row['id'] + ' · ' + row['name'], row['category'], LABELS[row['statusCode']], row['change'], row['remainingWork']]) + ' |\n'
    (OUT / 'CATALOG_STATUS.md').write_text(text)
    shutil.copyfile(run / 'model-audit-ipad.json', OUT / 'model-audit-ipad.json')
    # These are explicitly model previews, not substituted live-game screenshots.
    groups = {'fish': ['fish'], 'plants': ['plant'], 'invertebrates-corals': ['invert', 'coral'], 'hardscape': ['decor'], 'products': ['tank', 'filter', 'light', 'equipment', 'substrate', 'additive', 'food']}
    for name, categories in groups.items():
        subset = [row for row in rows if row['category'] in categories]
        cols, w, h = 6, 230, 178
        sheet = Image.new('RGB', (cols * w, ((len(subset) + cols - 1) // cols) * h), '#faf9f3')
        draw = ImageDraw.Draw(sheet)
        for n, row in enumerate(subset):
            x, y = n % cols * w, n // cols * h
            im = Image.open(ROOT / 'assets/catalog' / (row['id'] + '.webp')).convert('RGB')
            im.thumbnail((w, h - 28))
            sheet.paste(im, (x, y));draw.text((x + 5, y + h - 25), row['id'], fill='#132b2b')
        sheet.save(OUT / f'catalog-{name}.jpg', quality=85)
    print(json.dumps({'entries': len(rows), 'statusCounts': dict(counts), 'photorealisticAccepted': 0}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser();parser.add_argument('browser_run', type=Path)
    build(parser.parse_args().browser_run)

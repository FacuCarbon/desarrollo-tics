"""Import the local course without discarding slides, notes, tables or originals."""
import hashlib
import json
import re
import shutil
import sys
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET
sys.stdout.reconfigure(encoding='utf-8')

SOURCE = Path(r'C:\Users\facun\Downloads\nube')
ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public' / 'nube'
DEST.mkdir(parents=True, exist_ok=True)
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
documents = []
for path in sorted(SOURCE.iterdir()):
    if path.suffix.lower() not in ('.pptx', '.docx'):
        continue
    shutil.copy2(path, DEST / path.name)
    pages = []
    with zipfile.ZipFile(path) as archive:
        if path.suffix.lower() == '.pptx':
            names = sorted((n for n in archive.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)), key=lambda n: int(re.search(r'(\d+)\.xml', n)[1]))
            for number, name in enumerate(names, 1):
                root = ET.fromstring(archive.read(name))
                paragraphs = [''.join(t.text or '' for t in p.iter(A + 't')) for p in root.iter(A + 'p')]
                images = []
                relpath = f'ppt/slides/_rels/slide{number}.xml.rels'
                if relpath in archive.namelist():
                    import posixpath
                    for rel in ET.fromstring(archive.read(relpath)):
                        if rel.attrib.get('Type', '').endswith('/image') and rel.attrib.get('TargetMode') != 'External':
                            target = posixpath.normpath(posixpath.join('ppt/slides', rel.attrib['Target']))
                            if target in archive.namelist() and Path(target).suffix.lower() in ('.png', '.jpg', '.jpeg', '.gif', '.svg'):
                                image_name = path.stem + '-' + Path(target).name
                                (DEST / image_name).write_bytes(archive.read(target))
                                images.append('/nube/' + image_name)
                note = f'ppt/notesSlides/notesSlide{number}.xml'
                notes = []
                if note in archive.namelist():
                    notes = [''.join(t.text or '' for t in p.iter(A + 't')) for p in ET.fromstring(archive.read(note)).iter(A + 'p')]
                pages.append({'number': number, 'paragraphs': [p for p in paragraphs if p.strip()], 'notes': [p for p in notes if p.strip() and p.strip() != str(number)], 'images': images})
        else:
            root = ET.fromstring(archive.read('word/document.xml'))
            paragraphs = [''.join(t.text or '' for t in p.iter(W + 't')) for p in root.iter(W + 'p')]
            pages.append({'number': 1, 'paragraphs': [p for p in paragraphs if p.strip()], 'notes': []})
    documents.append({'file': path.name, 'href': '/nube/' + path.name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'pages': pages})
(ROOT / 'src/data/cloudSources.json').write_text(json.dumps(documents, ensure_ascii=False, indent=2), encoding='utf-8')
for doc in documents:
    print('\n###', doc['file'], len(doc['pages']), 'páginas')
    for page in doc['pages']:
        print(f"\n[{page['number']}] " + ' | '.join(page['paragraphs']))

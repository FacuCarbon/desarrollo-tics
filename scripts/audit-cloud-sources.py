"""Independently check the imported text and original binaries against the course files."""
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')
root = Path(__file__).resolve().parents[1]
source = Path(r'C:\Users\facun\Downloads\nube')
documents = json.loads((root / 'src/data/cloudSources.json').read_text(encoding='utf-8'))
a = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
w = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
slides = 0
for doc in documents:
    original = source / doc['file']
    imported = root / 'public/nube' / doc['file']
    expected = hashlib.sha256(original.read_bytes()).hexdigest()
    assert expected == doc['sha256'] == hashlib.sha256(imported.read_bytes()).hexdigest(), doc['file']
    with zipfile.ZipFile(original) as archive:
        if original.suffix.lower() == '.pptx':
            names = sorted((name for name in archive.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', name)), key=lambda name: int(re.search(r'(\d+)\.xml', name)[1]))
            ns = a
        else:
            names = ['word/document.xml']
            ns = w
        assert len(names) == len(doc['pages']), doc['file']
        for number, name in enumerate(names, 1):
            paragraphs = [''.join(t.text or '' for t in p.iter(ns + 't')) for p in ET.fromstring(archive.read(name)).iter(ns + 'p')]
            assert [text for text in paragraphs if text.strip()] == doc['pages'][number - 1]['paragraphs'], (doc['file'], number)
        slides += len(names)
    print(f"OK {doc['file']}: original íntegro y {len(names)} diapositivas/secciones con texto contrastado")
assert len(documents) == len(list(source.glob('*.pptx'))) + len(list(source.glob('*.docx')))
print(f'PASS: {len(documents)} archivos, {slides} diapositivas/secciones. Hashes y texto coinciden con Downloads/nube.')

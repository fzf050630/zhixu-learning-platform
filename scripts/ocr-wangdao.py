"""Cache OCR for the scanned textbooks' theoretical sections for private review."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tmp/wangdao-libs'))
import pymupdf

OUTPUT = ROOT / 'tmp/wangdao-audit'
TESSERACT = Path(r'C:\Program Files\Tesseract-OCR\tesseract.exe')
TESSDATA = OUTPUT / 'tessdata'

def prepare_languages():
    TESSDATA.mkdir(exist_ok=True)
    models = {
        'chi_sim': Path(r'C:\Users\RECAORD\tessdata\chi_sim.traineddata'),
        'eng': Path(r'C:\Program Files\Tesseract-OCR\tessdata\eng.traineddata'),
    }
    for language, model in models.items():
        target = TESSDATA / (language + '.traineddata')
        if not target.exists():
            shutil.copyfile(model, target)

def theory_pages(toc, count):
    pages = set()
    for index, (level, title, start) in enumerate(toc):
        if level != 2 or not (re.match(r'\*?\d+\.\d+\s', title) or re.search('归纳总结|本章小结|常见问题|疑难点|思维拓展', title)):
            continue
        end = count
        for next_level, next_title, next_page in toc[index + 1:]:
            if next_level <= level or re.search('试题精选|习题精选|答案与解析', next_title):
                end = next_page
                break
        pages.update(range(start, max(start, end) + 1))
    return sorted(p for p in pages if p <= count)

def ocr_one(name, page, image, destination):
    text = destination.with_suffix('.txt')
    if text.exists() and text.stat().st_size > 100:
        return name, page, True
    env = dict(os.environ, OMP_THREAD_LIMIT='1')
    result = subprocess.run([str(TESSERACT), str(image), str(destination), '--tessdata-dir', str(TESSDATA), '-l', 'chi_sim+eng', '--psm', '3'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env, timeout=90)
    if result.returncode:
        raise RuntimeError(f'{name} p.{page}: OCR failed')
    return name, page, False

def main():
    prepare_languages()
    selected = sys.argv[1:] or ['data-structures', 'computer-organization', 'computer-networks']
    jobs = []
    for name in selected:
        data = json.loads((OUTPUT / (name + '.json')).read_text(encoding='utf-8'))
        document = pymupdf.open(data['source'])
        pages = theory_pages(data['toc'], len(document))
        directory = OUTPUT / name
        (directory / 'theory').mkdir(exist_ok=True)
        (directory / 'ocr').mkdir(exist_ok=True)
        (directory / 'theory-pages.json').write_text(json.dumps(pages), encoding='utf-8')
        for page in pages:
            image = directory / 'theory' / f'page-{page:03}.png'
            if not image.exists():
                document[page - 1].get_pixmap(dpi=180).save(str(image))
            jobs.append((name, page, image, directory / 'ocr' / f'page-{page:03}'))
        print(name, 'theory pages:', len(pages), flush=True)
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = [executor.submit(ocr_one, *job) for job in jobs]
        for index, future in enumerate(as_completed(futures), 1):
            name, page, cached = future.result()
            if index % 10 == 0 or index == len(jobs):
                print(f'OCR {index}/{len(jobs)}; {name} PDF p.{page}', flush=True)

if __name__ == '__main__':
    main()

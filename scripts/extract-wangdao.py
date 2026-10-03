"""Read the supplied Wangdao PDFs into local audit working files; never publish PDF text."""
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tmp/wangdao-libs'))
import pymupdf as fitz

BOOKS = {
    'data-structures': ROOT / '数据结构可视化/27王道《数据结构》高清带书签.pdf',
    'computer-organization': ROOT / '计算机组成原理可视化/27王道《计算机组成原理》高清带书签.pdf',
    'operating-systems': ROOT / '操作系统/26王道《计算机操作系统》.pdf',
    'computer-networks': ROOT / '计算机网络/27王道《计算机网络》高清带书签.pdf',
}

def extract():
    output = ROOT / 'tmp/wangdao-audit'
    output.mkdir(parents=True, exist_ok=True)
    for name, source in BOOKS.items():
        document = fitz.open(source)
        toc = document.get_toc()
        pages = [{'pdfPage': index + 1, 'text': page.get_text()} for index, page in enumerate(document)]
        (output / (name + '.json')).write_text(json.dumps({'source': str(source), 'pages': len(document), 'toc': toc, 'pageText': pages}, ensure_ascii=False), encoding='utf-8')
        (output / (name + '-toc.txt')).write_text('\n'.join(f'{level}\tPDF p.{page}\t{title}' for level, title, page in toc), encoding='utf-8')
        directory = output / name
        directory.mkdir(exist_ok=True)
        for index in range(min(16, len(document))):
            document[index].get_pixmap(dpi=120).save(str(directory / f'page-{index + 1:03}.png'))
        print(name, 'pages', len(document), 'outline entries', len(toc), 'text pages', sum(len(page['text'].strip()) > 100 for page in pages))

if __name__ == '__main__':
    extract()

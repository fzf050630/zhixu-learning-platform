"""Freeze verified textbook headings/page anchors; no book paragraphs are published."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
topics = json.loads((ROOT / 'tmp/wangdao-audit/data-structures-topics.json').read_text(encoding='utf-8'))
chapters = [
    ('ch1', '绪论', 13), ('ch2', '线性表', 25), ('ch3', '栈、队列和数组', 75),
    ('ch4', '串', 121), ('ch5', '树与二叉树', 136), ('ch6', '图', 206),
    ('ch7', '查找', 276), ('ch8', '排序', 343),
]
data = {'book': '27王道《数据结构》高清带书签.pdf', 'version': 2027, 'pdfPages': 404,
        'chapters': [{'id': identifier, 'title': title, 'pdfPage': page, 'no': index + 1} for index, (identifier, title, page) in enumerate(chapters)], 'topics': topics}
directory = ROOT / 'docs/408-curricula'
directory.mkdir(parents=True, exist_ok=True)
(directory / 'data-structures-source-topics.json').write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
script = '// Textbook heading metadata; explanations are independently authored.\n(function(g){g.DS=g.DS||{};g.DS.WangdaoOutline=' + json.dumps(data, ensure_ascii=False, indent=2) + ';})(globalThis);\n'
(ROOT / '数据结构可视化/content/wangdao-outline.js').write_text(script, encoding='utf-8')
print('Frozen DS theory anchors:', len(topics))

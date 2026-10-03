(function (g) {
  'use strict';
  const outline = g.DS.WangdaoOutline;
  const details = g.DS.WangdaoDetails;
  if (!outline || !details) throw new Error('王道知识内容未按顺序加载');
  const topics = outline.topics.map(source => {
    const content = details[source.id];
    if (!content || !Array.isArray(content.paragraphs) || !content.paragraphs.length || !Array.isArray(content.rules) || !content.rules.length || !content.example) {
      throw new Error('王道知识说明缺失：' + source.id);
    }
    return Object.freeze({ ...source, ...content });
  });
  const chapters = outline.chapters.map(chapter => Object.freeze({ ...chapter,
    topics: Object.freeze(topics.filter(topic => topic.id.split('.')[0] === String(chapter.no))),
  }));
  g.DS.Wangdao = Object.freeze({ source: outline.book, version: outline.version,
    chapters: Object.freeze(chapters), topics: Object.freeze(topics),
  });
})(globalThis);

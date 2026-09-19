(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const names = ["linear", "stack-queue", "tree", "graph", "search", "sort"];
  const extensions = node ? require('./extensions.js') : root.DS.Extensions;
  const api = factory(extensions.extend(
    names.map((name) =>
      node
        ? require("./chapters/" + name + ".js")
        : root.DS.ChapterModules[name],
    )),
  );
  if (node) module.exports = api;
  root.DS.Content = api;
})(globalThis, function (modules) {
  "use strict";
  const ids = new Set();
  const chapterIds = new Set();
  const chapters = [];
  const experiments = [];
  for (const entry of modules) {
    if (!entry || !entry.chapter || !Array.isArray(entry.experiments))
      throw new Error("章节清单无效");
    if (chapterIds.has(entry.chapter.id))
      throw new Error("重复章节：" + entry.chapter.id);
    chapterIds.add(entry.chapter.id);
    for (const experiment of entry.experiments) {
      if (ids.has(experiment.id)) throw new Error("重复实验：" + experiment.id);
      if (experiment.chapter !== entry.chapter.id)
        throw new Error("实验章节不匹配：" + experiment.id);
      ids.add(experiment.id);
      experiments.push(experiment);
    }
    chapters.push(
      Object.freeze({
        ...entry.chapter,
        experiments: Object.freeze(entry.experiments.map((e) => e.id)),
      }),
    );
  }
  return {
    chapters: Object.freeze(chapters),
    experiments: Object.freeze(experiments),
  };
});

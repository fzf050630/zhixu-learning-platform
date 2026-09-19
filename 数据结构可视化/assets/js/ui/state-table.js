(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DS = root.DS || {};
  root.DS.StateTable = api;
})(globalThis, function () {
  "use strict";
  const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  function formatValue(value) {
    if (value === undefined) return "—";
    if (value === null) return "∅";
    if (value === Infinity) return "∞";
    if (value === -Infinity) return "−∞";
    if (typeof value === "boolean") return value ? "是" : "否";
    if (Array.isArray(value)) return value.length ? value.map(formatValue).join(" → ") : "∅";
    return String(value);
  }
  function describeState(s) {
    const tables = [];
    const add = (title, columns, rows) => tables.push({ title, columns, rows });
    if (s.pointers) add('实际指针位置（节点 ID）', ['指针', '指向'], Object.entries(s.pointers).map(([name,id])=>[name,id===null?'NULL':id]));
    const includes = (values, value) => Array.isArray(values) && values.includes(value);
    if (["array", "stack", "queue"].includes(s.kind)) {
      add(s.kind === "queue" ? "物理槽位" : "元素状态", ["下标", "值", "当前标记"], (s.values || []).map((value, i) => {
        const marks = [];
        if (includes(s.active, i) || s.active === i) marks.push("访问");
        if (includes(s.fixed, i)) marks.push("有序标记");
        for (const key of ["low", "high", "mid", "pivotIndex", "front", "rear", "found"])
          if (s[key] === i) marks.push(key);
        if (s.kind === "stack" && i === s.values.length - 1) marks.push("top");
        return [i, value, marks.length ? marks.join(" / ") : undefined];
      }));
    } else if (s.kind === "graph") {
      const fields = [["distances", "距离"], ["previous", "前驱"], ["indegrees", "入度"], ["earliest", "ve"], ["latest", "vl"]].filter(([key]) => has(s, key));
      const flags = [["fixed", "已确定/选中"], ["visited", "已访问"]].filter(([key]) => has(s, key));
      add("顶点状态", ["顶点", ...fields.map(([, label]) => label), ...flags.map(([, label]) => label)], (s.graph?.nodes || []).map(({ id }) => [id, ...fields.map(([key]) => s[key]?.[id]), ...flags.map(([key]) => includes(s[key], id))]));
    } else if (s.kind === 'string') {
      add('模式串前缀表', ['下标', '字符', 'pi'], [...s.pattern].map((ch, i) => [i, ch, s.pi[i]]));
      add('匹配进度', ['阶段', 'i', 'j', '结果下标'], [[s.phase === 'prefix' ? '构造 pi' : '匹配', s.i, s.j, s.found]]);
    } else if (s.kind === 'adjacency') {
      add('邻接矩阵（∅ 表示无边）', ['起点 / 终点', ...s.ids], s.matrix.map((row, i) => [s.ids[i], ...row]));
      add('邻接表', ['顶点', '邻接项（终点，权值）'], s.ids.map(id => [id, s.lists[id].map(([to,w]) => `${to} (${w})`)]));
    } else if (s.kind === "matrix") {
      add("最短距离矩阵", ["起点 / 终点", ...s.ids], s.matrix.map((row, i) => [s.ids[i], ...row]));
    } else if (s.kind === "hash") {
      add("散列桶", ["桶下标", "链内容", "当前桶"], s.buckets.map((bucket, i) => [i, bucket, s.index === i]));
    } else if (s.parents) {
      add("并查集", ["元素", "父节点", "根"], Object.keys(s.parents).map((id) => [id, s.parents[id], s.roots?.[id]]));
    } else if (s.tree) {
      add("树节点关系", ["节点 ID", "显示值", "左孩子", "右孩子"], Object.entries(s.tree.nodes).map(([id, children]) => [id, s.tree.labels?.[id] ?? id, children[0], children[1]]));
    } else if (s.kind === "linked") {
      const rows = [];
      for (const [label, nodes] of [[s.done ? "新链表" : "待处理", s.nodes || []], ["已逆置", s.reversed || []]])
        nodes.forEach((node, i) => rows.push([node.id, node.value, label, nodes[i + 1]?.id ?? null]));
      if (s.floating) rows.push([s.floating.id, s.floating.value, "暂存节点", undefined]);
      add("链表分段", ["节点 ID", "值", "所属段", "段内后继"], rows);
    }
    if (s.activities) add('活动时差', ['活动', '工期', 'e', 'l', '时差', '关键活动'], s.activities.map(a => [a.from + ' → ' + a.to, a.weight, a.e, a.l, a.slack, a.slack === 0]));
    const labels = {
      gap: '增量 gap', minIndex: '当前最小值下标', round: '松弛轮次', negativeCycle: '负环', hasCycle: '有环',
      low: "low", high: "high", mid: "mid", found: "找到的下标（-1 表示未找到）", target: "目标值", range: "当前区间", pivotIndex: "枢轴下标", heapEnd: "堆末下标", key: "暂存值",
      front: "front（队头槽位）", rear: "rear", tail: "队尾元素下标（空队列为∅）", capacity: "物理容量", logical: "逻辑队列（队头 → 队尾）", removed: "出栈值",
      frontier: "待访问队列", activeStack: "递归栈", output: "输出顺序", current: "当前节点", activeEdge: "当前边", selectedEdges: "已选边（端点、权值）", totalWeight: "总权值", criticalEdges: "关键活动", duration: "工期",
      queue: "待访问队列", inorder: "中序序列", forest: "森林根节点", rootWeight: "根权值", leafCount: "叶子数", count: "已存元素数", value: "待插入值", k: "中间顶点下标",
    };
    const variables = Object.entries(labels).filter(([key]) => has(s, key)).map(([key, label]) => [label, s[key]]);
    if (s.kind === "stack") variables.unshift(["top（-1 表示空栈）", s.values.length - 1]);
    if (s.tree) variables.unshift(["根节点", s.tree.root]);
    if (variables.length) add("当前变量", ["变量", "值"], variables);
    return tables;
  }
  function clear(container) {
    container.replaceChildren();
    container.hidden = true;
  }
  function render(container, state, customDescribe) {
    const descriptions = customDescribe ? customDescribe(state) : describeState(state);
    const document = container.ownerDocument;
    const fragment = document.createDocumentFragment();
    for (const { title, columns, rows } of descriptions) {
      const scroll = document.createElement("div");
      scroll.className = "state-table-scroll";
      scroll.tabIndex = 0;
      scroll.setAttribute("role", "region");
      scroll.setAttribute("aria-label", title);
      const table = document.createElement("table");
      const caption = table.createCaption();
      caption.textContent = title;
      const head = table.createTHead().insertRow();
      columns.forEach((label) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = label;
        head.append(th);
      });
      const body = table.createTBody();
      rows.forEach((row) => {
        const tr = body.insertRow();
        row.forEach((value) => { tr.insertCell().textContent = formatValue(value); });
      });
      scroll.append(table);
      fragment.append(scroll);
    }
    // Reuse the enclosing container: scrolling the page never changes playback.
    container.replaceChildren(fragment);
    container.hidden = descriptions.length === 0;
  }
  return { describeState, formatValue, render, clear };
});

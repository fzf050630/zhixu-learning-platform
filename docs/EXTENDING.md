# 后续科目接入约定

首期有七个稳定科目 ID：`data-structures`、`computer-organization`、`operating-systems`、`computer-networks`、`calculus`、`linear-algebra`、`probability`。后续沿用这些 ID，不按页面中文标题重新生成。

## 学科模块边界

- 学科负责自己的课程内容、实验引擎、章节 hash 路由、挂载/销毁与学习状态。
- 平台负责科目元数据、共享视觉变量、平台导航、跨科目搜索目录、主题和最近访问。
- 暂不强迫所有科目采用同一实验引擎。新科目可用 Canvas、SVG 或其他本地化实现，保持静态可部署即可。
- 可播放实验在离开页面或切换实验时需释放计时器、事件与观察器；控件保留原生键盘行为。

## 接入步骤

1. 创建科目源码目录及 `index.html`。用 `data-subject="对应ID"` 标记 html 元素。
2. 在 `platform/subjects.js` 把对应科目设为 `status: 'ready'`，填写相对源码根目录的 `path`、默认 `home` hash、说明文字。科目名称、分组和状态由此文件集中维护。
3. 在页面自己的样式之后引入 `platform/tokens.css`、`components.css` 以及所需适配样式；在 head 中依次引入 `subjects.js`、`theme.js`。实际相对层级参考现有两个项目。
4. 在学科主脚本之后加载 `catalog.js`、`navigation.js`。共享导航自动插入页头。不要建立第二套全平台侧栏。
5. 从 `window.Zhixu.Theme.get()` 获取主题，通过 `Theme.set('dark')` 或 `Theme.toggle()` 修改；监听 `zhixu:theme` 仅重绘图形，不重建整个知识点以免丢失参数。
6. 在 `scripts/catalog.cjs` 增加本学科的数据读取与目录转换。每条记录包含 `subject`、`title`、`chapter`、`hash`、`kind`；统计包含 `chapters`、`items`、`visualizations`、`unit`。hash 必须能直达真实页面，不复制课程正文。
7. 在 `scripts/build.cjs` 的科目发布映射加入 `[源码目录, 科目ID]`。默认复制 `index.html`、`assets/`、`content/`，其余文件不会自动发布。新增必要文件类型时扩充白名单并补发布测试。
8. 运行 `npm run build`，验证源码及 `dist/subjects/科目ID/index.html` 的根路径/子路径访问、主题、搜索入口、手机布局和无效 hash 处理。

当前发布与目录生成已配置全部七个科目：数据结构、计算机组成原理、操作系统、计算机网络、高等数学、线性代数、概率论与数理统计。新增科目时需完成数据适配和发布映射，不能只打开入口。

## 数据约定

- 最近访问仅接收目录中存在的 `subject + hash`，最多四条，不接受任意 URL。
- 主题键为 `zhixu-theme-v1`，兼容 `ds-theme` 与 `kaoyan-prob-theme`。
- 概率论进度保持 `kaoyan-prob-progress-v1`，不做破坏性迁移。
- 当前科目掌握率含义不同，不将“打开过”当作“已掌握”，不在平台合成虚假总进度。
- 本期目录查询只在浏览器进行，不采集或上传搜索和学习记录。

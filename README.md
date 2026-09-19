# 知序 · 408 与考研数学交互学习平台

一个**纯静态、可离线**的交互学习平台：把 408 四科与考研数学的抽象知识拆成可播放、可拖动、可验证的图形与动画。无需账号、数据库与后端服务，构建产物即完整站点。

**在线体验：** <https://recaord.top/math-modeling/>

**代码仓库：** [GitHub](https://github.com/fzf050630/zhixu-learning-platform) · [Gitee](https://gitee.com/fu-zhifeng0630/zhixu-learning-platform)

![平台首页](docs/verification/platform/portal-1440-light.png)

![数据结构实验页](docs/verification/platform/data-structures-1440-light.png)

## 特性

- **七科全覆盖**：数据结构、计算机组成原理、操作系统、计算机网络、高等数学、线性代数、概率论与数理统计。
- **240 个学习入口**：54 个数据结构算法实验 + 186 个知识小节，支持全站搜索与深浅主题。
- **324 个交互可视化**：每一步都能动手调整参数、逐步播放、观察状态变化。
- **138 处算法说明**：出现算法的小节配有统一「算法流程」板块（做什么 / 输入与前提 / 执行步骤 / 关键点与易错 / 复杂度），数据结构 54 个实验各自附带同款说明面板。
- **零依赖运行**：无框架、无 CDN、无网络请求；KaTeX 与字体全部本地化，`file://` 直接打开也能使用。

| 科目 | 章节 | 小节/实验 | 交互可视化 | 算法流程板块 |
| --- | --- | --- | --- | --- |
| 数据结构 | 6 | 54 个实验 | 54 | 54 份实验说明 |
| 计算机组成原理 | 7 | 39 | 45 | 24 |
| 操作系统 | 5 | 16 | 23 | 31 |
| 计算机网络 | 6 | 21 | 30 | 29 |
| 高等数学 | 8 | 46 | 48 | — |
| 线性代数 | 6 | 20 | 30 | — |
| 概率论与数理统计 | 8 | 44 | 94 | — |

## 快速开始

需要 Node.js 20 或更新版本（仅用于构建与本地预览，运行站点不需要 Node）：

```bash
npm run dev
```

浏览器访问 <http://127.0.0.1:8766/>。修改源码后重新运行 `npm run build` 并刷新即可；也可以直接双击根目录 `index.html`，完整目录在一起时支持离线使用。

## 构建与部署

```bash
npm run build     # 生成 dist/（白名单发布，排除教材 PDF、源码备份与测试产物）
npm run preview   # 本地 HTTP 预览 dist/
```

`dist/` 是完整网站，只需部署这一目录：

1. **静态托管 / Nginx / 宝塔**：把 `dist/` 里的内容上传到站点目录，确保根目录直接包含 `index.html`、`platform/`、`subjects/`。项目使用 hash 路由，无需额外重写规则；部署到子目录（如 `/math-modeling/`）同样可用。
2. **Docker Compose**：

   ```bash
   docker compose up -d --build
   ```

   默认监听 `127.0.0.1:8080`，见 [部署说明](docs/DEPLOYMENT.md)。

## 工程结构

```text
index.html                        统一门户（七科入口、搜索、最近访问）
platform/                         共享层：主题、导航、门户脚本与样式
scripts/                          catalog / build / audit / serve / 校验脚本
subjects 目录（七个）              各科内容与可视化组件源码
  content/ch*.js                  章节内容（含算法板块与例题）
  assets/js/widgets/*.js          Canvas 交互组件
  assets/js/lib/draw.js           轻量绘图引擎（HiDPI / 主题联动 / 自适应）
  assets/css/main.css             科目样式
tests/                            平台单元测试与浏览器测试
docs/                             部署、扩展与验收文档
```

数据驱动的渲染方式：内容以 JS 数据块（`h3`、`p`、`table`、`fml`、`viz`、`algo` 等）声明，`app.js` 负责渲染；新增可视化只需实现一个 `window.WIDGETS.<name>` 组件并注册 `{ t: 'viz', build: '<name>' }` 内容块，详见 [扩展说明](docs/EXTENDING.md)。

## 测试

```bash
npm test                      # 平台结构与发布白名单测试
npm run audit                 # 七科内容结构审查（锚点、例题、易错点、组件引用）
npm run test:browser          # 门户与子路径浏览器测试（Playwright + 本机 Chrome）
npm --prefix 数据结构可视化 test           # 数据结构算法单元测试
npm --prefix 数据结构可视化 run test:browser  # 含全部 54 个实验自动播放
```

另有源码直检与发布产物全量检查脚本：`node scripts/check-source.cjs <科目目录>`、`node scripts/verify-all.cjs`（240 个入口逐一检查脚本错误、组件失败、KaTeX 错误与文本越界）。

## 设计与技术要点

- **零框架 Canvas 引擎**：`draw.js` 提供场景/坐标系、渐变图元、主题色读取与尺寸自适应，约 200 个可视化组件共用；标签在窄屏下自动收缩、画布可横向滚动，避免文字裁切。
- **内容与渲染分离**：算法步骤、伪代码、例题、易错点均为结构化数据，便于审查与生成目录。
- **可访问性与细节**：统一的键盘操作（`/` 搜索、`Esc` 关闭、方向键播放）、深浅主题持久化、打印样式、`prefers-reduced-motion` 降级。
- **字体**：正文首选 MiSans（回退思源黑体 / 苹方 / 微软雅黑），代码与数字使用 JetBrains Mono；全部随站点本地加载。
- **构建白名单**：发布脚本只复制运行所需文件，教材 PDF、备份、测试与开发文档不会进入 `dist/`。

## 数据与隐私

站点没有账号、数据库、埋点或网络请求。主题、最近访问与掌握标记保存在浏览器 `localStorage` 中，清理站点数据即清空，不跨设备同步。

## 开源协议

本项目以 [MIT License](LICENSE) 开源，可自由使用、修改与分发（保留版权声明）。

- 知识点整理自公开考试大纲与教材主线，页面中的讲解、步骤说明、图示与预设案例均为**独立编写**；仓库不含任何教材或大纲 PDF（已在 `.gitignore` 中排除）。
- 第三方资源：数学公式渲染 [KaTeX](https://katex.org/)（MIT）、代码字体 [JetBrains Mono](https://www.jetbrains.com/lp/mono/)（SIL OFL 1.1），均以本地文件形式随站点分发，版权归原作者所有。

## 贡献

欢迎提交 Issue 与 Pull Request：修正知识点、补充可视化、改进样式与可访问性均可。提交前请运行 `npm test`、`npm run audit` 与 `node scripts/check-source.cjs <对应科目>` 保证内容结构完整。

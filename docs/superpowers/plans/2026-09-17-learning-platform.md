# 知序平台 Implementation Plan

用户已批准设计并授权直接实施，当前会话顺序执行，无额外确认。

**Goal:** 交付可本地预览、可静态部署的七科学习框架，接入数据结构与概率论。

**Architecture:** 静态多页面、共享导航与主题、科目注册表、生成式搜索目录。保留两学科的独立 hash 路由与交互引擎。

**Tech Stack:** HTML/CSS/JavaScript、Node 内置文件和 VM 模块、现有 Playwright、Nginx、Docker Compose。

## 任务与检查点

- [x] 保存两项目 index.html 与 assets/js/app.js 到根目录 backups/platform-时间戳；不改算法与课程源数据。
- [x] 新建 tests/platform.test.cjs 与 tests/browser/platform.spec.cjs，先验证目录生成、发布白名单及科目导航的缺失行为。
- [x] 新建 platform/subjects.js、theme.js、navigation.js：统一登记七科，根地址从脚本地址推导；统一主题键和旧键兼容；共享顶部导航、合法路由校验及最近访问。
- [x] 新建 index.html、platform/portal.js、portal.css、tokens.css、components.css：总览、真实统计、两组科目、标题搜索与最近访问；手机侧栏可关闭并恢复焦点。
- [x] 修改两科 index.html 引入共享层；修改 app.js 调用统一主题并订阅重绘事件；使用 adapters.css 对齐既有界面，不调整实验语义。
- [x] 新建 scripts/catalog.cjs：读取本地脚本到隔离 VM，仅加载目录所需数据；生成带稳定科目 ID、标题、hash 的目录。
- [x] 新建 scripts/build.cjs：只复制网页运行资源，输出 dist 的稳定英文科目路径，校验目标在工作区中并拒绝符号链接。
- [x] 新建 scripts/serve.cjs：本地预览仅提供发布目录，支持 HEAD、MIME、404、路径限制；npm run dev 先构建再预览。
- [x] 新建 deploy/nginx.conf、Dockerfile、compose.yaml、.dockerignore 与 README.md：提供静态站点及容器部署，解释进度范围及后续科目接入。
- [x] 运行 node --test tests/platform.test.cjs、两科集成浏览器测试、数据结构现有测试，检查发布路径及资源；截图检查桌面/手机浅色深色。
- [x] 更新验证记录、用户入口与部署交付状态，不将未执行的容器/远程部署记为通过。

## 关键验收操作

```powershell
node --test tests/platform.test.cjs
node scripts/build.cjs
node scripts/serve.cjs --port 8766
node 数据结构可视化/node_modules/@playwright/test/cli.js test --config playwright.config.cjs
npm --prefix 数据结构可视化 test
npm --prefix 数据结构可视化 run test:browser
docker compose config --quiet
```

集成检查：从门户搜索快速排序并直达；切换主题再进入概率论；调整参数、标记掌握并刷新；返回门户找到最近访问；在 /preview/ 子路径重复；断言七科仅两科可进入、页面无溢出、运行资源无 404。


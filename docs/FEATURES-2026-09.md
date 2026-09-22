# 知序 · 2026 年 9 月新增功能与设计说明

本文汇总 2026-09-21 ～ 2026-09-22 这一轮开发新增的全部功能、设计取舍、数据与接口变更、运维命令与验证结论。
上一轮的掌握度系统（Phase 1–8、题库、Jev 接入）见 [README](../README.md) 与 [部署说明](DEPLOYMENT.md)。

- 提交范围：`7953392` → `468357a`（共 9 个提交，86 个文件，+3893 / −227）
- 涉及两端：知序平台前端（静态站点）+ 知序掌握度后端（Node + SQLite），另与博客项目（RecaordWeb）的 MySQL/数据库工作台做了一处只读对接

---

## 1. 平衡树与 AVL 的删除操作可视化

设计文档：[2026-09-21-advanced-tree-delete-design.md](superpowers/specs/2026-09-21-advanced-tree-delete-design.md)（含全部决策与验收标准）。要点：

- 红黑树、B 树、B+ 树三个实验由「插入与查找」升级为「**插入、删除与查找**」；AVL 由四类预制旋转升级为**通用插入 + 删除**引擎。
- 红黑树删除按 CLRS 处理「双黑」四情形（兄红 / 兄两孩子黑 / 远侄红 / 近侄红）；摘除黑结点时用哨兵结点表示黑色 NIL，快照发出前必须摘除哨兵与被删结点。
- B 树（t=2）删除：先借位、后合并、根空降高；B+ 树删除：删记录后**重算父索引**（= 右子树最小值）并重接叶链 `next`。
- AVL：中序后继整体顶替 + 沿路径回溯，可能连续多次旋转（与插入「只修最低失衡结点」形成对照）。
- 输入新增**删除序列**字段（可留空；不存在的键会演示「未找到，跳过」）。
- 渲染器显式绘制红黑树 NIL 空槽，并用**双环 +「双黑」**标出黑高亏空待修复的结点。
- 实验总数保持 54 / 240 不变；实验 id `avl-rotations` 保持不变，避免迁移题库与掌握度数据。

## 2. 掌握度展示位置修正与「下一节」导航

- **只标注真实目录节点**：`platform/mastery-ui.js` 原先会给所有带 `#` 的链接加标签，章节标题链接、平台头部跳转也中招，侧栏多出无意义的「—」。现在按 `platform/catalog.js` 过滤（数据结构侧栏标签 61 → 54，章节行不再有残留）。
- **标签不再被样式污染**：`platform/mastery-ui.css` 显式重置盒模型——数据结构对目录项内的 `span` 有通用样式（`.nav-labs a span` 画成 5px 小圆点），此前把掌握度标签也画成了灰点。
- **不再换行重叠**：`数据结构可视化/assets/css/main.css` 的 `.nav-labs a` / `.chapter-link` grid 增加 `auto` 列，百分比标签有独立列，不会挤到第二行压住下一个小节。
- **每小节「下一节」按钮**：新增 `platform/section-nav.js` + `.css`，七科通用，顺序取自平台目录；显示下一节标题与所属章节，末节提示「已是本科最后一节」；挂在 `#view` / `#labView`，路由切换自动重挂；用签名做幂等保护，避免 MutationObserver 自我触发。

## 3. 首次访问说明弹层与访问记录

- **弹层** `platform/onboarding.js` + `.css`（门户 `index.html` 接入）：首次打开平台显示说明，内容包括平台架构三层、**重点介绍 Jev 决策层**（读取结构化学习状态，输出掌握程度/稳定度/薄弱类型/下一步动作，按规则 0.7 + Jev 0.3 融合；Key 只在服务器、置信度不足回退规则、失败不阻塞学习）、与主站的关系（「李嘉图笔记（编程寻道）」**分站**，主站 recaord.top）、免责声明（内容独立编写、不含教材扫描件、不构成考试承诺；主站已在中国境内 ICP 备案，展示备案号并可跳转工信部核验）、数据与隐私说明，以及醒目提示「**强烈推荐使用电脑访问本站**」。
- **阅读门禁**：正文滚动到底部才能点「我已阅读并开始学习」，带阅读进度百分比；`Esc` 不可关闭（必读）、焦点锁在弹层内；确认状态记在 `localStorage`，页脚「关于本站」可随时重看。
- **访问记录**：新增 `zx_site_visit` 表与 `POST /api/visit`（`GET /api/visit/count` 只返回聚合数字，不暴露 IP 与明细）。`visit_id` 由前端按「设备标识 + 日期」生成并唯一，同设备同天累计 `visit_count`，不会无限膨胀；记录 IP、X-Forwarded-For、UA、来源页、语言、屏幕、时区、时间与是否已确认。
- 服务器本机可用 `node scripts/visits-report.cjs [天数] [--full]` 查看（默认对 IP 末段打码）。

## 4. 访问安全加固（无账号方案）

背景：公开写接口此前没有任何身份校验（`userId` 由请求头自称），存在被脚本批量注入、并借 Jev 真实调用烧掉 TypeSafe 额度的风险。采取了三条互相配合的措施，**不引入注册登录**：

| 措施 | 实现 | 默认阈值 |
| --- | --- | --- |
| A 写接口按 IP 限流 | `server/lib/rateLimit.cjs`，滑动窗口，超限 `429` 并带 `retryAfterMs` | 60 次/分、2000 次/天 |
| B Jev 成本保险丝 | `server/services/jevBudget.cjs`，全局用 `zx_jev_call_log` 估算（重启后仍有效）+ 单 IP 计数；超限抛 `JEV_BUDGET_EXCEEDED` 由上层回退规则引擎 | 全局 300/天、单 IP 30/天 |
| C 服务端签发匿名设备令牌 | `server/lib/session.cjs` + `POST /api/session`，HMAC-SHA256 不透明令牌 | 有效期 30 天 |

- 用户数据接口（`/api/learning/*`、`/api/knowledge/*`、`/api/visit`）要求 `X-Zhixu-Token`；**身份取自令牌里的 uid，客户端自称的 `X-Zhixu-User` 被忽略**，因此无法冒充别人。伪造、篡改、过期令牌一律 401。
- 首次申请令牌时带上本地已有设备标识，**老用户的历史掌握度不丢**；令牌失效由前端自动重新申请。
- 前端新增 `platform/session.js`（申请/缓存/失效重申请 + `authedFetch`），`mastery.js`、`mastery-ui.js`、`heatmap.js`、`mastery-page.js`、`onboarding.js` 全部改为带令牌请求。
- 单次上报事件上限 200 条，请求体上限 256KB。
- 应急开关：`ZHIXU_REQUIRE_SESSION=false` 可退回旧的「请求头自称 userId」模式（不建议线上使用）。

> 上线时踩过一个坑并已修复（`194e400`）：只给写入路径加了令牌，漏了掌握度 UI / 热力图 / 掌握度页三个**读取**调用方，导致它们 401、页面显示「后端未连接」。现在所有调用方统一走 `authedFetch`，并且 `mastery.html` 也补上了 `session.js`。

## 5. 只读数据观察台（知序自带）

- 页面 `admin.html` + `platform/admin.js` + `platform/admin.css`：<https://recaord.top/math-modeling/admin.html>，不对外链接、`noindex`，令牌存 `sessionStorage`。
- 接口（均要求 `X-Zhixu-Admin`，值为 `ZHIXU_ADMIN_TOKEN`；**未配置令牌时整套接口 403**）：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/admin/overview` | 各表行数、访问汇总与近 7 天、Jev 预算、运行配置 |
| `GET` | `/api/admin/tables` | 表清单（含列定义与行数） |
| `GET` | `/api/admin/table/:name` | 分页浏览；IP/UA 默认打码，`mask=0` 关闭；未知表 404 |
| `POST` | `/api/admin/query` | 只读 SQL：仅单条 `SELECT`/`WITH`，拒绝多语句与写关键字，强制行数上限（默认 200），语法错误回显 |

- 设计原则：**只有读取接口**；表名必须来自 SQLite 白名单（不拼接用户输入）；令牌用定时安全比较；IP 默认打码便于截图/粘贴。
- 令牌获取：
  ```bash
  ssh my-server "grep '^ZHIXU_ADMIN_TOKEN=' /www/wwwroot/zhixu-backend/.env"
  ```

## 6. SQLite → MySQL 镜像（在博客数据库工作台里看）

博客的数据库工作台只连 MySQL，因此提供一个可选镜像，让 `zhixu_*` 表直接出现在工作台的表列表里：

- `scripts/mirror-to-mysql.cjs`：读取 SQLite 的 `zx_*` 表 → 生成 MySQL 的 `zhixu_*` 表（类型按 SQLite 动态映射，附加 `_mirrored_at`），**全量刷新**、每表默认最新 **5000** 行；只读 SQLite，**不碰博客自己的表**。`ZHIXU_MIRROR_SQL_OUT=<file>` 可干跑只看生成的 SQL。
- `deploy/zhixu-mysql-mirror.sh`：从 `/etc/recaordweb.env` 取应用账号凭据，写成临时 `0600` 配置文件，用完即删，不落日志。
- 定时：`/etc/cron.d/zhixu-mirror` 每 10 分钟执行一次，日志 `/var/log/zhixu-mirror.log`。
- 一次性授权（工作台用的受限账号 `recaord_console` 对新表没有 SELECT；MySQL 的 `GRANT` **不支持表名通配符**，需逐表）：
  ```sql
  GRANT SELECT ON `recaordweb`.`zhixu_learning_event`        TO 'recaord_console'@'localhost';
  GRANT SELECT ON `recaordweb`.`zhixu_user_knowledge_state` TO 'recaord_console'@'localhost';
  GRANT SELECT ON `recaordweb`.`zhixu_mastery_evaluation`    TO 'recaord_console'@'localhost';
  GRANT SELECT ON `recaordweb`.`zhixu_review_schedule`       TO 'recaord_console'@'localhost';
  GRANT SELECT ON `recaordweb`.`zhixu_jev_call_log`          TO 'recaord_console'@'localhost';
  GRANT SELECT ON `recaordweb`.`zhixu_site_visit`            TO 'recaord_console'@'localhost';
  FLUSH PRIVILEGES;
  ```
  授权后**无需重启**：工作台的表清单是每次实时读 `information_schema` 的。以后新增镜像表需再补一条。

---

## 7. 数据表与接口总览

| 数据表 | 用途 |
| --- | --- |
| `zx_learning_event` | 学习行为事件（原始留痕，算法变更后可重算） |
| `zx_user_knowledge_state` | 逐用户逐节点的掌握状态 |
| `zx_mastery_evaluation` | 每次评估的历史快照 |
| `zx_review_schedule` | 复习计划 |
| `zx_jev_call_log` | Jev 调用日志（同时用于成本保险丝估算） |
| `zx_site_visit` | 匿名访问记录（本轮新增） |

| 新增/变更接口 | 说明 |
| --- | --- |
| `POST /api/session` | 申请匿名设备令牌（身份 = 令牌里的 uid） |
| `POST /api/visit` | 记录一次访问（需令牌；确认说明后再次调用标记 `onboarded`） |
| `GET /api/visit/count` | 访问聚合计数（无 IP、无明细） |
| `GET /api/admin/*` | 只读观察台（需 `X-Zhixu-Admin`） |

## 8. 环境变量

| 变量 | 默认 | 作用 |
| --- | --- | --- |
| `ZHIXU_SESSION_SECRET` | 首次部署自动生成 | 设备令牌签名密钥（缺失时每次启动随机生成，令牌会失效） |
| `ZHIXU_REQUIRE_SESSION` | `true` | 是否强制设备令牌 |
| `ZHIXU_SESSION_TTL_MS` | 30 天 | 令牌有效期 |
| `ZHIXU_RATE_PER_MIN` / `ZHIXU_RATE_PER_DAY` | `60` / `2000` | 写接口按 IP 限流 |
| `ZHIXU_JEV_DAILY_LIMIT` / `ZHIXU_JEV_DAILY_LIMIT_PER_IP` | `300` / `30` | Jev 每日成本上限（0 = 不限） |
| `ZHIXU_ADMIN_TOKEN` | 首次部署自动生成 | 只读观察台令牌（留空则接口 403） |
| `ZHIXU_ADMIN_MAX_ROWS` | `200` | 观察台查询行数上限 |
| `ZHIXU_MIRROR_MAX_ROWS` | `5000` | 每表镜像的最新行数 |

## 9. 常用运维命令

```bash
# 访问记录报告（服务器本机，IP 默认打码）
cd /www/wwwroot/zhixu-backend && node scripts/visits-report.cjs 7

# 手工刷新 MySQL 镜像（cron 每 10 分钟已自动执行）
bash /www/wwwroot/zhixu-backend/deploy/zhixu-mysql-mirror.sh
tail -5 /var/log/zhixu-mirror.log

# 一键部署（本地：构建 dist、打包前后端、上传、备份、重启、验证）
npm run deploy

# 本地自检
npm test && npm run test:server          # 平台 3/3、后端 33/33
npm --prefix 数据结构可视化 test         # 91/91
npm --prefix 数据结构可视化 run test:browser   # 27/27
npm run audit && node scripts/check-source.cjs 数据结构可视化
```

## 10. 设计取舍与已知边界

- **不做注册登录**：知序的产品原则是零摩擦、可离线、不采集身份；真正要防的只是「脚本刷接口花钱」，因此用限流 + 成本保险丝 + 匿名设备令牌解决，而不引入账号体系（也避免隐私声明变更）。
- **镜像只保留最新 5000 行**：镜像定位是「看趋势、抽查」，完整明细请看观察台的只读 SQL 或 `visits-report.cjs`。
- **观察台是只读的**：没有写入接口，SQL 只放行单条 `SELECT`/`WITH`；这是刻意的边界，避免把公开站点变成可写数据库入口。
- **IP 默认打码**：观察台与报告脚本默认打码，需要排查时才显式关闭。
- **访问记录写入前需令牌**：避免匿名灌表；聚合计数接口有意保持开放（只有数字）。
- **MySQL 授权需 root**：工作台账号是受限只读账号，`GRANT` 必须由 MySQL 管理员执行一次；这是工作台原有安全设计的一部分。
- **GitHub 推送**：本轮提交已推 Gitee；GitHub 从本机网络不可达，待网络恢复后补推。

## 11. 验证结论（本轮结束时的状态）

| 项目 | 结果 |
| --- | --- |
| 后端测试 | 33/33（新增访问记录 5 条、安全 6 条、限流 2 条、观察台 6 条） |
| 平台测试 | 3/3（题库节点合法性、每节恰好 5 题、发布白名单） |
| 数据结构 Node | 91/91（含删除不变量、AVL、渲染器） |
| 数据结构 Chrome | 27/27（含全部 54 个实验自动播放、删除专项 spec） |
| 删除引擎随机化 | 4500 组、24 万个快照（含瞬时状态）不变量校验通过 |
| 线上（知序） | `healthz` / `heatmap` / `mastery.html` / `admin.html` 200；未带令牌访问用户数据与管理接口均 **401** |
| 线上（观察台） | 带令牌 200；工作台账号可列出并读取 6 张 `zhixu_*` 表（50 / 6 / 5 / 5 / 5 / 3 行） |
| 线上（博客未受影响） | `recaordweb.service` active；首页 200、`/api/blog/list` 200、工作台状态 200；业务表完好（`blog=8`、`comment=12`） |

## 12. 相关文件索引

```text
platform/onboarding.js|.css      首次访问说明弹层
platform/session.js              设备令牌申请/缓存/带令牌请求
platform/mastery.js              学习行为采集（改为带令牌上报）
platform/mastery-ui.js|.css      掌握度徽标、状态卡片与目录标注
platform/heatmap.js              门户学习状态热力图
platform/mastery-page.js         掌握度热力图页面
platform/section-nav.js|.css     每小节「下一节」导航
platform/admin.js|.css           只读数据观察台前端
admin.html                       观察台页面（noindex、不对外链接）
server/lib/session.cjs           设备令牌签发与校验
server/lib/rateLimit.cjs         IP 限流
server/lib/adminAuth.cjs         观察台令牌校验
server/services/jevBudget.cjs    Jev 成本保险丝
server/routes/sessionRoutes.cjs  POST /api/session
server/routes/siteVisitRoutes.cjs POST /api/visit、GET /api/visit/count
server/routes/adminRoutes.cjs    只读观察台接口
server/repositories/siteVisitRepository.cjs  zx_site_visit 读写
scripts/visits-report.cjs        访问记录报告（服务器本机）
scripts/mirror-to-mysql.cjs      SQLite → MySQL 镜像
deploy/zhixu-mysql-mirror.sh     镜像包装脚本（cron 调用）
tests/server/{security,rateLimit,siteVisit,adminApi}.test.cjs
数据结构可视化/assets/js/algorithms/advanced-trees.js   三棵高级树（含删除）
数据结构可视化/assets/js/algorithms/search.js          AVL 通用插入/删除
数据结构可视化/tests/tree-invariants.cjs               三树共用不变量校验
```

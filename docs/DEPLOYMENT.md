# 服务器部署

## 交付边界

网站运行时为静态文件，学习功能无需数据库或 Node 服务。Node 仅用于从源码构建。发布压缩包内已经包含构建后的 `dist/`，服务器可以直接使用。

若需要「知识掌握度」功能，再额外部署 `server/` 后端（见文末「方式三」）。后端不可用时前端自动降级，不影响静态站点。

当前已经验证发布产物的根路径和子路径访问，以及 Compose 配置解析。本机 Docker Linux 引擎未运行，容器构建/启动未验证，也尚未连接用户服务器部署。

## 方式一：现有 Nginx / 宝塔 / 1Panel 静态站点

1. 在控制面板中为你的域名创建静态站点。
2. 将 `dist/` **里面的内容** 上传到该站点根目录，确保根目录直接包含 `index.html`、`platform/`、`subjects/`。
3. 默认首页设为 `index.html`。本项目使用 hash 路由，不需要将所有不存在的请求重写到首页。
4. 通过面板为你的实际域名配置 HTTPS 证书。

使用原生 Nginx 时，下面是 HTTP 配置示例。把 `learn.example.com` 换成你的域名，把 `/var/www/zhixu` 换成实际上传目录：

```nginx
server {
    listen 80;
    server_name learn.example.com;
    root /var/www/zhixu;
    index index.html;
    charset utf-8;
    add_header X-Content-Type-Options nosniff always;
    add_header Cache-Control "no-cache" always;
    location / { try_files $uri $uri/ =404; }
    location ~ /\. { deny all; }
}
```

配置生效前运行 `nginx -t`，通过后再重载。HTTPS 使用现有站点/反向代理的证书管理流程，证书文件和私钥路径必须填写服务器上的实际位置。

### 部署到域名下的子目录

例如 `https://example.com/study/`：将 `dist` 的内容放到站点根目录下的 `study/`，沿用上面的 `try_files` 即可。请保留结尾斜杠，或者让 Nginx 的目录重定向补齐。

所有资源和科目链接均按平台脚本位置计算，支持 `/study/subjects/probability/index.html#ch1-s1` 这样的具体知识点地址，无需修改 JavaScript。

## 方式二：Docker Compose

把以下文件放在服务器同一个目录（发布包已按此结构组织）：

```text
dist/
deploy/nginx.conf
Dockerfile
compose.yaml
```

执行：

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
curl -I http://127.0.0.1:8080/
```

首次构建需要能拉取 Nginx 官方镜像。默认只绑定 `127.0.0.1:8080`。

### 已有域名反向代理

在现有域名的 Nginx server 块中添加：

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

域名 HTTPS 终止在此反向代理处。如果反向代理运行在另一个容器内，它的 `127.0.0.1` 不是宿主机，需要将两个服务接入同一个 Docker 网络并使用服务名与容器端口。

如果挂到 `/study/` 下：

```nginx
location = /study { return 301 /study/; }
location /study/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

`proxy_pass` 末尾斜杠用于去除转发给容器的 `/study/` 前缀，浏览器仍以 `/study/` 为平台根地址。门户生成的学习链接明确带 `index.html`，不会依赖容器的目录重定向。

### 直接以服务器 IP 访问

在 `compose.yaml` 同目录创建 `.env`：

```dotenv
BIND_ADDRESS=0.0.0.0
PORT=8080
```

重跑 `docker compose up -d --build`，然后访问 `http://服务器IP:8080/`。服务器防火墙与云安全组需允许所选端口。端口冲突时更改 `PORT`。

## 方式三：启用掌握度后端（可选）

掌握度后端位于 `server/`，零第三方依赖，需要 **Node.js 22+**（使用内置 `node:sqlite`，当前为实验特性，启动脚本已加 `--disable-warning=ExperimentalWarning`）。它同时提供 `/api` 接口与 `dist/` 静态站点。

```bash
# 在项目根目录
npm run build
ZHIXU_PORT=8787 npm run server
```

默认监听 `127.0.0.1:8787`，数据库文件写入 `server/data/zhixu.db`（已在 `.gitignore` 中排除）。

### 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `ZHIXU_PORT` | `8787` | 监听端口 |
| `ZHIXU_HOST` | `127.0.0.1` | 监听地址 |
| `ZHIXU_DB` | `server/data/zhixu.db` | SQLite 文件路径 |
| `ZHIXU_STATIC` | `dist` | 静态站点目录 |
| `ZHIXU_EVAL_MIN_INTERVAL_MS` | `30000` | 同一用户+节点两次评估的最小间隔 |
| `ZHIXU_JEV_ENABLED` | `false` | 是否调用 TypeSafe（Jev） |
| `TYPESAFE_API_KEY` | 空 | TypeSafe API Key，**只能放服务器端** |
| `TYPESAFE_BASE_URL` | `https://api.typesafe.ai/v1` | TypeSafe 接口地址 |
| `TYPESAFE_MODEL` | `jev-latest` | 模型名 |

### 与静态站点配合

推荐保持静态站点由 Nginx 提供，只把 `/api` 反向代理到后端，这样前端无需任何额外配置（`platform/mastery.js` 默认请求站点根下的 `api/`）：

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

如果后端与前端不同源，可在页面加载 `platform/mastery.js` 之前设置 `window.ZHIXU_API_BASE = 'https://api.example.com'`。

### 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/learning/events` | 记录学习行为（支持单条或 `{ events: [...] }` 批量） |
| `GET` | `/api/learning/events?nodeId=` | 查询学习事件 |
| `GET` | `/api/knowledge/:nodeId/mastery` | 获取节点掌握状态（不触发 Jev） |
| `POST` | `/internal/mastery/evaluate/:nodeId` | 触发一次评估（受节流保护） |
| `GET` | `/api/learning/reviews` | 待复习计划 |
| `GET` | `/api/learning/overview` | 用户掌握度概览 |
| `GET` | `/api/learning/heatmap` | 学科 / 章节加权掌握度热力图 |
| `GET` | `/healthz` | 健康检查 |

用户标识通过请求头 `X-Zhixu-User`（或请求体 `userId`）传入，为浏览器 `localStorage` 生成的匿名随机 ID。Jev 故障或未配置时自动使用规则引擎兜底，学习流程不受影响。

### 配置 Jev（TypeSafe）

后端会读取项目根目录的 `.env`（已在 `.gitignore` 中，不会提交）。复制 `.env.example` 为 `.env` 并填写：

```dotenv
ZHIXU_JEV_ENABLED=true
TYPESAFE_API_KEY=你的Key
TYPESAFE_BASE_URL=https://api.typesafe.ai/v1
TYPESAFE_MODEL=jev-latest
```

用一次真实请求验证连通性与返回结构（不会打印 Key）：

```bash
npm run jev:probe
```

Key 只存在服务器端，前端 `platform/mastery.js` 永远接触不到。评估结果会同时保存 `ruleScore`、`jevScore` 与 `finalScore`，并记录每次调用的置信度、延迟与 token 用量。

## 一键部署到现有服务器（recaord.top）

本仓库已配置好到 `120.46.207.156`（SSH 别名 `my-server`）的部署流程。本地运行：

```bash
npm run deploy        # 构建 → 打包 → 上传 → 远程部署（自动备份）
```

- 密钥从本地 `.env` 的 `TYPESAFE_API_KEY` 读取，**不会写入仓库**；远程脚本模板为 `deploy/zhixu-remote.sh`。
- 可用 `ZHIXU_DEPLOY_HOST=别的别名 npm run deploy` 部署到其它主机。

服务器布局：

| 项目 | 路径 |
| --- | --- |
| 前端静态站 | `/www/wwwroot/recaord.top/math-modeling` |
| 后端 | `/www/wwwroot/zhixu-backend`（`.env`、`server/`、节点注册表） |
| 数据库 | `/www/wwwroot/zhixu-backend/server/data/zhixu.db`（跨部署保留） |
| systemd 服务 | `zhixu-backend.service`（`systemctl status/restart zhixu-backend`） |
| nginx 代理 | `…/extension/120.46.207.156/zhixu-api.conf`（`/math-modeling/api/` → `127.0.0.1:8787/api/`） |
| 备份 | `/www/backups/recaord/zhixu-<时间戳>/` |

后端要求 Node 22+（`node:sqlite`）。服务器已安装于 `/usr/local/lib/node22`，`/usr/local/bin/node` 指向它。

> 轮换 Key：修改 `/www/wwwroot/zhixu-backend/.env` 的 `TYPESAFE_API_KEY` 后执行 `systemctl restart zhixu-backend`。

## 更新与回退

- 从源码更新：本地运行 `npm run build`，然后上传新的完整 `dist` 内容。
- 容器更新：替换服务器的 `dist/`，执行 `docker compose up -d --build`。
- 更新前保留上一个完整发布包。需要回退时恢复上一包的 `dist`；容器方式重新构建即可。
- 使用 `Cache-Control: no-cache` 让浏览器重新验证资源，避免旧页面与新脚本混用。
- 不要将整个开发工作区设为公开站点根目录；该目录含教材、备份和开发文档。只发布 `dist`。

## 上线检查

1. 首页显示七科，只有数据结构、概率论可进入。
2. 搜索“快速排序”，确认进入具体算法，并可播放和修改输入。
3. 切到概率论，打开一个知识点，确认公式与图示显示，标记掌握后刷新仍保留。
4. 切换深色并返回总览，确认主题一致。
5. 复制一个具体知识点地址到新标签页并刷新，确认资源正常。
6. 手机打开，确认目录可用、页面没有整体横向溢出。
7. 访问不存在文件应返回 404；教材 PDF、源码备份不应存在于站点目录。

配置参考：[Nginx try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)。

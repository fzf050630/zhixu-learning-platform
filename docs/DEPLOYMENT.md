# 服务器部署

## 交付边界

网站运行时为静态文件，无需数据库或 Node 服务。Node 仅用于从源码构建。发布压缩包内已经包含构建后的 `dist/`，服务器可以直接使用。

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

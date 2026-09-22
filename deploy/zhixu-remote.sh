#!/usr/bin/env bash
# 知序 · 远程部署脚本（在服务器上执行；由 scripts/deploy.cjs 上传）
# 占位符 __API_KEY__ 会在上传前由本地 .env 中的 TYPESAFE_API_KEY 替换。
set -euo pipefail

RUN_ID="$(date +%Y%m%d-%H%M%S)"
LIVE="/www/wwwroot/recaord.top/math-modeling"
BACKEND_DIR="/www/wwwroot/zhixu-backend"
NGX_EXT="/www/server/panel/vhost/nginx/extension/120.46.207.156"
NGINX="/www/server/nginx/sbin/nginx"
BACKUP="/www/backups/recaord/zhixu-$RUN_ID"

echo "== 1/7 备份 =="
mkdir -p "$BACKUP/nginx-ext-before"
cp -a "$LIVE" "$BACKUP/live-before"
cp -a "$NGX_EXT/." "$BACKUP/nginx-ext-before/"

echo "== 2/7 部署前端 =="
rm -rf /tmp/zhixu-site && mkdir -p /tmp/zhixu-site
tar -xzf /tmp/site.tar.gz -C /tmp/zhixu-site
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete /tmp/zhixu-site/ "$LIVE/"
else
  rm -rf "$LIVE"/*
  cp -a /tmp/zhixu-site/. "$LIVE/"
fi
find "$LIVE" -type d -exec chmod 755 {} +
find "$LIVE" -type f -exec chmod 644 {} +

echo "== 3/7 部署后端 =="
rm -rf /tmp/zhixu-backend && mkdir -p /tmp/zhixu-backend
tar -xzf /tmp/backend.tar.gz -C /tmp/zhixu-backend
mkdir -p /tmp/zhixu-backend/server/data
if [ -d "$BACKEND_DIR/server/data" ]; then
  cp -a "$BACKEND_DIR/server/data"/*.db* /tmp/zhixu-backend/server/data/ 2>/dev/null || true
fi
mkdir -p "$BACKEND_DIR"
rm -rf "$BACKEND_DIR"/*
cp -a /tmp/zhixu-backend/. "$BACKEND_DIR/"

echo "== 4/7 写入配置 =="
cat > "$BACKEND_DIR/.env" <<'ENV'
ZHIXU_PORT=8787
ZHIXU_HOST=127.0.0.1
ZHIXU_JEV_ENABLED=true
TYPESAFE_API_KEY=__API_KEY__
TYPESAFE_BASE_URL=https://api.typesafe.ai/v1
TYPESAFE_MODEL=jev-latest
ZHIXU_DB=/www/wwwroot/zhixu-backend/server/data/zhixu.db
ZHIXU_STATIC=/www/wwwroot/recaord.top/math-modeling
# 安全：设备令牌 + 写接口限流 + Jev 成本保险丝
ZHIXU_SESSION_SECRET=__SESSION_SECRET__
ZHIXU_REQUIRE_SESSION=true
# 只读数据观察台（/math-modeling/admin.html）
ZHIXU_ADMIN_TOKEN=__ADMIN_TOKEN__
ZHIXU_RATE_PER_MIN=60
ZHIXU_RATE_PER_DAY=2000
ZHIXU_JEV_DAILY_LIMIT=300
ZHIXU_JEV_DAILY_LIMIT_PER_IP=30
ENV
chmod 600 "$BACKEND_DIR/.env"

echo "== 5/7 注册服务 =="
cat > /etc/systemd/system/zhixu-backend.service <<'UNIT'
[Unit]
Description=ZhiXu mastery backend
After=network.target

[Service]
Type=simple
WorkingDirectory=/www/wwwroot/zhixu-backend
ExecStart=/usr/local/bin/node --disable-warning=ExperimentalWarning server/index.cjs
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable zhixu-backend >/dev/null 2>&1 || true
systemctl restart zhixu-backend
sleep 2
if ! systemctl is-active --quiet zhixu-backend; then
  echo "后端启动失败，日志："
  journalctl -u zhixu-backend -n 40 --no-pager || true
  exit 1
fi

echo "== 6/7 配置 nginx 代理 =="
cat > "$NGX_EXT/zhixu-api.conf" <<'NGINX'
# Zhixu mastery backend API（前端在 /math-modeling/ 下，API 反代到本机后端）
location ^~ /math-modeling/api/ {
    proxy_pass http://127.0.0.1:8787/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 30s;
}
NGINX
if ! "$NGINX" -t; then
  echo "nginx 配置校验失败，回滚扩展配置"
  cp -a "$BACKUP/nginx-ext-before/." "$NGX_EXT/"
  "$NGINX" -t && "$NGINX" -s reload
  exit 1
fi
"$NGINX" -s reload

echo "== 7/7 验证 =="
sleep 1
echo -n "backend healthz: "; curl -s http://127.0.0.1:8787/healthz; echo
echo -n "public api healthz: "; curl -s -o /dev/null -w '%{http_code}\n' https://recaord.top/math-modeling/api/healthz
API=https://recaord.top/math-modeling/api
TOKEN=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"userId":"deploy-check"}' "$API/session" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
if [ -n "$TOKEN" ]; then echo "device session: ok"; else echo "device session: FAILED"; fi
echo -n "public api heatmap: "; curl -s -o /dev/null -w '%{http_code}\n' -H "X-Zhixu-Token: $TOKEN" "$API/learning/heatmap"
echo -n "public api visit: "; curl -s -o /dev/null -w '%{http_code}\n' -X POST -H 'Content-Type: application/json' -H "X-Zhixu-Token: $TOKEN" -d '{"visitId":"deploy-check","onboarded":false}' "$API/visit"
echo -n "public api without token(expect 401): "; curl -s -o /dev/null -w '%{http_code}\n' "$API/learning/overview"
echo -n "mastery.html: "; curl -s -o /dev/null -w '%{http_code}\n' https://recaord.top/math-modeling/mastery.html
echo -n "portal index: "; curl -s -o /dev/null -w '%{http_code}\n' https://recaord.top/math-modeling/
echo "DONE"
echo "BACKUP=$BACKUP"

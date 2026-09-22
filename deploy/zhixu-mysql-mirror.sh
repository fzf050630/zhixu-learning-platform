#!/usr/bin/env bash
# 知序 · 把 SQLite 数据镜像到 MySQL（供博客的数据库工作台浏览）
# 建议由 /etc/cron.d/zhixu-mirror 每 10 分钟调用一次。
# 凭据从 /etc/recaordweb.env 读取，写入临时 0600 配置文件，用完即删，不落日志。
set -euo pipefail

ENV_FILE="${RECAORD_ENV_FILE:-/etc/recaordweb.env}"
BACKEND_DIR="${ZHIXU_BACKEND_DIR:-/www/wwwroot/zhixu-backend}"

if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  set -a
  . "$ENV_FILE"
  set +a
fi

DB_USER="${DB_USERNAME:-Recaord}"
DB_NAME="${DB_NAME:-recaordweb}"

if [ -z "${DB_PASSWORD:-}" ]; then
  echo "缺少 DB_PASSWORD（应来自 $ENV_FILE）" >&2
  exit 1
fi

CNF="$(mktemp /tmp/zhixu-mirror-XXXXXX.cnf)"
chmod 600 "$CNF"
cleanup() { rm -f "$CNF"; }
trap cleanup EXIT

{
  echo "[client]"
  echo "user=${DB_USER}"
  echo "password=${DB_PASSWORD}"
  echo "default-character-set=utf8mb4"
} > "$CNF"

cd "$BACKEND_DIR"
ZHIXU_MYSQL_CNF="$CNF" ZHIXU_MYSQL_DB="$DB_NAME" \
  node --disable-warning=ExperimentalWarning scripts/mirror-to-mysql.cjs

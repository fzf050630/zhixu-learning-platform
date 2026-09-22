/* 知序 · 设备令牌
   向后端申请一个 HMAC 签名的匿名设备令牌，并缓存在 localStorage。
   用户数据接口都用令牌里的 uid 作为身份，因此别人无法冒充你的 id；
   仍然无需注册，令牌里只有一个随机设备标识与有效期。
   首次申请时带上本地已有的设备标识，可以沿用之前的学习记录。 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const TOKEN_KEY = 'zhixu-token-v1';
  const UID_KEY = 'zhixu-uid-v1';
  const canSync = location.protocol === 'http:' || location.protocol === 'https:';
  const API_BASE = global.ZHIXU_API_BASE
    ? String(global.ZHIXU_API_BASE).replace(/\/$/, '')
    : (P.root ? String(P.root).replace(/\/$/, '') : '');
  const EXPIRY_SKEW_MS = 60000;

  function localUid() {
    try {
      const stored = localStorage.getItem(UID_KEY);
      if (stored) return stored;
      const created = 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(UID_KEY, created);
      return created;
    } catch (_) {
      return 'anonymous';
    }
  }

  function cached() {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data.token !== 'string' || !data.token) return null;
      const expiresAt = data.expiresAt ? Date.parse(data.expiresAt) : 0;
      if (expiresAt && expiresAt - EXPIRY_SKEW_MS < Date.now()) return null;
      return data;
    } catch (_) {
      return null;
    }
  }

  function store(data) {
    try { localStorage.setItem(TOKEN_KEY, JSON.stringify(data)); } catch (_) { /* ignore */ }
  }

  function clear() {
    try { localStorage.removeItem(TOKEN_KEY); } catch (_) { /* ignore */ }
  }

  let pending = null;

  /* 获取可用令牌：命中缓存直接返回；并发调用共享同一个请求。 */
  function ensure(force) {
    if (!canSync) return Promise.resolve(null);
    if (!force) {
      const hit = cached();
      if (hit) return Promise.resolve(hit);
    }
    if (pending) return pending;
    pending = fetch(API_BASE + '/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Zhixu-User': localUid() },
      body: JSON.stringify({ userId: localUid() }),
    })
      .then(response => (response.ok ? response.json() : Promise.reject(new Error('HTTP ' + response.status))))
      .then(data => {
        const value = {
          userId: data && data.userId ? String(data.userId) : localUid(),
          token: data && data.token ? String(data.token) : '',
          expiresAt: data && data.expiresAt ? String(data.expiresAt) : '',
        };
        if (!value.token) throw new Error('会话响应缺少令牌');
        store(value);
        try { localStorage.setItem(UID_KEY, value.userId); } catch (_) { /* ignore */ }
        return value;
      })
      .catch(() => null)
      .finally(() => { pending = null; });
    return pending;
  }

  function userId() {
    const hit = cached();
    return hit && hit.userId ? hit.userId : localUid();
  }

  function headers() {
    const hit = cached();
    if (!hit || !hit.token) return {};
    return { 'X-Zhixu-Token': hit.token, 'X-Zhixu-User': hit.userId };
  }

  P.session = { ensure, cached, clear, headers, userId, canSync, API_BASE };
})(window);

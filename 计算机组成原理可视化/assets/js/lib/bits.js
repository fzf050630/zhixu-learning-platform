/* ============================================================
   bits.js — 计算机组成原理数值工具
   进制转换 / 定长二进制 / 补码 / IEEE 754 / 数值格式化
   ============================================================ */
(function (global) {
  'use strict';

  const B = {};

  /* ---------- 基本进制 ---------- */
  B.toBase = function (n, base) {
    n = Math.trunc(Number(n) || 0);
    if (n === 0) return '0';
    const neg = n < 0;
    n = Math.abs(n);
    let s = '';
    const digits = '0123456789ABCDEF';
    while (n > 0) { s = digits[n % base] + s; n = Math.floor(n / base); }
    return (neg ? '-' : '') + s;
  };

  B.parseBase = function (str, base) {
    str = String(str).trim().replace(/^0[bBoOxX]/, '');
    if (!str) return NaN;
    const neg = str.startsWith('-');
    if (neg) str = str.slice(1);
    const v = parseInt(str, base);
    return neg ? -v : v;
  };

  /** 无符号定长二进制 */
  B.toBits = function (n, width) {
    const x = Number(n) || 0;
    let s = (x >>> 0).toString(2);
    if (width) {
      s = s.slice(-width);
      s = s.padStart(width, '0');
    }
    return s;
  };

  /** 直接给出十进制数的 width 位补码位串（负数可用） */
  B.toTwosBits = function (n, width) {
    n = Math.trunc(Number(n) || 0);
    const mod = Math.pow(2, width);
    let v = ((n % mod) + mod) % mod;
    return v.toString(2).padStart(width, '0');
  };

  B.fromBits = function (s) { return s ? parseInt(s, 2) : 0; };

  B.toSigned = function (s) {
    if (!s) return 0;
    const v = parseInt(s, 2);
    return s[0] === '1' ? v - Math.pow(2, s.length) : v;
  };

  /** 每 size 位插入一个空格 */
  B.group = function (s, size = 4, sep = ' ') {
    const out = [];
    for (let i = 0; i < s.length; i += size) out.push(s.slice(i, i + size));
    return out.join(sep);
  };

  B.pad = function (s, width, ch = '0') { return String(s).padStart(width, ch); };

  /* ---------- 溢出判断（补码加减） ---------- */
  B.overflowAdd = function (aBits, bBits, bits) {
    const a = B.toSigned(aBits), b = B.toSigned(bBits);
    const s = a + b;
    const lo = -Math.pow(2, bits - 1), hi = Math.pow(2, bits - 1) - 1;
    return s < lo || s > hi;
  };

  /* ---------- IEEE 754 ---------- */
  B.f32 = {
    encode(x) {
      const buf = new ArrayBuffer(4);
      new DataView(buf).setFloat32(0, Number(x), false);
      let bits = '';
      new Uint8Array(buf).forEach(b => { bits += b.toString(2).padStart(8, '0'); });
      return bits;
    },
    decode(bits) {
      const bytes = new Uint8Array(4);
      const clean = String(bits).replace(/\s/g, '');
      for (let i = 0; i < 4; i++) bytes[i] = parseInt(clean.slice(i * 8, i * 8 + 8), 2);
      return new DataView(bytes.buffer).getFloat32(0, false);
    },
    parts(bits) {
      const s = String(bits).replace(/\s/g, '');
      return {
        sign: s.slice(0, 1),
        exp: s.slice(1, 9),
        frac: s.slice(9, 32),
        eRaw: parseInt(s.slice(1, 9), 2),
        fVal: parseInt(s.slice(9, 32), 2) / Math.pow(2, 23)
      };
    }
  };

  B.f64 = {
    encode(x) {
      const buf = new ArrayBuffer(8);
      new DataView(buf).setFloat64(0, Number(x), false);
      let bits = '';
      new Uint8Array(buf).forEach(b => { bits += b.toString(2).padStart(8, '0'); });
      return bits;
    },
    decode(bits) {
      const bytes = new Uint8Array(8);
      const clean = String(bits).replace(/\s/g, '');
      for (let i = 0; i < 8; i++) bytes[i] = parseInt(clean.slice(i * 8, i * 8 + 8), 2);
      return new DataView(bytes.buffer).getFloat64(0, false);
    }
  };

  /* ---------- 格式化 ---------- */
  B.hex = n => '0x' + Math.trunc(Number(n) || 0).toString(16).toUpperCase();

  B.dec = (v, digits = 6) => {
    if (!isFinite(v)) return String(v);
    if (v === 0) return '0';
    if (Math.abs(v) >= 1e7 || Math.abs(v) < 1e-4) return v.toExponential(4).replace('e', '×10^');
    return String(Math.round(v * Math.pow(10, digits)) / Math.pow(10, digits));
  };

  B.int = v => Math.round(Number(v)).toLocaleString('en-US');

  /** 把 32 位浮点字段组装成位串 */
  B.join = (s, e, f) => String(s) + String(e) + String(f);

  /* ---------- 单位换算 ---------- */
  const UNITS = [
    ['', 1], ['K', 1e3], ['M', 1e6], ['G', 1e9], ['T', 1e12], ['P', 1e15]
  ];
  const BIN_UNITS = [['', 1], ['Ki', 1024], ['Mi', 1024 ** 2], ['Gi', 1024 ** 3], ['Ti', 1024 ** 4]];

  B.human = function (v, units = UNITS, suffix = '') {
    v = Number(v) || 0;
    let i = 0;
    while (i < units.length - 1 && Math.abs(v) >= units[i + 1][1]) i++;
    const val = v / units[i][1];
    const s = (Math.abs(val) >= 100 || val % 1 === 0) ? val.toFixed(0) : val.toFixed(2).replace(/\.?0+$/, '');
    return s + ' ' + units[i][0] + suffix;
  };

  B.humanBin = (v, suffix = 'B') => B.human(v, BIN_UNITS, suffix);
  B.humanSI = (v, suffix = '') => B.human(v, UNITS, suffix);

  global.Bits = B;

})(window);

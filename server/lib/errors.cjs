'use strict';

class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message || code);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const badRequest = (message, details) => new HttpError(400, 'BAD_REQUEST', message, details);
const unauthorized = message => new HttpError(401, 'UNAUTHORIZED', message || '缺少用户标识');
const notFound = message => new HttpError(404, 'NOT_FOUND', message || '资源不存在');
const tooMany = message => new HttpError(429, 'TOO_MANY_REQUESTS', message || '请求过于频繁');

module.exports = { HttpError, badRequest, unauthorized, notFound, tooMany };

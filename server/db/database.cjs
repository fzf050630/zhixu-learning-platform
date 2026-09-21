'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const config = require('../config.cjs');

let handle = null;

function openDatabase(file = config.dbPath) {
  if (handle) return handle;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  handle = new DatabaseSync(file);
  handle.exec('PRAGMA journal_mode = WAL;');
  handle.exec('PRAGMA foreign_keys = ON;');
  handle.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  return handle;
}

function getDatabase() {
  return handle || openDatabase();
}

function closeDatabase() {
  if (handle) { handle.close(); handle = null; }
}

function nowIso() {
  return new Date().toISOString();
}

module.exports = { openDatabase, getDatabase, closeDatabase, nowIso };

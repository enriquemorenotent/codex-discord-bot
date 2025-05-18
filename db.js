const Database = require('better-sqlite3');

const db = new Database('data.db');

db.prepare(`CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  date_text TEXT NOT NULL,
  date DATE
)`).run();

function addPrediction(userId, dateText) {
  const parsed = new Date(dateText);
  const iso = isNaN(parsed) ? null : parsed.toISOString().slice(0, 10);
  db.prepare(
    'INSERT INTO predictions (userId, date_text, date) VALUES (?, ?, ?)'
  ).run(userId, dateText, iso);
}

function getPredictions() {
  return db
    .prepare('SELECT userId, date_text FROM predictions ORDER BY id')
    .all()
    .map((r) => ({ userId: r.userId, date: r.date_text }));
}

module.exports = { addPrediction, getPredictions };


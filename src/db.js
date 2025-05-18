import Database from 'better-sqlite3';

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
    .prepare('SELECT id, userId, date_text FROM predictions ORDER BY id')
    .all()
    .map((r) => ({ id: r.id, userId: r.userId, date: r.date_text }));
}

function updatePrediction(id, dateText) {
  const parsed = new Date(dateText);
  const iso = isNaN(parsed) ? null : parsed.toISOString().slice(0, 10);
  db.prepare(
    'UPDATE predictions SET date_text = ?, date = ? WHERE id = ?'
  ).run(dateText, iso, id);
}

function deletePrediction(id) {
  db.prepare('DELETE FROM predictions WHERE id = ?').run(id);
}

export { addPrediction, getPredictions, updatePrediction, deletePrediction };


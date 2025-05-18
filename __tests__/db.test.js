import { jest } from '@jest/globals';

jest.unstable_mockModule('better-sqlite3', () => {
  return {
    default: class {
      constructor() {
        this.records = [];
        this.nextId = 1;
      }
      prepare(sql) {
        if (sql.startsWith('INSERT')) {
          return {
            run: (userId, text, iso) => {
              this.records.push({ id: this.nextId++, userId, date_text: text, date: iso });
            },
          };
        }
        if (sql.startsWith('SELECT')) {
          return {
            all: () => this.records.slice(),
          };
        }
        if (sql.startsWith('UPDATE')) {
          return {
            run: (text, iso, id) => {
              const r = this.records.find((r) => r.id === id);
              if (r) {
                r.date_text = text;
                r.date = iso;
              }
            },
          };
        }
        if (sql.startsWith('DELETE')) {
          return {
            run: (id) => {
              this.records = this.records.filter((r) => r.id !== id);
            },
          };
        }
        return { run: () => {} };
      }
    },
  };
});

let addPrediction, getPredictions, updatePrediction, deletePrediction;

beforeEach(async () => {
  jest.resetModules();
  const mod = await import('../db.js');
  addPrediction = mod.addPrediction;
  getPredictions = mod.getPredictions;
  updatePrediction = mod.updatePrediction;
  deletePrediction = mod.deletePrediction;
});

test('add and list predictions', () => {
  addPrediction('u1', 'tomorrow');
  const list = getPredictions();
  expect(list).toEqual([{ id: 1, userId: 'u1', date: 'tomorrow' }]);
});

test('update prediction', () => {
  addPrediction('u1', 'tomorrow');
  updatePrediction(1, 'next week');
  const list = getPredictions();
  expect(list[0]).toEqual({ id: 1, userId: 'u1', date: 'next week' });
});

test('delete prediction', () => {
  addPrediction('u1', 'tomorrow');
  deletePrediction(1);
  const list = getPredictions();
  expect(list).toEqual([]);
});

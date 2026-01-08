import { db } from "./index";

export function allAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

export function runAsync(sql: string, params: any[] = []): Promise<{ changes: number; lastID: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes, lastID: this.lastID });
    });
  });
}

export function getAsync<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}

export function transactionAsync<T>(
  operations: Array<{ sql: string; params?: any[] }>
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      
      const results: T[] = [];
      let completed = 0;
      let hasError = false;

      operations.forEach((op, index) => {
        db.run(op.sql, op.params || [], function(err) {
          if (hasError) return;
          
          if (err) {
            hasError = true;
            db.run("ROLLBACK", () => {
              reject(err);
            });
            return;
          }

          completed++;
          if (completed === operations.length) {
            db.run("COMMIT", (commitErr) => {
              if (commitErr) {
                reject(commitErr);
              } else {
                resolve(results);
              }
            });
          }
        });
      });
    });
  });
}
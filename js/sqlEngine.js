// Wraps sql.js to run queries against small in-memory datasets defined per-task.
// sql.js is loaded globally as `initSqlJs` via the CDN script tag in index.html.

let SQL = null;
let initPromise = null;

function ensureInit() {
  if (!initPromise) {
    initPromise = initSqlJs({
      locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`,
    }).then((sql) => {
      SQL = sql;
    });
  }
  return initPromise;
}

function inferType(value) {
  if (typeof value === 'number') return Number.isInteger(value) ? 'INTEGER' : 'REAL';
  return 'TEXT';
}

function quoteVal(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}

/**
 * Build a fresh in-memory DB from a dataset map:
 * { tableName: [ {col: val, ...}, ... ] }
 */
async function buildDb(datasets) {
  await ensureInit();
  const db = new SQL.Database();
  for (const [table, rows] of Object.entries(datasets)) {
    if (!rows || !rows.length) continue;
    const cols = Object.keys(rows[0]);
    const colDefs = cols.map((c) => `"${c}" ${inferType(rows[0][c])}`).join(', ');
    db.run(`CREATE TABLE "${table}" (${colDefs});`);
    for (const row of rows) {
      const vals = cols.map((c) => quoteVal(row[c])).join(', ');
      db.run(`INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(', ')}) VALUES (${vals});`);
    }
  }
  return db;
}

/**
 * Runs `query` against `datasets`. Returns { ok, columns, rows, error }.
 * rows is an array of arrays (matches column order). Read-only-ish: any single
 * statement sql.js supports is allowed since each run gets a throwaway DB.
 */
export async function runQuery(query, datasets) {
  let db;
  try {
    db = await buildDb(datasets);
    const res = db.exec(query);
    if (!res.length) {
      return { ok: true, columns: [], rows: [] };
    }
    const { columns, values } = res[0];
    return { ok: true, columns, rows: values };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  } finally {
    if (db) db.close();
  }
}

/** Compare two result sets for equality (order-sensitive, as SQL results are). */
export function resultsMatch(a, b) {
  if (!a.ok || !b.ok) return false;
  if (a.columns.length !== b.columns.length) return false;
  if (a.rows.length !== b.rows.length) return false;
  for (let i = 0; i < a.rows.length; i++) {
    const ra = a.rows[i], rb = b.rows[i];
    if (ra.length !== rb.length) return false;
    for (let j = 0; j < ra.length; j++) {
      // loose equality handles number/string mismatches from sql.js typing
      if (String(ra[j]) !== String(rb[j])) return false;
    }
  }
  return true;
}

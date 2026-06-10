import { Pool } from "pg";
import { ScanHistoryEntry } from "@/lib/types";

const maxEntries = 25;
let initPromise: Promise<void> | null = null;

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL in environment.");
  }

  return new Pool({
    connectionString,
  });
}

const globalForDb = globalThis as unknown as {
  scanStorePool?: Pool;
};

function getPool() {
  if (!globalForDb.scanStorePool) {
    globalForDb.scanStorePool = createPool();
  }
  return globalForDb.scanStorePool;
}

async function ensureSchema() {
  if (!initPromise) {
    initPromise = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS scan_history (
          id TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL,
          mode TEXT NOT NULL,
          title TEXT NOT NULL,
          recommendation TEXT,
          analysis_snapshot JSONB,
          estimate JSONB
        )
      `);
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }

  await initPromise;
}

function rowToEntry(row: {
  id: string;
  created_at: string;
  mode: string;
  title: string;
  recommendation: string | null;
  analysis_snapshot: ScanHistoryEntry["analysisSnapshot"] | null;
  estimate: ScanHistoryEntry["estimate"] | null;
}): ScanHistoryEntry {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    mode: row.mode as ScanHistoryEntry["mode"],
    title: row.title,
    recommendation: row.recommendation ?? undefined,
    analysisSnapshot: row.analysis_snapshot ?? undefined,
    estimate: row.estimate ?? undefined,
  };
}

export async function readScanHistory(): Promise<ScanHistoryEntry[]> {
  await ensureSchema();
  const pool = getPool();

  const res = await pool.query(
    `
      SELECT id, created_at, mode, title, recommendation, analysis_snapshot, estimate
      FROM scan_history
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [maxEntries],
  );

  return res.rows.map((row) => rowToEntry(row));
}

export async function prependScanHistoryEntry(entry: ScanHistoryEntry) {
  await ensureSchema();
  const pool = getPool();

  await pool.query(
    `
      INSERT INTO scan_history (id, created_at, mode, title, recommendation, analysis_snapshot, estimate)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)
      ON CONFLICT (id)
      DO UPDATE
      SET
        created_at = EXCLUDED.created_at,
        mode = EXCLUDED.mode,
        title = EXCLUDED.title,
        recommendation = EXCLUDED.recommendation,
        analysis_snapshot = EXCLUDED.analysis_snapshot,
        estimate = EXCLUDED.estimate
    `,
    [
      entry.id,
      entry.createdAt,
      entry.mode,
      entry.title,
      entry.recommendation ?? null,
      JSON.stringify(entry.analysisSnapshot ?? null),
      JSON.stringify(entry.estimate ?? null),
    ],
  );

  await pool.query(
    `
      DELETE FROM scan_history
      WHERE id IN (
        SELECT id
        FROM scan_history
        ORDER BY created_at DESC
        OFFSET $1
      )
    `,
    [maxEntries],
  );

  return readScanHistory();
}

export async function clearScanHistory() {
  await ensureSchema();
  const pool = getPool();
  await pool.query("DELETE FROM scan_history");
  return [] as ScanHistoryEntry[];
}

export async function getDatabaseStatus() {
  if (!process.env.DATABASE_URL) {
    return {
      engine: "postgres",
      configured: false,
      connected: false,
      message: "DATABASE_URL is missing.",
    };
  }

  try {
    await ensureSchema();
    const pool = getPool();
    await pool.query("SELECT 1");
    return {
      engine: "postgres",
      configured: true,
      connected: true,
      message: "Connected",
    };
  } catch (err: unknown) {
    return {
      engine: "postgres",
      configured: true,
      connected: false,
      message: err instanceof Error ? err.message : "Connection failed",
    };
  }
}

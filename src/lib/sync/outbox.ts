import type { Task } from "@/lib/db/schema";

export type MutationType = "create" | "update" | "delete" | "archive" | "restore";

export type OutboxEntry = {
  id: string;
  type: MutationType;
  taskId: string;
  payload: unknown;
  optimisticTask: Task;
  createdAt: number;
};

const DB_NAME = "tasks_outbox";
const STORE = "entries";
const VERSION = 1;

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getDB(): Promise<IDBDatabase> {
  if (!_db) _db = await openDB();
  return _db;
}

function run<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return getDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

export const outbox = {
  /** Write a pending mutation before hitting the network. */
  add: (entry: OutboxEntry) => run("readwrite", (s) => s.add(entry)),

  /** Clear a mutation after the server confirms it. */
  remove: (id: string) => run("readwrite", (s) => s.delete(id)),

  /** Load all pending mutations on startup. */
  getAll: () => run<OutboxEntry[]>("readonly", (s) => s.getAll()),
};

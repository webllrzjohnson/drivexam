import type { OfflineQuestionPack, StoredOfflineAttempt } from "@/lib/learner/offline-practice";

const OFFLINE_DB_NAME = "drivexam-offline-practice";
const OFFLINE_DB_VERSION = 1;
const PACK_STORE = "packs";
const ATTEMPT_STORE = "attempts";
const CURRENT_PACK_ID = "current";

type PackRecord = { id: typeof CURRENT_PACK_ID; pack: OfflineQuestionPack };

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function transactionComplete(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed."));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction was aborted."));
  });
}

async function openOfflineDb() {
  if (typeof indexedDB === "undefined") throw new Error("Offline browser storage is unavailable.");
  const request = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(PACK_STORE)) database.createObjectStore(PACK_STORE, { keyPath: "id" });
    if (!database.objectStoreNames.contains(ATTEMPT_STORE)) {
      const attempts = database.createObjectStore(ATTEMPT_STORE, { keyPath: "clientAttemptId" });
      attempts.createIndex("status", "status", { unique: false });
      attempts.createIndex("createdAt", "createdAt", { unique: false });
    }
  };
  return requestResult(request);
}

export async function getOfflinePack() {
  const database = await openOfflineDb();
  try {
    const transaction = database.transaction(PACK_STORE, "readonly");
    const record = await requestResult(transaction.objectStore(PACK_STORE).get(CURRENT_PACK_ID) as IDBRequest<PackRecord | undefined>);
    return record?.pack ?? null;
  } finally {
    database.close();
  }
}

export async function putOfflinePack(pack: OfflineQuestionPack) {
  const database = await openOfflineDb();
  try {
    const transaction = database.transaction(PACK_STORE, "readwrite");
    transaction.objectStore(PACK_STORE).put({ id: CURRENT_PACK_ID, pack } satisfies PackRecord);
    await transactionComplete(transaction);
  } finally {
    database.close();
  }
}

export async function clearOfflinePack() {
  const database = await openOfflineDb();
  try {
    const transaction = database.transaction(PACK_STORE, "readwrite");
    transaction.objectStore(PACK_STORE).delete(CURRENT_PACK_ID);
    await transactionComplete(transaction);
  } finally {
    database.close();
  }
}

export async function getOfflineAttempts() {
  const database = await openOfflineDb();
  try {
    const transaction = database.transaction(ATTEMPT_STORE, "readonly");
    const attempts = await requestResult(transaction.objectStore(ATTEMPT_STORE).getAll() as IDBRequest<StoredOfflineAttempt[]>);
    return attempts.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  } finally {
    database.close();
  }
}

export async function putOfflineAttempt(attempt: StoredOfflineAttempt) {
  const database = await openOfflineDb();
  try {
    const transaction = database.transaction(ATTEMPT_STORE, "readwrite");
    transaction.objectStore(ATTEMPT_STORE).put(attempt);
    await transactionComplete(transaction);
  } finally {
    database.close();
  }
}

export async function updateOfflineAttemptStatus(
  clientAttemptId: string,
  status: StoredOfflineAttempt["status"],
  details: { syncedAt?: string; syncNote?: string } = {},
) {
  const database = await openOfflineDb();
  try {
    const transaction = database.transaction(ATTEMPT_STORE, "readwrite");
    const store = transaction.objectStore(ATTEMPT_STORE);
    const attempt = await requestResult(store.get(clientAttemptId) as IDBRequest<StoredOfflineAttempt | undefined>);
    if (attempt) store.put({ ...attempt, status, ...details });
    await transactionComplete(transaction);
  } finally {
    database.close();
  }
}

export async function deleteOfflineAttempt(clientAttemptId: string) {
  const database = await openOfflineDb();
  try {
    const transaction = database.transaction(ATTEMPT_STORE, "readwrite");
    transaction.objectStore(ATTEMPT_STORE).delete(clientAttemptId);
    await transactionComplete(transaction);
  } finally {
    database.close();
  }
}

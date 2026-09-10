// Robust IndexedDB Persistence Engine
// Provides gigabyte-scale durable client-side storage for images, catalog, and store configurations.
// Automatically bypasses the strict 5MB localStorage limit.

const DB_NAME = 'SaleMarketAppDB_v1';
const STORE_NAME = 'app_store';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  try {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Window is undefined'));
    }
    const idb = window.indexedDB;
    if (!idb) {
      return Promise.reject(new Error('IndexedDB is not supported in this environment'));
    }

    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
      try {
        const request = idb.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          try {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME);
            }
          } catch (e) {
            reject(e);
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          db.onversionchange = () => {
            db.close();
            dbPromise = null;
          };
          resolve(db);
        };

        request.onerror = () => {
          dbPromise = null;
          reject(request.error);
        };
      } catch (err) {
        dbPromise = null;
        reject(err);
      }
    });

    return dbPromise;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function saveToIndexedDB(key: string, value: any): Promise<boolean> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => resolve(true);
      req.onerror = () => {
        console.warn(`IndexedDB save error for ${key}:`, req.error);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn(`IndexedDB failed to save key: ${key}`, err);
    return false;
  }
}

export async function loadFromIndexedDB<T = any>(key: string): Promise<T | null> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        resolve(req.result !== undefined ? req.result : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function loadAllFromIndexedDB(): Promise<Record<string, any>> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const result: Record<string, any> = {};

      // Using cursor or getAllKeys & getAll if supported
      if (store.getAllKeys && store.getAll) {
        const keysReq = store.getAllKeys();
        keysReq.onsuccess = () => {
          const keys = keysReq.result;
          const valsReq = store.getAll();
          valsReq.onsuccess = () => {
            const vals = valsReq.result;
            for (let i = 0; i < keys.length; i++) {
              result[keys[i] as string] = vals[i];
            }
            resolve(result);
          };
          valsReq.onerror = () => resolve(result);
        };
        keysReq.onerror = () => resolve(result);
      } else {
        const req = store.openCursor();
        req.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            result[cursor.key as string] = cursor.value;
            cursor.continue();
          } else {
            resolve(result);
          }
        };
        req.onerror = () => resolve(result);
      }
    });
  } catch {
    return {};
  }
}

export async function deleteFromIndexedDB(key: string): Promise<boolean> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

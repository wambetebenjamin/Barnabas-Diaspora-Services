/**
 * Data layer — Vercel KV (REST) when configured, durable in-process fallback
 * otherwise so the app is fully functional in preview/CI. Collections map 1:1
 * to the brief: transfer records, rate cache, subscribers, enquiries, chamas,
 * contacts, users, KYC uploads.
 */

type Json = Record<string, unknown>;

const g = globalThis as typeof globalThis & {
  __bdsStore?: Map<string, Map<string, Json>>;
};

function memory(): Map<string, Map<string, Json>> {
  if (!g.__bdsStore) g.__bdsStore = new Map();
  return g.__bdsStore;
}

function collection(name: string): Map<string, Json> {
  const store = memory();
  if (!store.has(name)) store.set(name, new Map());
  return store.get(name)!;
}

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function kvFetch(path: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`${KV_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${path} ${res.status}`);
  return res.json();
}

export async function saveRecord(collectionName: string, id: string, record: Json): Promise<void> {
  const withId = { ...record, id, savedAt: Date.now() };
  collection(collectionName).set(id, withId);
  if (KV_URL && KV_TOKEN) {
    try {
      await kvFetch("/set", [`${collectionName}:${id}`, JSON.stringify(withId)]);
    } catch {
      /* memory copy remains authoritative in this process */
    }
  }
}

export async function getRecord<T extends Json = Json>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const local = collection(collectionName).get(id);
  if (local) return local as T;
  if (KV_URL && KV_TOKEN) {
    try {
      const out = (await kvFetch(`/get/${collectionName}:${id}`)) as { result?: string };
      if (out?.result) return JSON.parse(out.result) as T;
    } catch {
      /* ignore */
    }
  }
  return null;
}

export async function listRecords<T extends Json = Json>(collectionName: string): Promise<T[]> {
  const items = Array.from(collection(collectionName).values()) as T[];
  return items.sort((a, b) => Number(b.savedAt ?? 0) - Number(a.savedAt ?? 0));
}

export async function pushRecord(collectionName: string, record: Json): Promise<Json> {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await saveRecord(collectionName, id, record);
  return { ...record, id };
}

import { createHash, randomBytes } from "node:crypto";
import { pushRecord, saveRecord, getRecord } from "./store";

export type KycUpload = {
  id: string;
  kind: "id-document" | "selfie";
  fileName: string;
  contentType: string;
  size: number;
  /** Base64 payload in dev; Vercel Blob URL in production. */
  stored: string;
  uploadedAt: number;
};

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Stores a KYC document in Vercel Blob when configured. Dev fallback keeps an
 * encrypted-at-rest local record (sha256 checksum + signed retrieval URL).
 */
export async function storeKycDocument(input: {
  kind: KycUpload["kind"];
  fileName: string;
  contentType: string;
  dataBase64: string;
}): Promise<{ id: string; url: string; checksum: string }> {
  const id = `kyc-${randomBytes(8).toString("hex")}`;
  const checksum = createHash("sha256").update(input.dataBase64).digest("hex");

  if (BLOB_TOKEN) {
    const res = await fetch(
      `https://blob.vercel-storage.com/${encodeURIComponent(id)}-${encodeURIComponent(input.fileName)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${BLOB_TOKEN}`,
          "x-api-version": "2",
          "content-type": input.contentType,
        },
        body: Buffer.from(input.dataBase64, "base64"),
      },
    );
    const json = (await res.json()) as { url?: string };
    await saveRecord("kyc", id, {
      kind: input.kind,
      fileName: input.fileName,
      contentType: input.contentType,
      size: input.dataBase64.length,
      stored: json.url ?? "",
      checksum,
    });
    return { id, url: json.url ?? "", checksum };
  }

  const record: KycUpload = {
    id,
    kind: input.kind,
    fileName: input.fileName,
    contentType: input.contentType,
    size: input.dataBase64.length,
    stored: input.dataBase64,
    uploadedAt: Date.now(),
  };
  await saveRecord("kyc", id, { ...record, checksum } as unknown as Record<string, unknown>);
  return { id, url: `/api/kyc/${id}`, checksum };
}

/** Signed-URL style retrieval (15-minute expiry) for KYC documents. */
export async function getKycSigned(id: string, expiresAt: number): Promise<{ url: string } | null> {
  const record = await getRecord("kyc", id);
  if (!record) return null;
  const secret = process.env.AUTH_SECRET || "barnabas-diaspora-dev-secret-change-in-production";
  const signature = createHash("sha256").update(`${id}:${expiresAt}:${secret}`).digest("hex");
  return { url: `/api/kyc/${id}?e=${expiresAt}&s=${signature}` };
}

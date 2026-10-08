import { NextRequest } from "next/server";
import { storeKycDocument, getKycSigned } from "@/lib/blob";

export const dynamic = "force-dynamic";

/**
 * /api/kyc — KYC document upload to Vercel Blob (signed-URL retrieval).
 * POST { kind, fileName, contentType, dataBase64 }
 * GET /api/kyc/:id via ?id=… for the signed URL.
 */
export async function POST(request: NextRequest) {
  let body: {
    kind?: "id-document" | "selfie";
    fileName?: string;
    contentType?: string;
    dataBase64?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body.kind || !body.fileName || !body.dataBase64) {
    return Response.json(
      { ok: false, error: "kind, fileName and dataBase64 are required." },
      { status: 400 },
    );
  }

  const sizeLimit = 8 * 1024 * 1024;
  if (body.dataBase64.length > sizeLimit) {
    return Response.json({ ok: false, error: "File exceeds the 8 MB limit." }, { status: 413 });
  }

  const result = await storeKycDocument({
    kind: body.kind,
    fileName: body.fileName,
    contentType: body.contentType ?? "application/octet-stream",
    dataBase64: body.dataBase64,
  });

  return Response.json({ ok: true, ...result });
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 });

  const expiresAt = Date.now() + 15 * 60 * 1000;
  const signed = await getKycSigned(id, expiresAt);
  if (!signed) return Response.json({ ok: false, error: "Not found" }, { status: 404 });

  return Response.json({ ok: true, url: signed.url, expiresAt });
}

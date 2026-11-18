/**
 * Neon S3-Compatible Object Storage Client
 * Handles direct file uploads and retrieval for companion verification documents & media
 * using the Neon Object Storage endpoint with standard AWS Signature V4.
 */

import crypto from "crypto";

const S3_ENDPOINT = (
  process.env.AWS_ENDPOINT_URL_S3 ||
  "https://br-proud-glitter-begb3vlt.storage.c-9.us-east-2.aws.neon.tech"
).replace(/\/$/, "");

const ACCESS_KEY = (
  process.env.AWS_ACCESS_KEY_ID || "nak_live_748603588d434dc39a832bf0dff87f42"
).trim();

const SECRET_KEY = (
  process.env.AWS_SECRET_ACCESS_KEY ||
  "nsk_live_bb98d707005ccb9ba8f06d51769241ae4eeec4984c3260981a702d0fd673b588"
).trim();

const REGION = (process.env.AWS_REGION || "us-east-2").trim();
const DEFAULT_BUCKET = (process.env.S3_BUCKET || "documents").trim();

function getAmzDate(): { amzDate: string; dateStamp: string } {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  return { amzDate, dateStamp };
}

function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function getSignatureKey(key: string, dateStamp: string, region: string, service: string): Buffer {
  const kDate = hmac("AWS4" + key, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

/**
 * Uploads a file (Buffer or Uint8Array) directly to the Neon Object Storage bucket.
 */
export async function uploadToNeonStorage(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string = "application/octet-stream",
  bucket: string = DEFAULT_BUCKET
): Promise<{ success: boolean; url: string; key: string }> {
  const cleanKey = fileName.replace(/^\/+/, "");
  const { amzDate, dateStamp } = getAmzDate();

  const url = new URL(`${S3_ENDPOINT}/${bucket}/${cleanKey}`);
  const host = url.host;
  const canonicalUri = `/${bucket}/${cleanKey}`;

  const payloadHash = crypto.createHash("sha256").update(Buffer.from(fileBuffer)).digest("hex");

  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = ["PUT", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");

  const credentialScope = `${dateStamp}/${REGION}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");

  const signingKey = getSignatureKey(SECRET_KEY, dateStamp, REGION, "s3");
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      Host: host,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      Authorization: authorizationHeader,
    },
    body: Buffer.from(fileBuffer),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Neon storage upload failed (${response.status}): ${errorText}`);
  }

  return {
    success: true,
    url: url.toString(),
    key: `${bucket}/${cleanKey}`,
  };
}

/**
 * Generates an authorized download/view URL for an object stored in Neon.
 */
export function getNeonStoragePublicUrl(key: string, bucket: string = DEFAULT_BUCKET): string {
  const cleanKey = key.replace(new RegExp(`^${bucket}/`), "").replace(/^\/+/, "");
  return `${S3_ENDPOINT}/${bucket}/${cleanKey}`;
}

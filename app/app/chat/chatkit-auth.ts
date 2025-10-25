import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const CHATKIT_AUTH_COOKIE = "ecotrips.chatkit.auth";

const TOKEN_VERSION = "v1";
const TOKEN_TTL_SECONDS = 60 * 10;

function sign(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
}

export function issueAuthToken(secret: string, now = Date.now()) {
  const nonce = randomBytes(16).toString("hex");
  const issuedAt = Math.floor(now / 1000);
  const expiresAt = issuedAt + TOKEN_TTL_SECONDS;
  const payload = `${TOKEN_VERSION}.${nonce}.${expiresAt}`;
  const signature = sign(secret, payload);
  const token = `${payload}.${signature}`;
  const maxAge = Math.max(1, expiresAt - issuedAt);
  return { token, expiresAt, maxAge } as const;
}

export function verifyAuthToken(token: string, secret: string, now = Date.now()) {
  const parts = token.split(".");
  if (parts.length !== 4) {
    return false;
  }
  const [version, nonce, expiresAtRaw, signature] = parts;
  if (version !== TOKEN_VERSION) {
    return false;
  }
  if (!nonce) {
    return false;
  }
  const expiresAt = Number.parseInt(expiresAtRaw, 10);
  if (!Number.isFinite(expiresAt)) {
    return false;
  }
  if (expiresAt <= Math.floor(now / 1000)) {
    return false;
  }
  const payload = `${version}.${nonce}.${expiresAtRaw}`;
  const expected = sign(secret, payload);
  if (!safeEqual(expected, signature)) {
    return false;
  }
  return true;
}

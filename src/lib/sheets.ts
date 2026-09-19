import { createSign } from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

type Credentials = {
  email: string;
  privateKey: string;
  sheetId: string;
};

/**
 * Returns null when the sheet has not been wired up yet, so the site can still
 * run (and tell the guest to call instead) before the credentials exist.
 */
export function credentials(): Credentials | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.RSVP_SHEET_ID;

  if (!email || !privateKey || !sheetId) return null;

  return {
    email,
    // Env vars keep newlines escaped; the signer needs them real.
    privateKey: privateKey.replace(/\\n/g, "\n"),
    sheetId,
  };
}

function base64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

let cachedToken: { value: string; expiresAt: number } | null = null;

/**
 * Signs a service-account JWT and exchanges it for an access token. Done by
 * hand because the official client is an enormous dependency for two calls.
 */
async function accessToken({ email, privateKey }: Credentials) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const claims = {
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: issuedAt,
    exp: issuedAt + 3600,
  };

  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64url(
    JSON.stringify(claims),
  )}`;

  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${base64url(signer.sign(privateKey))}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status} ${await response.text()}`);
  }

  const token = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + token.expires_in * 1000,
  };

  return cachedToken.value;
}

const api = (sheetId: string, path: string) =>
  `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${path}`;

export async function appendRow(tab: string, row: (string | number)[]) {
  const creds = credentials();
  if (!creds) throw new Error("Google Sheets is not configured");

  const token = await accessToken(creds);
  const range = encodeURIComponent(`${tab}!A:Z`);
  const url = `${api(creds.sheetId, range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Sheet append failed: ${response.status} ${await response.text()}`);
  }
}

export async function readRows(range: string): Promise<string[][]> {
  const creds = credentials();
  if (!creds) throw new Error("Google Sheets is not configured");

  const token = await accessToken(creds);
  const response = await fetch(api(creds.sheetId, encodeURIComponent(range)), {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Sheet read failed: ${response.status} ${await response.text()}`);
  }

  const body = (await response.json()) as { values?: string[][] };
  return body.values ?? [];
}

export const TABS = { rsvp: "RSVP", wishes: "Wishes" } as const;

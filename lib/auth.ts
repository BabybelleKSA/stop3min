import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";
const SESSION_VERSION = "v1";

function getSecrets() {
  const email = process.env.ADMIN_EMAIL ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SESSION_SECRET ?? password ?? "change-me";
  return { email, password, secret };
}

function createSessionToken(email: string, password: string, secret: string) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${email}:${password}:${SESSION_VERSION}`);
  return hmac.digest("hex");
}

function expectedToken() {
  const { email, password, secret } = getSecrets();
  if (!email || !password) return "";
  return createSessionToken(email, password, secret);
}

export function isValidAdminSession(token?: string | null) {
  if (!token) return false;
  return token === expectedToken();
}

export function setAdminSessionCookie(response: NextResponse) {
  const { email, password, secret } = getSecrets();
  const token = createSessionToken(email, password, secret);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  });
}

export function requireAdminSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidAdminSession(token)) {
    redirect("/admin/login");
  }
}

export function isAdminRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return isValidAdminSession(token);
}

export function enforceApiAuth(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

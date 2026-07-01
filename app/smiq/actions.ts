"use server";

import { eq, and, gt, lt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { smiqResponses, pendingSmiqSubmissions } from "@/db/schema";
import { subscribeToKit } from "@/lib/kit";
import { sendConfirmationEmail } from "@/lib/email";

const SUPPORTED_LANGS = new Set(["en", "pt", "es", "fr"]);

// TEMP: log db host to identify which Neon branch preview is using — remove after diagnosis
const dbUrl = process.env.DATABASE_URL ?? "";
const dbHost = dbUrl.replace(/^[^@]+@/, "").replace(/\/.*$/, "");
console.log("[db-host]", dbHost || "(DATABASE_URL not set)");

export type SubmitPayload = {
  segment: string;
  segmentLabel: string;
  smiqAnswer: string;
  teachingRole: string | null;
  graduationLevel: string | null;
  name: string;
  email: string;
  lang: string;
};

export type SubmitResult =
  | { ok: true; pendingEmail: string }
  | { ok: false; error: string };

export async function submitResponse(
  payload: SubmitPayload
): Promise<SubmitResult> {
  const { segment, segmentLabel, smiqAnswer, teachingRole, graduationLevel, name, email, lang } =
    payload;

  if (!segment || !segmentLabel || !smiqAnswer.trim() || !name.trim() || !email.trim()) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const cleanLang = SUPPORTED_LANGS.has(lang) ? lang : "en";
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  try {
    const db = getDb();

    await db.delete(pendingSmiqSubmissions).where(
      lt(pendingSmiqSubmissions.expiresAt, new Date())
    );

    await db.insert(pendingSmiqSubmissions).values({
      token,
      expiresAt,
      name: cleanName,
      email: cleanEmail,
      segment,
      segmentLabel,
      smiqAnswer: smiqAnswer.trim(),
      teachingRole: teachingRole ?? null,
      graduationLevel: graduationLevel ?? null,
      lang: cleanLang,
    });

    await sendConfirmationEmail({ name: cleanName, email: cleanEmail, token });

    return { ok: true, pendingEmail: cleanEmail };
  } catch (err) {
    console.error("[submitResponse]", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function confirmResponse(token: string): Promise<{ ok: boolean }> {
  if (!token) return { ok: false };

  const db = getDb();

  const rows = await db
    .select()
    .from(pendingSmiqSubmissions)
    .where(
      and(
        eq(pendingSmiqSubmissions.token, token),
        gt(pendingSmiqSubmissions.expiresAt, new Date())
      )
    )
    .limit(1);

  const row = rows[0];
  if (!row) return { ok: false };

  try {
    await db.insert(smiqResponses).values({
      segment: row.segment,
      segmentLabel: row.segmentLabel,
      smiqAnswer: row.smiqAnswer,
      teachingRole: row.teachingRole,
      graduationLevel: row.graduationLevel,
      name: row.name,
      email: row.email,
      lang: row.lang,
    });

    await db.delete(pendingSmiqSubmissions).where(
      eq(pendingSmiqSubmissions.token, token)
    );

    subscribeToKit({
      name: row.name,
      email: row.email,
      segment: row.segment,
      teachingRole: row.teachingRole,
      graduationLevel: row.graduationLevel,
      lang: row.lang,
    }).catch((err) => console.error("[kit]", err));

    return { ok: true };
  } catch (err) {
    console.error("[confirmResponse]", err);
    return { ok: false };
  }
}

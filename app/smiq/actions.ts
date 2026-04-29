"use server";

import { db } from "@/lib/db";
import { smiqResponses } from "@/db/schema";

export type SubmitPayload = {
  segment: string;
  segmentLabel: string;
  smiqAnswer: string;
  teachingRole: string | null;
  graduationLevel: string | null;
  name: string;
  email: string;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

export async function submitResponse(
  payload: SubmitPayload
): Promise<SubmitResult> {
  const { segment, segmentLabel, smiqAnswer, teachingRole, graduationLevel, name, email } =
    payload;

  if (!segment || !segmentLabel || !smiqAnswer.trim() || !name.trim() || !email.trim()) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  try {
    await db.insert(smiqResponses).values({
      segment,
      segmentLabel,
      smiqAnswer: smiqAnswer.trim(),
      teachingRole: teachingRole ?? null,
      graduationLevel: graduationLevel ?? null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });

    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

"use server";

import { getDb } from "@/lib/db";
import { smiqResponses } from "@/db/schema";
import { subscribeToKit } from "@/lib/kit";

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
    await getDb().insert(smiqResponses).values({
      segment,
      segmentLabel,
      smiqAnswer: smiqAnswer.trim(),
      teachingRole: teachingRole ?? null,
      graduationLevel: graduationLevel ?? null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });

    subscribeToKit({ name: name.trim(), email: email.trim().toLowerCase(), segment, teachingRole, graduationLevel }).catch(
      (err) => console.error("[kit]", err)
    );

    return { ok: true };
  } catch (err) {
    console.error("[submitResponse]", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

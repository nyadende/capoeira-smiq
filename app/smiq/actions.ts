"use server";

import { getDb } from "@/lib/db";
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

type NormalizedSubmitPayload = {
  segment: string;
  segmentLabel: string;
  smiqAnswer: string;
  teachingRole: string | null;
  graduationLevel: string | null;
  name: string;
  email: string;
};

const VALID_SEGMENTS = new Set(["curious", "student", "practitioner", "teacher", "lapsed"]);
const VALID_TEACHING_ROLES = new Set(["classes", "own-school", "admin", "online"]);
const VALID_GRADUATION_LEVELS = new Set(["monitor", "professor", "contra-mestre", "mestre", "grao-mestre", "ungraded"]);

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function validatePayload(payload: SubmitPayload): { ok: true; payload: NormalizedSubmitPayload } | { ok: false; error: string } {
  const segment = normalizeText(payload.segment).toLowerCase();
  const segmentLabel = normalizeText(payload.segmentLabel);
  const smiqAnswer = normalizeText(payload.smiqAnswer);
  const teachingRole = normalizeText(payload.teachingRole);
  const graduationLevel = normalizeText(payload.graduationLevel);
  const name = normalizeText(payload.name);
  const email = normalizeText(payload.email).toLowerCase();

  if (!segment || !segmentLabel || !smiqAnswer || !name || !email) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  if (!VALID_SEGMENTS.has(segment)) {
    return { ok: false, error: "The selected segment is invalid." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (segment === "teacher") {
    if (!VALID_TEACHING_ROLES.has(teachingRole)) {
      return { ok: false, error: "Please select a teaching situation." };
    }

    if (!VALID_GRADUATION_LEVELS.has(graduationLevel)) {
      return { ok: false, error: "Please select a graduation level." };
    }

    return {
      ok: true,
      payload: {
        segment,
        segmentLabel,
        smiqAnswer,
        teachingRole,
        graduationLevel,
        name,
        email,
      },
    };
  }

  return {
    ok: true,
    payload: {
      segment,
      segmentLabel,
      smiqAnswer,
      teachingRole: null,
      graduationLevel: null,
      name,
      email,
    },
  };
}

export async function submitResponse(
  payload: SubmitPayload
): Promise<SubmitResult> {
  const validated = validatePayload(payload);
  if (!validated.ok) {
    return validated;
  }

  const { segment, segmentLabel, smiqAnswer, teachingRole, graduationLevel, name, email } =
    validated.payload;

  if (!process.env.DATABASE_URL) {
    return { ok: false, error: "Submission is temporarily unavailable. Please try again later." };
  }

  try {
    await getDb().insert(smiqResponses).values({
      segment,
      segmentLabel,
      smiqAnswer,
      teachingRole,
      graduationLevel,
      name,
      email,
    });

    return { ok: true };
  } catch (error) {
    console.error("Failed to save SMIQ response", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

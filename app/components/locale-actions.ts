"use server";

import { cookies } from "next/headers";
import { LANGUAGES } from "@/lib/reference-data";

const SUPPORTED_LOCALES = new Set<string>(LANGUAGES.map((l) => l.code));
const LOCALE_COOKIE = "capoeira-lang";

export async function setLocale(locale: string) {
  if (!SUPPORTED_LOCALES.has(locale)) return;

  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { LANGUAGES } from "@/lib/reference-data";

const SUPPORTED_LOCALES = new Set<string>(LANGUAGES.map((l) => l.code));
const DEFAULT_LOCALE = "en";
const LOCALE_COOKIE = "capoeira-lang";

async function resolveLocale(): Promise<string> {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (cookieLocale && SUPPORTED_LOCALES.has(cookieLocale)) return cookieLocale;

  const acceptLanguage = (await headers()).get("accept-language");
  if (acceptLanguage) {
    for (const part of acceptLanguage.split(",")) {
      const primary = part.trim().split(";")[0].split("-")[0].toLowerCase();
      if (SUPPORTED_LOCALES.has(primary)) return primary;
    }
  }

  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

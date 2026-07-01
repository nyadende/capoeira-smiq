"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ConfirmedContent() {
  const params = useSearchParams();
  const expired = params.get("expired") === "1";
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    function onLangChange() {
      setTick((n) => n + 1);
    }
    document.addEventListener("i18n:change", onLangChange);
    return () => document.removeEventListener("i18n:change", onLangChange);
  }, []);

  function t(key: string, fallback: string): string {
    if (!mounted) return fallback;
    return window.i18n?.t(key) || fallback;
  }

  if (expired) {
    return (
      <div className="card" id="main-card">
        <div id="success-screen">
          <div className="axe-heading" id="success-heading">
            {t("confirmed.expired_heading", "Link expired")}
          </div>
          <p className="success-msg" id="success-msg">
            {t("confirmed.expired_before", "This confirmation link has expired or has already been used. Please ")}
            <a href="/smiq" style={{ color: "var(--gold)" }}>
              {t("confirmed.expired_link", "fill in the form again")}
            </a>
            {t("confirmed.expired_after", " to receive a new one.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" id="main-card">
      <div id="success-screen">
        <div className="axe-heading" id="success-heading">
          {t("confirmed.success_heading", "Axé!")}
        </div>
        <p className="success-msg" id="success-msg">
          {t("confirmed.success_body", "Thank you for sharing. We read every response personally and your answer will help shape something genuinely useful for the Capoeira community.")}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";

export default function ConfirmedContent() {
  const params = useSearchParams();
  const expired = params.get("expired") === "1";

  if (expired) {
    return (
      <div className="card" id="main-card">
        <div id="success-screen">
          <div className="axe-heading" id="success-heading">Link expired</div>
          <p className="success-msg" id="success-msg">
            This confirmation link has expired or has already been used. Please{" "}
            <a href="/smiq" style={{ color: "var(--gold)" }}>fill in the form again</a> to receive a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" id="main-card">
      <div id="success-screen">
        <div className="axe-heading" id="success-heading">Axé!</div>
        <p className="success-msg" id="success-msg">
          Thank you for sharing. We read every response personally and your answer will help shape something genuinely useful for the Capoeira community.
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import SmiqForm from "./SmiqForm";

export const metadata: Metadata = {
  title: "Share Your Voice — Capoeira International",
  description:
    "One question. Two minutes. Help shape the future of the global Capoeira community.",
};

export default function SmiqPage() {
  return (
    <>
      <nav>
        <a href="/" className="nav-logo">Capoeira International</a>
      </nav>
      <main className="smiq-page">
        <SmiqForm />
      </main>
    </>
  );
}

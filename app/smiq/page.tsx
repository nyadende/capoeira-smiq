import type { Metadata } from "next";
import SmiqForm from "./SmiqForm";
import LangSwitcher from "../components/LangSwitcher";

export const metadata: Metadata = {
  title: "Share Your Voice — Capoeira International",
  description:
    "One question. Two minutes. Help shape the future of the global Capoeira community.",
};

export default function SmiqPage() {
  return (
    <>
      <nav>
        <a href="/" className="nav-logo" data-i18n="smiq_nav.logo">Capoeira International</a>
        <LangSwitcher />
      </nav>
      <main className="smiq-page">
        <SmiqForm />
      </main>
    </>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import ConfirmedContent from "./ConfirmedContent";
import LangSwitcher from "../../components/LangSwitcher";

export default function ConfirmedPage() {
  return (
    <>
      <nav>
        <Link href="/" className="nav-logo" data-i18n="smiq_nav.logo">
          Capoeira International
        </Link>
        <LangSwitcher />
      </nav>
      <main className="smiq-page">
        <Suspense>
          <ConfirmedContent />
        </Suspense>
      </main>
    </>
  );
}

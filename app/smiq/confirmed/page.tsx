import { Suspense } from "react";
import ConfirmedContent from "./ConfirmedContent";

export default function ConfirmedPage() {
  return (
    <main className="smiq-page">
      <Suspense>
        <ConfirmedContent />
      </Suspense>
    </main>
  );
}

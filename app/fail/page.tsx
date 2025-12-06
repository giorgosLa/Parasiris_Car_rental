"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import FailedContent from "./fail-content";

export default function FailedPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <FailedContent />
    </Suspense>
  );
}

import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Navbar />
      {children}
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import "./globals.css";
import Link from "next/link";
import { HelpButton } from "~/components/help-button";

/* eslint-disable @next/next/no-img-element */

export const metadata: Metadata = {
  title: "Ukens hjernetrim",
  description: "Helseytelser ukens hjernetrim.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto flex max-w-screen-md flex-col gap-4 bg-stone-50 p-4 text-stone-900 sm:p-8">
        <header className="flex items-center gap-10 pt-[80px]">
         
          
          <div>
            
            <h1 className="text-2xl font-bold inline-flex items-center gap-2"><img src="./norway-flag.png" alt="Norway flag" className="h-6 w-auto inline-block" /> Helseytelser ukens hjernetrim</h1>
            
            <p>Lag 4 grupper av 4 ord som deler en felles tråd!</p>
          </div>

          <div className="ml-auto">
            <HelpButton />
          </div>
        </header>
        <hr className="border-stone-300" />

        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}

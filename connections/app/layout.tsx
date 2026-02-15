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
          {/* <Link href="/" className="shrink-0">
            <img
              src="/logo-1024.png"
              alt="Custom Connections Logo"
              className="h-12 w-12"
            />
          </Link> */}
          
          <div>
            
            <h1 className="text-2xl font-bold">Helseytelser ukens hjernetrim</h1>
            
            <p>Grupper 4 ord som deler en felles tråd.</p>
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

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import Provider from "@/components/Provider";
import "@uploadthing/react/styles.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  fallback: ["helvetica", "arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "DocInsight-AI",
  description: "The Best PDF AI Chat App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
        variables: {
          colorBackground: "rgb(30, 30, 30)",
        },
      }}
    >
      <html lang="en" className="light">
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2",
            poppins.className
          )}
        >
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}

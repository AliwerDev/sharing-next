import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import AxiosInterceptor from "@/components/providers/AxiosInterceptor";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShareFlow - Community Item Sharing Ecosystem",
  description: "A premium, gamified peer-to-peer (P2P) resource-sharing platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <AxiosInterceptor>
            <ReactQueryProvider>
              {children}
              <Toaster position="top-center" richColors />
            </ReactQueryProvider>
          </AxiosInterceptor>
        </SessionProvider>
      </body>
    </html>
  );
}

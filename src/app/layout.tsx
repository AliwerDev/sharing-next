import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import AxiosInterceptor from "@/components/providers/AxiosInterceptor";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShareFlow - Community Item Sharing Ecosystem",
  description: "A premium, gamified peer-to-peer (P2P) resource-sharing platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${plusJakartaSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionProvider>
            <AxiosInterceptor>
              <ReactQueryProvider>
                {children}
                <Toaster position="top-center" richColors />
              </ReactQueryProvider>
            </AxiosInterceptor>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


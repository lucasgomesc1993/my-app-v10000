import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedLayout } from "@/components/protected-layout";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/sidebar";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scheme-only-dark">
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <ProtectedLayout>
                <div className="min-h-screen">
                  {children}
                </div>
              </ProtectedLayout>
            </SidebarInset>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

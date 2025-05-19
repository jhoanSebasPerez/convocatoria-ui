import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import authenticated from "@/modules/auth/server/authenticated";
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LayoutClient from "@/components/layout-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feria de convocatoria - UFPS",
  description: "Sistema de gestión de convocatorias de proyectos de la Universidad Francisco de Paula Santander",
  icons: {
    icon: "https://ww2.ufps.edu.co/assets/img/ico/favicon.ico",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const isAuthenticated = await authenticated();

  return (
    <html lang="es">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledEngineProvider injectFirst>
          <Providers authenticated={isAuthenticated}>
            <CssBaseline />
            <CssBaseline enableColorScheme />
            {isAuthenticated ? (
              <LayoutClient>
                {children}
              </LayoutClient>
            ) : (children)}
          </Providers>
        </StyledEngineProvider>
      </body>
    </html>
  );
}

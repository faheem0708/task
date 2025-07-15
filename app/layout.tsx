import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "@/context/auth-context";

const font = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task",
  description: "Auth + User Dashboard with Firebase Authp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={font.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer/>
      </body>
    </html>
  );
}

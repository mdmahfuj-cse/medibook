import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ToastContainer } from "../ui/ToastContainer";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7FBFC] text-[#143B43] selection:bg-[#CDECEF] selection:text-[#143B43]">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

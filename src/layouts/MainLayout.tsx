import Header from "../components/Header";
import Footer from "../components/Footer";
import type { ReactNode } from "react";

import { useCursorLight } from "../hooks/useCursorLight";

type MainLayoutProps = {
  children: ReactNode;
  introDone: boolean;
};

export default function MainLayout({ children, introDone }: MainLayoutProps) {
  useCursorLight();

  return (
    <>
      <div id="cursor-light" />

      <div className="layout">
        <Header introDone={introDone} />
        {/* Main page */}
        <main className="layout__main">{children}</main>
        <Footer />
      </div>
    </>
  );
}

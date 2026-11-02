import Header from "../components/Header";
import Footer from "../components/Footer";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useCursorLight } from "../hooks/useCursorLight";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  useCursorLight();
  const { t } = useTranslation();

  return (
    <>
      <div id="cursor-light" aria-hidden="true" />

      <div className="layout">
        <a className="skip-link" href="#main-content" onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main-content");
          main?.focus({ preventScroll: true });
          main?.scrollIntoView({ behavior: "instant" });
        }}>{t("accessibility.skipToContent")}</a>
        <Header />
        {/* Main page */}
        <main id="main-content" className="layout__main" tabIndex={-1}>{children}</main>
        <Footer />
      </div>
    </>
  );
}

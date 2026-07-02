import type { Metadata } from "next";
import "./globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";

export const metadata: Metadata = {
  title: "DDR Analytics",
  description: "Daily Drilling Report — OCR extraction & analytics platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="layout-root">
          <aside className="sidebar">
            <div className="sidebar-logo">
              <div className="sidebar-logo-mark">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div className="sidebar-logo-title">DDR Analytics</div>
                <div className="sidebar-logo-sub">OCR Platform</div>
              </div>
            </div>

            <SidebarWrapper />

            <div className="sidebar-footer">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--color-bg-overlay)",
                    border: "0.5px solid var(--color-border-default)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                    flexShrink: 0,
                  }}
                >
                  AD
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      lineHeight: 1,
                    }}
                  >
                    Admin
                  </div>
                  <div
                    style={{
                      fontSize: "0.625rem",
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-mono)",
                      marginTop: "2px",
                    }}
                  >
                    v2.0 · PaddleOCR
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="main-content">
            <main className="page-wrapper page-enter">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

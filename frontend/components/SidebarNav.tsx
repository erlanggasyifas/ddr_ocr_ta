"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav({
  onUploadClick,
}: {
  onUploadClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav">
      <div className="mb-4">
        <div className="sidebar-section-label">Main</div>

        {/* Dashboard */}
        <Link
          href="/"
          className={`sidebar-link${pathname === "/" ? " active" : ""}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

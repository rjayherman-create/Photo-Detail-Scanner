"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppNavItem, MobileMenu } from "./MobileMenu";

type AppShellProps = {
  title: string;
  subtitle?: string;
  logoSrc?: string;
  children: React.ReactNode;
  navItems?: AppNavItem[];
  bottomNavItems?: AppNavItem[];
  rightAction?: React.ReactNode;
};

const defaultNavItems: AppNavItem[] = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "New", to: "/new" },
  { label: "Documents", to: "/documents" },
  { label: "Review", to: "/review" },
  { label: "Messages", to: "/messages" },
  { label: "Settings", to: "/settings" },
];

export function AppShell({
  title,
  subtitle,
  logoSrc,
  children,
  navItems = defaultNavItems,
  bottomNavItems,
  rightAction,
}: AppShellProps) {
  const mobileBottomNav = bottomNavItems || navItems.slice(0, 4);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          {logoSrc ? (
            <Image src={logoSrc} alt="" width={38} height={38} className="app-logo" />
          ) : (
            <div className="app-logo-fallback" />
          )}

          <div className="app-title-group">
            <h1 className="app-title">{title}</h1>
            {subtitle ? <p className="app-subtitle">{subtitle}</p> : null}
          </div>
        </div>

        <div className="app-header-actions">
          <MobileMenu navItems={navItems} />
          {rightAction}
        </div>
      </header>

      <aside className="desktop-sidebar">
        <nav className="desktop-sidebar-nav">
          {navItems.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </nav>
      </aside>

      <main className="app-main">{children}</main>

      <nav className="mobile-bottom-nav" aria-label="Primary mobile navigation">
        {mobileBottomNav.slice(0, 4).map((item) => (
          <BottomNavLink key={item.to} item={item} />
        ))}
      </nav>
    </div>
  );
}

function SidebarLink({ item }: { item: AppNavItem }) {
  const pathname = usePathname();
  const active = pathname === item.to || pathname.startsWith(`${item.to}/`);

  return (
    <Link
      href={item.to}
      className={active ? "desktop-sidebar-link active" : "desktop-sidebar-link"}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
}

function BottomNavLink({ item }: { item: AppNavItem }) {
  const pathname = usePathname();
  const active = pathname === item.to || pathname.startsWith(`${item.to}/`);

  return (
    <Link href={item.to} className={active ? "mobile-nav-item active" : "mobile-nav-item"}>
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
}

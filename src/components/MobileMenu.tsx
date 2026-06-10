"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type AppNavItem = {
  label: string;
  to: string;
  icon?: React.ReactNode;
};

export function MobileMenu({ navItems }: { navItems: AppNavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="hamburger-button mobile-only"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      {open ? (
        <>
          <div className="mobile-drawer-backdrop" onClick={() => setOpen(false)} />

          <aside className="mobile-menu-drawer" aria-label="Mobile menu">
            <div className="mobile-menu-header">
              <strong className="mobile-menu-title">Menu</strong>
              <button className="btn btn-secondary" onClick={() => setOpen(false)} type="button">
                Close
              </button>
            </div>

            <nav className="mobile-menu-list">
              {navItems.map((item) => (
                <NavItem key={item.to} item={item} onSelect={() => setOpen(false)} />
              ))}
            </nav>
          </aside>
        </>
      ) : null}
    </>
  );
}

function NavItem({ item, onSelect }: { item: AppNavItem; onSelect: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.to || pathname.startsWith(`${item.to}/`);

  return (
    <Link
      href={item.to}
      onClick={onSelect}
      className={active ? "mobile-menu-link active" : "mobile-menu-link"}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
}

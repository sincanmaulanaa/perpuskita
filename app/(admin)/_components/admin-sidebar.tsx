"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  available: boolean;
  icon: React.ReactNode;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    items: [
      { label: "Beranda", href: "/", available: true, icon: <HomeIcon /> },
    ],
  },
  {
    title: "Master Data",
    items: [
      { label: "Buku", href: "/buku", available: true, icon: <BookIcon /> },
      {
        label: "Jenis Buku",
        href: "/jenis-buku",
        available: true,
        icon: <TagIcon />,
      },
      {
        label: "Penulis",
        href: "/penulis",
        available: true,
        icon: <PencilIcon />,
      },
      {
        label: "Penerbit",
        href: "/penerbit",
        available: true,
        icon: <BuildingIcon />,
      },
      {
        label: "Anggota",
        href: "/anggota",
        available: true,
        icon: <UserIcon />,
      },
    ],
  },
  {
    title: "Transaksi",
    items: [
      {
        label: "Peminjaman",
        href: "/peminjaman",
        available: true,
        icon: <CalendarIcon />,
      },
      {
        label: "Denda",
        href: "/denda",
        available: true,
        icon: <ReceiptIcon />,
      },
    ],
  },
];

type AdminSidebarProps = {
  onNavigate?: () => void;
};

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-5 p-3">
      {sections.map((section, index) => (
        <div key={section.title ?? `section-${index}`} className="flex flex-col gap-1">
          {section.title ? (
            <div className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
          ) : null}
          {section.items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}

type NavLinkProps = {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
};

function NavLink({ item, active, onNavigate }: NavLinkProps) {
  if (!item.available) {
    return (
      <div
        aria-disabled
        title="Segera tersedia"
        className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-400"
      >
        <span className="flex items-center gap-3">
          <span className="text-slate-300">{item.icon}</span>
          {item.label}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
          Segera
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "flex items-center gap-3 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      }
    >
      <span className={active ? "text-white" : "text-slate-500"}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5v12a1 1 0 0 0 1 1h6V5H6.5A2.5 2.5 0 0 0 4 6.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6.5v12a1 1 0 0 1-1 1h-6V5h4.5A2.5 2.5 0 0 1 20 6.5Z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.5V5a2 2 0 0 1 2-2h7.5L21 11.5 12.5 20 3 12.5Z" />
      <circle cx={8} cy={8} r={1.5} />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 20 1-4 11-11 3 3-11 11-4 1Z" />
      <path strokeLinecap="round" d="m13.5 6.5 3 3" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M3 21h18" />
      <path strokeLinecap="round" d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden>
      <circle cx={12} cy={8} r={4} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden>
      <rect x={3.5} y={5} width={17} height={15} rx={2} strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 10h17M8 3v4m8-4v4" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path strokeLinecap="round" d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

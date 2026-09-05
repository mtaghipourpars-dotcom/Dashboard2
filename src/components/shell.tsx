import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  Box,
  GitBranch,
  History,
  LayoutDashboard,
  Package,
  Radio,
  Scale,
  Wallet,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "کنترل مأموریت", icon: LayoutDashboard },
  { to: "/impact", label: "تحلیل اثر", icon: Activity },
  { to: "/scenario", label: "سناریو", icon: Zap },
  { to: "/simulation", label: "شبیه‌سازی", icon: Radio },
  { to: "/decision", label: "بسته تصمیم", icon: Scale },
  { to: "/graph", label: "گراف بنگاه", icon: GitBranch },
  { to: "/projects", label: "پروژه‌ها", icon: Box },
  { to: "/resources", label: "منابع", icon: Package },
  { to: "/cash", label: "نقدینگی", icon: Wallet },
  { to: "/history", label: "تاریخچه", icon: History },
  { to: "/blueprint", label: "معماری", icon: BookOpen },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-bg text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-50 bg-fg text-accent-fg px-3 py-2 rounded-[8px]"
      >
        پرش به محتوا
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-[1600px] mx-auto">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="size-7 grid place-items-center border border-accent text-accent text-[10px] font-mono">
              MC
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-medium tracking-tight">Mission Control</span>
              <span className="block text-[10px] text-fg-muted font-mono">PARS · MAPNA · v1.0</span>
            </span>
          </Link>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-fg-muted">
            <span className="size-1.5 rounded-full bg-ok" />
            SAP مشاهده‌گر
            <span className="text-border-strong">/</span>
            موتور قطعی فعال
            <span className="text-border-strong">/</span>
            انسان تصمیم‌گیر
          </div>
        </div>
        <nav className="border-t border-border overflow-x-auto">
          <ul className="flex gap-0 px-2 max-w-[1600px] mx-auto min-w-max">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-1.5 px-3 h-10 text-[13px] border-b-2 transition-colors",
                      active
                        ? "border-accent text-fg"
                        : "border-transparent text-fg-muted hover:text-fg",
                    )}
                  >
                    <Icon className="size-3.5" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main id="main" className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  desc,
  actions,
}: {
  kicker?: string;
  title: string;
  desc?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
      <div className="flex-1 min-w-0">
        {kicker && (
          <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-fg-muted mb-2">
            {kicker}
          </p>
        )}
        <h1 className="text-2xl md:text-[1.75rem] font-medium tracking-tight leading-tight">
          {title}
        </h1>
        {desc && <p className="mt-2 text-sm text-fg-muted max-w-2xl leading-relaxed">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  children,
  className,
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("bg-bg-elevated border border-border rounded-[24px] p-4 md:p-5", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {title && <h2 className="text-sm font-medium">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "danger" | "info";
}) {
  const map = {
    neutral: "border-border text-fg-muted",
    ok: "border-ok/40 text-ok",
    warn: "border-warn/40 text-warn",
    danger: "border-danger/40 text-danger",
    info: "border-info/40 text-info",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 text-[11px] font-mono border rounded-full",
        map[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "ok" | "warn" | "danger" | "neutral";
}) {
  const color =
    tone === "ok"
      ? "text-ok"
      : tone === "warn"
        ? "text-warn"
        : tone === "danger"
          ? "text-danger"
          : "text-fg";
  return (
    <div className="bg-bg-subtle border border-border rounded-[16px] p-4">
      <div className="text-[11px] text-fg-muted mb-1">{label}</div>
      <div className={cn("text-xl md:text-2xl font-medium tabular-nums font-mono tracking-tight", color)}>
        {value}
      </div>
      {hint && <div className="text-[11px] text-fg-subtle mt-1">{hint}</div>}
    </div>
  );
}

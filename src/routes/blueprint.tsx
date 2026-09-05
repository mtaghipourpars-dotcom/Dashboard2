import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Panel } from "@/components/shell";
import { BLUEPRINT } from "@/lib/blueprint/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blueprint")({ component: BlueprintPage });

function BlueprintPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(BLUEPRINT[0]!.id);
  const filtered = useMemo(() => {
    const n = q.trim();
    if (!n) return BLUEPRINT;
    return BLUEPRINT.filter((s) => s.title.includes(n) || s.body.includes(n));
  }, [q]);
  const current = BLUEPRINT.find((s) => s.id === active) ?? filtered[0] ?? BLUEPRINT[0]!;

  return (
    <div>
      <PageHeader
        kicker="Architecture · Design Blueprint · MVP Spec"
        title="سند معماری Mission Control v1.0"
        desc="Implementation-ready. FACT / INFERENCE / ASSUMPTION جدا شده‌اند. تیم توسعه پس از این سند نباید برای تفسیر معماری معطل بماند."
      />
      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        <aside className="lg:sticky lg:top-28 h-fit">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو در سند"
            className="w-full h-11 px-3 mb-3 bg-bg-subtle border border-border rounded-[12px] text-sm outline-none focus:border-accent"
          />
          <nav className="max-h-[70vh] overflow-y-auto border border-border rounded-[24px] p-2 bg-bg-elevated">
            {filtered.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={cn(
                  "w-full text-right px-3 py-2 rounded-[12px] text-[13px] leading-snug",
                  active === s.id ? "bg-bg-subtle text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>
        <Panel>
          <h2 className="text-xl font-medium mb-4">{current.title}</h2>
          <div className="prose-mc text-sm leading-7 text-fg-muted whitespace-pre-wrap">
            {current.body}
          </div>
        </Panel>
      </div>
    </div>
  );
}

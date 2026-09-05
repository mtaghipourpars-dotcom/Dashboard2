import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { buildGraph } from "@/lib/mc/graph";
import type { NodeType } from "@/lib/mc/types";

const TYPE_TONE: Record<NodeType, string> = {
  resource: "border-danger/50 text-danger",
  operation: "border-warn/50 text-warn",
  order: "border-info/50 text-info",
  project: "border-accent/60 text-accent",
  wbs: "border-accent/40 text-fg-muted",
  commitment: "border-ok/50 text-ok",
  cash_event: "border-fg/40 text-fg",
  milestone: "border-ok/30 text-ok",
  material: "border-border text-fg-muted",
  supplier: "border-border text-fg-muted",
  enterprise: "border-border text-fg",
  plant: "border-border text-fg",
  person: "border-border text-fg-muted",
};

const CHAIN: NodeType[] = ["resource", "operation", "order", "project", "commitment", "cash_event"];

export function GraphView({ highlightIds }: { highlightIds?: string[] }) {
  const graph = useMemo(() => buildGraph(), []);
  const [focus, setFocus] = useState<string | null>("WC-VPI-01");
  const hi = new Set(highlightIds ?? (focus ? [focus] : []));

  const columns = CHAIN.map((t) => graph.nodes.filter((n) => n.type === t));

  const related = new Set<string>();
  if (focus) {
    related.add(focus);
    for (const e of graph.edges) {
      if (e.source === focus) related.add(e.target);
      if (e.target === focus) related.add(e.source);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-fg-muted">
        گراف برای توضیح تصمیم است نه تزئین. از منبع به تعهد و نقد دنبال کنید.
      </p>
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-3 min-w-[860px]">
          {columns.map((col, i) => (
            <div key={CHAIN[i]} className="flex-1 min-w-[130px] space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-fg-subtle px-1">
                {CHAIN[i]}
              </div>
              {col.slice(0, 10).map((n) => {
                const on = hi.has(n.id) || related.has(n.id);
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setFocus(n.id)}
                    className={cn(
                      "w-full text-right border rounded-[12px] px-2.5 py-2 text-[11px] leading-snug transition-opacity",
                      TYPE_TONE[n.type],
                      on ? "bg-bg-subtle opacity-100" : "opacity-40 hover:opacity-80",
                    )}
                  >
                    <div className="font-medium text-inherit">{n.labelFa}</div>
                    <div className="font-mono text-[10px] opacity-70">{n.id}</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

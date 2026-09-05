import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel, Tag } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useHydrateMc } from "@/lib/mc/use-hydrate";
import { useSimulation } from "@/lib/mc/store";
import { formatDays, formatIrr, formatPct, toFaDigits } from "@/lib/mc/money";
import { PROFILE_LABEL } from "@/lib/mc/weights";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulation")({ component: SimPage });

function SimPage() {
  useHydrateMc();
  const sim = useSimulation();

  return (
    <div>
      <PageHeader
        kicker="Simulation Engine · Level 1 deterministic + Level 2 scenarios"
        title="چهار مسیر اجرایی"
        desc={`پروفایل ${PROFILE_LABEL[sim.profile]}. اعداد از موتور قطعی می‌آیند نه از مدل زبانی.`}
        actions={
          <Link to="/decision">
            <Button>بسته تصمیم و شورا</Button>
          </Link>
        }
      />

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-fg-muted text-[12px] border-b border-border">
              <th className="text-right py-3 font-medium">مسیر</th>
              <th className="text-right py-3 font-medium">هزینه</th>
              <th className="text-right py-3 font-medium">تأخیر</th>
              <th className="text-right py-3 font-medium">نقد</th>
              <th className="text-right py-3 font-medium">ریسک اجرا</th>
              <th className="text-right py-3 font-medium">امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {sim.ranked.map((r, i) => (
              <tr
                key={r.alternative.id}
                className={cn("border-b border-border/70", i === 0 && "bg-bg-subtle")}
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    {i === 0 && <Tag tone="ok">منتخب</Tag>}
                    <span>{r.alternative.nameFa}</span>
                  </div>
                  <div className="text-[11px] text-fg-muted mt-1 max-w-xs">{r.alternative.summaryFa}</div>
                </td>
                <td className="py-3 font-mono tabular-nums">{formatIrr(r.kpi.costIrr)}</td>
                <td className="py-3 font-mono tabular-nums">{formatDays(r.kpi.delayDays)}</td>
                <td className="py-3 font-mono tabular-nums">{formatIrr(r.kpi.cashDeltaIrr)}</td>
                <td className="py-3 font-mono">{formatPct(r.kpi.executionRisk)}</td>
                <td className="py-3 font-mono text-base">{toFaDigits(r.score.toFixed(0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sim.ranked.map((r) => (
          <Panel key={r.alternative.id} title={r.alternative.nameFa}>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {Object.entries(r.scoreBreakdown).map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] text-fg-muted">{k}</div>
                  <div className="h-1.5 bg-bg-subtle rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-accent" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <ul className="text-[12px] text-fg-muted space-y-1">
              {r.delayedProjects.map((p) => (
                <li key={p.id}>
                  {p.nameFa}: {formatDays(p.delayDays)}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}

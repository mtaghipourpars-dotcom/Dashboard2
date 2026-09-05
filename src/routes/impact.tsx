import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Tag } from "@/components/shell";
import { useHydrateMc } from "@/lib/mc/use-hydrate";
import { useSimulation } from "@/lib/mc/store";
import { formatDays, formatIrr, toFaDigits } from "@/lib/mc/money";

export const Route = createFileRoute("/impact")({ component: ImpactPage });

function ImpactPage() {
  useHydrateMc();
  const sim = useSimulation();
  const traces = sim.baseline.traces.filter((t) => t.delayDays > 0).slice(0, 18);

  return (
    <div>
      <PageHeader
        kicker="Impact Propagation"
        title="انتشار اثر از منبع تا نقد"
        desc="هر عدد باید قابل ردگیری باشد. کلیک مسیر محاسبه است نه روایت."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <Tag tone="danger">ماشین VPI-01</Tag>
        <span className="text-fg-subtle">→</span>
        <Tag tone="warn">{toFaDigits(sim.baseline.affected.operations)} عملیات</Tag>
        <span className="text-fg-subtle">→</span>
        <Tag tone="info">{toFaDigits(sim.baseline.affected.orders)} سفارش</Tag>
        <span className="text-fg-subtle">→</span>
        <Tag>{toFaDigits(sim.baseline.affected.projects)} پروژه</Tag>
        <span className="text-fg-subtle">→</span>
        <Tag tone="ok">{toFaDigits(sim.baseline.affected.commitments)} تعهد</Tag>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Panel title="زمان‌بندی">
          <p className="text-2xl font-mono tabular-nums">{formatDays(sim.baseline.kpi.delayDays)}</p>
          <p className="text-sm text-fg-muted mt-2">تأخیر پروژه واحد ۲ نسبت به برنامه SAP</p>
        </Panel>
        <Panel title="جریمه قراردادی">
          <p className="text-2xl font-mono tabular-nums text-danger">{formatIrr(sim.baseline.kpi.penaltyIrr)}</p>
          <p className="text-sm text-fg-muted mt-2">سقف جریمه ۱۰٪ قرارداد · نرخ روزانه ۰٫۱۵٪</p>
        </Panel>
        <Panel title="اثر نقد">
          <p className="text-2xl font-mono tabular-nums">{formatIrr(sim.baseline.kpi.cashDeltaIrr)}</p>
          <p className="text-sm text-fg-muted mt-2">ارزش زمانی وصول FAT + تأخیر صورت‌وضعیت</p>
        </Panel>
      </div>

      <Panel title="ردپا">
        <ol className="space-y-3">
          {traces.map((t, i) => (
            <li key={`${t.fromId}-${t.toId}-${i}`} className="grid md:grid-cols-[1fr_auto_1fr] gap-2 items-start text-sm">
              <div>
                <div className="text-fg">{t.fromLabel}</div>
                <div className="font-mono text-[10px] text-fg-subtle">{t.fromId}</div>
              </div>
              <div className="text-[11px] font-mono text-accent text-center">
                {t.relation}
                <div className="text-fg-muted">{formatDays(t.delayDays)}</div>
              </div>
              <div className="md:text-left">
                <div>{t.toLabel}</div>
                <div className="text-fg-muted text-[12px]">{t.noteFa}</div>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="تعهدات در ریسک" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-fg-muted text-[12px]">
              <tr className="border-b border-border">
                <th className="text-right py-2 font-medium">تعهد</th>
                <th className="text-right py-2 font-medium">تأخیر</th>
                <th className="text-right py-2 font-medium">جریمه</th>
              </tr>
            </thead>
            <tbody>
              {sim.baseline.delayedCommitments.map((c) => (
                <tr key={c.id} className="border-b border-border/60">
                  <td className="py-2.5">{c.nameFa}</td>
                  <td className="py-2.5 font-mono">{formatDays(c.delayDays)}</td>
                  <td className="py-2.5 font-mono">{formatIrr(c.penaltyIrr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ArchitectureFlow } from "@/components/flow";
import { Kpi, PageHeader, Panel, Tag } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { GraphView } from "@/components/graph-view";
import { useHydrateMc } from "@/lib/mc/use-hydrate";
import { useMcStore, useSimulation } from "@/lib/mc/store";
import { dayToJalali, formatDays, formatIrr, formatIrrCompact, toFaDigits } from "@/lib/mc/money";
import { COMPANY, GOLDEN_DISRUPTION, PLANT, PROJECTS, RESOURCES } from "@/lib/mc/seed";
import { PROFILE_LABEL } from "@/lib/mc/weights";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  useHydrateMc();
  const sim = useSimulation();
  const profile = useMcStore((s) => s.profile);
  const rec = sim.recommendation;
  const vpi = RESOURCES.find((r) => r.id === "WC-VPI-01")!;
  const h2 = PROJECTS[0]!;

  return (
    <div>
      <PageHeader
        kicker="System of Intelligence · نه ERP، نه MRP، نه داشبورد"
        title="اتاق فرمان پارس"
        desc={`${COMPANY.nameFa} — ${PLANT.city}. مشاهده، مدل، شبیه‌سازی، توضیح، پیشنهاد. تصمیم با انسان است.`}
        actions={
          <>
            <Link to="/scenario">
              <Button>ساخت اختلال</Button>
            </Link>
            <Link to="/decision">
              <Button variant="secondary">بسته تصمیم</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Kpi label="منبع بحرانی" value="VPI-01" hint={vpi.nameFa} tone="danger" />
        <Kpi
          label="تأخیر اگر هیچ اقدامی نشود"
          value={formatDays(sim.baseline.kpi.delayDays)}
          hint="مسیر بحرانی واحد ۲"
          tone="danger"
        />
        <Kpi
          label="بهترین مسیر"
          value={rec.alternative.nameFa}
          hint={`${PROFILE_LABEL[profile]} · امتیاز ${toFaDigits(rec.score.toFixed(0))}`}
          tone="ok"
        />
        <Kpi
          label="اثر نقد اقدام منتخب"
          value={formatIrrCompact(rec.kpi.cashDeltaIrr)}
          hint="میلیارد ریال"
          tone={rec.kpi.cashDeltaIrr < 0 ? "warn" : "ok"}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-4 mb-6">
        <Panel className="lg:col-span-3" title="حادثه جاری — Golden Scenario">
          <div className="flex flex-wrap gap-2 mb-4">
            <Tag tone="danger">RESOURCE_UNAVAILABLE</Tag>
            <Tag tone="warn">{toFaDigits(GOLDEN_DISRUPTION.durationDays)} روز</Tag>
            <Tag>از {dayToJalali(0)}</Tag>
            <Tag tone="info">پایلوت MGS72-SH2</Tag>
          </div>
          <h3 className="text-base font-medium mb-2">{h2.nameFa}</h3>
          <p className="text-sm text-fg-muted leading-relaxed mb-4">{GOLDEN_DISRUPTION.causeFa}</p>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Stat k="عملیات متأثر" v={toFaDigits(sim.baseline.affected.operations)} />
            <Stat k="سفارش تولید" v={toFaDigits(sim.baseline.affected.orders)} />
            <Stat k="مایل‌استون" v={toFaDigits(sim.baseline.affected.milestones)} />
            <Stat k="تعهد" v={toFaDigits(sim.baseline.affected.commitments)} />
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/impact" className="text-sm text-accent inline-flex items-center gap-1">
              مشاهده انتشار اثر
              <ArrowLeft className="size-3.5" />
            </Link>
          </div>
        </Panel>
        <Panel className="lg:col-span-2" title="رتبه‌بندی مسیرها">
          <ol className="space-y-2">
            {sim.ranked.map((r, i) => (
              <li
                key={r.alternative.id}
                className="flex items-center gap-3 border border-border rounded-[16px] px-3 py-2.5"
              >
                <span className="font-mono text-xs text-fg-subtle w-5">{toFaDigits(i + 1)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{r.alternative.nameFa}</div>
                  <div className="text-[11px] text-fg-muted">
                    تأخیر {formatDays(r.kpi.delayDays)} · هزینه {formatIrr(r.kpi.costIrr)}
                  </div>
                </div>
                <span className="font-mono text-sm tabular-nums">{toFaDigits(r.score.toFixed(0))}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Panel title="جریان تصمیم" className="mb-6">
        <ArchitectureFlow />
      </Panel>

      <Panel title="زنجیره اثر" className="mb-6">
        <GraphView highlightIds={["WC-VPI-01", "OP-H2-VPI", "ORD-H2-ST", "PRJ-H2-376-U2", "CM-H2-DLV", "CASH-H2-FAT"]} />
      </Panel>

      <div className="grid md:grid-cols-3 gap-4">
        <Panel title="اصل معماری">
          <p className="text-sm text-fg-muted leading-relaxed">
            SAP نظام ثبت است. Mission Control نظام هوش است. مدیریت نظام اختیار است. مدل محاسبه می‌کند؛
            شورا تفسیر می‌کند؛ انسان مسئولیت می‌پذیرد.
          </p>
        </Panel>
        <Panel title="پروفایل تصمیم">
          <p className="text-sm text-fg-muted leading-relaxed mb-3">
            وزن‌ها ثابت نیستند. الان: <span className="text-fg">{PROFILE_LABEL[profile]}</span>
          </p>
          <Link to="/scenario" className="text-sm text-accent">
            تغییر پروفایل
          </Link>
        </Panel>
        <Panel title="منبع حقیقت شرکت">
          <p className="text-sm text-fg-muted leading-relaxed">
            {COMPANY.nameFa} از ۱۳۷۷ طراح و سازنده ژنراتورهای حرارتی، آبی و بادی است. محصول پرچم: MGS72-SH2
            هیدروژن‌خنک ۳۷۶ مگاوات.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[11px] text-fg-muted">{k}</div>
      <div className="font-mono text-lg tabular-nums">{v}</div>
    </div>
  );
}

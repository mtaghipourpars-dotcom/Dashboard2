import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Tag } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useHydrateMc } from "@/lib/mc/use-hydrate";
import { useMcStore, useSimulation } from "@/lib/mc/store";
import { conveneCouncil } from "@/lib/mc/council";
import { interpretCouncil } from "@/lib/mc/council.server";
import { formatDays, formatIrr, formatPct, toFaDigits } from "@/lib/mc/money";
import { FAILURE_AXES } from "@/lib/mc/failure";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/decision")({ component: DecisionPage });

function DecisionPage() {
  useHydrateMc();
  const sim = useSimulation();
  const rec = sim.recommendation;
  const opinions = conveneCouncil(sim);
  const recordDecision = useMcStore((s) => s.recordDecision);
  const profile = useMcStore((s) => s.profile);
  const durationDays = useMcStore((s) => s.durationDays);
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const [ai, setAi] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState<string | null>(null);

  const act = (status: "approved" | "overridden" | "rejected") => {
    recordDecision(rec.alternative.id, "مدیر کارخانه فردیس", note || "بدون توضیح", status);
    setFlash(
      status === "approved" ? "تصمیم ثبت و ممیزی شد." : status === "rejected" ? "رد شد و در تاریخچه ماند." : "جایگزینی ثبت شد.",
    );
  };

  const askAi = async () => {
    setAiBusy(true);
    setAiErr(null);
    try {
      const res = await interpretCouncil({ data: { profile, durationDays } });
      if (res.ok) setAi(res.interpretation);
      else {
        setAiErr("لایه زبانی در دسترس نیست — شورا روی موتور قطعی ادامه می‌دهد.");
        if (res.interpretation) setAi(res.interpretation);
      }
    } catch {
      setAiErr("لایه زبانی در دسترس نیست — شورا روی موتور قطعی ادامه می‌دهد.");
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        kicker={`DECISION · ${sim.recommendationKind.toUpperCase()}`}
        title="بسته تصمیم"
        desc="حقایق، فرض‌ها، نتایج محاسبه‌شده، تفسیر شورا، توصیه. اعداد قابل ردگیری‌اند."
      />

      <div className="flex flex-wrap gap-2 mb-5">
        <Tag tone={sim.recommendationKind === "go" ? "ok" : "warn"}>
          {sim.recommendationKind === "conditional_go" ? "GO مشروط" : "GO"}
        </Tag>
        <Tag tone="info">{rec.alternative.nameFa}</Tag>
        <Tag>اطمینان {toFaDigits(Math.round(sim.confidence * 100))}٪</Tag>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Panel title="مسئله">
          <p className="text-sm leading-relaxed text-fg-muted">{sim.disruption.causeFa}</p>
        </Panel>
        <Panel title="توصیه">
          <p className="text-lg font-medium mb-2">{rec.alternative.nameFa}</p>
          <p className="text-sm text-fg-muted leading-relaxed">{rec.alternative.summaryFa}</p>
        </Panel>
        <Panel title="اثر محاسبه‌شده">
          <ul className="text-sm space-y-1 font-mono">
            <li>تأخیر {formatDays(rec.kpi.delayDays)}</li>
            <li>هزینه {formatIrr(rec.kpi.costIrr)}</li>
            <li>نقد {formatIrr(rec.kpi.cashDeltaIrr)}</li>
            <li>جریمه {formatIrr(rec.kpi.penaltyIrr)}</li>
            <li>ریسک {formatPct(rec.kpi.executionRisk)}</li>
          </ul>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Panel title="حقایق">
          <ul className="text-sm space-y-2 text-fg-muted">
            {sim.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="فرض‌ها — باید در پایلوت اعتبارسنجی شوند">
          <ul className="text-sm space-y-2 text-fg-muted">
            {sim.assumptions.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="شرایط" className="mb-6">
        <ol className="list-decimal list-inside text-sm space-y-2 text-fg-muted">
          {sim.conditionsFa.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </Panel>

      <Panel
        title="شورای اجرایی مجازی"
        className="mb-6"
        action={
          <Button variant="secondary" size="sm" onClick={askAi} disabled={aiBusy}>
            {aiBusy ? "در حال تفسیر…" : "تفسیر زبانی (اختیاری)"}
          </Button>
        }
      >
        <p className="text-xs text-fg-muted mb-4">
          LLM حقیقت را محاسبه نمی‌کند. اگر لایه زبانی قطع شود، آرا همچنان از موتور قطعی نمایش داده می‌شوند.
        </p>
        {aiErr && <p className="text-sm text-warn mb-3">{aiErr}</p>}
        {ai && (
          <div className="border border-border rounded-[16px] p-4 text-sm leading-relaxed mb-4 bg-bg-subtle">
            {ai}
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-3">
          {opinions.map((o) => (
            <article key={o.role} className="border border-border rounded-[16px] p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-medium">{o.titleFa}</h3>
                <Tag
                  tone={
                    o.stance === "support" ? "ok" : o.stance === "veto" ? "danger" : o.stance === "challenge" ? "warn" : "info"
                  }
                >
                  {o.stance}
                </Tag>
              </div>
              <p className="text-[13px] text-fg-muted leading-relaxed">{o.thesisFa}</p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="آزمون بدبینانه — اگر تصمیم شکست بخورد" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-fg-muted text-[12px]">
              <tr className="border-b border-border">
                <th className="text-right py-2 font-medium">محور شکست</th>
                <th className="text-right py-2 font-medium">هشدار زودرس</th>
                <th className="text-right py-2 font-medium">احتیاط</th>
              </tr>
            </thead>
            <tbody>
              {FAILURE_AXES.map((f) => (
                <tr key={f.id} className="border-b border-border/60 align-top">
                  <td className="py-2.5">{f.axisFa}</td>
                  <td className="py-2.5 text-fg-muted">{f.earlyWarningFa}</td>
                  <td className="py-2.5 text-fg-muted">{f.contingencyFa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="تصمیم انسان">
        <label className="block text-sm text-fg-muted mb-2">یادداشت / دلیل رد یا تأیید</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full bg-bg-subtle border border-border rounded-[16px] p-3 text-sm mb-4 outline-none focus:border-accent"
          placeholder="فرض را تغییر دهید، اولویت را عوض کنید، یا دلیل رد را بنویسید."
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => act("approved")}>تأیید توصیه</Button>
          <Button variant="secondary" onClick={() => act("overridden")}>
            انتخاب مسیر دیگر
          </Button>
          <Button variant="ghost" onClick={() => act("rejected")}>
            رد
          </Button>
        </div>
        {flash && <p className={cn("text-sm text-ok mt-3")}>{flash}</p>}
      </Panel>
    </div>
  );
}

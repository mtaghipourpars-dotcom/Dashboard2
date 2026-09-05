import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel } from "@/components/shell";
import { useHydrateMc } from "@/lib/mc/use-hydrate";
import { useSimulation } from "@/lib/mc/store";
import { cashSeries } from "@/lib/mc/simulate";
import { CASH_EVENTS, OPENING_CASH_IRR } from "@/lib/mc/seed";
import { dayToJalali, formatIrr, toFaDigits } from "@/lib/mc/money";

export const Route = createFileRoute("/cash")({ component: CashPage });

function CashPage() {
  useHydrateMc();
  const sim = useSimulation();
  const series = cashSeries(sim, sim.recommendation.alternative.id).map((p) => ({
    ...p,
    label: dayToJalali(p.day),
    v: Math.round(p.value / 1e9),
  }));

  return (
    <div>
      <PageHeader
        kicker="Cash = Resource + Constraint + State"
        title="نقدینگی به‌عنوان متغیر حالت"
        desc="موجودی افتتاحیه + ورود مورد انتظار − خروج مورد انتظار = نقد پیش‌بینی‌شده. تأخیر FAT ورود را جابه‌جا می‌کند."
      />
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Panel title="افتتاحیه">
          <p className="font-mono text-xl">{formatIrr(OPENING_CASH_IRR)}</p>
          <p className="text-xs text-fg-subtle mt-2">ASSUMPTION · خزانه — SAP GL در پایلوت</p>
        </Panel>
        <Panel title="اثر اقدام منتخب">
          <p className="font-mono text-xl">{formatIrr(sim.recommendation.kpi.cashDeltaIrr)}</p>
        </Panel>
        <Panel title="جریمه در مسیر پایه">
          <p className="font-mono text-xl text-danger">{formatIrr(sim.baseline.kpi.penaltyIrr)}</p>
        </Panel>
      </div>
      <Panel title="مسیر نقد (میلیارد ریال)" className="mb-6">
        <div className="h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <XAxis dataKey="label" tick={{ fill: "#8b919c", fontSize: 10 }} />
              <YAxis tick={{ fill: "#8b919c", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#111316", border: "1px solid #262b33", borderRadius: 12 }}
                labelStyle={{ color: "#eceef1" }}
              />
              <Area type="monotone" dataKey="v" stroke="#9eb3c7" fill="#9eb3c7" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="رویدادها">
        <ul className="text-sm space-y-2">
          {CASH_EVENTS.map((e) => (
            <li key={e.id} className="flex justify-between gap-3">
              <span>
                {e.nameFa}
                <span className="text-fg-subtle"> · {dayToJalali(e.plannedDay)}</span>
              </span>
              <span className="font-mono">
                {e.kind === "outflow" ? "−" : "+"}
                {toFaDigits(Math.round(e.amountIrr / 1e9))}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel, Tag } from "@/components/shell";
import { RESOURCES } from "@/lib/mc/seed";
import { toFaDigits } from "@/lib/mc/money";

export const Route = createFileRoute("/resources")({ component: ResourcesPage });

function ResourcesPage() {
  return (
    <div>
      <PageHeader
        kicker="Work Centers · CRHD"
        title="منابع کارخانه فردیس"
        desc="منبع فقط ماشین نیست: ظرفیت، تقویم، خرابی، انرژی، مواد، تأمین‌کننده و جایگزین."
      />
      <div className="grid md:grid-cols-2 gap-3">
        {RESOURCES.filter((r) => r.kind !== "cash").map((r) => (
          <Panel key={r.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link to="/resources/$id" params={{ id: r.id }} className="text-sm font-medium hover:text-accent">
                  {r.nameFa}
                </Link>
                <div className="font-mono text-[11px] text-fg-muted mt-1">{r.sapWorkCenter ?? r.code}</div>
              </div>
              <Tag tone={!r.available ? "danger" : r.uniqueInPlant ? "warn" : "neutral"}>
                {!r.available ? "خارج از مدار" : r.uniqueInPlant ? "یکتا" : r.kind}
              </Tag>
            </div>
            <div className="mt-3 text-[12px] text-fg-muted">
              ظرفیت {toFaDigits(r.capacityPerDay)} {r.capacityUnit} / روز · انرژی {toFaDigits(r.energyKwhPerHour)} kWh/h
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

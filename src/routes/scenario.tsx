import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel, Tag } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useHydrateMc } from "@/lib/mc/use-hydrate";
import { useMcStore } from "@/lib/mc/store";
import { GOLDEN_DISRUPTION, RESOURCES } from "@/lib/mc/seed";
import { PROFILE_LABEL } from "@/lib/mc/weights";
import type { PriorityProfile } from "@/lib/mc/types";
import { toFaDigits } from "@/lib/mc/money";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scenario")({ component: ScenarioPage });

const PROFILES: PriorityProfile[] = ["normal", "cash_crisis", "delivery_crisis", "strategic_customer"];

function ScenarioPage() {
  useHydrateMc();
  const durationDays = useMcStore((s) => s.durationDays);
  const profile = useMcStore((s) => s.profile);
  const setDuration = useMcStore((s) => s.setDuration);
  const setProfile = useMcStore((s) => s.setProfile);
  const vpi = RESOURCES.find((r) => r.id === GOLDEN_DISRUPTION.resourceId)!;

  return (
    <div>
      <PageHeader
        kicker="Scenario Builder"
        title="اختلال و پروفایل تصمیم"
        desc="MVP روی یک منبع بحرانی و یک اختلال واقعی قفل شده است. مدت و وزن‌های تصمیم قابل تنظیم‌اند."
      />

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Panel title="منبع">
          <div className="flex flex-wrap gap-2 mb-3">
            <Tag tone="danger">{vpi.code}</Tag>
            <Tag>یکتا در کارخانه</Tag>
            <Tag tone="warn">از مدار خارج</Tag>
          </div>
          <h3 className="text-base mb-1">{vpi.nameFa}</h3>
          <p className="text-sm text-fg-muted leading-relaxed">{GOLDEN_DISRUPTION.causeFa}</p>
        </Panel>
        <Panel title="مدت اختلال (روز)">
          <input
            type="range"
            min={5}
            max={40}
            value={durationDays}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="mt-3 flex justify-between text-sm text-fg-muted">
            <span>{toFaDigits(5)}</span>
            <span className="text-fg font-mono text-xl">{toFaDigits(durationDays)}</span>
            <span>{toFaDigits(40)}</span>
          </div>
          <p className="text-xs text-fg-subtle mt-2">دانه‌بندی زمان MVP: روز. شیفت در نسخه ۱.۱.</p>
        </Panel>
      </div>

      <Panel title="پروفایل اولویت کسب‌وکار" className="mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROFILES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProfile(p)}
              className={cn(
                "text-right border rounded-[16px] p-4 transition-colors",
                profile === p ? "border-accent bg-bg-subtle" : "border-border hover:bg-bg-subtle",
              )}
            >
              <div className="text-sm font-medium">{PROFILE_LABEL[p]}</div>
              <div className="text-[11px] text-fg-muted mt-1 font-mono">{p}</div>
            </button>
          ))}
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2">
        <Link to="/simulation">
          <Button>اجرای شبیه‌سازی</Button>
        </Link>
        <Link to="/impact">
          <Button variant="secondary">فقط انتشار اثر</Button>
        </Link>
      </div>
    </div>
  );
}

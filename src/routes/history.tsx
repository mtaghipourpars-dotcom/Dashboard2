import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Tag } from "@/components/shell";
import { useHydrateMc } from "@/lib/mc/use-hydrate";
import { useMcStore } from "@/lib/mc/store";
import { dayToJalali } from "@/lib/mc/money";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function HistoryPage() {
  useHydrateMc();
  const decisions = useMcStore((s) => s.decisions);
  return (
    <div>
      <PageHeader
        kicker="Audit trail"
        title="حافظه سازمانی"
        desc="تصمیم، فرض، نتیجه، درس. تغییر مدل بدون نسخه‌گذاری ممنوع است."
      />
      {decisions.length === 0 ? (
        <Panel>
          <p className="text-sm text-fg-muted">هنوز تصمیمی در این نشست ثبت نشده. از بسته تصمیم اقدام کنید.</p>
        </Panel>
      ) : (
        <div className="space-y-3">
          {decisions.map((d) => (
            <Panel key={d.id}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Tag
                  tone={d.status === "approved" ? "ok" : d.status === "rejected" ? "danger" : "warn"}
                >
                  {d.status}
                </Tag>
                <Tag>{d.chosen}</Tag>
                <span className="text-[11px] font-mono text-fg-subtle">{d.id}</span>
              </div>
              <p className="text-sm">{d.rationaleFa}</p>
              <p className="text-[12px] text-fg-muted mt-2">
                {d.owner} · {d.createdAt.slice(0, 16).replace("T", " ")}
              </p>
            </Panel>
          ))}
        </div>
      )}
      <Panel title="درس نمونه‌ای از حافظه" className="mt-4">
        <p className="text-sm text-fg-muted leading-relaxed">
          تأمین‌کننده رزین: Lead time استاندارد SAP = ۱۵ روز. واقعی در کانال ایران = ۳۱ روز. درس: lead time
          SAP ریسک تأمین ایران را کم‌برآورد می‌کند — باید با بافر Iran Reality به گراف تزریق شود.
        </p>
        <p className="text-[11px] text-fg-subtle mt-2">{dayToJalali(-40)}</p>
      </Panel>
    </div>
  );
}

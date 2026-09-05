import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel, Tag } from "@/components/shell";
import { PROJECTS, WBS } from "@/lib/mc/seed";
import { dayToJalali, formatIrr, formatPct, toFaDigits } from "@/lib/mc/money";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

function ProjectsPage() {
  return (
    <div>
      <PageHeader kicker="PS / PP" title="پروژه‌های فعال کارخانه" desc="سه پروژه واقعی‌نما برای پایلوت. منبع: PROJ / PRPS (سنتتیک)." />
      <div className="space-y-4">
        {PROJECTS.map((p) => (
          <Panel key={p.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Tag>{p.pspid}</Tag>
                  {p.strategic && <Tag tone="warn">راهبردی</Tag>}
                  <Tag tone="info">{p.status}</Tag>
                </div>
                <h2 className="text-base font-medium">
                  <Link to="/projects/$id" params={{ id: p.id }} className="hover:text-accent">
                    {p.nameFa}
                  </Link>
                </h2>
                <p className="text-sm text-fg-muted mt-1">{p.productModel}</p>
              </div>
              <div className="text-sm text-fg-muted font-mono">
                تحویل {dayToJalali(p.contractualFinishDay)}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div>
                <div className="text-[11px] text-fg-muted">پیشرفت</div>
                <div className="font-mono">{formatPct(p.progressPct / 100)}</div>
              </div>
              <div>
                <div className="text-[11px] text-fg-muted">ارزش قرارداد</div>
                <div className="font-mono">{formatIrr(p.contractValueIrr)}</div>
              </div>
              <div>
                <div className="text-[11px] text-fg-muted">صورت‌وضعیت باقی</div>
                <div className="font-mono">{formatIrr(p.remainingInvoiceIrr)}</div>
              </div>
              <div>
                <div className="text-[11px] text-fg-muted">WBS</div>
                <div className="font-mono">{toFaDigits(WBS.filter((w) => w.projectId === p.id).length)}</div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

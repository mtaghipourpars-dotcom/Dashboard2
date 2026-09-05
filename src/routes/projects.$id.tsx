import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel, Tag } from "@/components/shell";
import { COMMITMENTS, MILESTONES, OPERATIONS, ORDERS, PROJECTS, WBS } from "@/lib/mc/seed";
import { dayToJalali, formatIrr, toFaDigits } from "@/lib/mc/money";

export const Route = createFileRoute("/projects/$id")({ component: ProjectDetail });

function ProjectDetail() {
  const { id } = Route.useParams();
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) {
    return (
      <div>
        <PageHeader title="پروژه یافت نشد" />
        <Link to="/projects" className="text-sm text-accent">
          بازگشت
        </Link>
      </div>
    );
  }
  const ops = OPERATIONS.filter((o) => o.projectId === p.id);
  const orders = ORDERS.filter((o) => o.projectId === p.id);

  return (
    <div>
      <PageHeader kicker={p.pspid} title={p.nameFa} desc={`${p.customer} · ${p.productModel}`} />
      <div className="flex flex-wrap gap-2 mb-6">
        {p.strategic && <Tag tone="warn">راهبردی</Tag>}
        <Tag>پیشرفت {toFaDigits(p.progressPct)}٪</Tag>
        <Tag>قراردادی {dayToJalali(p.contractualFinishDay)}</Tag>
        <Tag>{formatIrr(p.contractValueIrr)}</Tag>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="سفارش‌های تولید">
          <ul className="text-sm space-y-2">
            {orders.map((o) => (
              <li key={o.id} className="flex justify-between gap-2">
                <span>{o.materialNameFa}</span>
                <span className="font-mono text-fg-muted">{o.aufnr}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="WBS">
          <ul className="text-sm space-y-2">
            {WBS.filter((w) => w.projectId === p.id).map((w) => (
              <li key={w.id} className="flex justify-between gap-2">
                <span>{w.nameFa}</span>
                <span className="font-mono text-fg-muted">{formatIrr(w.plannedCostIrr)}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="عملیات باقی‌مانده">
          <ul className="text-sm space-y-2">
            {ops
              .filter((o) => o.remainingWorkDays > 0)
              .map((o) => (
                <li key={o.id}>
                  <span className="font-mono text-fg-muted ml-2">{o.seq}</span>
                  {o.nameFa}
                  <span className="text-fg-subtle"> · {toFaDigits(o.remainingWorkDays)} روز</span>
                </li>
              ))}
          </ul>
        </Panel>
        <Panel title="تعهدات و مایل‌استون">
          <ul className="text-sm space-y-2">
            {MILESTONES.filter((m) => m.projectId === p.id).map((m) => (
              <li key={m.id}>
                {m.nameFa} · {dayToJalali(m.dueDay)}
              </li>
            ))}
            {COMMITMENTS.filter((c) => c.projectId === p.id).map((c) => (
              <li key={c.id} className="text-fg-muted">
                {c.nameFa}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

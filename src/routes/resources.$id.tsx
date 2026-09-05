import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel, Tag } from "@/components/shell";
import { OPERATIONS, RESOURCES } from "@/lib/mc/seed";
import { toFaDigits } from "@/lib/mc/money";

export const Route = createFileRoute("/resources/$id")({ component: ResourceDetail });

function ResourceDetail() {
  const { id } = Route.useParams();
  const r = RESOURCES.find((x) => x.id === id);
  if (!r) {
    return (
      <div>
        <PageHeader title="منبع یافت نشد" />
        <Link to="/resources" className="text-sm text-accent">
          بازگشت
        </Link>
      </div>
    );
  }
  const ops = OPERATIONS.filter((o) => o.workCenterId === r.id);
  return (
    <div>
      <PageHeader kicker={r.code} title={r.nameFa} desc={r.nameEn} />
      <div className="flex flex-wrap gap-2 mb-6">
        {!r.available && <Tag tone="danger">ناموجود</Tag>}
        {r.uniqueInPlant && <Tag tone="warn">بدون جایگزین کامل</Tag>}
        <Tag>{r.kind}</Tag>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="مدل منبع">
          <ul className="text-sm space-y-2 text-fg-muted">
            <li>ظرفیت: {toFaDigits(r.capacityPerDay)} {r.capacityUnit}</li>
            <li>احتمال خرابی: {toFaDigits(Math.round(r.failureProbability * 100))}٪</li>
            <li>وابستگی انرژی: {toFaDigits(r.energyKwhPerHour)} kWh/h</li>
            <li>وابستگی مواد: {r.materialDependency.join("، ") || "—"}</li>
            <li>جایگزین: {r.alternativeIds.join("، ") || "ندارد"}</li>
          </ul>
        </Panel>
        <Panel title="عملیات تخصیص‌یافته">
          <ul className="text-sm space-y-2">
            {ops.map((o) => (
              <li key={o.id}>
                {o.nameFa}
                <span className="text-fg-muted"> · {o.status}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

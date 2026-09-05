import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/shell";
import { GraphView } from "@/components/graph-view";
import { buildGraph } from "@/lib/mc/graph";
import { toFaDigits } from "@/lib/mc/money";

export const Route = createFileRoute("/graph")({ component: GraphPage });

function GraphPage() {
  const g = buildGraph();
  return (
    <div>
      <PageHeader
        kicker="Enterprise Graph"
        title="گراف بنگاه"
        desc={`${toFaDigits(g.nodes.length)} گره · ${toFaDigits(g.edges.length)} یال. ساخت از استخراج SAP به‌صورت دسته‌ای در MVP؛ افزایشی در نسخه سازمانی.`}
      />
      <Panel>
        <GraphView />
      </Panel>
    </div>
  );
}

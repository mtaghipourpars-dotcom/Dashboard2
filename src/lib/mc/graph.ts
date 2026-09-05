import type { EnterpriseGraph, GraphEdge, GraphNode } from "./types";
import {
  CASH_EVENTS,
  COMMITMENTS,
  MATERIALS,
  MILESTONES,
  OPERATIONS,
  ORDERS,
  PROJECTS,
  RESOURCES,
  SUPPLIERS,
  WBS,
} from "./seed";

export function buildGraph(): EnterpriseGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const addEdge = (
    type: GraphEdge["type"],
    source: string,
    target: string,
    extra?: Partial<GraphEdge>,
  ) => {
    edges.push({
      id: `${type}:${source}->${target}`,
      type,
      source,
      target,
      confidence: extra?.confidence ?? "medium",
      sourceSystem: extra?.sourceSystem ?? "SAP extract / derived",
      ...extra,
    });
  };

  for (const p of PROJECTS) {
    nodes.push({
      id: p.id,
      type: "project",
      labelFa: p.nameFa,
      labelEn: p.nameEn,
      meta: { progress: p.progressPct, strategic: p.strategic },
    });
  }
  for (const w of WBS) {
    nodes.push({
      id: w.id,
      type: "wbs",
      labelFa: w.nameFa,
      labelEn: w.posid,
      meta: { projectId: w.projectId },
    });
    addEdge("BELONGS_TO", w.id, w.projectId);
  }
  for (const o of ORDERS) {
    nodes.push({
      id: o.id,
      type: "order",
      labelFa: o.materialNameFa,
      labelEn: o.aufnr,
      meta: { aufnr: o.aufnr, projectId: o.projectId },
    });
    addEdge("BELONGS_TO", o.id, o.wbsId);
    addEdge("PRODUCES", o.id, o.wbsId);
  }
  for (const op of OPERATIONS) {
    nodes.push({
      id: op.id,
      type: "operation",
      labelFa: `${op.seq} ${op.nameFa}`,
      labelEn: op.nameEn,
      meta: {
        workCenterId: op.workCenterId,
        remaining: op.remainingWorkDays,
        start: op.plannedStartDay,
        finish: op.plannedFinishDay,
        status: op.status,
      },
    });
    addEdge("BELONGS_TO", op.id, op.orderId);
    addEdge("USES", op.id, op.workCenterId, { sourceSystem: "AFVC.ARBID" });
    addEdge("ALLOCATED_TO", op.workCenterId, op.projectId);
    for (const pred of op.predecessors) {
      addEdge("PRECEDES", pred, op.id, { lagDays: 0, sourceSystem: "AFVC relationships" });
      addEdge("DEPENDS_ON", op.id, pred);
    }
    for (const mid of op.materialIds) {
      addEdge("REQUIRES", op.id, mid, { sourceSystem: "RESB" });
    }
  }
  for (const r of RESOURCES) {
    nodes.push({
      id: r.id,
      type: "resource",
      labelFa: r.nameFa,
      labelEn: r.nameEn,
      meta: { kind: r.kind, unique: r.uniqueInPlant, available: r.available },
    });
    for (const alt of r.alternativeIds) {
      addEdge("ALTERNATIVE_TO", r.id, alt, { confidence: "medium" });
    }
  }
  for (const m of MATERIALS) {
    nodes.push({
      id: m.id,
      type: "material",
      labelFa: m.nameFa,
      labelEn: m.nameEn,
      meta: { importDependent: m.importDependent, onHand: m.onHand },
    });
    if (m.supplierId) addEdge("SUPPLIED_BY", m.id, m.supplierId, { sourceSystem: "EINA/EINE" });
  }
  for (const s of SUPPLIERS) {
    nodes.push({
      id: s.id,
      type: "supplier",
      labelFa: s.nameFa,
      labelEn: s.nameEn,
      meta: { reliability: s.reliability },
    });
  }
  for (const ms of MILESTONES) {
    nodes.push({
      id: ms.id,
      type: "milestone",
      labelFa: ms.nameFa,
      labelEn: ms.type,
      meta: { due: ms.dueDay, invoicePct: ms.invoicePct },
    });
    addEdge("DELIVERS", ms.wbsId, ms.id);
    addEdge("BELONGS_TO", ms.id, ms.projectId);
  }
  for (const c of COMMITMENTS) {
    nodes.push({
      id: c.id,
      type: "commitment",
      labelFa: c.nameFa,
      labelEn: c.kind,
      meta: { hardness: c.hardness, due: c.dueDay, criticality: c.criticality },
    });
    if (c.milestoneId) addEdge("SATISFIES", c.milestoneId, c.id);
    if (c.projectId) addEdge("IMPACTS", c.projectId, c.id);
  }
  for (const e of CASH_EVENTS) {
    nodes.push({
      id: e.id,
      type: "cash_event",
      labelFa: e.nameFa,
      labelEn: e.kind,
      meta: { amount: e.amountIrr, day: e.plannedDay },
    });
    if (e.commitmentId) addEdge("TRIGGERS", e.commitmentId, e.id);
    if (e.projectId) addEdge("PAY_FOR", e.projectId, e.id);
  }

  return { nodes, edges };
}

export function neighbors(
  graph: EnterpriseGraph,
  id: string,
  type?: GraphEdge["type"],
  dir: "out" | "in" | "both" = "out",
): string[] {
  const out: string[] = [];
  for (const e of graph.edges) {
    if (type && e.type !== type) continue;
    if ((dir === "out" || dir === "both") && e.source === id) out.push(e.target);
    if ((dir === "in" || dir === "both") && e.target === id) out.push(e.source);
  }
  return [...new Set(out)];
}

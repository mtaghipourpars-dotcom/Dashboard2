/**
 * Deterministic impact-propagation engine (MVP Level 1 + Level 2 scenarios).
 * LLM is forbidden from computing these numbers.
 */

import type {
  Alternative,
  AlternativeId,
  AlternativeResult,
  Disruption,
  KpiImpact,
  PriorityProfile,
  SimulationRun,
  TraceStep,
} from "./types";
import { PROFILE_WEIGHTS } from "./weights";
import {
  CASH_EVENTS,
  COMMITMENTS,
  GOLDEN_DISRUPTION,
  MILESTONES,
  OPENING_CASH_IRR,
  OPERATIONS,
  ORDERS,
  PROJECTS,
} from "./seed";
import { IRAN_DEFAULTS } from "./iran";

type OpState = {
  id: string;
  start: number;
  finish: number;
  remaining: number;
  wc: string;
  projectId: string;
  orderId: string;
  wbsId: string;
  preds: string[];
  nameFa: string;
};

function cloneOps(): OpState[] {
  return OPERATIONS.map((o) => ({
    id: o.id,
    start: o.plannedStartDay,
    finish: o.plannedFinishDay,
    remaining: o.remainingWorkDays,
    wc: o.workCenterId,
    projectId: o.projectId,
    orderId: o.orderId,
    wbsId: o.wbsId,
    preds: [...o.predecessors],
    nameFa: o.nameFa,
  }));
}

function topo(ops: OpState[]): OpState[] {
  const byId = new Map(ops.map((o) => [o.id, o]));
  const seen = new Set<string>();
  const out: OpState[] = [];
  const visit = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    const n = byId.get(id);
    if (!n) return;
    for (const p of n.preds) visit(p);
    out.push(n);
  };
  for (const o of ops) visit(o.id);
  return out;
}

function scheduleForward(ops: OpState[]): void {
  const byId = new Map(ops.map((o) => [o.id, o]));
  for (const o of topo(ops)) {
    let earliest = o.start;
    for (const p of o.preds) {
      const pred = byId.get(p);
      if (pred) earliest = Math.max(earliest, pred.finish);
    }
    const dur = Math.max(o.remaining, 0);
    if (earliest > o.start) {
      o.start = earliest;
    }
    o.finish = o.start + dur;
  }
}

export const ALTERNATIVES: Alternative[] = [
  {
    id: "repair",
    nameFa: "تعمیر و انتظار",
    nameEn: "Repair & wait",
    summaryFa:
      "تعمیر محلی پمپ خلاء با قطعه واسطه. ماشین پس از ۲۰ روز برمی‌گردد. صف پروژه‌ها حفظ می‌شود.",
    extraCostIrr: 8_400_000_000,
    extraLeadDays: 20,
    durationOverrideDays: 20,
    qualityRisk: 0.08,
    executionRisk: 0.22,
    fxExposureIrr: 6_200_000_000,
    energyRisk: 0.05,
  },
  {
    id: "outsource",
    nameFa: "برون‌سپاری VPI",
    nameEn: "Outsource VPI",
    summaryFa:
      "حمل استاتور واحد ۲ به کارگاه اشباع اصفهان. سیکل پیمانکار ۱۲ روز + ۸ روز لجستیک. گواهی IEC و ریسک کیفیت.",
    extraCostIrr: 42_000_000_000,
    extraLeadDays: 8,
    qualityRisk: 0.34,
    executionRisk: 0.4,
    fxExposureIrr: 0,
    energyRisk: 0.1,
    usesAlternativeResource: "SUP-VPI-ISO",
  },
  {
    id: "reallocate",
    nameFa: "بازتخصیص ظرفیت",
    nameEn: "Reallocate",
    summaryFa:
      "شینه‌های یدکی و استاتور MGS58 از صف VPI-01 خارج می‌شوند. واحد ۲ پس از تعمیر در اولویت است. MGS58 به تأخیر می‌افتد.",
    extraCostIrr: 6_100_000_000,
    extraLeadDays: 20,
    durationOverrideDays: 20,
    qualityRisk: 0.1,
    executionRisk: 0.18,
    fxExposureIrr: 6_200_000_000,
    energyRisk: 0.05,
    bumpProjectId: "PRJ-MGS58-CC",
  },
  {
    id: "overtime",
    nameFa: "تعمیر اضطراری + سه‌شیفت",
    nameEn: "Emergency repair + overtime",
    summaryFa:
      "استفاده از پمپ VPI-02 برای تعمیر اضطراری ۱۱روزه، سپس فشرده‌سازی صف با شیفت سوم. ریسک قطع برق شب.",
    extraCostIrr: 24_800_000_000,
    extraLeadDays: 11,
    emergencyRepairDays: 11,
    compressAfterRepairDays: 8,
    qualityRisk: 0.16,
    executionRisk: 0.33,
    fxExposureIrr: 1_800_000_000,
    energyRisk: 0.45,
  },
];

function applyDisruption(
  ops: OpState[],
  resourceId: string,
  start: number,
  duration: number,
  opts?: {
    bumpProjectId?: string;
    skipOpIds?: string[];
    compressAfter?: { fromDay: number; recoverDays: number };
    retarget?: { opId: string; extraDays: number };
  },
): TraceStep[] {
  const traces: TraceStep[] = [];
  const availableFrom = start + duration;
  const orig = new Map(OPERATIONS.map((o) => [o.id, o]));

  if (opts?.retarget) {
    const t = ops.find((o) => o.id === opts.retarget!.opId);
    if (t) {
      t.start = start + 8;
      t.finish = t.start + t.remaining + opts.retarget.extraDays;
      t.wc = "OUTSOURCE";
      traces.push({
        fromId: "SUP-VPI-ISO",
        fromLabel: "پیمانکار اصفهان",
        toId: t.id,
        toLabel: t.nameFa,
        relation: "ALTERNATIVE_TO",
        delayDays: opts.retarget.extraDays,
        costIrr: 0,
        noteFa: "حمل استاتور و اجرای VPI خارج از کارخانه",
      });
    }
  }

  for (const o of ops) {
    if (opts?.skipOpIds?.includes(o.id) && orig.get(o.id)?.workCenterId === resourceId) {
      o.wc = "WC-VPI-02";
      o.remaining += 6;
      o.start = Math.max(o.start, start);
      o.finish = o.start + o.remaining;
      traces.push({
        fromId: resourceId,
        fromLabel: "VPI-01",
        toId: o.id,
        toLabel: o.nameFa,
        relation: "ALTERNATIVE_TO",
        delayDays: 6,
        costIrr: 0,
        noteFa: "انتقال به VPI-02 با سیکل دوبخشی",
      });
    }
  }

  const queue = ops
    .filter((o) => o.wc === resourceId && o.remaining > 0)
    .sort((a, b) => {
      if (opts?.bumpProjectId) {
        if (a.projectId === opts.bumpProjectId && b.projectId !== opts.bumpProjectId) return 1;
        if (b.projectId === opts.bumpProjectId && a.projectId !== opts.bumpProjectId) return -1;
      }
      return a.start - b.start || a.id.localeCompare(b.id);
    });

  let cursor = availableFrom;
  for (const o of queue) {
    const before = orig.get(o.id)!;
    const resume = Math.max(o.start, cursor, availableFrom);
    o.start = resume;
    o.finish = resume + o.remaining;
    cursor = o.finish;
    const delay = o.finish - before.plannedFinishDay;
    traces.push({
      fromId: resourceId,
      fromLabel: "VPI-01",
      toId: o.id,
      toLabel: o.nameFa,
      relation: "USES",
      delayDays: Math.max(0, delay),
      costIrr: 0,
      noteFa:
        opts?.bumpProjectId && o.projectId === opts.bumpProjectId
          ? "عقب‌نشینی آگاهانه برای حفاظت از پروژه راهبردی"
          : `ماشین از روز ${start} تا ${availableFrom} در دسترس نیست؛ صف سریالی شد`,
    });
  }

  if (opts?.compressAfter) {
    let left = opts.compressAfter.recoverDays;
    for (const o of queue) {
      if (left <= 0) break;
      if (o.start < opts.compressAfter.fromDay) continue;
      const cut = Math.min(2, left, Math.max(0, o.remaining - 2));
      if (cut <= 0) continue;
      o.remaining -= cut;
      o.finish -= cut;
      left -= cut;
    }
  }

  scheduleForward(ops);
  return traces;
}

function finishOf(ops: OpState[], projectId: string): number {
  return Math.max(...ops.filter((o) => o.projectId === projectId).map((o) => o.finish), 0);
}

function baselineFinish(projectId: string): number {
  return PROJECTS.find((x) => x.id === projectId)?.plannedFinishDay ?? 0;
}

function evaluate(alt: Alternative, ops: OpState[], traces: TraceStep[]): AlternativeResult {
  const delayedProjects = PROJECTS.map((p) => {
    const fin = finishOf(ops, p.id);
    const delay = Math.max(0, fin - baselineFinish(p.id));
    return { id: p.id, nameFa: p.nameFa, delayDays: delay, finish: fin };
  }).filter((p) => p.delayDays > 0 || p.id === "PRJ-H2-376-U2");

  const delayedCommitments = COMMITMENTS.map((c) => {
    if (!c.projectId) return { ...c, delayDays: 0, penaltyIrr: 0, newDay: c.dueDay };
    const proj = delayedProjects.find((p) => p.id === c.projectId);
    const p = PROJECTS.find((x) => x.id === c.projectId)!;
    const projectDelay = proj ? Math.max(0, proj.finish - p.plannedFinishDay) : 0;
    const delayDays = Math.max(0, projectDelay);
    const beyondFlex = Math.max(0, delayDays - c.flexibilityDays);
    const cap = p.contractValueIrr * p.penaltyCapPct;
    const penaltyIrr = Math.min(beyondFlex * c.penaltyIrrPerDay, cap);
    return { ...c, delayDays, penaltyIrr, newDay: c.dueDay + delayDays };
  }).filter((c) => c.delayDays > 0 || c.criticality >= 0.85);

  const penaltyIrr = delayedCommitments.reduce((s, c) => s + c.penaltyIrr, 0);
  const extraCost = alt.extraCostIrr;
  const fxUplift = alt.fxExposureIrr * IRAN_DEFAULTS.fxShockPct;
  const costIrr = extraCost + penaltyIrr + fxUplift;

  const h2 = delayedProjects.find((p) => p.id === "PRJ-H2-376-U2");
  const delayDays = h2?.delayDays ?? 0;

  const fat = CASH_EVENTS.find((e) => e.id === "CASH-H2-FAT")!;
  const timeValue = (delayDays / 365) * 0.32 * fat.amountIrr;
  const cashDeltaIrr = -(timeValue + extraCost * 0.7 + fxUplift);
  const contract = PROJECTS.find((p) => p.id === "PRJ-H2-376-U2")!;
  const marginDeltaIrr = -(costIrr + timeValue * 0.5);

  const hardBreaches = delayedCommitments.filter(
    (c) => (c.hardness === "hard" || c.hardness === "contractual") && c.delayDays > c.flexibilityDays,
  ).length;
  const commitmentRisk = Math.min(1, hardBreaches * 0.28 + delayDays / 40 + alt.qualityRisk * 0.3);
  const customerImpact = Math.min(1, delayDays / 30 + (contract.strategic ? 0.2 : 0));
  const executionRisk = Math.min(1, alt.executionRisk + alt.energyRisk * 0.25);

  const kpi: KpiImpact = {
    delayDays,
    costIrr,
    cashDeltaIrr,
    penaltyIrr,
    marginDeltaIrr,
    commitmentRisk,
    customerImpact,
    executionRisk,
    energyRisk: alt.energyRisk,
    fxRisk: Math.min(1, alt.fxExposureIrr / 20_000_000_000),
  };

  const affectedOps = ops.filter((o) => {
    const src = OPERATIONS.find((x) => x.id === o.id)!;
    return o.finish !== src.plannedFinishDay || o.start !== src.plannedStartDay;
  });
  const affectedOrders = new Set(affectedOps.map((o) => o.orderId));
  const affectedProjects = new Set(affectedOps.map((o) => o.projectId));
  const affectedMs = MILESTONES.filter((m) => affectedProjects.has(m.projectId));
  const affectedCm = COMMITMENTS.filter((c) => c.projectId && affectedProjects.has(c.projectId));

  const rollTraces: TraceStep[] = [...traces];
  for (const o of affectedOps) {
    const src = OPERATIONS.find((x) => x.id === o.id)!;
    const dly = o.finish - src.plannedFinishDay;
    if (dly <= 0) continue;
    rollTraces.push({
      fromId: o.id,
      fromLabel: o.nameFa,
      toId: o.orderId,
      toLabel: ORDERS.find((x) => x.id === o.orderId)?.materialNameFa ?? o.orderId,
      relation: "BELONGS_TO",
      delayDays: dly,
      costIrr: 0,
      noteFa: "تأخیر عملیات به سفارش تولید منتقل شد",
    });
  }
  for (const pid of affectedProjects) {
    const p = PROJECTS.find((x) => x.id === pid)!;
    const dly = Math.max(0, finishOf(ops, pid) - p.plannedFinishDay);
    if (!dly) continue;
    rollTraces.push({
      fromId: pid,
      fromLabel: p.nameFa,
      toId: COMMITMENTS.find((c) => c.projectId === pid)?.id ?? pid,
      toLabel: "تعهد تحویل / نقد",
      relation: "IMPACTS",
      delayDays: dly,
      costIrr: delayedCommitments.find((c) => c.projectId === pid)?.penaltyIrr ?? 0,
      noteFa: "تأخیر پروژه به تعهد و جریان نقد می‌رسد",
    });
  }

  return {
    alternative: alt,
    kpi,
    affected: {
      operations: affectedOps.length,
      orders: affectedOrders.size,
      projects: affectedProjects.size,
      milestones: affectedMs.length,
      commitments: affectedCm.length,
    },
    score: 0,
    scoreBreakdown: {},
    feasible: true,
    traces: rollTraces,
    delayedCommitments: delayedCommitments.map((c) => ({
      id: c.id,
      nameFa: c.nameFa,
      delayDays: c.delayDays,
      penaltyIrr: c.penaltyIrr,
    })),
    delayedProjects: delayedProjects.map((p) => ({
      id: p.id,
      nameFa: p.nameFa,
      delayDays: p.delayDays,
    })),
  };
}

const DO_NOTHING: Alternative = {
  id: "repair",
  nameFa: "بدون اقدام (پایه)",
  nameEn: "Do nothing",
  summaryFa: "ماشین ۲۰ روز خارج است و هیچ مسیر جایگزینی اجرا نمی‌شود.",
  extraCostIrr: 0,
  extraLeadDays: 20,
  durationOverrideDays: 20,
  qualityRisk: 0.12,
  executionRisk: 0.15,
  fxExposureIrr: 0,
  energyRisk: 0.05,
};

function runAlt(alt: Alternative, d: Disruption): AlternativeResult {
  const ops = cloneOps();
  const duration = alt.emergencyRepairDays ?? alt.durationOverrideDays ?? d.durationDays;
  const traces = applyDisruption(ops, d.resourceId, d.startDay, duration, {
    bumpProjectId: alt.bumpProjectId,
    skipOpIds: alt.id === "reallocate" || alt.id === "outsource" ? ["OP-H2-BAR-VPI"] : undefined,
    retarget: alt.id === "outsource" ? { opId: "OP-H2-VPI", extraDays: 4 } : undefined,
    compressAfter:
      alt.compressAfterRepairDays && alt.emergencyRepairDays
        ? { fromDay: d.startDay + alt.emergencyRepairDays, recoverDays: alt.compressAfterRepairDays }
        : undefined,
  });
  return evaluate(alt, ops, traces);
}

function minMax(values: number[]): { min: number; max: number } {
  return { min: Math.min(...values), max: Math.max(...values) };
}

function norm(v: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (v - min) / (max - min);
}

function scoreAll(results: AlternativeResult[], profile: PriorityProfile): AlternativeResult[] {
  const w = PROFILE_WEIGHTS[profile];
  const delays = minMax(results.map((r) => r.kpi.delayDays));
  const costs = minMax(results.map((r) => r.kpi.costIrr));
  const cash = minMax(results.map((r) => r.kpi.cashDeltaIrr));
  const margin = minMax(results.map((r) => r.kpi.marginDeltaIrr));
  const crisk = minMax(results.map((r) => r.kpi.commitmentRisk));
  const erisk = minMax(results.map((r) => r.kpi.executionRisk + r.kpi.energyRisk + r.kpi.fxRisk));

  return results.map((r) => {
    const sCash = norm(r.kpi.cashDeltaIrr, cash.min, cash.max);
    const sCommit = 1 - norm(r.kpi.commitmentRisk, crisk.min, crisk.max);
    const sMargin = norm(r.kpi.marginDeltaIrr, margin.min, margin.max);
    const sSched = 1 - norm(r.kpi.delayDays, delays.min, delays.max);
    const sRisk = 1 - norm(r.kpi.executionRisk + r.kpi.energyRisk + r.kpi.fxRisk, erisk.min, erisk.max);
    const sCost = 1 - norm(r.kpi.costIrr, costs.min, costs.max);
    const score =
      100 *
      (w.cash * sCash +
        w.commitment * sCommit +
        w.margin * sMargin +
        w.schedule * sSched +
        w.risk * sRisk +
        w.cost * sCost);
    return {
      ...r,
      score: Math.round(score * 10) / 10,
      scoreBreakdown: {
        نقد: Math.round(sCash * 100),
        تعهد: Math.round(sCommit * 100),
        حاشیه: Math.round(sMargin * 100),
        زمان‌بندی: Math.round(sSched * 100),
        ریسک: Math.round(sRisk * 100),
        هزینه: Math.round(sCost * 100),
      },
    };
  });
}

export function runSimulation(
  disruption: Disruption = GOLDEN_DISRUPTION,
  profile: PriorityProfile = "strategic_customer",
): SimulationRun {
  const baselineOps = cloneOps();
  const baseTraces = applyDisruption(
    baselineOps,
    disruption.resourceId,
    disruption.startDay,
    disruption.durationDays,
  );
  const baseline = evaluate(DO_NOTHING, baselineOps, baseTraces);

  const raw = ALTERNATIVES.map((a) => runAlt(a, disruption));
  const scored = scoreAll(raw, profile);
  const ranked = [...scored].sort((a, b) => b.score - a.score);
  const best = ranked[0]!;

  const kind: SimulationRun["recommendationKind"] =
    best.alternative.qualityRisk >= 0.3 || best.kpi.executionRisk > 0.5
      ? "conditional_go"
      : "go";

  const conditionsFa: string[] = [];
  if (best.alternative.id === "outsource") {
    conditionsFa.push("تأیید مهندسی عایق و پروتکل تست IEC قبل از حمل استاتور");
    conditionsFa.push("بیمه حمل محموله فوق‌سنگین و مجوز جاده");
    conditionsFa.push("بازرسی کیفیت پیمانکار در سه نقطه: خلاء، فشار، پخت");
  }
  if (best.alternative.id === "overtime") {
    conditionsFa.push("دیزل اضطراری برای شیفت شب VPI و کوره تضمین شود");
    conditionsFa.push("VPI-02 تا پایان تعمیر واحد ۲ برای پمپ یدکی از مدار تولید خارج می‌ماند");
  }
  if (best.alternative.id === "reallocate") {
    conditionsFa.push("اطلاع به کارفرمای MGS58 و بازنگری جریمه با امور قراردادها");
  }
  if (best.alternative.id === "repair") {
    conditionsFa.push("پیگیری روزانه قطعه پمپ از کانال واسطه");
  }
  conditionsFa.push("تصمیم نهایی با مدیر کارخانه / مدیرعامل پارس است — سیستم پیشنهاد می‌دهد");

  return {
    id: `SIM-${Date.now()}`,
    createdAt: new Date().toISOString(),
    disruption,
    profile,
    baseline: { ...baseline, score: 0 },
    alternatives: scored,
    ranked,
    recommendation: best,
    recommendationKind: kind,
    conditionsFa,
    confidence:
      best.alternative.id === "reallocate" ? 0.78 : best.alternative.id === "overtime" ? 0.7 : 0.74,
    facts: [
      `FACT: منبع ${disruption.resourceId} طبق داده کارخانه یکتاست.`,
      "FACT: عملیات OP-H2-VPI در حال اجراست و remainingWorkDays = ۷.",
      "FACT: محصول MGS72-SH2 ژنراتور هیدروژن‌خنک ۳۷۶ MW کلاس F است (mapnagroup.com، ۲۰۲۵).",
      `CALCULATED: تأخیر پایه پروژه واحد ۲ = ${baseline.kpi.delayDays} روز.`,
      `CALCULATED: جریمه پایه = ${Math.round(baseline.kpi.penaltyIrr / 1e9)} میلیارد ریال.`,
    ],
    assumptions: [
      "ASSUMPTION: ارقام هزینه/نقد/قرارداد سنتتیک هستند تا استخراج SAP در پایلوت جایگزین شود.",
      `ASSUMPTION: نرخ ارز ${IRAN_DEFAULTS.fxShockPct * 100}٪ شوک برای قطعات وارداتی.`,
      `ASSUMPTION: تأخیر وصول کارفرمای دولتی ${IRAN_DEFAULTS.governmentCollectionLagDays} روز.`,
      "ASSUMPTION: کارگاه اصفهان از نظر ابعادی استاتور ۳۷۶ MW را می‌پذیرد — VALIDATION REQUIRED.",
    ],
    calculated: scored.map(
      (s) =>
        `${s.alternative.nameEn}: delay=${s.kpi.delayDays}d cost=${Math.round(s.kpi.costIrr / 1e9)}B score=${s.score}`,
    ),
  };
}

export function cashSeries(sim: SimulationRun, altId?: AlternativeId) {
  const extra = altId
    ? sim.alternatives.find((a) => a.alternative.id === altId)?.kpi
    : sim.baseline.kpi;
  const delay = extra?.delayDays ?? 0;
  const extraOut = extra ? Math.abs(Math.min(0, extra.cashDeltaIrr)) : 0;
  const points: { day: number; label: string; value: number }[] = [];
  let cash = OPENING_CASH_IRR;
  const events = CASH_EVENTS.filter((e) => e.id !== "CASH-OPEN").map((e) => ({
    ...e,
    plannedDay: e.id === "CASH-H2-FAT" ? e.plannedDay + delay : e.plannedDay,
  }));
  events.push({
    id: "CASH-ACTION",
    kind: "outflow",
    nameFa: "هزینه اقدام",
    amountIrr: extraOut,
    plannedDay: 2,
    probability: 1,
    fxLinked: false,
    provenance: CASH_EVENTS[0]!.provenance,
  });
  points.push({ day: 0, label: "افتتاحیه", value: cash });
  const sorted = [...events].sort((a, b) => a.plannedDay - b.plannedDay);
  for (const e of sorted) {
    cash += e.kind === "inflow" ? e.amountIrr * e.probability : -e.amountIrr;
    points.push({ day: e.plannedDay, label: e.nameFa, value: cash });
  }
  return points;
}

export { OPENING_CASH_IRR };

/** Canonical data model for Mission Control. Independent of SAP; SAP is a source. */

export type SourceKind =
  | "sap"
  | "calculated"
  | "derived"
  | "estimated"
  | "external"
  | "assumption";

export type Confidence = "high" | "medium" | "low" | "assumed";

export type ResourceKind =
  | "machine"
  | "work_center"
  | "employee"
  | "skill"
  | "material"
  | "supplier"
  | "contractor"
  | "engineering"
  | "energy"
  | "cash"
  | "tooling"
  | "warehouse";

export type CommitmentKind =
  | "customer_delivery"
  | "contract_milestone"
  | "project_milestone"
  | "supplier_payment"
  | "payroll"
  | "regulatory"
  | "warranty"
  | "strategic";

export type CommitmentHardness = "hard" | "soft" | "financial" | "strategic" | "contractual" | "internal";

export type NodeType =
  | "enterprise"
  | "plant"
  | "project"
  | "wbs"
  | "order"
  | "operation"
  | "resource"
  | "material"
  | "supplier"
  | "commitment"
  | "milestone"
  | "cash_event"
  | "person";

export type EdgeType =
  | "REQUIRES"
  | "USES"
  | "DEPENDS_ON"
  | "PRODUCES"
  | "DELIVERS"
  | "CONSTRAINS"
  | "PAY_FOR"
  | "SUPPLIED_BY"
  | "ALLOCATED_TO"
  | "PRECEDES"
  | "IMPACTS"
  | "CAUSES"
  | "DELAYED_BY"
  | "ALTERNATIVE_TO"
  | "BELONGS_TO"
  | "SATISFIES"
  | "TRIGGERS"
  | "OWNED_BY";

export type PriorityProfile =
  | "normal"
  | "cash_crisis"
  | "delivery_crisis"
  | "strategic_customer";

export type Provenance = {
  sourceSystem: string;
  sourceRecordId?: string;
  sourceKind: SourceKind;
  confidence: Confidence;
  asOf: string;
  note?: string;
};

export type Resource = {
  id: string;
  code: string;
  nameFa: string;
  nameEn: string;
  kind: ResourceKind;
  plantId: string;
  capacityPerDay: number;
  capacityUnit: string;
  calendarId: string;
  available: boolean;
  failureProbability: number;
  hourlyCostIrr: number;
  energyKwhPerHour: number;
  alternativeIds: string[];
  laborDependency: string[];
  materialDependency: string[];
  supplierDependency: string[];
  uniqueInPlant: boolean;
  sapWorkCenter?: string;
  provenance: Provenance;
};

export type Material = {
  id: string;
  code: string;
  nameFa: string;
  nameEn: string;
  plantId: string;
  uom: string;
  onHand: number;
  reserved: number;
  safetyStock: number;
  leadTimeDays: number;
  importDependent: boolean;
  fxSensitive: boolean;
  unitCostIrr: number;
  supplierId?: string;
  sapMatnr?: string;
  provenance: Provenance;
};

export type Supplier = {
  id: string;
  code: string;
  nameFa: string;
  nameEn: string;
  country: string;
  sanctionedChannel: boolean;
  reliability: number;
  typicalDelayDays: number;
  provenance: Provenance;
};

export type Operation = {
  id: string;
  orderId: string;
  wbsId: string;
  projectId: string;
  seq: string;
  nameFa: string;
  nameEn: string;
  workCenterId: string;
  plannedStartDay: number;
  plannedFinishDay: number;
  actualStartDay?: number;
  remainingWorkDays: number;
  totalWorkDays: number;
  status: "planned" | "released" | "in_progress" | "confirmed" | "delayed";
  predecessors: string[];
  materialIds: string[];
  sapAufnr?: string;
  sapVornr?: string;
  provenance: Provenance;
};

export type ProductionOrder = {
  id: string;
  aufnr: string;
  materialId: string;
  materialNameFa: string;
  projectId: string;
  wbsId: string;
  qty: number;
  plannedFinishDay: number;
  status: string;
  provenance: Provenance;
};

export type Wbs = {
  id: string;
  posid: string;
  nameFa: string;
  projectId: string;
  parentId?: string;
  plannedFinishDay: number;
  plannedCostIrr: number;
  actualCostIrr: number;
  provenance: Provenance;
};

export type Project = {
  id: string;
  pspid: string;
  nameFa: string;
  nameEn: string;
  plantId: string;
  customer: string;
  productModel: string;
  status: string;
  progressPct: number;
  plannedStartDay: number;
  plannedFinishDay: number;
  contractualFinishDay: number;
  contractValueIrr: number;
  remainingInvoiceIrr: number;
  strategic: boolean;
  penaltyPerDayPct: number;
  penaltyCapPct: number;
  collectionLagDays: number;
  provenance: Provenance;
};

export type Milestone = {
  id: string;
  nameFa: string;
  projectId: string;
  wbsId: string;
  dueDay: number;
  type: "fat" | "delivery" | "pac" | "invoice" | "internal";
  invoicePct: number;
  provenance: Provenance;
};

export type Commitment = {
  id: string;
  kind: CommitmentKind;
  hardness: CommitmentHardness;
  nameFa: string;
  owner: string;
  dueDay: number;
  priority: number;
  financialImpactIrr: number;
  penaltyIrrPerDay: number;
  flexibilityDays: number;
  criticality: number;
  status: "on_track" | "at_risk" | "breached" | "completed";
  projectId?: string;
  milestoneId?: string;
  provenance: Provenance;
};

export type CashEvent = {
  id: string;
  kind: "inflow" | "outflow";
  nameFa: string;
  amountIrr: number;
  plannedDay: number;
  probability: number;
  commitmentId?: string;
  projectId?: string;
  fxLinked: boolean;
  provenance: Provenance;
};

export type GraphNode = {
  id: string;
  type: NodeType;
  labelFa: string;
  labelEn: string;
  meta: Record<string, string | number | boolean | undefined>;
};

export type GraphEdge = {
  id: string;
  type: EdgeType;
  source: string;
  target: string;
  weight?: number;
  lagDays?: number;
  validFromDay?: number;
  validToDay?: number;
  confidence: Confidence;
  sourceSystem: string;
};

export type EnterpriseGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type Disruption = {
  id: string;
  resourceId: string;
  nameFa: string;
  startDay: number;
  durationDays: number;
  causeFa: string;
  iranFactors: string[];
};

export type AlternativeId = "repair" | "outsource" | "reallocate" | "overtime";

export type Alternative = {
  id: AlternativeId;
  nameFa: string;
  nameEn: string;
  summaryFa: string;
  extraCostIrr: number;
  extraLeadDays: number;
  durationOverrideDays?: number;
  qualityRisk: number;
  executionRisk: number;
  fxExposureIrr: number;
  energyRisk: number;
  usesAlternativeResource?: string;
  bumpProjectId?: string;
  compressAfterRepairDays?: number;
  emergencyRepairDays?: number;
};

export type KpiImpact = {
  delayDays: number;
  costIrr: number;
  cashDeltaIrr: number;
  penaltyIrr: number;
  marginDeltaIrr: number;
  commitmentRisk: number;
  customerImpact: number;
  executionRisk: number;
  energyRisk: number;
  fxRisk: number;
};

export type AffectedCounts = {
  operations: number;
  orders: number;
  projects: number;
  milestones: number;
  commitments: number;
};

export type TraceStep = {
  fromId: string;
  fromLabel: string;
  toId: string;
  toLabel: string;
  relation: EdgeType;
  delayDays: number;
  costIrr: number;
  noteFa: string;
};

export type AlternativeResult = {
  alternative: Alternative;
  kpi: KpiImpact;
  affected: AffectedCounts;
  score: number;
  scoreBreakdown: Record<string, number>;
  feasible: boolean;
  infeasibleReasonFa?: string;
  traces: TraceStep[];
  delayedCommitments: { id: string; nameFa: string; delayDays: number; penaltyIrr: number }[];
  delayedProjects: { id: string; nameFa: string; delayDays: number }[];
};

export type SimulationRun = {
  id: string;
  createdAt: string;
  disruption: Disruption;
  profile: PriorityProfile;
  baseline: AlternativeResult;
  alternatives: AlternativeResult[];
  ranked: AlternativeResult[];
  recommendation: AlternativeResult;
  recommendationKind: "go" | "conditional_go" | "no_go";
  conditionsFa: string[];
  confidence: number;
  facts: string[];
  assumptions: string[];
  calculated: string[];
};

export type CouncilRoleId =
  | "ceo"
  | "cfo"
  | "coo"
  | "engineering"
  | "supply"
  | "commercial"
  | "project_controls"
  | "risk"
  | "iran"
  | "devil"
  | "chair";

export type CouncilOpinion = {
  role: CouncilRoleId;
  titleFa: string;
  stance: "support" | "challenge" | "veto" | "condition";
  thesisFa: string;
  questionsFa: string[];
  veto: boolean;
  vetoReasonFa?: string;
};

export type DecisionRecord = {
  id: string;
  simulationId: string;
  chosen: AlternativeId;
  status: "pending" | "approved" | "overridden" | "rejected" | "executed";
  owner: string;
  rationaleFa: string;
  overrides: { field: string; from: string; to: string; by: string; at: string }[];
  createdAt: string;
};

export type PriorityWeights = {
  cash: number;
  commitment: number;
  margin: number;
  schedule: number;
  risk: number;
  cost: number;
};

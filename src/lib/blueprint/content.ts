export type Section = { id: string; title: string; body: string };

export const BLUEPRINT: Section[] = [
  {
    id: "exec",
    title: "۱. خلاصه اجرایی",
    body: `Mission Control v1.0 یک System of Intelligence است نه System of Record.

مسئله: وقتی یک منبع بحرانی در کارخانه فردیس از مدار خارج می‌شود، اثر آن روی عملیات، سفارش، پروژه، تعهد قراردادی، جریمه و نقد پنهان می‌ماند تا دیر شود.

راه‌حل MVP: گراف بنگاه از داده SAP-مانند + انتشار اثر قطعی + چهار مسیر اجرایی + امتیازدهی با پروفایل اولویت + شورای مجازی تفسیری + بسته تصمیم برای انسان.

حکم معمار ارشد: CONDITIONAL GO برای محصول، معماری، فناوری، MVP و پایلوت پارس.

شرکت: مهندسی و ساخت ژنراتور مپنا (پارس) — تأسیس ۱۳۷۷، کارخانه فردیس. محصول پایلوت: ژنراتور هیدروژن‌خنک MGS72-SH2 ۳۷۶ MW کلاس F (رونمایی ۲۰۲۵، mapnagroup.com).

FACT: پارس بیش از ۵۰٪ ژنراتورهای صنعت برق کشور را تولید کرده است (mapnagenerator.com، بازیابی ۲۰۲۶-۰۹-۰۵).
ASSUMPTION: سفارش‌ها، هزینه‌ها و نقد این MVP سنتتیک‌اند تا استخراج SAP جایگزین شود.`,
  },
  {
    id: "problem",
    title: "۲. تعریف مسئله",
    body: `پارس همزمان سازنده تجهیزات و متعهد پروژه‌ای است. ERP وضعیت را ثبت می‌کند؛ MRP نیاز را می‌ترکاند؛ APS ظرفیت را زمان‌بندی می‌کند. هیچ‌کدام به مدیر نمی‌گویند:

اگر VPI-01 بیست روز نباشد، کدام تعهد می‌شکند، نقد چه می‌شود، و کدام اقدام از نظر اجرایی و اقتصادی در ایران قابل دفاع است؟

مرز سیستم:
- جایگزین SAP / ERP / MRP / MES / PLM نیست.
- داشبورد BI نیست (توضیح گذشته کافی نیست).
- چت‌بات نیست (LLM محاسبه نمی‌کند).
- APS جدید نمی‌سازد (زمان‌بندی پایه از SAP می‌آید؛ MC تأخیر را منتشر می‌کند).`,
  },
  {
    id: "context",
    title: "۳. زمینه کسب‌وکار",
    body: `گروه مپنا پیمانکار اصلی نیروگاه‌های حرارتی و سیکل ترکیبی ایران است. پارس ژنراتورهای گازی، بخار، آبی، بادی و باس‌داکت می‌سازد. همکاری تاریخی با Siemens، Ansaldo، Andritz/Elin، GE Canada، Jeumont.

پایلوت روی واحد دوم سری هیدروژن‌خنک است چون:
- ارزش کسب‌وکار بالا (محصول پرچم کلاس F)
- پوشش SAP خوب (PP + PS)
- دامنه محدود (یک منبع یکتا)
- خروجی قابل اندازه‌گیری (روز تأخیر، ریال جریمه، ریال نقد)

شرایط ایران که در شبیه‌سازی تزریق می‌شوند نه به‌صورت لیست ریسک: ارز، تورم، تحریم کانال تأمین، کسری برق، تأخیر وصول دولتی، گمرک.`,
  },
  {
    id: "product",
    title: "۴. تعریف محصول",
    body: `Mission Control = Resource–Commitment Impact Simulation & Decision System

جمله ماندگار:
Mission Control does not replace ERP. It understands the enterprise represented by ERP, simulates how changes propagate through resources and commitments, evaluates executable alternatives, and helps management choose the best action under real-world constraints.

برای ایران:
Mission Control must optimize not for theoretical operational efficiency, but for economically executable commitments under cash, capacity, supply, FX, contractual and environmental constraints.

اصل سه‌نظامی:
SAP / ERP = System of Record
Mission Control = System of Intelligence
Human Management = System of Authority`,
  },
  {
    id: "principles",
    title: "۵. اصول معماری",
    body: `P1. حقیقت از SAP و منابع ثبت می‌آید؛ MC بازنویسی حقیقت نمی‌کند.
P2. گراف مدل رابطه است نه دیتابیس گزارش.
P3. شبیه‌سازی قطعی در MVP؛ احتمالی در V2.
P4. بهینه‌سازی قانون‌محور + امتیاز چندهدفه در MVP؛ MIP در مسیر سازمانی.
P5. LLM توضیح می‌دهد نه محاسبه.
P6. انسان تصمیم نهایی است؛ همه Override ممیزی می‌شود.
P7. موتور هسته بدون اینترنت و بدون LLM کار می‌کند.
P8. نقد = منبع + قید + متغیر حالت.
P9. لایه واقعیت ایران به یال‌ها و هزینه‌ها تزریق می‌شود.
P10. در تعارض زیبایی معماری و اثبات ارزش اقتصادی، اثبات ارزش برنده است.`,
  },
  {
    id: "func-arch",
    title: "۶. معماری کارکردی",
    body: `EXTERNAL REALITY
  → DATA SOURCES (SAP S/4, PLM, Treasury, Iran feeds)
  → TRUTH LAYER (canonical, versioned, confidence)
  → ENTERPRISE MODEL (resource, commitment, cash, time)
  → GRAPH MODEL
  → SIMULATION ENGINE (propagate)
  → OPTIMIZATION (score alternatives)
  → VIRTUAL EXECUTIVE COUNCIL (interpret)
  → DECISION PACKAGE
  → HUMAN
  → EXECUTION (back to SAP as record — not written by MC in MVP)
  → ACTUAL
  → LEARNING (versioned model change)`,
  },
  {
    id: "bom",
    title: "۷. مدل اشیاء کسب‌وکار",
    body: `حداقل اشیاء MVP: Company, Plant, Project, WBS, ProductionOrder, Operation, WorkCenter/Machine, Material, Supplier, Milestone, Commitment, CashEvent, Scenario/Disruption, Alternative, SimulationRun, Decision, ActualResult, LearningRecord.

برای هر شیء: شناسه، معنی، منبع SAP، منبع داخلی، صفات اجباری/اختیاری، روابط، بعد زمان، مالک، فرکانس به‌روزرسانی، نیاز به تاریخچه، سطح اطمینان.

نمونه Operation:
- SAP: AFVC+AFVV via CDS I_ProductionOrderOperation_2
- صفات اجباری: seq, workCenter, remainingWorkDays, predecessors
- زمان: planned/actual start-finish (روز)
- مالک: برنامه‌ریزی تولید
- فرکانس: هر ۴ ساعت در پایلوت؛ روزانه در MVP دمو
- تاریخچه: بله (نسخه گراف)`,
  },
  {
    id: "resource",
    title: "۸. مدل منبع",
    body: `Resource
 ├── Capacity (per day / batch)
 ├── Calendar (۶ روز کاری؛ جمعه تعطیل — ASSUMPTION)
 ├── Availability
 ├── Maintenance / FailureProbability
 ├── LaborDependency
 ├── EnergyDependency (kWh/h → قید برق ایران)
 ├── MaterialDependency
 ├── SupplierDependency
 ├── Cost
 └── AlternativeResources

ماشین VPI-01 یکتاست. VPI-02 فقط شینه را می‌پذیرد نه استاتور ۳۷۶ MW (ASSUMPTION فنی — VALIDATION با مهندسی عایق).`,
  },
  {
    id: "commitment",
    title: "۹. مدل تعهد",
    body: `Commitment first-class است.
صفات: Type, Owner, Due, Priority, FinancialImpact, Penalty, Dependencies, Flexibility, Criticality, Status, Hardness.

سخت (Hard): تحویل قراردادی واحد ۲، حقوق.
قراردادی: MGS58.
مالی: صورت‌وضعیت FAT.
راهبردی: هویت کلاس F پارس.
داخلی: صف VPI.

قاعده تصمیم: نقض Hard بدون انعطاف → امتیاز تعهد صفر می‌شود مگر مسیر جایگزین delay را به داخل flexibility برگرداند.`,
  },
  {
    id: "cash",
    title: "۱۰. مدل نقد",
    body: `OpeningCash + ExpectedInflows − ExpectedOutflows = ProjectedCash(t)

زنجیره:
Payment → Material → Production → Delivery → Invoice → Collection → Cash

MVP: رویدادهای نقدی زمان‌دار. تأخیر FAT، inflow را به اندازه delay جابه‌جا می‌کند و ارزش زمانی ۳۲٪ سالانه (ASSUMPTION WACC ریالی) اعمال می‌شود.

الگوی یکپارچگی نقد اگر SAP Treasury موجود نباشد:
فایل خزانه روزانه (CSV/API داخلی) + مانده GL (FAGLFLEXT / ACDOCA) به‌عنوان افتتاحیه. VALIDATION REQUIRED.`,
  },
  {
    id: "time",
    title: "۱۱. مدل زمان",
    body: `دانه‌بندی MVP: روز.
دلیل: تاریخ‌های پایه SAP روزانه است؛ اختلال ۲۰روزه؛ شیفت برای Overtime به‌صورت ضریب فشرده‌سازی مدل می‌شود نه تقویم دقیق.

سطح بعدی: شیفت (۳ در روز) وقتی انرژی و نفرات شیفت سوم داده واقعی داشته باشند.

انواع زمان: Event, EffectiveFrom/To, Planned, Actual, Forecast, Calendar, Shift, CapacityWindow, LeadTime, Delay, ExpectedDelay, Distribution (V2).`,
  },
  {
    id: "canonical",
    title: "۱۲. مدل کانونیکال",
    body: `هر موجودیت: PK, Natural Key, Attributes, FKs, Timestamp, Version, SourceSystem, SourceRecordId, Confidence, ValidFrom, ValidTo.

MC مستقل از SAP است. SAP مهم‌ترین منبع است. Natural key برای Operation: (AUFNR, VORNR). برای WBS: POSID.`,
  },
  {
    id: "sap-arch",
    title: "۱۳. معماری داده SAP",
    body: `استخراج توصیه‌شده S/4HANA On-Prem (حالت غالب صنعت ایران):

Master
- MARA/MARC/MBEW — CDS I_Product, I_ProductPlant
- CRHD/CRTX/KAKO — Work Center
- PLKO/PLPO/MAPL — Routing (I_ProductionRoutingHeaderDEX)
- MAST/STKO/STPO — BOM
- LFA1/LFB1 — Supplier
- KNA1 — Customer
- EQUI — Equipment

Production
- AUFK/AFKO/AFPO — I_ManufacturingOrder (CDC delta)
- AFVC/AFVV — I_ProductionOrderOperation_2
- AFRU — confirmations
- RESB — reservations
- PLAF — planned orders (مشاهده؛ MC MRP اجرا نمی‌کند)

Project
- PROJ, PRPS, PRHI, PRTE, MLST
- AUFK/AFKO/AFVC برای Network
- RPSCO / COSP / COSS / COEP / ACDOCA (actual)
- COOI — commitments (PR/PO)

Inventory: MARD / MATDOC
Finance: ACDOCA, BSEG (در صورت نیاز), FQM یا فایل خزانه

روش: CDS extraction CDC به Staging؛ هرگز RFC نوشتنی در MVP. فقط خواندنی.

فرکانس پایلوت: هر ۴ ساعت برای عملیات و تأییدها؛ روزانه برای master؛ بلادرنگ برای حادثه دستی.

منابع: SAP Help S/4HANA 2025 FPS01 — I_ProductionOrderOperation_2, I_ManufacturingOrder, I_EnterpriseProject؛ DVW Analytics PP/PS table guides (بازیابی ۲۰۲۶-۰۸/۰۹).`,
  },
  {
    id: "sap-map",
    title: "۱۴. نگاشت SAP → Mission Control",
    body: `| SAP | Source | Field | MC Object | MC Field | Transform | Kind |
| AFKO | AUFNR, GLTRP, GAMNG | ProductionOrder | id, plannedFinish | identity | authoritative |
| AFVC | VORNR, ARBID | Operation | seq, workCenterId | ARBID→CRHD.OBJID | authoritative |
| AFVV | dates, qty | Operation | plannedStart/Finish | day offset from as-of | authoritative |
| AFRU | LMNGA | Operation | remainingWorkDays | derived from total−yield | calculated |
| CRHD | ARBPL | Resource | code | identity | authoritative |
| PROJ | PSPID | Project | pspid | identity | authoritative |
| PRPS | POSID | WBS | posid | identity | authoritative |
| MLST | LSTNR | Milestone | dueDay | date→day | authoritative |
| COOI | WTGXX | Commitment (PO) | financialImpact | currency to IRR | authoritative |
| ACDOCA | HSL | Cost actual | actualCostIrr | sum by OBJNR | authoritative |
| EKKO/EKPO | LFDAT | Supplier lead | leadTimeDays | + Iran buffer | derived |
| Treasury file | BALANCE | CashEvent | opening | as-is | externally supplied |

authoritative = SAP. calculated = MC engine. estimated = Iran/treasury. assumption = seed.`,
  },
  {
    id: "egraph",
    title: "۱۵. مدل گراف بنگاه",
    body: `Nodes: Project, WBS, Order, Operation, Resource, Material, Supplier, Milestone, Commitment, CashEvent.

Edges و کاردینالیتی:
USES: Operation → Resource (n:1)
PRECEDES: Operation → Operation (n:n)
REQUIRES: Operation → Material (n:n)
BELONGS_TO: child → parent (n:1)
PRODUCES: Order → WBS
DELIVERS: WBS → Milestone
SATISFIES: Milestone → Commitment
TRIGGERS: Commitment → CashEvent
SUPPLIED_BY: Material → Supplier
ALTERNATIVE_TO: Resource → Resource
ALLOCATED_TO: Resource → Project
IMPACTS: Project → Commitment

هر یال: source, target, type, lagDays, validFrom/To, confidence, sourceSystem.`,
  },
  {
    id: "gbuild",
    title: "۱۶. ساخت گراف",
    body: `MVP: Batch کامل هر بار استخراج.
Pilot: Incremental با کلید طبیعی.

شبه‌کد:
for each SAP row in extract:
  upsert node by (type, naturalKey)
  if hash unchanged: skip
  else: new version, validTo=now on old
for each relationship rule:
  upsert edge
detect orphans: node with degree 0 and type in {operation, order}
detect duplicates: same natural key different source id → quarantine
Time-aware: edge.validFrom/To؛ query as-of = simulation time

Inconsistency: operation.workCenter missing in CRHD → confidence=low, still simulate with flag.`,
  },
  {
    id: "gtech",
    title: "۱۷. فناوری گراف",
    body: `Option A: Relational + graph abstraction
+ ساده، پشتیبان آسان، مهارت SQL در ایران، بدون لایسنس
− پیمایش عمیق کندتر
Option B: Native graph (Neo4j)
+ پیمایش
− لایسنس، استقرار، مهارت، تحریم
Option C: Hybrid (Postgres + recursive CTE / pgRouting-like)

RECOMMENDED MVP: Option A روی Postgres (در دمو: ساختار درون‌حافظه معادل).
RECOMMENDED Enterprise: Option C — Postgres منبع حقیقت، موتور پیمایش در سرویس شبیه‌سازی.

دلیل: استقرار ایران، پشتیبان، امنیت، مهارت توسعه‌دهنده، عدم قفل فروشنده.`,
  },
  {
    id: "prop",
    title: "۱۸. انتشار اثر",
    body: `الگوریتم:
1. Select resource R unavailable [t, t+d]
2. Ops = operations USING R overlapping window OR queued after t
3. Shift start to t+d (in-progress: remaining work resumes after repair)
4. Topological PRECEDES forward
5. Roll-up finish → Order → WBS → Project
6. Milestone delay = project finish − planned
7. Commitment: delay beyond flexibility → penalty = min(days×rate, cap)
8. Cash: shift inflows; add action cost outflows; time-value

پیچیدگی: O(N+E) روی زیرگراف پروژههای درگیر. برای MVP سه پروژه کافی است.`,
  },
  {
    id: "simeng",
    title: "۱۹. موتور شبیه‌سازی",
    body: `Level 1 Deterministic: ۲۰ روز ناموجود.
Level 2 Scenario: Repair / Outsource / Reallocate / Overtime.
Level 3 Probabilistic: V1.3+ (توزیع تأخیر تأمین، تعمیر، وصول).

MVP الگوریتم ۱۲مرحله‌ای در کد: select → disrupt → affect → propagate → alternatives → simulate each → KPI → constraints → score → rank → recommend → explain.`,
  },
  {
    id: "obj",
    title: "۲۰. تابع هدف",
    body: `DecisionScore = 100 × (
  w_cash·N(cashDelta) + w_commit·(1−N(commitRisk)) + w_margin·N(margin)
  + w_sched·(1−N(delay)) + w_risk·(1−N(exec+energy+fx)) + w_cost·(1−N(cost))
)
N نرمال‌سازی بین گزینه‌های همان اجراست نه مطلق تاریخی.

وزن‌ها از پروفایل:
عادی / بحران نقد / بحران تحویل / مشتری راهبردی (مقادیر در weights.ts).`,
  },
  {
    id: "cons",
    title: "۲۱. قیود",
    body: `Hard: ظرفیت فیزیکی VPI-02 برای استاتور ۳۷۶ MW (غیرممکن)، ایمنی هیدروژن، تقویم جمعه، حقوق.
Soft: اضافه کاری، انرژی شب، اولویت MGS58، سقف تنخواه.

نقض Hard → گزینه infeasible.
نقض Soft → جریمه در امتیاز.`,
  },
  {
    id: "opt",
    title: "۲۲. بهینه‌سازی",
    body: `MVP: Rule-based generation of 4 alternatives + weighted scoring.
رد شده برای MVP: MIP/CP (پیچیدگی، داده ناقص، زمان اثبات ارزش).
مسیر سازمانی: Constraint Programming روی تخصیص منبع چندپروژه (V1.4) سپس MIP نقد-زمان.`,
  },
  {
    id: "vec",
    title: "۲۳–۲۵. شورای اجرایی مجازی",
    body: `جایگاه: پس از بهینه‌سازی، پیش از بسته تصمیم. جایگزین موتور نیست.

نقش‌ها: CEO, CFO, COO, Engineering, Supply, Commercial, Project Controls, Risk, Iran Reality, Devil, Chair.

فعال‌سازی پویا: خرابی ماشین → COO, Engineering, Project Control, Supply, CFO, Risk, Devil, Iran, Chair. CEO اگر بیش از یک پروژه متأثر شود.

خروجی هر نقش: stance, thesis, questions, veto. LLM فقط بازنویسی تفسیری با ورودی ساخت‌یافته.`,
  },
  {
    id: "gov",
    title: "۲۶–۲۷. حکمرانی هوش مصنوعی و توهم",
    body: `مجاز: توضیح علت اثر نقد، چالش Devil، پیش‌نویس نامه به کارفرما.
ممنوع: تولید عدد KPI، ساخت یال گراف، تغییر امتیاز.

کنترل توهم: Retrieval از JSON شبیه‌سازی، tool calling به موتور، منبع، confidence، تفکیک Fact/Assumption، audit.

اگر LLM نباشد: شورا روی متن قطعی نقش‌ها کار می‌کند. LLM نقطه شکست نیست.`,
  },
  {
    id: "dec",
    title: "۲۸–۳۰. بسته تصمیم، انسان، توضیح‌پذیری",
    body: `بسته: ID, Problem, State, Commitments, Scenario, Alternatives, Cost/Schedule/Cash/Risk/Strategic, Recommendation, Conditions, Confidence, Owner, Actions, Deadline.

Human-in-the-loop: Observe → Review → Challenge → Override → Approve → Execute.

Override ممیزی می‌شود. مدیر می‌تواند فرض، قید، اولویت و سناریو را عوض کند.

Trace: هر KPI به مسیر گراف وصل است (صفحه تحلیل اثر).`,
  },
  {
    id: "iran-m",
    title: "۳۲. مدل واقعیت ایران",
    body: `نه لیست کلی. تزریق به شبیه‌سازی:

FX +30٪ → cost of imported pump/resin ×1.3
Energy shortage p=0.35 → overtime compression × (1-p)
Sanctions lead-time +18..35d → Repair duration
Collection lag 90d → cash inflow day
Inflation 3.5٪/ماه → overtime labor

منابع (۲۰۲۶-۰۹-۰۵):
- Financial Tribune 2026-07-04: ارزش افزوده صنعت ۱۴۰۴ ٪۱.۵−؛ کسری برق پیک ~۱۴۷۰۰ MW
- IMF WEO Apr 2026: GDP 2026 ٪۶.۱−، CPI ٪۶۸.۹ (پیش‌بینی)
- نرخ ریال گزارش‌شده حدود ۱.۵–۱.۸ میلیون در دلار (ASSUMPTION مدل: ۱٫۵۰۰٫۰۰۰)`,
  },
  {
    id: "mvp-sel",
    title: "۳۳–۳۶. انتخاب پایلوت پارس",
    body: `امتیازدهی سناریوها (۰–۵):

| سناریو | ارزش | داده | پیچیدگی* | SAP | شبیه‌سازی | سنجش | ریسک پایلوت | جمع |
| A خرابی ماشین | ۵ | ۵ | ۴ | ۵ | ۵ | ۵ | ۴ | ۳۳ |
| B تأخیر ماده وارداتی | ۵ | ۳ | ۳ | ۴ | ۴ | ۴ | ۳ | ۲۶ |
| C قید نقد | ۴ | ۲ | ۳ | ۲ | ۳ | ۳ | ۳ | ۲۰ |
| D گلوگاه مهندسی | ۳ | ۲ | ۲ | ۲ | ۳ | ۲ | ۳ | ۱۷ |
| E شکست تأمین | ۴ | ۳ | ۳ | ۳ | ۳ | ۳ | ۳ | ۲۲ |
| F کاهش ظرفیت | ۳ | ۴ | ۳ | ۴ | ۴ | ۳ | ۳ | ۲۴ |
| G تأخیر مایل‌استون | ۴ | ۴ | ۲ | ۴ | ۳ | ۴ | ۴ | ۲۵ |
| H بازتخصیص چندپروژه | ۵ | ۴ | ۲ | ۴ | ۳ | ۳ | ۲ | ۲۳ |

*پیچیدگی: نمره بالاتر = ساده‌تر برای MVP.

انتخاب: A — خرابی VPI-01 به مدت ۲۰ روز روی پروژه فعال MGS72-SH2 واحد ۲.

چرا VPI نه تراش روتور؟ مخزن VPI در کارخانه‌های ژنراتور بزرگ معمولاً یکتاتر است، روی مسیر بحرانی عایق استاتور می‌نشیند، و جایگزین فیزیکی (VPI-02) ناقص است — دقیقاً مسئله تصمیم.

خروجی الزامی MVP در محصول زنده پیاده شده: عملیات/سفارش/مایل‌استون/تعهد متأثر + جدول ۴ مسیر + توصیه مشروط.`,
  },
  {
    id: "mvp-data",
    title: "۳۷. مجموعه داده MVP",
    body: `حداقل: Plant 1100, 3 projects, 5 WBS, 6 orders, 15 operations, 12 resources, 5 materials, 4 suppliers, 4 milestones, 6 commitments, 6 cash events.

مالک داده پایلوت: برنامه‌ریزی تولید (PP)، کنترل پروژه (PS)، خزانه، مهندسی عایق.

فرکانس: حادثه دستی + refresh ۴ساعته عملیات.`,
  },
  {
    id: "tech",
    title: "۳۸–۳۹. معماری فنی و پشته",
    body: `RECOMMENDED STACK MVP:
- UI: React + TanStack Router (همین محصول)
- Engine: TypeScript deterministic (قابل پورت به Python/OR-Tools بعداً)
- Canonical store (pilot): PostgreSQL
- Graph: relational abstraction
- Optimization: scored heuristics
- AI: xAI grok-4.5 فقط تفسیر، server-side
- Integration: SAP CDS CDC → staging (ODP/SLT) خواندنی
- Auth: SAP SSO / Keycloak در پایلوت؛ دمو بدون حساب
- Deploy Iran: on-prem VM پشت شبکه کارخانه

رد:
- SAP BTP اجباری (وابستگی اینترنت/حساب ابری)
- Neo4j در MVP
- Python شبیه‌سازی جدا در MVP (هزینه دو زمانه)

ایران: مهارت React/TS در دسترس‌تر از stack علمی سنگین برای اثبات ۸ هفته‌ای.`,
  },
  {
    id: "api",
    title: "۴۳. API",
    body: `GET /projects
GET /resources
GET /commitments
POST /scenarios  {resourceId, durationDays, profile}
POST /disruptions
POST /simulations
GET /simulations/{id}
POST /decisions
POST /decisions/{id}/approve | /override
GET /impact/{resourceId}
GET /project/{id}/critical-path

نمونه پاسخ شبیه‌سازی: {id, disruption, baseline, ranked[], recommendation, facts[], assumptions[], conditions[]}

رویدادها (اختیاری در MVP — polling کافی است): RESOURCE_UNAVAILABLE, COMMITMENT_AT_RISK, CASH_THRESHOLD_BREACH.

RECOMMENDED MVP: بدون bus. Event schema برای V1.2 آماده شود.`,
  },
  {
    id: "uiux",
    title: "۴۵–۴۶. UI/UX",
    body: `صفحات MVP در این محصول: داشبورد، پروژه، منبع، اثر، سناریو، شبیه‌سازی، بسته تصمیم، تاریخچه، گراف، نقد، معماری.

گراف برای توضیح تصمیم است. تزئینی نیست.`,
  },
  {
    id: "sec",
    title: "۳۶. امنیت و استقرار ایران",
    body: `On-prem پشت فایروال کارخانه. داده SAP هرگز به LLM خارجی به‌صورت خام مالی/قراردادی ارسال نشود — فقط KPI aggregat و متن نقش.

RBAC پایلوت: Viewer, Planner, CFO, Plant Manager, Admin.
رمزنگاری در حال سکون دیسک سرور، TLS داخل شبکه.
Secrets: SAP user فنی فقط خواندنی، در vault نه در گیت.
Audit: هر تصمیم با نسخه داده/مدل/فرض.

قطع اینترنت خارجی: موتور + UI + شورا قطعی زنده می‌مانند. تفسیر زبانی degrade می‌شود.

پشتیبان: dump روزانه Postgres + نسخه گراف.
DR: RPO ۲۴س، RTO ۸س برای MVP.`,
  },
  {
    id: "devplan",
    title: "۴۷–۴۸. برنامه توسعه و اسپرینت",
    body: `Sprint 0 (۱ هفته): محیط، RBAC، قرارداد CDS
Sprint 1: استخراج PP/PS فقط‌خواندنی
Sprint 2: مدل کانونیکال + کیفیت داده
Sprint 3: گراف batch
Sprint 4: انتشار اثر + Golden test
Sprint 5: چهار مسیر + امتیاز
Sprint 6: بسته تصمیم + ممیزی
Sprint 7: UI اتاق فرمان
Sprint 8: شورا + degrade بدون LLM
Sprint 9: پایلوت روی VPI با داده واقعی یک پروژه
Sprint 10: تثبیت KPI و آموزش مالک تصمیم

تیم پیشنهادی: ۱ معمار SAP PP/PS، ۱ داده، ۲ بک‌اند، ۱ فرانت، ۱ کنترل پروژه پارس، ۰.۵ امنیت.`,
  },
  {
    id: "test",
    title: "۴۹–۵۰. آزمون و سناریوی طلایی",
    body: `Golden: VPI-01 unavailable 20 days on in-progress OP-H2-VPI.
انتظار: affected operations ≥ ۵، پروژه‌ها ≥ ۲، تعهد واحد ۲ در ریسک، رتبه اول یکی از چهار مسیر اجرایی، توصیه GO یا CONDITIONAL GO، توضیح‌پذیری غیرتهی.

۲۰ مورد آزمون MVP:
1-4. استخراج AFVC/AFKO/CRHD/PROJ
5. orphan operation
6. duplicate natural key
7. VPI overlap
8. predecessor forward
9. penalty cap
10. cash lag
11. VPI-02 infeasible for stator
12. overtime energy derate
13. profile weight change re-ranks
14. LLM down still recommends
15. SAP down uses last snapshot
16. override audit
17. FX shock sensitivity
18. collection 90d
19. golden regression
20. UAT plant manager ≤ ۱۵ دقیقه تا بسته تصمیم`,
  },
  {
    id: "kpi",
    title: "۵۱–۵۲. موفقیت و ارزش",
    body: `PROPOSED TARGET (نه ادعا):
- صحت داده طبیعی key > ۹۸٪
- تشخیص عملیات متأثر > ۹۵٪ روی golden
- خطای پیش‌بینی تأخیر < ۳ روز روی پایلوت ۱۲ هفته
- پذیرش توصیه (تأیید یا override مستند) > ۷۰٪
- زمان تحلیل تصمیم < ۱۵ دقیقه

ارزش: زمان تصمیم، تأخیر اجتناب‌شده، جریمه اجتناب‌شده، نقد محافظت‌شده، ریسک آشکارشده.`,
  },
  {
    id: "out",
    title: "۵۳. خارج از دامنه MVP",
    body: `جایگزینی ERP/MRP/APS، دوقلوی دیجیتال کامل، تصمیم خودمختار، شبیه‌سازی کاملاً احتمالی، بهینه‌سازی پرتفوی کامل، نگهداری پیش‌بینانه کامل، عامل‌های سازمانی گسترده.`,
  },
  {
    id: "road",
    title: "۴۵. نقشه راه",
    body: `V1.1 Multi-project impact visible as default
V1.2 Cash-aware with real treasury
V1.3 Supplier risk distributions
V1.4 Portfolio optimization (CP)
V2 Decision intelligence + learning loop governed
V3 Predictive + closed-loop to SAP write (still human approved)`,
  },
  {
    id: "learn",
    title: "۵۵–۵۶. یادگیری و حافظه",
    body: `Forecast → Decision → Execution → Actual → Variance → Root cause → Versioned model update (نیاز به approver).

حافظه: Supplier A lead 15 vs actual 31 → بافر ایران.

بدون governance هیچ وزن یا lead time خودتغییر نیست.`,
  },
  {
    id: "nfr",
    title: "۵۷–۶۰. NFR، مشاهده‌پذیری، خطا، حالت تنزل",
    body: `Availability MVP: ۸×۵ کارخانه. Pilot: ۹۹٪ ساعت اداری.
Latency شبیه‌سازی سه پروژه < ۲ث.
SAP unavailable: last good snapshot + banner.
Incomplete routing: confidence low, still run.
LLM unavailable: council deterministic.
Missing cash: cash KPI disabled not blocking schedule.

Observability: data freshness, sim latency, graph build time, LLM fail rate, data quality score.`,
  },
  {
    id: "adr",
    title: "۶۱. ADRها",
    body: `ADR-001 MC is not MRP — MRP explodes demand; MC explains disruption.
ADR-002 Graph required — propagation is relational not tabular joins in UI.
ADR-003 Cash is a state variable — not only a resource bucket.
ADR-004 LLM is not a calculator.
ADR-005 Human remains final authority.
ADR-006 Day granularity in MVP.
ADR-007 Postgres/relational graph not Neo4j for Iran deploy.
ADR-008 Read-only SAP.
ADR-009 Four alternatives max in MVP.
ADR-010 Weighted score with profiles not single cost min.
ADR-011 VPI-01 golden scenario.
ADR-012 Synthetic data labeled ASSUMPTION.
ADR-013 Iran layer coupled to equations.
ADR-014 On-prem first.
ADR-015 No write-back to SAP in v1.
ADR-016 Council after optimization.
ADR-017 Offline core.
ADR-018 Penalty cap from contract not unlimited.
ADR-019 VPI-02 not a full alternative for 376 MW stator.
ADR-020 Event bus deferred.`,
  },
  {
    id: "risks",
    title: "۶۲. ریسک پروژه",
    body: `| ریسک | P | I | کاهش |
| داده SAP ناقص routing | M | H | quarantine + engineering fill |
| خزانه موجود نیست | H | M | فایل CSV و KPI جدا |
| مقاومت سازمانی «ERP دوم» | M | H | اصل سه‌نظامی در آموزش |
| قطع اینترنت LLM | M | L | degrade |
| اشتباه فنی VPI-02 | M | H | validation مهندسی |
| تحریم قطعه در خود پایلوت | L | M | سناریو واقعی‌تر می‌شود |
| انتظار تصمیم خودمختار | M | H | UI انسان‌محور |`,
  },
  {
    id: "verdict",
    title: "۶۳ و ۷۲. حکم و معیار موفقیت",
    body: `Product concept: GO
Architecture: GO
Technology: CONDITIONAL GO (on-prem Postgres + TS engine; LLM optional)
MVP: GO
MAPNA Pars pilot: CONDITIONAL GO — منوط به دسترسی خواندنی PP/PS و یک مالک تصمیم در کارخانه.

آیا MC می‌تواند در پروژه واقعی پارس با داده SAP وقتی منبع بحرانی مختل می‌شود اثر را تا تعهد و نقد حساب کند و حداقل یک مسیر جایگزین قابل دفاع بدهد؟

YES — به شرط جایگزینی seed با استخراج واقعی. موتور، گراف، چهار مسیر، شورا و بسته تصمیم در این MVP پیاده شده‌اند. آنچه باقی است اتصال Truth Layer به SAP زنده است نه اختراع الگوریتم.`,
  },
  {
    id: "start",
    title: "Developer Start Here",
    body: `| Order | Component | Start With | Depends On | Deliverable |
| 1 | Truth snapshot | CDS I_ManufacturingOrder + operations | SAP read user | staging tables |
| 2 | Canonical map | این سند بخش ۱۴ | snapshot | mapped JSON |
| 3 | Graph build | graph.ts rules | canonical | nodes/edges |
| 4 | Golden disrupt | VPI-01 20d | graph | baseline KPI |
| 5 | Alternatives | simulate.ts | baseline | 4 results |
| 6 | Score | weights.ts | results | rank |
| 7 | Decision UI | /decision | rank | package |
| 8 | Council | council.ts | package | opinions |
| 9 | Audit | /history | human action | trail |
| 10 | UAT | plant manager | all | <15 min path |

First 10 tasks:
1. Confirm plant 1100 work centers in CRHD
2. List open AFKO for MGS72 unit
3. Pull AFVC for those orders
4. Map ARBID to VPI
5. Load PROJ/PRPS/MLST
6. Build graph and dump orphans
7. Run golden
8. Review numbers with planner
9. Lock weights with CFO/COO
10. Schedule UAT on shop-floor office`,
  },
  {
    id: "premortem",
    title: "۷۰. Premortem — اگر MVP پس از ۶ ماه شکست خورد",
    body: `1. SAP extract never left IT backlog — Early: no staging in 30 days — Prevent: executive sponsor + read-only RFC freeze.
2. Treated as BI dashboard — Early: users ask for more charts — Prevent: hide vanity KPIs.
3. LLM hallucinated a cost — Early: number without trace — Prevent: renderer forbids uncited figures.
4. VPI-02 modelled wrong — Early: engineering dispute — Prevent: workshop day 0.
5. Cash module blocked go-live — Early: treasury data war — Prevent: cash optional KPI.
6. No decision owner — Early: packages unsigned — Prevent: named plant manager.
7. Change-the-ERP politics — Early: steering asks write-back — Prevent: ADR-015.
8. Over-scoped to portfolio MIP — Early: sprint 3 optimizer debate — Prevent: four alts only.
9. Data quality orphans ignored — Early: empty traces — Prevent: quarantine dashboard.
10. Iran layer became a slide — Early: FX not in formula — Prevent: coupling tests.
11. Training skipped — Early: planners revert to Excel — Prevent: UAT is the training.
12. Performance after 200 orders — Early: >2s sim — Prevent: subgraph by plant.
13. Security review late — Early: SAP audit findings — Prevent: read-only service account first.
14. Golden test broken silently — Early: no CI — Prevent: golden in pipeline.
15. Success undefined — Early: «feels useful» — Prevent: 15-min + acceptance rate.

حکم نهایی معمار: CONDITIONAL GO. بسازید کوچک، روی VPI، با SAP خواندنی، با انسان در حلقه.`,
  },
];

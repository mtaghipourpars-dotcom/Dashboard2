/**
 * Iran Operating Reality Model — not a generic country-risk list.
 * Each factor has a simulation coupling: how it actually changes the graph.
 *
 * Sources (retrieved 2026-09-05):
 * - Financial Tribune, 2026-07-04: industrial value-added −1.5% in 1404; electricity peak shortfall ~14,700 MW.
 * - IMF WEO Apr 2026: GDP −6.1% (2026), CPI 68.9% (projection).
 * - AP / research: ~20,000 factories damaged in 2026 conflict reporting (treat as external, validate).
 * - Rial: ~1.5–1.8 million per USD in H1 2026 reporting (ASSUMPTION: use 1,500,000).
 */

export type IranFactor = {
  id: string;
  nameFa: string;
  nameEn: string;
  probability: number;
  impact: "low" | "medium" | "high" | "severe";
  detectability: "high" | "medium" | "low";
  mitigationFa: string;
  /** How this factor is injected into simulation. */
  couplingFa: string;
  kind: "fact" | "inference" | "assumption";
  source: string;
};

export const IRAN_FACTORS: IranFactor[] = [
  {
    id: "fx",
    nameFa: "نوسان نرخ ارز",
    nameEn: "FX volatility",
    probability: 0.7,
    impact: "high",
    detectability: "high",
    mitigationFa: "قرارداد ریالی با تأمین داخلی؛ پیش‌خرید رزین؛ سقف تعهد ارزی",
    couplingFa: "هزینه مواد وارداتی × (1 + ΔFX). در شبیه‌سازی برون‌سپاری و قطعات یدکی پمپ خلاء اعمال می‌شود.",
    kind: "fact",
    source: "گزارش‌های بازار آزاد ۱۴۰۴–۱۴۰۵؛ IMF WEO آوریل ۲۰۲۶",
  },
  {
    id: "inflation",
    nameFa: "تورم نهاده و دستمزد",
    nameEn: "Input & wage inflation",
    probability: 0.8,
    impact: "high",
    detectability: "high",
    mitigationFa: "قرارداد اضافه کاری با نرخ ثابت کوتاه‌مدت؛ بازنگری هفتگی بهای تمام‌شده",
    couplingFa: "هزینه اضافه کاری و تعمیر محلی با ضریب تورم ماهانه مدل می‌شود (پیش‌فرض ۳٫۵٪ در ماه).",
    kind: "fact",
    source: "مرکز آمار ایران؛ CPI نقطه‌به‌نقطه گزارش‌شده در ۱۴۰۴–۱۴۰۵",
  },
  {
    id: "sanctions",
    nameFa: "تحریم و کانال واسطه تأمین",
    nameEn: "Sanctions / intermediary supply",
    probability: 0.9,
    impact: "severe",
    detectability: "medium",
    mitigationFa: "موجودی ایمنی رزین و پمپ یدکی؛ ساخت داخل پمپ خلاء",
    couplingFa: "Lead time قطعات وارداتی +۱۲ تا +۴۵ روز نسبت به SAP standard. در گزینه Repair اعمال می‌شود.",
    kind: "fact",
    source: "محدودیت‌های بانکی و واردات صنعتی ایران — شرایط ساختاری",
  },
  {
    id: "import",
    nameFa: "وابستگی به قطعه و رزین وارداتی",
    nameEn: "Import dependency",
    probability: 0.85,
    impact: "high",
    detectability: "high",
    mitigationFa: "جایگزین رزین داخلی با آزمون IEC؛ دو منبع تأمین",
    couplingFa: "گره Material با importDependent=true → تأخیر تأمین به Operation REQUIRES تزریق می‌شود.",
    kind: "inference",
    source: "فرایند VPI ژنراتورهای کلاس F نیازمند رزین اپوکسی با گواهی IEC",
  },
  {
    id: "energy",
    nameFa: "کسری برق و محدودیت شیفت شب",
    nameEn: "Electricity shortage",
    probability: 0.55,
    impact: "high",
    detectability: "medium",
    mitigationFa: "دیزل اضطراری برای VPI/کوره؛ پرهیز از اتکا به شیفت سوم در تابستان",
    couplingFa: "گزینه Overtime: با احتمال قطع شب، فشرده‌سازی زمان × (1 − p_outage). FACT: کسری پیک حدود ۱۴٫۷ گیگاوات در برآورد ۱۴۰۴.",
    kind: "fact",
    source: "Financial Tribune 2026-07-04؛ مرکز پژوهش‌های مجلس — کسری برق",
  },
  {
    id: "receivable",
    nameFa: "تأخیر وصول مطالبات کارفرمای دولتی",
    nameEn: "Government receivable lag",
    probability: 0.65,
    impact: "high",
    detectability: "medium",
    mitigationFa: "پیش‌دریافت قراردادی؛ جریمه‌های تأخیر پرداخت در قرارداد",
    couplingFa: "Cash inflow = invoice × P(collection) با تأخیر collectionLagDays (پیش‌فرض ۹۰ روز).",
    kind: "assumption",
    source: "الگوی سرمایه در گردش پروژه‌های نیروگاهی ایران — باید در پایلوت با خزانه مپنا اعتبارسنجی شود",
  },
  {
    id: "banking",
    nameFa: "محدودیت انتقال وجه و گشایش",
    nameEn: "Banking / LC restrictions",
    probability: 0.6,
    impact: "high",
    detectability: "low",
    mitigationFa: "پرداخت از طریق شرکت‌های گروه در حوزه freely tradable؛ پیش‌پرداخت ریالی به واسطه",
    couplingFa: "برون‌سپاری خارجی یا خرید قطعه: +lag بانکی و احتمال شکست پرداخت.",
    kind: "inference",
    source: "محدودیت نظام بانکی ایران در تراکنش‌های ارزی",
  },
  {
    id: "customs",
    nameFa: "تأخیر ثبت سفارش و گمرک",
    nameEn: "Customs / order registration",
    probability: 0.5,
    impact: "medium",
    detectability: "medium",
    mitigationFa: "ثبت سفارش پیش‌دستانه برای قطعات بحرانی VPI",
    couplingFa: "Lead time وارداتی += توزیع یکنواخت ۸–۴۰ روز (گمرک).",
    kind: "fact",
    source: "Financial Tribune 2026-07-04: تأخیر ثبت سفارش و تخصیص ارز",
  },
];

export const IRAN_DEFAULTS = {
  fxShockPct: 0.3,
  monthlyInflationPct: 0.035,
  importLeadTimeBufferDays: 18,
  energyNightShiftFailProb: 0.35,
  governmentCollectionLagDays: 90,
  collectionProbability: 0.82,
};

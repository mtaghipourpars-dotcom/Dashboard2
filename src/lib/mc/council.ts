import type {
  AlternativeResult,
  CouncilOpinion,
  CouncilRoleId,
  Disruption,
  SimulationRun,
} from "./types";

const ROLE_TITLE: Record<CouncilRoleId, string> = {
  ceo: "مدیرعامل — ارزش بنگاه",
  cfo: "مدیر مالی — نقد و حاشیه",
  coo: "مدیر عملیات — اجرا و ظرفیت",
  engineering: "مدیر مهندسی — امکان فنی",
  supply: "مدیر زنجیره تأمین",
  commercial: "مدیر بازرگانی — مشتری و قرارداد",
  project_controls: "کنترل پروژه — زمان و هزینه",
  risk: "مسئول ریسک",
  iran: "افسر واقعیت ایران",
  devil: "وکیل منتقد",
  chair: "رئیس شورا — جمع‌بندی",
};

export function activateRoles(disruption: Disruption, rec: AlternativeResult): CouncilRoleId[] {
  const roles: CouncilRoleId[] = ["coo", "project_controls", "risk", "devil", "chair"];
  if (disruption.resourceId.startsWith("WC-")) roles.unshift("engineering");
  if (rec.kpi.cashDeltaIrr < 0 || rec.kpi.costIrr > 5e9) roles.splice(2, 0, "cfo");
  if (rec.delayedCommitments.some((c) => c.delayDays > 0)) roles.push("commercial");
  if (rec.alternative.id === "outsource" || rec.alternative.fxExposureIrr > 0) roles.push("supply");
  roles.push("iran");
  if (rec.alternative.id === "reallocate" || rec.delayedProjects.length > 1) roles.push("ceo");
  return [...new Set(roles)];
}

export function conveneCouncil(sim: SimulationRun): CouncilOpinion[] {
  const rec = sim.recommendation;
  const base = sim.baseline;
  const roles = activateRoles(sim.disruption, rec);
  const delay = rec.kpi.delayDays;
  const baseDelay = base.kpi.delayDays;
  const saved = baseDelay - delay;

  const byRole: Partial<Record<CouncilRoleId, () => CouncilOpinion>> = {
    ceo: () => ({
      role: "ceo",
      titleFa: ROLE_TITLE.ceo,
      stance: rec.delayedProjects.length > 1 ? "condition" : "support",
      thesisFa: `واحد ۲ کلاس F هویت صنعتی پارس است. حفاظت از آن بر بهینه‌سازی محلی ظرفیت اولویت دارد. تأخیر ${delay} روز در برابر ${baseDelay} روز پایه قابل دفاع است اگر MGS58 مدیریت قرارداد شود.`,
      questionsFa: ["آیا هیئت‌مدیره گروه از جابه‌جایی اولویت MGS58 مطلع است؟"],
      veto: false,
    }),
    cfo: () => ({
      role: "cfo",
      titleFa: ROLE_TITLE.cfo,
      stance: rec.kpi.costIrr > 30e9 ? "challenge" : "support",
      thesisFa: `اثر نقدینگی ${Math.round(rec.kpi.cashDeltaIrr / 1e9)} میلیارد ریال است. جریمه پایه ${Math.round(base.kpi.penaltyIrr / 1e9)} میلیارد در برابر هزینه اقدام ${Math.round(rec.alternative.extraCostIrr / 1e9)} میلیارد.`,
      questionsFa: ["آیا پرداخت پیمانکار از سقف تنخواه کارخانه خارج می‌شود؟", "شوک ارز روی قطعه پمپ چقدر قطعی است؟"],
      veto: rec.kpi.cashDeltaIrr < -120e9,
      vetoReasonFa: rec.kpi.cashDeltaIrr < -120e9 ? "کسری نقد پیش‌بینی‌شده حقوق شهریور را تهدید می‌کند" : undefined,
    }),
    coo: () => ({
      role: "coo",
      titleFa: ROLE_TITLE.coo,
      stance: "support",
      thesisFa: `VPI-01 منبع یکتای استاتورهای بزرگ است. صف سه پروژه روی یک مخزن است. ${rec.alternative.nameFa} تنها مسیر اجرایی با ظرفیت واقعی کارخانه است.`,
      questionsFa: ["آیا اپراتورهای VPI برای سه‌شیفت موجودند؟"],
      veto: false,
    }),
    engineering: () => ({
      role: "engineering",
      titleFa: ROLE_TITLE.engineering,
      stance: rec.alternative.id === "outsource" ? "challenge" : "support",
      thesisFa:
        rec.alternative.id === "outsource"
          ? "استاتور هیدروژن‌خنک کلاس F پس از جاگذاری شینه نباید بدون پروتکل کنترل رطوبت و خلاء جابه‌جا شود. پیمانکار باید سیکل IEC را تکرار کند."
          : "تعمیر پمپ خلاء از نظر فنی استاندارد است. VPI-02 از نظر قطر استاتور ۳۷۶ MW را نمی‌پذیرد — فقط شینه.",
      questionsFa: ["گواهی رزین پیمانکار با کلاس H محصول ما یکی است؟"],
      veto: false,
    }),
    supply: () => ({
      role: "supply",
      titleFa: ROLE_TITLE.supply,
      stance: "condition",
      thesisFa: "قطعه پمپ از کانال واسطه آلمان با تأخیر معمول ۳۵ روز SAP lead-time را رد می‌کند. مسیر تعمیر ۲۰روزه تنها با موجودی اضطراری یا cannibalize ممکن است.",
      questionsFa: ["PO باز برای پمپ یدکی داریم؟"],
      veto: false,
    }),
    commercial: () => ({
      role: "commercial",
      titleFa: ROLE_TITLE.commercial,
      stance: saved >= 5 ? "support" : "challenge",
      thesisFa: `جریمه قراردادی واحد ۲ روزانه ۴٫۲۷۵ میلیارد ریال است. ذخیره ${saved} روز تحویل، تعهد سخت را از نقض قطعی به ناحیه مدیریت‌پذیر می‌برد.`,
      questionsFa: ["آیا کارفرما بند force majeure برای خرابی ماشین را می‌پذیرد؟"],
      veto: false,
    }),
    project_controls: () => ({
      role: "project_controls",
      titleFa: ROLE_TITLE.project_controls,
      stance: "support",
      thesisFa: `مسیر بحرانی از VPI → پخت → مونتاژ → تست هیدروژن می‌گذرد. شناوری استاتور واحد ۲ صفر است. تأخیر VPI یک‌به‌یک به FAT می‌رسد.`,
      questionsFa: ["برنامه زمان‌بندی PS پس از تصمیم باید در همان روز به‌روز شود."],
      veto: false,
    }),
    risk: () => ({
      role: "risk",
      titleFa: ROLE_TITLE.risk,
      stance: "challenge",
      thesisFa: `ریسک اجرا ${Math.round(rec.kpi.executionRisk * 100)}٪ و ریسک کیفیت ${Math.round(rec.alternative.qualityRisk * 100)}٪. بدترین حالت: شکست اقدام + تأخیر پایه.`,
      questionsFa: ["طرح احتیاط اگر اقدام تا روز ۵ نتیجه نداد چیست؟"],
      veto: rec.kpi.executionRisk > 0.7,
    }),
    iran: () => ({
      role: "iran",
      titleFa: ROLE_TITLE.iran,
      stance: rec.alternative.id === "overtime" ? "challenge" : "condition",
      thesisFa:
        rec.alternative.id === "overtime"
          ? "کسری برق تابستان/اوج مصرف شیفت سوم را نامطمئن می‌کند. تصمیم مبتنی بر سه‌شیفت بدون دیزل، تصمیم روی کاغذ است."
          : "تحریم، گمرک و ارز باید در lead time قطعه دیده شود نه در ستون خوش‌بینانه SAP.",
      questionsFa: ["ذخیره گازوئیل دیزل کارخانه چند ساعت VPI را پوشش می‌دهد؟"],
      veto: false,
    }),
    devil: () => ({
      role: "devil",
      titleFa: ROLE_TITLE.devil,
      stance: "challenge",
      thesisFa: `اگر توصیه غلط باشد: هزینه اقدام سوخت می‌شود، کیفیت استاتور کلاس F آسیب می‌بیند، و تأخیر از پایه بدتر می‌شود. مدل، احتمال شکست پیمانکار و قطع برق را کامل توزیع نکرده — سطح ۲ سناریو است نه سطح ۳ احتمالی.`,
      questionsFa: [
        "چرا گزینه «توقف واحد ۲ و تحویل MGS58» اصلاً در مجموعه شدنی‌ها نیست؟",
        "آیا عدد امتیاز فقط بازتاب وزن پروفایل مشتری راهبردی است؟",
      ],
      veto: false,
    }),
    chair: () => ({
      role: "chair",
      titleFa: ROLE_TITLE.chair,
      stance: sim.recommendationKind === "conditional_go" ? "condition" : "support",
      thesisFa: `بسته تصمیم: ${sim.recommendationKind === "conditional_go" ? "GO مشروط" : "GO"} — ${rec.alternative.nameFa}. انسان تصمیم می‌گیرد. شرایط در بسته تصمیم قید شود.`,
      questionsFa: ["مالک تصمیم کیست و مهلت اعلام تا کی است؟"],
      veto: false,
    }),
  };

  return roles.map((r) => byRole[r]!());
}

export { ROLE_TITLE };

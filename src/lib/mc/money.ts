/** Display helpers. Amounts are stored in IRR (ریال). */

export const FX_IRR_PER_USD = 1_500_000;
/** ASSUMPTION: mid-2026 free-market proxy. Validation required in pilot. */

export function formatIrr(amount: number): string {
  const billion = amount / 1_000_000_000;
  const abs = Math.abs(billion);
  const sign = billion < 0 ? "−" : "";
  const formatted =
    abs >= 100
      ? abs.toFixed(0)
      : abs >= 10
        ? abs.toFixed(1)
        : abs.toFixed(2);
  return `${sign}${toFaDigits(formatted)} میلیارد ریال`;
}

export function formatIrrCompact(amount: number): string {
  const billion = amount / 1_000_000_000;
  const sign = billion < 0 ? "−" : "";
  return `${sign}${toFaDigits(Math.abs(billion).toFixed(billion >= 10 || billion <= -10 ? 0 : 1))}`;
}

export function formatUsd(amountIrr: number): string {
  const usd = amountIrr / FX_IRR_PER_USD;
  const millions = usd / 1_000_000;
  return `$${millions.toFixed(2)}M`;
}

export function formatDays(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${toFaDigits(String(Math.abs(n)))} روز`;
}

export function toFaDigits(value: string | number): string {
  const s = String(value);
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return s.replace(/\d/g, (d) => map[Number(d)] ?? d);
}

export function formatPct(n: number): string {
  return `${toFaDigits((n * 100).toFixed(0))}٪`;
}

/** Gregorian day offset from 2026-09-05 → Jalali display. FACT: 2026-09-05 = 1405/06/14. */
export const BASE_ISO = "2026-09-05";
export const BASE_JALALI = { y: 1405, m: 6, d: 14 };

export function dayToJalali(day: number): string {
  const start = Date.UTC(2026, 8, 5);
  const dt = new Date(start + day * 86400000);
  const gY = dt.getUTCFullYear();
  const gM = dt.getUTCMonth() + 1;
  const gD = dt.getUTCDate();
  const [jy, jm, jd] = gregorianToJalali(gY, gM, gD);
  return `${toFaDigits(jy)}/${toFaDigits(String(jm).padStart(2, "0"))}/${toFaDigits(String(jd).padStart(2, "0"))}`;
}

function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  let gy2 = gy <= 1600 ? gy - 621 : gy - 1600;
  const gyMinus = gm > 2 ? gy2 + 1 : gy2;
  let days =
    365 * gy2 +
    Math.floor((gyMinus + 3) / 4) -
    Math.floor((gyMinus + 99) / 100) +
    Math.floor((gyMinus + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

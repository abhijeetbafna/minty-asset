import type { NumberFormatType } from "@/types/database.types";

export interface CurrencyFormatOptions {
  symbol?: string;
  format?: NumberFormatType;
  showDecimals?: boolean;
  signDisplay?: "auto" | "always" | "never";
}

/**
 * Formats a number using the Indian numbering system (Lakhs / Crores)
 * Format pattern: Last 3 digits grouped, then every 2 digits (e.g. 12,34,567.89)
 */
export function formatIndianNumber(val: number, showDecimals = true): string {
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const parts = absVal.toFixed(showDecimals ? 2 : 0).split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1];

  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    integerPart = formattedOthers + "," + lastThree;
  }

  const result = showDecimals && decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  return isNegative ? `-${result}` : result;
}

/**
 * Formats a number using the International standard (Thousands / Millions / Billions)
 */
export function formatInternationalNumber(val: number, showDecimals = true): string {
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const parts = absVal.toFixed(showDecimals ? 2 : 0).split(".");
  let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimalPart = parts[1];

  const result = showDecimals && decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  return isNegative ? `-${result}` : result;
}

/**
 * Main currency formatter with configurable currency symbol and numbering mode
 */
export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {}
): string {
  const {
    symbol = "₹",
    format = "lakh_crore",
    showDecimals = true,
    signDisplay = "auto",
  } = options;

  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0.00`;
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formattedNumber =
    format === "lakh_crore"
      ? formatIndianNumber(absAmount, showDecimals)
      : formatInternationalNumber(absAmount, showDecimals);

  let prefix = "";
  if (signDisplay === "always") {
    prefix = isNegative ? "-" : "+";
  } else if (isNegative) {
    prefix = "-";
  }

  return `${prefix}${symbol}${formattedNumber}`;
}

/**
 * Compact currency notation for charts, badges, and tight UI cards
 * E.g., ₹1.25 Cr, ₹35.4 L, ₹80 K
 */
export function formatCompactCurrency(
  amount: number,
  symbol = "₹",
  format: NumberFormatType = "lakh_crore"
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0`;
  }

  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const sign = isNegative ? "-" : "";

  if (format === "lakh_crore") {
    if (abs >= 10000000) {
      // 1 Crore = 10,000,000
      const cr = abs / 10000000;
      return `${sign}${symbol}${cr.toFixed(cr >= 10 ? 1 : 2)} Cr`;
    }
    if (abs >= 100000) {
      // 1 Lakh = 100,000
      const lk = abs / 100000;
      return `${sign}${symbol}${lk.toFixed(lk >= 10 ? 1 : 2)} L`;
    }
    if (abs >= 1000) {
      const k = abs / 1000;
      return `${sign}${symbol}${k.toFixed(1)} K`;
    }
    return `${sign}${symbol}${abs.toFixed(0)}`;
  } else {
    // International standard
    if (abs >= 1000000000) {
      const b = abs / 1000000000;
      return `${sign}${symbol}${b.toFixed(1)}B`;
    }
    if (abs >= 1000000) {
      const m = abs / 1000000;
      return `${sign}${symbol}${m.toFixed(1)}M`;
    }
    if (abs >= 1000) {
      const k = abs / 1000;
      return `${sign}${symbol}${k.toFixed(1)}K`;
    }
    return `${sign}${symbol}${abs.toFixed(0)}`;
  }
}

import assert from "node:assert";
import {
  formatIndianNumber,
  formatInternationalNumber,
  formatCurrency,
  formatCompactCurrency,
} from "../src/lib/formatters/currency.ts";
import {
  getFiscalYearFromDate,
  resolvePeriodDateRange,
  isDateWithinPeriod,
} from "../src/lib/date/period.ts";

console.log("--------------------------------------------------");
console.log("Running Phase 2 Engine & Localization Test Suite...");
console.log("--------------------------------------------------");

// 1. Test Indian Number Formatting
console.log("Test 1: Indian Number Formatting (Lakhs & Crores)");
assert.strictEqual(formatIndianNumber(0), "0.00");
assert.strictEqual(formatIndianNumber(500), "500.00");
assert.strictEqual(formatIndianNumber(1000), "1,000.00");
assert.strictEqual(formatIndianNumber(10000), "10,000.00");
assert.strictEqual(formatIndianNumber(100000), "1,00,000.00"); // 1 Lakh
assert.strictEqual(formatIndianNumber(1234567.89), "12,34,567.89"); // 12.34 Lakhs
assert.strictEqual(formatIndianNumber(10000000), "1,00,00,000.00"); // 1 Crore
assert.strictEqual(formatIndianNumber(123456789.5), "12,34,56,789.50"); // 12.34 Crores
assert.strictEqual(formatIndianNumber(-100000), "-1,00,000.00");
console.log("✓ All Indian number formatting tests passed.");

// 2. Test Currency & Compact Notation
console.log("Test 2: Currency & Compact Formatter");
assert.strictEqual(formatCurrency(1234567, { symbol: "₹", format: "lakh_crore" }), "₹12,34,567.00");
assert.strictEqual(formatCurrency(1234567, { symbol: "$", format: "million_billion" }), "$1,234,567.00");
assert.strictEqual(formatCompactCurrency(15000000, "₹", "lakh_crore"), "₹1.50 Cr");
assert.strictEqual(formatCompactCurrency(1250000, "₹", "lakh_crore"), "₹12.5 L");
assert.strictEqual(formatCompactCurrency(45000, "₹", "lakh_crore"), "₹45.0 K");
console.log("✓ All currency and compact notation tests passed.");

// 3. Test Fiscal Year (April-March Standard for India)
console.log("Test 3: Financial Year Date Calculation");
// April 2024 -> FY 2024-25
const apr2024 = getFiscalYearFromDate(new Date(2024, 3, 1), 4);
assert.strictEqual(apr2024.fyLabel, "FY 2024-25");
assert.strictEqual(apr2024.startYear, 2024);

// November 2024 -> FY 2024-25
const nov2024 = getFiscalYearFromDate(new Date(2024, 10, 15), 4);
assert.strictEqual(nov2024.fyLabel, "FY 2024-25");

// January 2025 -> FY 2024-25
const jan2025 = getFiscalYearFromDate(new Date(2025, 0, 10), 4);
assert.strictEqual(jan2025.fyLabel, "FY 2024-25");

// March 2025 -> FY 2024-25
const mar2025 = getFiscalYearFromDate(new Date(2025, 2, 31), 4);
assert.strictEqual(mar2025.fyLabel, "FY 2024-25");

// April 2025 -> FY 2025-26
const apr2025 = getFiscalYearFromDate(new Date(2025, 3, 1), 4);
assert.strictEqual(apr2025.fyLabel, "FY 2025-26");
assert.strictEqual(apr2025.startYear, 2025);
console.log("✓ All Financial Year boundary tests passed.");

// 4. Test Period Range Resolution
console.log("Test 4: Period Range Resolution & Filter Checking");
const resolvedFY = resolvePeriodDateRange({ type: "financial_year", financialYearStart: 2024 }, 4);
assert.strictEqual(resolvedFY.startDateStr, "2024-04-01");
assert.strictEqual(resolvedFY.endDateStr, "2025-03-31");
assert.strictEqual(resolvedFY.label, "FY 2024-25");

assert.strictEqual(isDateWithinPeriod("2024-06-15", { type: "financial_year", financialYearStart: 2024 }, 4), true);
assert.strictEqual(isDateWithinPeriod("2025-02-28", { type: "financial_year", financialYearStart: 2024 }, 4), true);
assert.strictEqual(isDateWithinPeriod("2025-05-01", { type: "financial_year", financialYearStart: 2024 }, 4), false);
console.log("✓ All date interval inclusion tests passed.");

console.log("--------------------------------------------------");
console.log("100% OF TESTS PASSED SUCCESSFULLY! ✓");
console.log("--------------------------------------------------");

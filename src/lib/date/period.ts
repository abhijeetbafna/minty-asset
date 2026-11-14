import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
  isWithinInterval,
} from "date-fns";

export type PeriodType = "financial_year" | "calendar_year" | "month" | "custom";

export interface PeriodFilter {
  type: PeriodType;
  financialYearStart?: number; // e.g. 2024 for FY 2024-25
  calendarYear?: number;       // e.g. 2024
  monthYear?: { year: number; month: number }; // month: 1-12
  customRange?: { from: string; to: string };  // YYYY-MM-DD
}

export interface ResolvedDateRange {
  startDate: Date;
  endDate: Date;
  startDateStr: string; // YYYY-MM-DD
  endDateStr: string;   // YYYY-MM-DD
  label: string;
}

/**
 * Calculates the Fiscal Year label and boundaries for a given date
 * @param date Target date
 * @param fyStartMonth Month that begins the FY (1 = Jan, 4 = Apr). Defaults to 4.
 */
export function getFiscalYearFromDate(date: Date, fyStartMonth = 4): {
  fyLabel: string;
  startYear: number;
  startDate: Date;
  endDate: Date;
} {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12

  let startYear: number;
  if (month >= fyStartMonth) {
    startYear = year;
  } else {
    startYear = year - 1;
  }

  const endYear = startYear + 1;
  const startDate = new Date(startYear, fyStartMonth - 1, 1, 0, 0, 0, 0);

  // End date is the last day of the month preceding fyStartMonth in endYear
  const endMonth = fyStartMonth === 1 ? 12 : fyStartMonth - 1;
  const targetEndYear = fyStartMonth === 1 ? startYear : endYear;
  const endDate = endOfMonth(new Date(targetEndYear, endMonth - 1, 1));
  endDate.setHours(23, 59, 59, 999);

  const nextYearShort = String(endYear).slice(-2);
  const fyLabel = `FY ${startYear}-${nextYearShort}`;

  return { fyLabel, startYear, startDate, endDate };
}

/**
 * Returns a list of recent Financial Years for dropdowns
 */
export function getAvailableFiscalYears(
  fyStartMonth = 4,
  count = 6
): Array<{ label: string; startYear: number }> {
  const current = getFiscalYearFromDate(new Date(), fyStartMonth);
  const list: Array<{ label: string; startYear: number }> = [];

  for (let i = 0; i < count; i++) {
    const y = current.startYear - i;
    const nextYShort = String(y + 1).slice(-2);
    list.push({
      label: `FY ${y}-${nextYShort}`,
      startYear: y,
    });
  }

  return list;
}

/**
 * Returns a list of recent Calendar Years
 */
export function getAvailableCalendarYears(count = 6): number[] {
  const currentYear = new Date().getFullYear();
  const list: number[] = [];
  for (let i = 0; i < count; i++) {
    list.push(currentYear - i);
  }
  return list;
}

/**
 * Resolves any PeriodFilter into clean [startDate, endDate] boundaries
 */
export function resolvePeriodDateRange(
  filter: PeriodFilter,
  fyStartMonth = 4
): ResolvedDateRange {
  const today = new Date();

  switch (filter.type) {
    case "financial_year": {
      const startYear =
        filter.financialYearStart ?? getFiscalYearFromDate(today, fyStartMonth).startYear;
      const endYear = startYear + 1;
      const startDate = new Date(startYear, fyStartMonth - 1, 1, 0, 0, 0, 0);

      const endMonth = fyStartMonth === 1 ? 12 : fyStartMonth - 1;
      const targetEndYear = fyStartMonth === 1 ? startYear : endYear;
      const endDate = endOfMonth(new Date(targetEndYear, endMonth - 1, 1));
      endDate.setHours(23, 59, 59, 999);

      const label = `FY ${startYear}-${String(endYear).slice(-2)}`;
      return {
        startDate,
        endDate,
        startDateStr: format(startDate, "yyyy-MM-dd"),
        endDateStr: format(endDate, "yyyy-MM-dd"),
        label,
      };
    }

    case "calendar_year": {
      const year = filter.calendarYear ?? today.getFullYear();
      const startDate = startOfYear(new Date(year, 0, 1));
      const endDate = endOfYear(new Date(year, 11, 31));
      endDate.setHours(23, 59, 59, 999);

      return {
        startDate,
        endDate,
        startDateStr: format(startDate, "yyyy-MM-dd"),
        endDateStr: format(endDate, "yyyy-MM-dd"),
        label: `CY ${year}`,
      };
    }

    case "month": {
      const year = filter.monthYear?.year ?? today.getFullYear();
      const month = filter.monthYear?.month ?? today.getMonth() + 1;
      const startDate = startOfMonth(new Date(year, month - 1, 1));
      const endDate = endOfMonth(new Date(year, month - 1, 1));
      endDate.setHours(23, 59, 59, 999);

      return {
        startDate,
        endDate,
        startDateStr: format(startDate, "yyyy-MM-dd"),
        endDateStr: format(endDate, "yyyy-MM-dd"),
        label: format(startDate, "MMMM yyyy"),
      };
    }

    case "custom": {
      if (filter.customRange?.from && filter.customRange?.to) {
        const startDate = parseISO(filter.customRange.from);
        startDate.setHours(0, 0, 0, 0);
        const endDate = parseISO(filter.customRange.to);
        endDate.setHours(23, 59, 59, 999);

        return {
          startDate,
          endDate,
          startDateStr: filter.customRange.from,
          endDateStr: filter.customRange.to,
          label: `${format(startDate, "dd MMM yyyy")} – ${format(endDate, "dd MMM yyyy")}`,
        };
      }

      // Default fallback to current fiscal year
      return resolvePeriodDateRange({ type: "financial_year" }, fyStartMonth);
    }
  }
}

/**
 * Checks if a given date string (YYYY-MM-DD) falls within the selected period
 */
export function isDateWithinPeriod(
  dateStr: string,
  filter: PeriodFilter,
  fyStartMonth = 4
): boolean {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  const range = resolvePeriodDateRange(filter, fyStartMonth);

  return isWithinInterval(date, {
    start: range.startDate,
    end: range.endDate,
  });
}

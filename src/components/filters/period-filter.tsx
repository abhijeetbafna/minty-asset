"use client";

import * as React from "react";
import { useApp } from "@/lib/context/app-context";
import {
  PeriodType,
  getAvailableFiscalYears,
  getAvailableCalendarYears,
} from "@/lib/date/period";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PeriodFilterBar() {
  const { profile, period, setPeriod, resolvedPeriod } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fiscalYears = React.useMemo(() => {
    return getAvailableFiscalYears(profile.fy_start_month, 6);
  }, [profile.fy_start_month]);

  const calendarYears = React.useMemo(() => {
    return getAvailableCalendarYears(6);
  }, []);

  const [activeTab, setActiveTab] = React.useState<PeriodType>(period.type);
  const [customFrom, setCustomFrom] = React.useState(
    period.customRange?.from || resolvedPeriod.startDateStr
  );
  const [customTo, setCustomTo] = React.useState(
    period.customRange?.to || resolvedPeriod.endDateStr
  );

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const handleSelectFY = (startYear: number) => {
    setPeriod({
      type: "financial_year",
      financialYearStart: startYear,
    });
    setIsOpen(false);
  };

  const handleSelectCY = (year: number) => {
    setPeriod({
      type: "calendar_year",
      calendarYear: year,
    });
    setIsOpen(false);
  };

  const handleSelectMonth = (year: number, monthIndex: number) => {
    setPeriod({
      type: "month",
      monthYear: { year, month: monthIndex + 1 },
    });
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (customFrom && customTo) {
      setPeriod({
        type: "custom",
        customRange: { from: customFrom, to: customTo },
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Active Period Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3 gap-2 border-border/80 bg-card hover:bg-secondary/70 text-foreground shadow-sm font-medium"
      >
        <Calendar className="w-4 h-4 text-primary shrink-0" />
        <span className="truncate max-w-[200px] sm:max-w-none text-xs font-semibold">
          {resolvedPeriod.label}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </Button>

      {/* Popover / Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-[340px] sm:w-[380px] rounded-xl border border-border bg-card shadow-xl z-50 p-4 space-y-4 animate-in fade-in-50 zoom-in-95">
          {/* Header Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-secondary/80 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("financial_year")}
              className={cn(
                "py-1.5 px-2 rounded-md transition-all text-center",
                activeTab === "financial_year"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Fiscal Yr
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("calendar_year")}
              className={cn(
                "py-1.5 px-2 rounded-md transition-all text-center",
                activeTab === "calendar_year"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Cal Yr
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("month")}
              className={cn(
                "py-1.5 px-2 rounded-md transition-all text-center",
                activeTab === "month"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={cn(
                "py-1.5 px-2 rounded-md transition-all text-center",
                activeTab === "custom"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Custom
            </button>
          </div>

          {/* Tab 1: Financial Year */}
          {activeTab === "financial_year" && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Select Financial Year (Starts {profile.fy_start_month === 4 ? "April" : `Month ${profile.fy_start_month}`})
              </div>
              <div className="grid grid-cols-2 gap-2">
                {fiscalYears.map((fy) => {
                  const isSelected =
                    period.type === "financial_year" &&
                    period.financialYearStart === fy.startYear;
                  return (
                    <button
                      key={fy.startYear}
                      type="button"
                      onClick={() => handleSelectFY(fy.startYear)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold transition-colors",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-secondary/60 text-foreground"
                      )}
                    >
                      <span>{fy.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Calendar Year */}
          {activeTab === "calendar_year" && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Select Calendar Year (Jan – Dec)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {calendarYears.map((year) => {
                  const isSelected =
                    period.type === "calendar_year" && period.calendarYear === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleSelectCY(year)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold transition-colors",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-secondary/60 text-foreground"
                      )}
                    >
                      <span>{year}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Monthly Selection */}
          {activeTab === "month" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Select Month ({new Date().getFullYear()})</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {months.map((m, idx) => {
                  const currentYear = new Date().getFullYear();
                  const isSelected =
                    period.type === "month" &&
                    period.monthYear?.year === currentYear &&
                    period.monthYear?.month === idx + 1;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSelectMonth(currentYear, idx)}
                      className={cn(
                        "py-2 px-1 rounded-lg border text-xs font-medium text-center transition-colors",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border hover:bg-secondary/60 text-foreground"
                      )}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Custom Date Range */}
          {activeTab === "custom" && (
            <div className="space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Custom Date Range
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                    From Date
                  </label>
                  <Input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
                    To Date
                  </label>
                  <Input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleApplyCustom}
                className="w-full h-8 text-xs font-semibold"
              >
                Apply Date Range
              </Button>
            </div>
          )}

          {/* Footer Active Bounds Hint */}
          <div className="pt-2 border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Effective range:</span>
            <span className="font-mono text-foreground font-medium">
              {resolvedPeriod.startDateStr} → {resolvedPeriod.endDateStr}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useApp } from "@/lib/context/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ReceiptText,
  PiggyBank,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Settings as SettingsIcon,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  const { profile, resolvedPeriod, formatMoney, formatCompactMoney, categories } = useApp();

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Financial Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Ledger for {profile.display_name || "Personal Account"} · Formatted in {profile.currency_symbol} {profile.number_format === "lakh_crore" ? "(Lakhs/Crores)" : "(Standard)"}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold text-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Period: {resolvedPeriod.label}
        </div>
      </div>

      {/* Phase 2 Milestone Card */}
      <Card className="border border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Phase 2 Completed &amp; Verified
          </div>
          <CardTitle className="text-lg">Core Data Engine &amp; Localization Configured</CardTitle>
          <CardDescription>
            Configured native Indian Lakh/Crore number formatting, custom April–March Fiscal Year &amp; Calendar Year filtering,
            and complete Category Directory with sensible Indian household defaults.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/settings">
              <Button size="sm" variant="outline" className="gap-2">
                <SettingsIcon className="w-4 h-4" />
                Customize Categories &amp; Settings
              </Button>
            </Link>
            <Link href="/transactions">
              <Button size="sm" className="gap-2">
                Next: Income &amp; Expense Ledger (Phase 3)
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Preview Using Dynamic Currency Formatter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold">Total Income</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{formatMoney(0)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{resolvedPeriod.label} · 0 records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold">Total Expenses</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{formatMoney(0)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{resolvedPeriod.label} · 0 expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold">Net Savings</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary font-mono">{formatMoney(0)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Savings rate: 0.0%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold">Total Invested</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{formatMoney(0)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Cumulative principal</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Directory Snapshot */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                Active Ledger Categories
              </div>
              <CardTitle className="text-base mt-1">Preloaded Indian Categories ({categories.length} total)</CardTitle>
            </div>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                Manage Categories &rarr;
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 text-xs">
            {categories.slice(0, 10).map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-background font-medium"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color || "#0F766E" }}
                />
                {cat.name}
              </span>
            ))}
            {categories.length > 10 && (
              <span className="inline-flex items-center px-2 py-1 rounded-lg bg-secondary text-muted-foreground font-medium text-[11px]">
                +{categories.length - 10} more categories
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

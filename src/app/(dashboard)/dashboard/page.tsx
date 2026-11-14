"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ReceiptText,
  PiggyBank,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Financial Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome to Minty. Track cash flows and capital invested with Indian fiscal defaults.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Active: FY 2024-25 (Apr – Mar)
        </div>
      </div>

      {/* Phase 1 Verification / Milestone Card */}
      <Card className="border border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Phase 1 Completed &amp; Verified
          </div>
          <CardTitle className="text-lg">Core Foundation &amp; Authentication Ready</CardTitle>
          <CardDescription>
            The project design system, branding, Supabase client authentication, responsive shell,
            and theme engine (soft off-white light mode &amp; soft slate dark mode) are fully wired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/transactions">
              <Button size="sm" variant="outline" className="gap-2">
                <ReceiptText className="w-4 h-4" />
                Ledger (Phase 3)
              </Button>
            </Link>
            <Link href="/investments">
              <Button size="sm" variant="outline" className="gap-2">
                <PiggyBank className="w-4 h-4" />
                Investments (Phase 4)
              </Button>
            </Link>
            <Link href="/settings">
              <Button size="sm" className="gap-2">
                Next: Settings &amp; Categories (Phase 2)
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Baseline Metric Cards Skeleton Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold">Total Income</CardDescription>
            <CardTitle className="text-2xl font-bold">₹0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">0 transactions recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold">Total Expenses</CardDescription>
            <CardTitle className="text-2xl font-bold">₹0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">0 expenses recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold">Net Savings</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">₹0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Savings rate: 0.0%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold">Total Invested</CardDescription>
            <CardTitle className="text-2xl font-bold">₹0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Cumulative principal</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

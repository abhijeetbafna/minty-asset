import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Calendar,
  Layers,
  FileSpreadsheet,
  Smartphone,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border/50">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_50%_15%,rgba(15,118,110,0.08)_0%,transparent_100%)]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Engineered for Indian Personal Finance
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight sm:leading-tight">
            Clear, private financial tracking for <span className="text-primary">Indian households.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            Record income, monitor daily expenses, and track your total invested capital.
            Native support for Indian Lakhs &amp; Crores, the April–March Financial Year, and 100% manual privacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-md gap-2 w-full sm:w-auto">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold w-full sm:w-auto">
                Sign In to Account
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No bank credential sharing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Native ₹ Lakh &amp; Crore format</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>April–March FY tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Full CSV/Excel portability</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-14">
          <div className="rounded-2xl border border-border/80 bg-card p-3 sm:p-5 shadow-2xl overflow-hidden">
            {/* Top Bar of Preview */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-border/60 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-muted-foreground ml-2 hidden sm:inline">
                  Minty Financial Overview — FY 2024-25
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                  Period: FY 2024-25 (Apr &apos;24 – Mar &apos;25)
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  Format: ₹ Lakhs
                </span>
              </div>
            </div>

            {/* KPI Cards Preview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-4">
              <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Income
                </span>
                <div className="text-xl sm:text-2xl font-bold text-foreground">₹2,45,000</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Salary + Dividends
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Expenses
                </span>
                <div className="text-xl sm:text-2xl font-bold text-foreground">₹84,200</div>
                <div className="text-[11px] text-muted-foreground font-medium">
                  Rent, EMI, Household
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Net Savings
                </span>
                <div className="text-xl sm:text-2xl font-bold text-primary">₹1,60,800</div>
                <div className="text-[11px] text-primary font-medium">
                  65.6% Savings Rate
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Invested
                </span>
                <div className="text-xl sm:text-2xl font-bold text-foreground">₹18,50,000</div>
                <div className="text-[11px] text-muted-foreground font-medium">
                  Cumulative Principal
                </div>
              </div>
            </div>

            {/* Sub-grid: Transactions Ledger + Asset Allocation Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 p-4 rounded-xl bg-background border border-border">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Recent Ledger Entries
                  </span>
                  <span className="text-xs text-muted-foreground">Showing 4 of 28</span>
                </div>
                <div className="divide-y divide-border/50 text-xs sm:text-sm">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">Monthly Salary</div>
                      <div className="text-xs text-muted-foreground">01 Nov 2024 · Direct Deposit</div>
                    </div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +₹2,20,000
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">House Rent</div>
                      <div className="text-xs text-muted-foreground">03 Nov 2024 · Housing</div>
                    </div>
                    <span className="font-semibold text-foreground">-₹35,000</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">Home Loan EMI</div>
                      <div className="text-xs text-muted-foreground">05 Nov 2024 · Loan Repayment</div>
                    </div>
                    <span className="font-semibold text-foreground">-₹28,500</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">Domestic Help &amp; Cook</div>
                      <div className="text-xs text-muted-foreground">07 Nov 2024 · Services</div>
                    </div>
                    <span className="font-semibold text-foreground">-₹8,500</span>
                  </div>
                </div>
              </div>

              {/* Investment Allocation Snapshot */}
              <div className="p-4 rounded-xl bg-background border border-border space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground block pb-1 border-b border-border/60">
                  Invested Capital By Segment
                </span>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Mutual Funds (SIP)</span>
                      <span className="font-semibold">₹7,20,000 (39%)</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "39%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Provident Fund (EPF/PPF)</span>
                      <span className="font-semibold">₹5,50,000 (30%)</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Equities / Direct Stocks</span>
                      <span className="font-semibold">₹3,00,000 (16%)</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: "16%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>SGBs &amp; Gold</span>
                      <span className="font-semibold">₹1,80,000 (10%)</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: "10%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>NPS (Tier I)</span>
                      <span className="font-semibold">₹1,00,000 (5%)</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: "5%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 sm:py-24 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-primary">
              Core Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Designed around how Indian personal finance actually works
            </p>
            <p className="text-base text-muted-foreground">
              Everything you need for comprehensive financial health, with none of the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">April–March Financial Year</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Filter your finances by Indian fiscal years (e.g. FY 2024-25) or switch to calendar years.
                The financial year start month is fully configurable in settings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Indian Lakh &amp; Crore Formatting</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                See numbers formatted the way you think: ₹12,34,567 instead of Western millions.
                Switchable to international notation whenever needed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Sensible Category Defaults</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pre-configured with categories relevant to Indian households: Rent, Groceries, Domestic Help,
                Fuel, EMI, School Fees, and Utilities. Fully customizable.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">12 Investment Segments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Record principal invested across EPF, PPF, NPS, Mutual Funds, Fixed Deposits, Stocks,
                Bonds, SGBs, Gold, Real Estate, and Business ventures.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">100% Private &amp; Isolated</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is strictly yours. Database-level row security ensures complete isolation.
                No automated bank scrapers, no unwanted promotional spam.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Import, Export &amp; Full Backup</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download sample CSV/Excel templates, bulk import your existing records, export filtered
                data anytime, or save a complete JSON backup to your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Tracking Highlight Section */}
      <section id="investments" className="py-20 sm:py-24 bg-card/40 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-xs font-semibold text-primary">
                Capital Invested Philosophy
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Track how much money you&apos;ve put to work, without market noise.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Most portfolio trackers distract with daily price swings, complex NAV calculations, and noisy
                notifications. Minty focuses on the metric you control: <strong>how much principal capital you have invested</strong> over time.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Simple entries:</strong> Date, asset segment, sub-type (EPF, PPF, Tier-I, SGB, etc.), and amount.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Instant asset allocation:</strong> Clear visual breakdown across traditional, equity, and physical assets.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Future-proof architecture:</strong> Schema designed to accommodate future valuations without restructuring.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-lg space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Supported Investment Segments
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-medium">
                {[
                  "Provident Fund (EPF/PPF)",
                  "NPS (Tier I & II)",
                  "Mutual Funds",
                  "Bank Deposits (FD/RD)",
                  "Stocks & Equities",
                  "Bonds & SGBs",
                  "ULIPs",
                  "LIC & Insurance",
                  "Gold & Silver",
                  "Real Estate",
                  "Startup & Business",
                  "Other Capital",
                ].map((segment) => (
                  <div
                    key={segment}
                    className="p-2.5 rounded-lg bg-background border border-border/80 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="truncate">{segment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Take command of your financial ledger today.
          </h2>
          <p className="max-w-xl mx-auto text-base text-muted-foreground">
            Experience an intentional, clutter-free way to manage household cash flows and track wealth building.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-md gap-2 w-full sm:w-auto">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

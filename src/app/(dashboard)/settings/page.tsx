"use client";

import * as React from "react";
import { useApp } from "@/lib/context/app-context";
import {
  MONTH_NAMES,
  SUPPORTED_CURRENCIES,
} from "@/lib/constants/defaults";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Plus,
  Trash2,
  FolderPlus,
  Settings as SettingsIcon,
  Tag,
  Coins,
  Calendar,
  Layers,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/types/database.types";

export default function SettingsPage() {
  const {
    profile,
    updateProfile,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    formatMoney,
    formatCompactMoney,
  } = useApp();

  const [displayName, setDisplayName] = React.useState(profile.display_name || "");
  const [currencyCode, setCurrencyCode] = React.useState(profile.currency_code);
  const [numberFormat, setNumberFormat] = React.useState(profile.number_format);
  const [fyStartMonth, setFyStartMonth] = React.useState(profile.fy_start_month);

  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = React.useState<TransactionType>("expense");

  // New Category Modal / Inline Form
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState("");
  const [newCatSubcategories, setNewCatSubcategories] = React.useState("");
  const [newCatColor, setNewCatColor] = React.useState("#0F766E");

  // Sync state when profile loads
  React.useEffect(() => {
    setDisplayName(profile.display_name || "");
    setCurrencyCode(profile.currency_code);
    setNumberFormat(profile.number_format);
    setFyStartMonth(profile.fy_start_month);
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const currObj = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);

    await updateProfile({
      display_name: displayName,
      currency_code: currencyCode,
      currency_symbol: currObj ? currObj.symbol : "₹",
      number_format: numberFormat,
      fy_start_month: Number(fyStartMonth),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const subcats = newCatSubcategories
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await addCategory({
      user_id: null,
      type: activeCategoryTab,
      name: newCatName.trim(),
      subcategories: subcats.length > 0 ? subcats : ["General"],
      icon: activeCategoryTab === "expense" ? "Tag" : "Coins",
      color: newCatColor,
      is_system_default: false,
    });

    setNewCatName("");
    setNewCatSubcategories("");
    setIsAddingCategory(false);
  };

  const filteredCategories = categories.filter((c) => c.type === activeCategoryTab);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Settings &amp; Localization
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize currency symbols, Indian number grouping, financial year rules, and categories.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Settings updated and saved successfully!
        </div>
      )}

      {/* Grid: Preferences Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* General & Profile */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <SettingsIcon className="w-4 h-4" />
                  Account &amp; Ledger Profile
                </div>
                <CardTitle className="text-lg">Display Name</CardTitle>
                <CardDescription>How your profile appears across the dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Account Name
                  </label>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Aditya Sharma or Family Ledger"
                    className="max-w-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Currency & Formatting */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Coins className="w-4 h-4" />
                  Currency &amp; Number System
                </div>
                <CardTitle className="text-lg">Number Formatting</CardTitle>
                <CardDescription>
                  Configure whether amounts use Indian Lakh/Crore grouping or International notation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Currency Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Currency
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SUPPORTED_CURRENCIES.map((curr) => {
                      const isSelected = currencyCode === curr.code;
                      return (
                        <button
                          key={curr.code}
                          type="button"
                          onClick={() => setCurrencyCode(curr.code as any)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border text-xs font-semibold transition-all text-left",
                            isSelected
                              ? "border-primary bg-primary/10 text-primary shadow-xs"
                              : "border-border hover:bg-secondary/60 text-foreground"
                          )}
                        >
                          <div>
                            <div className="font-bold">{curr.code}</div>
                            <div className="text-[11px] text-muted-foreground font-normal">{curr.name}</div>
                          </div>
                          <span className="text-sm font-bold">{curr.symbol}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Number Format Toggle */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Number Grouping Standard
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNumberFormat("lakh_crore")}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all space-y-1",
                        numberFormat === "lakh_crore"
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border hover:bg-secondary/60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">
                          Indian (Lakhs &amp; Crores)
                        </span>
                        {numberFormat === "lakh_crore" && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Example: <code className="font-mono font-semibold text-foreground">₹12,34,567.00</code>
                      </p>
                      <p className="text-[11px] text-primary/80 font-medium">
                        Standard for Indian users &amp; tax returns
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNumberFormat("million_billion")}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all space-y-1",
                        numberFormat === "million_billion"
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border hover:bg-secondary/60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">
                          International Standard
                        </span>
                        {numberFormat === "million_billion" && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Example: <code className="font-mono font-semibold text-foreground">1,234,567.00</code>
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        Standard 3-digit comma intervals
                      </p>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Year Start Month */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  Fiscal Year Definition
                </div>
                <CardTitle className="text-lg">Financial Year Start Month</CardTitle>
                <CardDescription>
                  Indian personal finance tracks April to March. Customize if your tax jurisdiction differs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5 max-w-sm">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Start Month
                  </label>
                  <select
                    value={fyStartMonth}
                    onChange={(e) => setFyStartMonth(Number(e.target.value))}
                    className="flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {MONTH_NAMES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  With {MONTH_NAMES.find((m) => m.value === Number(fyStartMonth))?.name.split(" ")[0]} as the start month,
                  transactions from {MONTH_NAMES.find((m) => m.value === Number(fyStartMonth))?.name.split(" ")[0]} 2024 to the following year are grouped into <strong>FY 2024-25</strong>.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="gap-2 px-6">
                <Save className="w-4 h-4" />
                Save Preferences
              </Button>
            </div>
          </form>
        </div>

        {/* Live Formatting Preview Card */}
        <div className="space-y-6">
          <Card className="border-primary/30 bg-card/80 sticky top-20 shadow-md">
            <CardHeader className="pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Live Rendering Preview
              </span>
              <CardTitle className="text-base">Formatting in Action</CardTitle>
              <CardDescription>
                How amounts will display in your ledgers, widgets, and charts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-background border border-border space-y-1">
                <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                  1 Crore / 10 Million Sample
                </span>
                <div className="text-lg font-bold text-foreground font-mono">
                  {formatMoney(10000000)}
                </div>
                <div className="text-[11px] text-primary font-medium">
                  Compact Badge: {formatCompactMoney(10000000)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-background border border-border space-y-1">
                <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                  12.34 Lakhs / 1.23 Million Sample
                </span>
                <div className="text-lg font-bold text-foreground font-mono">
                  {formatMoney(1234567.89)}
                </div>
                <div className="text-[11px] text-primary font-medium">
                  Compact Badge: {formatCompactMoney(1234567.89)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-background border border-border space-y-1">
                <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                  Negative Cash Flow / Expense Sample
                </span>
                <div className="text-lg font-bold text-destructive font-mono">
                  {formatMoney(-45200.5)}
                </div>
                <div className="text-[11px] text-muted-foreground font-medium">
                  Compact Badge: {formatCompactMoney(-45200.5)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                  Active Fiscal Calendar
                </span>
                <div className="text-xs font-semibold text-foreground">
                  Starts: {MONTH_NAMES.find((m) => m.value === Number(fyStartMonth))?.name}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Manager Section */}
      <Card className="mt-8">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                Category Directory
              </div>
              <CardTitle className="text-lg">Custom Categories &amp; Subcategories</CardTitle>
              <CardDescription>
                Review preloaded Indian household categories or create your own custom tags.
              </CardDescription>
            </div>

            <Button
              size="sm"
              onClick={() => setIsAddingCategory(true)}
              className="gap-2 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>

          {/* Category Type Filter Tabs */}
          <div className="flex items-center gap-2 pt-3">
            <button
              type="button"
              onClick={() => setActiveCategoryTab("expense")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                activeCategoryTab === "expense"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              Expense Categories ({categories.filter((c) => c.type === "expense").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryTab("income")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                activeCategoryTab === "income"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              Income Categories ({categories.filter((c) => c.type === "income").length})
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add Category Form Modal / Drawer */}
          {isAddingCategory && (
            <form
              onSubmit={handleCreateCategory}
              className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4 animate-in fade-in-50"
            >
              <div className="flex items-center justify-between pb-2 border-b border-primary/20">
                <h4 className="text-sm font-bold text-foreground">
                  Create New {activeCategoryTab === "expense" ? "Expense" : "Income"} Category
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7"
                  onClick={() => setIsAddingCategory(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Category Name</label>
                  <Input
                    required
                    placeholder="e.g. Pet Care & Vet"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
                    />
                    <Input
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Subcategories (comma separated)
                </label>
                <Input
                  placeholder="e.g. Pet Food, Vet Consultation, Grooming"
                  value={newCatSubcategories}
                  onChange={(e) => setNewCatSubcategories(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingCategory(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Save Category
                </Button>
              </div>
            </form>
          )}

          {/* Categories Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl border border-border bg-background/50 hover:bg-card transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || "#0F766E" }}
                    />
                    <span className="font-bold text-sm text-foreground">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {cat.is_system_default ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                        Default
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCategory(cat.id)}
                        className="w-7 h-7 text-muted-foreground hover:text-destructive"
                        title="Delete custom category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Subcategories Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.subcategories && cat.subcategories.length > 0 ? (
                    cat.subcategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/80 text-foreground font-medium"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic">
                      No subcategories
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

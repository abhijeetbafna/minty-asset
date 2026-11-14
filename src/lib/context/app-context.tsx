"use client";

import * as React from "react";
import {
  Category,
  CurrencyCode,
  NumberFormatType,
  UserProfile,
  TransactionType,
} from "@/types/database.types";
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/lib/constants/defaults";
import {
  PeriodFilter,
  ResolvedDateRange,
  getFiscalYearFromDate,
  resolvePeriodDateRange,
} from "@/lib/date/period";
import { formatCurrency, formatCompactCurrency } from "@/lib/formatters/currency";
import { createClient } from "@/lib/supabase/client";

interface AppContextValue {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  period: PeriodFilter;
  setPeriod: (period: PeriodFilter) => void;
  resolvedPeriod: ResolvedDateRange;
  categories: Category[];
  addCategory: (category: Omit<Category, "id" | "created_at" | "updated_at">) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  formatMoney: (amount: number, options?: { showDecimals?: boolean; signDisplay?: "auto" | "always" | "never" }) => string;
  formatCompactMoney: (amount: number) => string;
  isLoading: boolean;
}

const defaultInitialProfile: UserProfile = {
  id: "local-user",
  display_name: "Personal Account",
  currency_code: "INR",
  currency_symbol: "₹",
  number_format: "lakh_crore",
  fy_start_month: 4, // April (India default)
  theme_preference: "light",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function generateInitialCategories(): Category[] {
  const categories: Category[] = [];

  DEFAULT_EXPENSE_CATEGORIES.forEach((cat, index) => {
    categories.push({
      id: `system-exp-${index}`,
      user_id: null,
      type: "expense",
      name: cat.name,
      subcategories: cat.subcategories,
      icon: cat.icon,
      color: cat.color,
      is_system_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  DEFAULT_INCOME_CATEGORIES.forEach((cat, index) => {
    categories.push({
      id: `system-inc-${index}`,
      user_id: null,
      type: "income",
      name: cat.name,
      subcategories: cat.subcategories,
      icon: cat.icon,
      color: cat.color,
      is_system_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  return categories;
}

const AppContext = React.createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("minty_profile");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return defaultInitialProfile;
  });

  const [categories, setCategories] = React.useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("minty_categories");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return generateInitialCategories();
  });

  const [period, setPeriod] = React.useState<PeriodFilter>(() => {
    const currentFY = getFiscalYearFromDate(new Date(), 4);
    return {
      type: "financial_year",
      financialYearStart: currentFY.startYear,
    };
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const supabase = createClient();

  // Load from Supabase if user is signed in
  React.useEffect(() => {
    let isMounted = true;

    async function loadRemoteData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        setIsLoading(true);

        // Fetch Profile
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData && isMounted) {
          setProfile(profileData);
          localStorage.setItem("minty_profile", JSON.stringify(profileData));
        }

        // Fetch User and System Categories
        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .order("created_at", { ascending: true });

        if (catData && catData.length > 0 && isMounted) {
          setCategories(catData);
          localStorage.setItem("minty_categories", JSON.stringify(catData));
        }
      } catch (err) {
        // Fallback to local state if offline
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRemoteData();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Save profile changes
  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("minty_profile", JSON.stringify(updated));
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await (supabase as any)
          .from("user_profiles")
          .upsert({ ...updated, id: user.id });
      }
    } catch {}
  };

  // Category management
  const addCategory = async (catInput: Omit<Category, "id" | "created_at" | "updated_at">): Promise<Category> => {
    const newCat: Category = {
      ...catInput,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextCategories = [...categories, newCat];
    setCategories(nextCategories);
    localStorage.setItem("minty_categories", JSON.stringify(nextCategories));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await (supabase as any)
          .from("categories")
          .insert({ ...catInput, user_id: user.id })
          .select()
          .single();

        if (data) {
          setCategories((prev) => prev.map((c) => (c.id === newCat.id ? (data as Category) : c)));
          return data as Category;
        }
      }
    } catch {}

    return newCat;
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const nextCategories = categories.map((cat) =>
      cat.id === id ? { ...cat, ...updates, updated_at: new Date().toISOString() } : cat
    );
    setCategories(nextCategories);
    localStorage.setItem("minty_categories", JSON.stringify(nextCategories));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await (supabase as any)
          .from("categories")
          .update(updates)
          .eq("id", id)
          .eq("user_id", user.id);
      }
    } catch {}
  };

  const deleteCategory = async (id: string) => {
    const nextCategories = categories.filter((cat) => cat.id !== id);
    setCategories(nextCategories);
    localStorage.setItem("minty_categories", JSON.stringify(nextCategories));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await (supabase as any)
          .from("categories")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);
      }
    } catch {}
  };

  const resolvedPeriod = React.useMemo(() => {
    return resolvePeriodDateRange(period, profile.fy_start_month);
  }, [period, profile.fy_start_month]);

  const formatMoney = React.useCallback(
    (
      amount: number,
      options?: { showDecimals?: boolean; signDisplay?: "auto" | "always" | "never" }
    ) => {
      return formatCurrency(amount, {
        symbol: profile.currency_symbol,
        format: profile.number_format,
        showDecimals: options?.showDecimals ?? true,
        signDisplay: options?.signDisplay ?? "auto",
      });
    },
    [profile.currency_symbol, profile.number_format]
  );

  const formatCompactMoney = React.useCallback(
    (amount: number) => {
      return formatCompactCurrency(amount, profile.currency_symbol, profile.number_format);
    },
    [profile.currency_symbol, profile.number_format]
  );

  const value = {
    profile,
    updateProfile,
    period,
    setPeriod,
    resolvedPeriod,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    formatMoney,
    formatCompactMoney,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

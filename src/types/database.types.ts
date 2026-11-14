export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD";
export type NumberFormatType = "lakh_crore" | "million_billion";
export type ThemePreference = "light" | "dark" | "system";

export type TransactionType = "income" | "expense";

export type InvestmentSegment =
  | "provident_fund"
  | "nps"
  | "mutual_funds"
  | "bank_deposits"
  | "stocks"
  | "securities_bonds"
  | "ulip"
  | "insurance"
  | "commodities"
  | "real_estate"
  | "startup_business"
  | "other";

export interface UserProfile {
  id: string;
  display_name: string | null;
  currency_code: CurrencyCode;
  currency_symbol: string;
  number_format: NumberFormatType;
  fy_start_month: number; // 1-12, default 4 (April)
  theme_preference: ThemePreference;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  type: TransactionType;
  name: string;
  subcategories: string[];
  icon: string | null;
  color: string | null;
  is_system_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  category_id: string | null;
  category_name: string;
  subcategory: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  segment: InvestmentSegment;
  sub_type: string | null;
  amount_invested: number;
  notes: string | null;
  metadata: Record<string, Json>;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Partial<UserProfile> & { id: string };
        Update: Partial<UserProfile>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Category>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Transaction>;
      };
      investments: {
        Row: Investment;
        Insert: Omit<Investment, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Investment>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

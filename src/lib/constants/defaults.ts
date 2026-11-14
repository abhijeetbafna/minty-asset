import { Category, InvestmentSegment } from "@/types/database.types";

export interface InvestmentSegmentConfig {
  id: InvestmentSegment;
  name: string;
  defaultSubTypes: string[];
  description: string;
  color: string;
}

export const INVESTMENT_SEGMENTS: InvestmentSegmentConfig[] = [
  {
    id: "provident_fund",
    name: "Provident Fund",
    defaultSubTypes: ["EPF (Employee PF)", "PPF (Public PF)", "VPF (Voluntary PF)"],
    description: "Government-backed retirement savings (EPF, PPF, VPF)",
    color: "#0F766E", // Teal
  },
  {
    id: "nps",
    name: "National Pension Scheme (NPS)",
    defaultSubTypes: ["Tier I (Retirement)", "Tier II (Flexible)"],
    description: "Pension regulatory savings with tax benefits",
    color: "#4338CA", // Indigo
  },
  {
    id: "mutual_funds",
    name: "Mutual Funds",
    defaultSubTypes: ["Equity SIP", "Debt Fund", "Hybrid / Balanced", "Index / ETF", "ELSS (Tax Saver)"],
    description: "Systematic investment plans & lump sum fund units",
    color: "#059669", // Emerald
  },
  {
    id: "bank_deposits",
    name: "Bank Deposits (FD / RD)",
    defaultSubTypes: ["Fixed Deposit (FD)", "Recurring Deposit (RD)", "Tax-Saving FD"],
    description: "Guaranteed interest term deposits with banks and post offices",
    color: "#2563EB", // Blue
  },
  {
    id: "stocks",
    name: "Stocks & Direct Equities",
    defaultSubTypes: ["Direct Stocks (NSE/BSE)", "US Equities", "ESOPs"],
    description: "Direct equity shares held in demat accounts",
    color: "#0284C7", // Sky
  },
  {
    id: "securities_bonds",
    name: "Securities & Bonds",
    defaultSubTypes: ["Sovereign Gold Bonds (SGB)", "RBI Floating Rate Bonds", "Government T-Bills", "Corporate Bonds"],
    description: "Fixed income debt instruments, treasury bills, and gold bonds",
    color: "#D97706", // Amber
  },
  {
    id: "ulip",
    name: "ULIPs",
    defaultSubTypes: ["Equity Growth ULIP", "Balanced ULIP", "Debt ULIP"],
    description: "Unit Linked Insurance Plans combining protection & investment",
    color: "#7C3AED", // Violet
  },
  {
    id: "insurance",
    name: "LIC & Traditional Insurance",
    defaultSubTypes: ["Endowment Policy", "Money Back Policy", "Annuity / Pension Plan"],
    description: "Life insurance policies with savings or cash-value return components",
    color: "#9333EA", // Purple
  },
  {
    id: "commodities",
    name: "Commodities (Gold & Silver)",
    defaultSubTypes: ["Physical Gold / Jewelry", "Gold Coins / Bars", "Silver Bullion", "Digital Gold"],
    description: "Precious metals and bullion holdings",
    color: "#EAB308", // Yellow / Gold
  },
  {
    id: "real_estate",
    name: "Real Estate",
    defaultSubTypes: ["Residential Plot / Flat", "Commercial Property", "Land", "REITs"],
    description: "Physical property, land acquisition, and real estate trusts",
    color: "#DC2626", // Red / Coral
  },
  {
    id: "startup_business",
    name: "Startup & Business Investments",
    defaultSubTypes: ["Angel Investment", "Franchise Capital", "Private Business Equity", "Partnership Venture"],
    description: "Private capital injected into operating businesses or ventures",
    color: "#EA580C", // Orange
  },
  {
    id: "other",
    name: "Other Capital Investments",
    defaultSubTypes: ["Art & Collectibles", "P2P Lending", "Miscellaneous Capital"],
    description: "Any other financial instruments or capital deployed",
    color: "#64748B", // Slate
  },
];

export const DEFAULT_EXPENSE_CATEGORIES: Array<{
  name: string;
  subcategories: string[];
  icon: string;
  color: string;
}> = [
  {
    name: "Rent & Housing",
    subcategories: ["House Rent", "Maintenance Charges", "Property Tax"],
    icon: "Home",
    color: "#0F766E",
  },
  {
    name: "Groceries & Household",
    subcategories: ["Supermarket", "Fruits & Vegetables", "Milk & Dairy", "Packaged Food"],
    icon: "ShoppingCart",
    color: "#10B981",
  },
  {
    name: "EMI & Loan Repayments",
    subcategories: ["Home Loan EMI", "Car Loan EMI", "Personal Loan", "Credit Card Bill"],
    icon: "Landmark",
    color: "#DC2626",
  },
  {
    name: "Utilities & Bills",
    subcategories: ["Electricity", "Water", "LPG Cylinder / Piped Gas", "Broadband & Wi-Fi", "Mobile Recharge"],
    icon: "Zap",
    color: "#F59E0B",
  },
  {
    name: "Domestic Help & Services",
    subcategories: ["Maid / Housekeeping", "Cook", "Driver", "Gardener", "Car Wash"],
    icon: "Users",
    color: "#8B5CF6",
  },
  {
    name: "Transportation & Fuel",
    subcategories: ["Petrol / Diesel", "CNG", "Metro / Train", "Auto / Taxi / Uber", "Vehicle Service & Insurance"],
    icon: "Car",
    color: "#3B82F6",
  },
  {
    name: "Dining Out & Delivery",
    subcategories: ["Swiggy / Zomato", "Restaurants", "Cafes & Snacks"],
    icon: "Utensils",
    color: "#EC4899",
  },
  {
    name: "Healthcare & Wellness",
    subcategories: ["Doctor Consultation", "Medicines & Pharmacy", "Diagnostic Tests", "Health Insurance Premium"],
    icon: "HeartPulse",
    color: "#14B8A6",
  },
  {
    name: "Education & Learning",
    subcategories: ["School / College Tuition", "Books & Stationery", "Coaching & Courses"],
    icon: "GraduationCap",
    color: "#6366F1",
  },
  {
    name: "Shopping & Lifestyle",
    subcategories: ["Clothing & Footwear", "Electronics & Gadgets", "Personal Care / Grooming", "Home Decor"],
    icon: "ShoppingBag",
    color: "#06B6D4",
  },
  {
    name: "Festivals & Gifts",
    subcategories: ["Diwali / Festive Expenses", "Family Gifts", "Charity & Donations"],
    icon: "Gift",
    color: "#D97706",
  },
  {
    name: "Travel & Vacations",
    subcategories: ["Flight / Train Tickets", "Hotel Stays", "Holiday Expenses"],
    icon: "Plane",
    color: "#64748B",
  },
  {
    name: "Miscellaneous",
    subcategories: ["General / Others"],
    icon: "MoreHorizontal",
    color: "#94A3B8",
  },
];

export const DEFAULT_INCOME_CATEGORIES: Array<{
  name: string;
  subcategories: string[];
  icon: string;
  color: string;
}> = [
  {
    name: "Salary / Paycheck",
    subcategories: ["Base Salary", "Performance Bonus", "Reimbursements", "HRA / Arrears"],
    icon: "Briefcase",
    color: "#059669",
  },
  {
    name: "Business & Freelance",
    subcategories: ["Client Invoicing", "Consulting Fees", "Contract Revenue"],
    icon: "Laptop",
    color: "#0D9488",
  },
  {
    name: "Rental Income",
    subcategories: ["Residential Tenant", "Commercial Property"],
    icon: "Building2",
    color: "#2563EB",
  },
  {
    name: "Dividends & Interest",
    subcategories: ["Stock Dividends", "Mutual Fund Payouts", "FD Interest", "Savings Bank Interest"],
    icon: "Coins",
    color: "#7C3AED",
  },
  {
    name: "Other Income",
    subcategories: ["Gifts Received", "Tax Refund", "Cashbacks / Rewards"],
    icon: "CircleDollarSign",
    color: "#10B981",
  },
];

export const MONTH_NAMES = [
  { value: 1, name: "January" },
  { value: 2, name: "February" },
  { value: 3, name: "March" },
  { value: 4, name: "April (India Standard)" },
  { value: 5, name: "May" },
  { value: 6, name: "June" },
  { value: 7, name: "July (Australia Standard)" },
  { value: 8, name: "August" },
  { value: 9, name: "September" },
  { value: 10, name: "October" },
  { value: 11, name: "November" },
  { value: 12, name: "December" },
];

export const SUPPORTED_CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee (₹)" },
  { code: "USD", symbol: "$", name: "US Dollar ($)" },
  { code: "EUR", symbol: "€", name: "Euro (€)" },
  { code: "GBP", symbol: "£", name: "British Pound (£)" },
  { code: "AED", symbol: "AED", name: "UAE Dirham (AED)" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar (S$)" },
];

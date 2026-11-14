-- Seed standard Indian Categories (System Defaults)
insert into public.categories (id, user_id, type, name, subcategories, icon, color, is_system_default)
values
    -- Expenses
    (gen_random_uuid(), null, 'expense', 'Rent & Housing', array['House Rent', 'Maintenance Charges', 'Property Tax'], 'Home', '#0F766E', true),
    (gen_random_uuid(), null, 'expense', 'Groceries & Household', array['Supermarket', 'Fruits & Vegetables', 'Milk & Dairy', 'Packaged Food'], 'ShoppingCart', '#10B981', true),
    (gen_random_uuid(), null, 'expense', 'EMI & Loan Repayments', array['Home Loan EMI', 'Car Loan EMI', 'Personal Loan', 'Credit Card Bill'], 'Landmark', '#DC2626', true),
    (gen_random_uuid(), null, 'expense', 'Utilities & Bills', array['Electricity', 'Water', 'LPG Cylinder / Piped Gas', 'Broadband & Wi-Fi', 'Mobile Recharge'], 'Zap', '#F59E0B', true),
    (gen_random_uuid(), null, 'expense', 'Domestic Help & Services', array['Maid / Housekeeping', 'Cook', 'Driver', 'Gardener', 'Car Wash'], 'Users', '#8B5CF6', true),
    (gen_random_uuid(), null, 'expense', 'Transportation & Fuel', array['Petrol / Diesel', 'CNG', 'Metro / Train', 'Auto / Taxi / Uber', 'Vehicle Service & Insurance'], 'Car', '#3B82F6', true),
    (gen_random_uuid(), null, 'expense', 'Dining Out & Delivery', array['Swiggy / Zomato', 'Restaurants', 'Cafes & Snacks'], 'Utensils', '#EC4899', true),
    (gen_random_uuid(), null, 'expense', 'Healthcare & Wellness', array['Doctor Consultation', 'Medicines & Pharmacy', 'Diagnostic Tests', 'Health Insurance Premium'], 'HeartPulse', '#14B8A6', true),
    (gen_random_uuid(), null, 'expense', 'Education & Learning', array['School / College Tuition', 'Books & Stationery', 'Coaching & Courses'], 'GraduationCap', '#6366F1', true),
    (gen_random_uuid(), null, 'expense', 'Shopping & Lifestyle', array['Clothing & Footwear', 'Electronics & Gadgets', 'Personal Care / Grooming', 'Home Decor'], 'ShoppingBag', '#06B6D4', true),
    (gen_random_uuid(), null, 'expense', 'Festivals & Gifts', array['Diwali / Festive Expenses', 'Family Gifts', 'Charity & Donations'], 'Gift', '#D97706', true),
    (gen_random_uuid(), null, 'expense', 'Travel & Vacations', array['Flight / Train Tickets', 'Hotel Stays', 'Holiday Expenses'], 'Plane', '#64748B', true),
    (gen_random_uuid(), null, 'expense', 'Miscellaneous', array['General / Others'], 'MoreHorizontal', '#94A3B8', true),

    -- Income
    (gen_random_uuid(), null, 'income', 'Salary / Paycheck', array['Base Salary', 'Performance Bonus', 'Reimbursements', 'HRA / Arrears'], 'Briefcase', '#059669', true),
    (gen_random_uuid(), null, 'income', 'Business & Freelance', array['Client Invoicing', 'Consulting Fees', 'Contract Revenue'], 'Laptop', '#0D9488', true),
    (gen_random_uuid(), null, 'income', 'Rental Income', array['Residential Tenant', 'Commercial Property'], 'Building2', '#2563EB', true),
    (gen_random_uuid(), null, 'income', 'Dividends & Interest', array['Stock Dividends', 'Mutual Fund Payouts', 'FD Interest', 'Savings Bank Interest'], 'Coins', '#7C3AED', true),
    (gen_random_uuid(), null, 'income', 'Other Income', array['Gifts Received', 'Tax Refund', 'Cashbacks / Rewards'], 'CircleDollarSign', '#10B981', true)
on conflict do nothing;

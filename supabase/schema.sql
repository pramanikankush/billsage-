-- BillSage Database Schema for Supabase
-- This schema creates all necessary tables, indexes, and RLS policies
-- Execute this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table (stores user profiles, linked to Firebase Auth)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,  -- Firebase UID
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bills table (stores uploaded bill information)
CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'csv', 'image')),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'ocr', 'analyzing', 'analyzed', 'error')),
    provider TEXT,
    total_billed DECIMAL(10, 2) DEFAULT 0,
    total_recommended DECIMAL(10, 2) DEFAULT 0,
    total_savings DECIMAL(10, 2) DEFAULT 0,
    raw_text TEXT,
    parsed_json JSONB,
    gemini_response TEXT,
    ocr_metadata JSONB,
    error_message TEXT
);

-- Bill line items table (stores individual charges from bills)
CREATE TABLE IF NOT EXISTS bill_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    service_code TEXT,
    cpt_code TEXT,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    billed_amount DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    provider TEXT NOT NULL,
    insurer_allowed DECIMAL(10, 2),
    patient_responsibility DECIMAL(10, 2) NOT NULL,
    is_overpriced BOOLEAN NOT NULL DEFAULT FALSE,
    recommended_price DECIMAL(10, 2) NOT NULL,
    confidence DECIMAL(3, 2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    reasoning TEXT NOT NULL,
    savings DECIMAL(10, 2) NOT NULL DEFAULT 0
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);

-- Indexes for bill queries
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_organization_id ON bills(organization_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_uploaded_at ON bills(uploaded_at DESC);

-- Index for line item queries
CREATE INDEX IF NOT EXISTS idx_bill_line_items_bill_id ON bill_line_items(bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_line_items_is_overpriced ON bill_line_items(is_overpriced);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_line_items ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid()::text = id);

CREATE POLICY "Anyone can insert users (for signup)"
    ON users FOR INSERT
    WITH CHECK (true);

-- Bills table policies
CREATE POLICY "Users can view their own bills"
    ON bills FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own bills"
    ON bills FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own bills"
    ON bills FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own bills"
    ON bills FOR DELETE
    USING (auth.uid()::text = user_id);

-- Bill line items table policies
CREATE POLICY "Users can view line items for their bills"
    ON bill_line_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM bills
            WHERE bills.id = bill_line_items.bill_id
            AND bills.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert line items for their bills"
    ON bill_line_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM bills
            WHERE bills.id = bill_line_items.bill_id
            AND bills.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update line items for their bills"
    ON bill_line_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM bills
            WHERE bills.id = bill_line_items.bill_id
            AND bills.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete line items for their bills"
    ON bill_line_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM bills
            WHERE bills.id = bill_line_items.bill_id
            AND bills.user_id = auth.uid()::text
        )
    );

-- ============================================================================
-- STORAGE BUCKET
-- ============================================================================

-- Create storage bucket for bill files
INSERT INTO storage.buckets (id, name, public)
VALUES ('bills', 'bills', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for bills bucket
CREATE POLICY "Users can upload their own bills"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'bills' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view their own bills"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'bills' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own bills"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'bills' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries after executing the schema to verify everything was created:

-- Check tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public';

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Check storage bucket
-- SELECT * FROM storage.buckets WHERE id = 'bills';

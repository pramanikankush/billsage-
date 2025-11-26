-- BillSage PostgreSQL Database Schema
-- This file contains the complete database schema for the BillSage application

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS bill_line_items CASCADE;
DROP TABLE IF EXISTS bills CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    organization_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bills table
CREATE TABLE bills (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id VARCHAR(255),
    file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('pdf', 'csv', 'image')),
    file_path TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'analyzed', 'error')),
    provider VARCHAR(255),
    total_billed DECIMAL(10, 2) DEFAULT 0,
    total_recommended DECIMAL(10, 2) DEFAULT 0,
    total_savings DECIMAL(10, 2) DEFAULT 0,
    raw_text TEXT,
    parsed_json JSONB,
    gemini_response JSONB,
    ocr_metadata JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bill Line Items table
CREATE TABLE bill_line_items (
    id VARCHAR(255) PRIMARY KEY,
    bill_id VARCHAR(255) NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    service_code VARCHAR(100),
    cpt_code VARCHAR(100),
    description TEXT,
    date DATE,
    billed_amount DECIMAL(10, 2) DEFAULT 0,
    quantity INTEGER DEFAULT 1,
    provider VARCHAR(255),
    insurer_allowed DECIMAL(10, 2),
    patient_responsibility DECIMAL(10, 2) DEFAULT 0,
    is_overpriced BOOLEAN DEFAULT FALSE,
    recommended_price DECIMAL(10, 2) DEFAULT 0,
    confidence DECIMAL(5, 2) DEFAULT 0,
    reasoning TEXT,
    savings DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);

CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_organization_id ON bills(organization_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_uploaded_at ON bills(uploaded_at DESC);

CREATE INDEX idx_line_items_bill_id ON bill_line_items(bill_id);
CREATE INDEX idx_line_items_is_overpriced ON bill_line_items(is_overpriced);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_line_items_updated_at BEFORE UPDATE ON bill_line_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE bills IS 'Stores uploaded bill documents and analysis results';
COMMENT ON TABLE bill_line_items IS 'Stores individual line items from analyzed bills';

COMMENT ON COLUMN bills.status IS 'Bill processing status: pending, processing, analyzed, error';
COMMENT ON COLUMN bills.parsed_json IS 'Structured data extracted from the bill';
COMMENT ON COLUMN bills.gemini_response IS 'Raw response from Gemini AI analysis';
COMMENT ON COLUMN bills.ocr_metadata IS 'Metadata from OCR processing';

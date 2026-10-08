CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('family', 'individual', 'agency', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE hospital_category AS ENUM ('government', 'private', 'unknown');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TYPE hospital_category ADD VALUE IF NOT EXISTS 'unknown';

DO $$ BEGIN
  CREATE TYPE caregiver_availability AS ENUM ('whole_day', 'half_day_morning', 'half_day_afternoon', 'nights');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE availability_slot AS ENUM ('whole_day', 'morning', 'afternoon', 'night', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE reviewee_category AS ENUM ('individual', 'agency');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(32) NOT NULL DEFAULT '',
  full_name VARCHAR(160) NOT NULL,
  user_type user_role NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL UNIQUE,
  location VARCHAR(300) NOT NULL,
  district VARCHAR(100) NOT NULL,
  latitude NUMERIC(9, 6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude NUMERIC(9, 6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  hospital_type hospital_category NOT NULL,
  phone VARCHAR(32),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS caregiver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(160) NOT NULL,
  age INTEGER NOT NULL CHECK (age BETWEEN 18 AND 100),
  gender VARCHAR(16) NOT NULL DEFAULT 'Female',
  bio TEXT,
  primary_hospital_id UUID NOT NULL REFERENCES hospitals(id),
  secondary_hospitals JSONB NOT NULL DEFAULT '[]'::jsonb,
  price_per_hour NUMERIC(10, 2) NOT NULL CHECK (price_per_hour >= 0),
  price_per_day NUMERIC(10, 2) NOT NULL CHECK (price_per_day >= 0),
  price_per_shift NUMERIC(10, 2) NOT NULL CHECK (price_per_shift >= 0),
  availability_type caregiver_availability NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  qualifications TEXT[] NOT NULL DEFAULT '{}',
  specializations TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  contact_phone BOOLEAN NOT NULL DEFAULT true,
  contact_email BOOLEAN NOT NULL DEFAULT false,
  contact_whatsapp BOOLEAN NOT NULL DEFAULT true,
  phone_number VARCHAR(32) NOT NULL DEFAULT '',
  whatsapp_number VARCHAR(32) NOT NULL DEFAULT '',
  email VARCHAR(254) NOT NULL DEFAULT '',
  profile_image_url TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agency_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  agency_name VARCHAR(200) NOT NULL,
  registration_number VARCHAR(100) NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  num_caregivers INTEGER NOT NULL DEFAULT 0 CHECK (num_caregivers >= 0),
  primary_hospital_id UUID NOT NULL REFERENCES hospitals(id),
  secondary_hospitals JSONB NOT NULL DEFAULT '[]'::jsonb,
  price_range_min NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price_range_min >= 0),
  price_range_max NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price_range_max >= price_range_min),
  contact_phone VARCHAR(32) NOT NULL DEFAULT '',
  contact_email VARCHAR(254) NOT NULL DEFAULT '',
  contact_whatsapp VARCHAR(32) NOT NULL DEFAULT '',
  show_staff_profiles BOOLEAN NOT NULL DEFAULT false,
  logo_url TEXT NOT NULL DEFAULT '',
  services TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agency_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agency_profiles(id) ON DELETE CASCADE,
  staff_name VARCHAR(160) NOT NULL,
  staff_age INTEGER NOT NULL CHECK (staff_age BETWEEN 18 AND 100),
  gender VARCHAR(16) NOT NULL DEFAULT 'Female',
  specialization VARCHAR(200) NOT NULL DEFAULT '',
  experience_years INTEGER NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  contact_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES caregiver_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL,
  time_slot availability_slot NOT NULL DEFAULT 'whole_day',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (caregiver_id, date)
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  reviewee_type reviewee_category NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200) NOT NULL DEFAULT '',
  comment TEXT NOT NULL,
  hospital_name VARCHAR(200),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_id UUID REFERENCES caregiver_profiles(id) ON DELETE SET NULL,
  agency_id UUID REFERENCES agency_profiles(id) ON DELETE SET NULL,
  family_name VARCHAR(160) NOT NULL,
  patient_name VARCHAR(160),
  phone VARCHAR(32) NOT NULL,
  hospital_name VARCHAR(200) NOT NULL,
  shift_needed VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  message TEXT,
  contact_method_used VARCHAR(16) NOT NULL CHECK (contact_method_used IN ('whatsapp', 'phone', 'email')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (caregiver_id IS NOT NULL OR agency_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_hospitals_district ON hospitals(district);
CREATE INDEX IF NOT EXISTS idx_caregivers_hospital ON caregiver_profiles(primary_hospital_id);
CREATE INDEX IF NOT EXISTS idx_caregivers_availability ON caregiver_profiles(availability_type);
CREATE INDEX IF NOT EXISTS idx_caregivers_price_hour ON caregiver_profiles(price_per_hour);
CREATE INDEX IF NOT EXISTS idx_caregivers_price_day ON caregiver_profiles(price_per_day);
CREATE INDEX IF NOT EXISTS idx_caregivers_age ON caregiver_profiles(age);
CREATE INDEX IF NOT EXISTS idx_agencies_hospital ON agency_profiles(primary_hospital_id);
CREATE INDEX IF NOT EXISTS idx_availability_caregiver_date ON availability(caregiver_id, date);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_caregiver ON inquiries(caregiver_id, created_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['users', 'caregiver_profiles', 'agency_profiles', 'availability', 'reviews'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I_set_updated_at ON %I', table_name, table_name);
    EXECUTE format('CREATE TRIGGER %I_set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()', table_name, table_name);
  END LOOP;
END $$;
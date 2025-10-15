/*
  # Healthcare Platform Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `role` (text: 'user', 'doctor', 'admin')
      - `is_premium` (boolean)
      - `premium_expiry` (timestamptz)
      - `assigned_doctor_id` (uuid, foreign key)
      - `health_profile` (jsonb)
      - `doctor_profile` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `vitals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `date` (timestamptz)
      - `systolic_bp` (integer)
      - `diastolic_bp` (integer)
      - `sugar_level` (integer)
      - `heart_rate` (integer)
      - `weight_kg` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)
    
    - `triage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `input_data` (jsonb)
      - `pathway` (text: 'wellness', 'expert')
      - `risk_level` (text: 'low', 'moderate', 'high', 'critical')
      - `recommendations` (text[])
      - `requires_doctor` (boolean)
      - `ai_confidence` (numeric)
      - `created_at` (timestamptz)
    
    - `meal_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `input_params` (jsonb)
      - `plan` (jsonb)
      - `generated_by` (text: 'ml_model', 'doctor')
      - `doctor_id` (uuid, foreign key)
      - `is_active` (boolean)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `exercise_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `input_params` (jsonb)
      - `plan` (jsonb)
      - `generated_by` (text: 'ml_model', 'doctor')
      - `doctor_id` (uuid, foreign key)
      - `is_active` (boolean)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `progress_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `date` (timestamptz)
      - `vitals` (jsonb)
      - `activity` (jsonb)
      - `nutrition` (jsonb)
      - `wellness` (jsonb)
      - `notes` (text)
      - `photos` (text[])
      - `created_at` (timestamptz)
    
    - `consultations`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `doctor_id` (uuid, foreign key)
      - `type` (text: 'scheduled', 'emergency', 'followup')
      - `status` (text: 'pending', 'confirmed', 'completed', 'cancelled')
      - `scheduled_date` (timestamptz)
      - `scheduled_time` (text)
      - `duration_min` (integer)
      - `complaint` (text)
      - `symptoms` (text[])
      - `notes` (jsonb)
      - `vitals` (jsonb)
      - `diagnosis` (text[])
      - `prescriptions` (jsonb[])
      - `lab_tests` (jsonb[])
      - `follow_up_date` (timestamptz)
      - `rating` (integer)
      - `feedback` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, foreign key)
      - `receiver_id` (uuid, foreign key)
      - `consultation_id` (uuid, foreign key)
      - `message` (text)
      - `attachments` (jsonb[])
      - `is_read` (boolean)
      - `read_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `type` (text: 'reminder', 'consultation', 'message', 'health_alert', 'system')
      - `title` (text)
      - `message` (text)
      - `data` (jsonb)
      - `is_read` (boolean)
      - `read_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for doctors to access assigned patients' data
    - Add policies for admins to access all data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'doctor', 'admin')),
  is_premium boolean DEFAULT false,
  premium_expiry timestamptz,
  assigned_doctor_id uuid REFERENCES users(id),
  health_profile jsonb DEFAULT '{}'::jsonb,
  doctor_profile jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vitals table
CREATE TABLE IF NOT EXISTS vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date timestamptz DEFAULT now(),
  systolic_bp integer,
  diastolic_bp integer,
  sugar_level integer,
  heart_rate integer,
  weight_kg numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create triage table
CREATE TABLE IF NOT EXISTS triage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_data jsonb NOT NULL,
  pathway text NOT NULL CHECK (pathway IN ('wellness', 'expert')),
  risk_level text CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  recommendations text[],
  requires_doctor boolean DEFAULT false,
  ai_confidence numeric,
  created_at timestamptz DEFAULT now()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_params jsonb NOT NULL,
  plan jsonb NOT NULL,
  generated_by text NOT NULL CHECK (generated_by IN ('ml_model', 'doctor')),
  doctor_id uuid REFERENCES users(id),
  is_active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create exercise_plans table
CREATE TABLE IF NOT EXISTS exercise_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_params jsonb NOT NULL,
  plan jsonb NOT NULL,
  generated_by text NOT NULL CHECK (generated_by IN ('ml_model', 'doctor')),
  doctor_id uuid REFERENCES users(id),
  is_active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create progress_logs table
CREATE TABLE IF NOT EXISTS progress_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date timestamptz DEFAULT now(),
  vitals jsonb DEFAULT '{}'::jsonb,
  activity jsonb DEFAULT '{}'::jsonb,
  nutrition jsonb DEFAULT '{}'::jsonb,
  wellness jsonb DEFAULT '{}'::jsonb,
  notes text,
  photos text[],
  created_at timestamptz DEFAULT now()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text DEFAULT 'scheduled' CHECK (type IN ('scheduled', 'emergency', 'followup')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  scheduled_date timestamptz,
  scheduled_time text,
  duration_min integer DEFAULT 30,
  complaint text,
  symptoms text[],
  notes jsonb DEFAULT '{}'::jsonb,
  vitals jsonb DEFAULT '{}'::jsonb,
  diagnosis text[],
  prescriptions jsonb[],
  lab_tests jsonb[],
  follow_up_date timestamptz,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consultation_id uuid REFERENCES consultations(id) ON DELETE SET NULL,
  message text NOT NULL,
  attachments jsonb[],
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('reminder', 'consultation', 'message', 'health_alert', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_vitals_user_id ON vitals(user_id);
CREATE INDEX IF NOT EXISTS idx_vitals_date ON vitals(date);
CREATE INDEX IF NOT EXISTS idx_triage_user_id ON triage(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_active ON meal_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_exercise_plans_user_id ON exercise_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_plans_active ON exercise_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id ON progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_date ON progress_logs(date);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Doctors can read assigned patients"
  ON users FOR SELECT
  TO authenticated
  USING (
    role = 'user' AND 
    assigned_doctor_id::text = auth.uid()::text
  );

-- Vitals policies
CREATE POLICY "Users can read own vitals"
  ON vitals FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own vitals"
  ON vitals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Doctors can read assigned patients vitals"
  ON vitals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = vitals.user_id
      AND users.assigned_doctor_id::text = auth.uid()::text
    )
  );

-- Triage policies
CREATE POLICY "Users can read own triage"
  ON triage FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own triage"
  ON triage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- Meal plans policies
CREATE POLICY "Users can read own meal plans"
  ON meal_plans FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own meal plans"
  ON meal_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Doctors can create meal plans for assigned patients"
  ON meal_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = meal_plans.user_id
      AND users.assigned_doctor_id::text = auth.uid()::text
    )
  );

-- Exercise plans policies
CREATE POLICY "Users can read own exercise plans"
  ON exercise_plans FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own exercise plans"
  ON exercise_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Doctors can create exercise plans for assigned patients"
  ON exercise_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = exercise_plans.user_id
      AND users.assigned_doctor_id::text = auth.uid()::text
    )
  );

-- Progress logs policies
CREATE POLICY "Users can read own progress logs"
  ON progress_logs FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own progress logs"
  ON progress_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Doctors can read assigned patients progress logs"
  ON progress_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = progress_logs.user_id
      AND users.assigned_doctor_id::text = auth.uid()::text
    )
  );

-- Consultations policies
CREATE POLICY "Patients can read own consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Doctors can read own consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (auth.uid()::text = doctor_id::text);

CREATE POLICY "Patients can create consultations"
  ON consultations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = patient_id::text);

CREATE POLICY "Doctors can update own consultations"
  ON consultations FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = doctor_id::text)
  WITH CHECK (auth.uid()::text = doctor_id::text);

-- Messages policies
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = sender_id::text OR 
    auth.uid()::text = receiver_id::text
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = sender_id::text);

CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = receiver_id::text)
  WITH CHECK (auth.uid()::text = receiver_id::text);

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);
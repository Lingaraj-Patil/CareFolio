import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'doctor' | 'admin';
  is_premium: boolean;
  premium_expiry?: string;
  assigned_doctor_id?: string;
  health_profile: any;
  doctor_profile?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vitals {
  id: string;
  user_id: string;
  date: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  sugar_level?: number;
  heart_rate?: number;
  weight_kg?: number;
  notes?: string;
  created_at: string;
}

export interface Triage {
  id: string;
  user_id: string;
  input_data: any;
  pathway: 'wellness' | 'expert';
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  recommendations: string[];
  requires_doctor: boolean;
  ai_confidence?: number;
  created_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  input_params: any;
  plan: any;
  generated_by: 'ml_model' | 'doctor';
  doctor_id?: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface ExercisePlan {
  id: string;
  user_id: string;
  input_params: any;
  plan: any;
  generated_by: 'ml_model' | 'doctor';
  doctor_id?: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface ProgressLog {
  id: string;
  user_id: string;
  date: string;
  vitals: any;
  activity: any;
  nutrition: any;
  wellness: any;
  notes?: string;
  photos?: string[];
  created_at: string;
}

export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string;
  type: 'scheduled' | 'emergency' | 'followup';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduled_date?: string;
  scheduled_time?: string;
  duration_min: number;
  complaint?: string;
  symptoms?: string[];
  notes: any;
  vitals: any;
  diagnosis?: string[];
  prescriptions?: any[];
  lab_tests?: any[];
  follow_up_date?: string;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  consultation_id?: string;
  message: string;
  attachments?: any[];
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'reminder' | 'consultation' | 'message' | 'health_alert' | 'system';
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

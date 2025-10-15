import { supabase } from './supabase';
import type { Vitals, Triage, MealPlan, ExercisePlan, ProgressLog, Consultation, Message, Notification } from './supabase';

export const api = {
  vitals: {
    async create(data: Omit<Vitals, 'id' | 'created_at'>) {
      const { data: vitals, error } = await supabase
        .from('vitals')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return vitals;
    },

    async getByUserId(userId: string, limit = 30) {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },

    async getLatest(userId: string) {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  },

  triage: {
    async create(data: Omit<Triage, 'id' | 'created_at'>) {
      const { data: triage, error } = await supabase
        .from('triage')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return triage;
    },

    async getLatest(userId: string) {
      const { data, error } = await supabase
        .from('triage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  },

  mealPlans: {
    async create(data: Omit<MealPlan, 'id' | 'created_at'>) {
      await supabase
        .from('meal_plans')
        .update({ is_active: false })
        .eq('user_id', data.user_id);

      const { data: plan, error } = await supabase
        .from('meal_plans')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return plan;
    },

    async getActive(userId: string) {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async getHistory(userId: string) {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  },

  exercisePlans: {
    async create(data: Omit<ExercisePlan, 'id' | 'created_at'>) {
      await supabase
        .from('exercise_plans')
        .update({ is_active: false })
        .eq('user_id', data.user_id);

      const { data: plan, error } = await supabase
        .from('exercise_plans')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return plan;
    },

    async getActive(userId: string) {
      const { data, error } = await supabase
        .from('exercise_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async getHistory(userId: string) {
      const { data, error } = await supabase
        .from('exercise_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  },

  progressLogs: {
    async create(data: Omit<ProgressLog, 'id' | 'created_at'>) {
      const { data: log, error } = await supabase
        .from('progress_logs')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return log;
    },

    async getByUserId(userId: string, limit = 30) {
      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },

    async getStats(userId: string, days = 30) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },
  },

  consultations: {
    async create(data: Omit<Consultation, 'id' | 'created_at' | 'updated_at'>) {
      const { data: consultation, error } = await supabase
        .from('consultations')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return consultation;
    },

    async getByPatientId(patientId: string) {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          doctor:doctor_id(first_name, last_name, doctor_profile)
        `)
        .eq('patient_id', patientId)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getByDoctorId(doctorId: string) {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          patient:patient_id(first_name, last_name, health_profile)
        `)
        .eq('doctor_id', doctorId)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      return data;
    },

    async updateStatus(id: string, status: Consultation['status']) {
      const { data, error } = await supabase
        .from('consultations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async addNotes(id: string, updates: Partial<Consultation>) {
      const { data, error } = await supabase
        .from('consultations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  messages: {
    async send(data: Omit<Message, 'id' | 'created_at' | 'is_read' | 'read_at'>) {
      const { data: message, error } = await supabase
        .from('messages')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return message;
    },

    async getConversation(userId: string, otherUserId: string) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },

    async markAsRead(messageId: string) {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;
    },
  },

  notifications: {
    async create(data: Omit<Notification, 'id' | 'created_at' | 'is_read' | 'read_at'>) {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return notification;
    },

    async getByUserId(userId: string, unreadOnly = false) {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async markAsRead(notificationId: string) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    },

    async markAllAsRead(userId: string) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    },
  },

  doctors: {
    async getAll() {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getPatients(doctorId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('assigned_doctor_id', doctorId)
        .eq('role', 'user')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  },

  admin: {
    async getAllUsers(role?: string) {
      let query = supabase.from('users').select('*');

      if (role) {
        query = query.eq('role', role);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async updatePremiumStatus(userId: string, isPremium: boolean, premiumDuration?: number) {
      const updates: any = { is_premium: isPremium };

      if (isPremium && premiumDuration) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + premiumDuration);
        updates.premium_expiry = expiryDate.toISOString();
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async assignDoctor(userId: string, doctorId: string) {
      const { data, error } = await supabase
        .from('users')
        .update({ assigned_doctor_id: doctorId })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },
};

export const generateFallbackMealPlan = (params: any) => {
  const { fitness_goal, has_diabetes, has_hypertension, tdee = 2000 } = params;

  let targetCalories = tdee;
  if (fitness_goal === 'weight_loss') targetCalories = tdee - 500;
  if (fitness_goal === 'weight_gain') targetCalories = tdee + 500;

  return {
    daily_calories: targetCalories,
    macros: {
      protein_g: Math.round(targetCalories * 0.3 / 4),
      carbs_g: Math.round(targetCalories * 0.4 / 4),
      fats_g: Math.round(targetCalories * 0.3 / 9)
    },
    meals: [
      {
        meal_type: 'breakfast',
        name: 'Healthy Breakfast',
        calories: Math.round(targetCalories * 0.25),
        protein_g: 20,
        carbs_g: 40,
        fats_g: 10,
        ingredients: ['Oats', 'Milk', 'Banana', 'Almonds'],
        instructions: 'Cook oats with milk, top with banana and almonds',
        time: '08:00'
      },
      {
        meal_type: 'lunch',
        name: 'Balanced Lunch',
        calories: Math.round(targetCalories * 0.35),
        protein_g: 30,
        carbs_g: 50,
        fats_g: 15,
        ingredients: ['Chicken', 'Rice', 'Vegetables', 'Olive Oil'],
        instructions: 'Grilled chicken with brown rice and steamed vegetables',
        time: '13:00'
      },
      {
        meal_type: 'dinner',
        name: 'Light Dinner',
        calories: Math.round(targetCalories * 0.3),
        protein_g: 25,
        carbs_g: 35,
        fats_g: 12,
        ingredients: ['Fish', 'Quinoa', 'Salad'],
        instructions: 'Baked fish with quinoa and fresh salad',
        time: '19:00'
      }
    ],
    hydration_liters: 2.5,
    supplements: has_diabetes ? ['Vitamin D', 'Omega-3'] : ['Multivitamin'],
    restrictions: [
      has_diabetes ? 'Low sugar, complex carbs only' : '',
      has_hypertension ? 'Low sodium' : ''
    ].filter(Boolean)
  };
};

export const generateFallbackExercisePlan = (params: any) => {
  const { fitness_goal, experience_level, days_per_week = 3, conditions = [] } = params;

  const hasCondition = conditions && conditions.length > 0;
  const intensity = hasCondition ? 'low' : (experience_level === 'beginner' ? 'moderate' : 'high');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return {
    weekly_schedule: Array.from({ length: days_per_week }, (_, i) => ({
      day: days[i],
      exercises: [
        {
          name: 'Brisk Walk',
          type: 'cardio',
          duration: '20 min',
          intensity: 'low',
          instructions: 'Walk at a comfortable but brisk pace',
          precautions: hasCondition ? ['Monitor heart rate', 'Stop if dizzy'] : []
        },
        {
          name: 'Bodyweight Squats',
          type: 'strength',
          sets: 3,
          reps: 12,
          intensity,
          rest_seconds: 60,
          instructions: 'Keep back straight, knees behind toes',
          precautions: []
        },
        {
          name: 'Stretching',
          type: 'flexibility',
          duration: '10 min',
          intensity: 'low',
          instructions: 'Hold each stretch for 30 seconds',
          precautions: []
        }
      ],
      total_duration_min: 45,
      calories_burned: 250
    })),
    warm_up: ['Light jogging in place - 3 min', 'Arm circles - 1 min', 'Leg swings - 2 min'],
    cool_down: ['Walking - 3 min', 'Full body stretching - 5 min'],
    weekly_goal: fitness_goal === 'weight_loss' ? 'Burn 1500 calories' : 'Build strength and endurance',
    safety_notes: hasCondition
      ? ['Consult doctor before starting', 'Monitor vitals', 'Start slow', 'Stay hydrated']
      : ['Stay hydrated', 'Listen to your body', 'Rest when needed']
  };
};

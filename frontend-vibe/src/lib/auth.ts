import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'doctor' | 'admin';
  isPremium: boolean;
  healthProfile?: any;
  doctorProfile?: any;
}

export const authService = {
  async signUp(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'user' | 'doctor' | 'admin';
  }) {
    const { email, password, firstName, lastName, phone, role = 'user' } = data;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role,
        },
      },
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role,
        health_profile: {},
        doctor_profile: {},
      });

      if (userError) throw userError;
    }

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      return {
        session: data.session,
        user: userData,
      };
    }

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;

    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role,
      isPremium: userData.is_premium,
      healthProfile: userData.health_profile,
      doctorProfile: userData.doctor_profile,
    };
  },

  async updateProfile(userId: string, updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    healthProfile?: any;
    doctorProfile?: any;
  }) {
    const updateData: any = {};

    if (updates.firstName) updateData.first_name = updates.firstName;
    if (updates.lastName) updateData.last_name = updates.lastName;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.healthProfile) updateData.health_profile = updates.healthProfile;
    if (updates.doctorProfile) updateData.doctor_profile = updates.doctorProfile;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};

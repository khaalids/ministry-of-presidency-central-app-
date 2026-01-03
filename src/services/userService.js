import { supabase } from '../lib/supabase';

export const userService = {
  async getAllUsers() {
    const { data, error } = await supabase
      ?.from('user_profiles')
      ?.select('*, department:departments(id, name)')
      ?.order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      email: row?.email,
      fullName: row?.full_name,
      role: row?.role,
      departmentId: row?.department_id,
      department: row?.department,
      avatarUrl: row?.avatar_url,
      isActive: row?.is_active,
      createdAt: row?.created_at,
      updatedAt: row?.updated_at
    })) || [];
  },

  async createUser(userData) {
    // Create auth user first
    const { data: authData, error: authError } = await supabase?.auth?.admin?.createUser({
      email: userData?.email,
      password: userData?.password || 'ChangeMe123!',
      email_confirm: true,
      user_metadata: {
        full_name: userData?.fullName,
        role: userData?.role
      }
    });

    if (authError) throw authError;

    // Update user profile with department
    if (authData?.user && userData?.departmentId) {
      const { error: profileError } = await supabase
        ?.from('user_profiles')
        ?.update({ department_id: userData?.departmentId })
        ?.eq('id', authData?.user?.id);

      if (profileError) throw profileError;
    }

    return authData?.user;
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      ?.from('user_profiles')
      ?.update({
        full_name: updates?.fullName,
        role: updates?.role,
        department_id: updates?.departmentId,
        is_active: updates?.isActive
      })
      ?.eq('id', userId)
      ?.select('*, department:departments(id, name)')
      ?.single();

    if (error) throw error;

    return {
      id: data?.id,
      email: data?.email,
      fullName: data?.full_name,
      role: data?.role,
      departmentId: data?.department_id,
      department: data?.department,
      avatarUrl: data?.avatar_url,
      isActive: data?.is_active,
      createdAt: data?.created_at,
      updatedAt: data?.updated_at
    };
  },

  async deactivateUser(userId) {
    const { error } = await supabase
      ?.from('user_profiles')
      ?.update({ is_active: false })
      ?.eq('id', userId);

    if (error) throw error;
  },

  async reactivateUser(userId) {
    const { error } = await supabase
      ?.from('user_profiles')
      ?.update({ is_active: true })
      ?.eq('id', userId);

    if (error) throw error;
  },

  async resetUserPassword(userId) {
    const { data, error } = await supabase
      ?.from('user_profiles')
      ?.select('email')
      ?.eq('id', userId)
      ?.single();

    if (error) throw error;

    const { error: resetError } = await supabase?.auth?.resetPasswordForEmail(data?.email);

    if (resetError) throw resetError;
  }
};
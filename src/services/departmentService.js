import { supabase } from '../lib/supabase';

export const departmentService = {
  async getAllDepartments() {
    const { data, error } = await supabase?.from('departments')?.select('*')?.order('name', { ascending: true });

    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      name: row?.name,
      description: row?.description,
      createdAt: row?.created_at,
      updatedAt: row?.updated_at
    })) || [];
  },

  async getDepartmentUsers(departmentId) {
    const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('department_id', departmentId)?.eq('is_active', true)?.order('full_name', { ascending: true });

    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      email: row?.email,
      fullName: row?.full_name,
      role: row?.role,
      departmentId: row?.department_id,
      avatarUrl: row?.avatar_url,
      isActive: row?.is_active
    })) || [];
  }
};
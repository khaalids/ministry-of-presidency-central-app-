import { supabase } from '../lib/supabase';

export const ministryService = {
  async getAllMinistries() {
    const { data, error } = await supabase
      ?.from('ministries')
      ?.select('*')
      ?.order('name', { ascending: true });

    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      name: row?.name,
      description: row?.description,
      code: row?.code,
      isActive: row?.is_active,
      createdAt: row?.created_at,
      updatedAt: row?.updated_at
    })) || [];
  },

  async createMinistry(ministryData) {
    const { data, error } = await supabase
      ?.from('ministries')
      ?.insert({
        name: ministryData?.name,
        description: ministryData?.description || null,
        code: ministryData?.code || null,
        is_active: ministryData?.isActive !== undefined ? ministryData?.isActive : true
      })
      ?.select()
      ?.single();

    if (error) throw error;

    return {
      id: data?.id,
      name: data?.name,
      description: data?.description,
      code: data?.code,
      isActive: data?.is_active,
      createdAt: data?.created_at,
      updatedAt: data?.updated_at
    };
  },

  async updateMinistry(ministryId, updates) {
    const { data, error } = await supabase
      ?.from('ministries')
      ?.update({
        name: updates?.name,
        description: updates?.description,
        code: updates?.code,
        is_active: updates?.isActive
      })
      ?.eq('id', ministryId)
      ?.select()
      ?.single();

    if (error) throw error;

    return {
      id: data?.id,
      name: data?.name,
      description: data?.description,
      code: data?.code,
      isActive: data?.is_active,
      createdAt: data?.created_at,
      updatedAt: data?.updated_at
    };
  },

  async deleteMinistry(ministryId) {
    const { error } = await supabase
      ?.from('ministries')
      ?.delete()
      ?.eq('id', ministryId);

    if (error) throw error;
  }
};


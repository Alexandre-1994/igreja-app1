import { supabase } from '../services/supabase';

export const getUserRole = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.user_metadata?.role || null;
};

export const canManageMembers = async (): Promise<boolean> => {
    const role = await getUserRole();
    return ['super_admin', 'admin', 'user'].includes(role || '');
};

export const canManageUsers = async (): Promise<boolean> => {
    const role = await getUserRole();
    return role === 'super_admin';
};
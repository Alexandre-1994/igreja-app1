import { supabase } from '../services/supabase';

export const getUserRole = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.user_metadata?.role || 'user'; // Default role como 'user'
};

export const canManageMembers = async (): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Se o usuário está autenticado, permite acesso básico
        if (user) {
            const role = user.user_metadata?.role || 'user';
            return ['super_admin', 'admin', 'user'].includes(role);
        }
        
        return false;
    } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
    }
};

export const canManageUsers = async (): Promise<boolean> => {
    try {
        const role = await getUserRole();
        return role === 'super_admin';
    } catch (error) {
        console.error('Error checking user management permissions:', error);
        return false;
    }
};
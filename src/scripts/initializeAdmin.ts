import { supabase } from '../services/supabase';
import { INITIAL_ADMIN } from '../config/initialAdmin';

const initializeAdmin = async () => {
    try {
        // Verificar se já existe um super admin
        const { data: existingAdmin } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'super_admin')
            .single();

        if (existingAdmin) {
            console.log('Super admin já existe');
            return;
        }

        // Criar o primeiro super admin
        const { data, error } = await supabase.auth.signUp({
            email: INITIAL_ADMIN.email,
            password: INITIAL_ADMIN.password,
            options: {
                data: {
                    role: INITIAL_ADMIN.role
                }
            }
        });

        if (error) throw error;

        // Adicionar à tabela de usuários
        await supabase.from('users').insert([{
            id: data.user?.id,
            email: INITIAL_ADMIN.email,
            role: INITIAL_ADMIN.role,
            created_at: new Date()
        }]);

        console.log('Super admin criado com sucesso');
    } catch (error) {
        console.error('Erro ao criar super admin:', error);
    }
};

export default initializeAdmin;
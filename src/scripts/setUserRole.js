// Script para definir role do usuário logado
// Execute este código no console do navegador após fazer login

const setUserRole = async (role = 'user') => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        const { data, error } = await supabase.auth.updateUser({
            data: { role: role }
        });
        
        if (error) {
            console.error('Erro ao definir role:', error);
        } else {
            console.log('Role definida com sucesso:', role);
            console.log('Dados do usuário:', data);
        }
    }
};

// Para usar:
// setUserRole('admin') - para admin
// setUserRole('super_admin') - para super admin  
// setUserRole('user') - para usuário normal (padrão)

console.log('Script carregado. Use setUserRole("admin") para definir role.');

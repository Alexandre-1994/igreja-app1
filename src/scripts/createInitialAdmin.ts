const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const createInitialAdmin = async () => {
    const adminEmail = 'alexandresitole@gmail.com';
    const adminPassword = 'Admin@123456';

    try {
        // Create user with admin privileges
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
            user_metadata: { role: 'super_admin' }
        });

        if (authError) {
            console.error('Auth Error:', authError);
            throw authError;
        }

        if (!authData.user) {
            throw new Error('No user data returned');
        }

        // Insert into users table
        const { error: dbError } = await supabase
            .from('users')
            .insert([{
                id: authData.user.id,
                email: adminEmail,
                role: 'super_admin'
            }]);

        if (dbError) {
            console.error('DB Error:', dbError);
            throw dbError;
        }

        console.log('Super admin created successfully');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);

    } catch (error) {
        console.error('Error creating super admin:', error);
    }
};

createInitialAdmin();
import React, { useState, useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { supabase } from '../services/supabase';
import LoadingSpinner from './LoadingSpinner';

interface PrivateRouteProps extends RouteProps {
    component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const [session, setSession] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar sessão inicial
        checkSession();

        // CHAVE: Escutar mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email);
                
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    setSession(!!session);
                    setLoading(false);
                } else if (event === 'SIGNED_OUT') {
                    setSession(false);
                    setLoading(false);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(!!session);
        } catch (error) {
            console.error('Error checking session:', error);
            setSession(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Verificando autenticação..." />;
    }

    return (
        <Route
            {...rest}
            render={props =>
                session ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
import React, { useState, useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { showFeedback } from '../services/feedback';
import './MainLayout.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const history = useHistory();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Verificar sessão existente
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                history.push('/');
            }
        };
        
        checkSession();
        
        // Escutar mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_OUT' || !session) {
                    history.push('/');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [history]);

    return (
        <div className={`main-layout ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1 className="app-logo">Ekklesia</h1>
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink 
                        to="/app" 
                        exact 
                        className="nav-item" 
                        activeClassName="active"
                    >
                        <span className="nav-icon">📊</span>
                        <span className="nav-text">Dashboard</span>
                    </NavLink>
                    <NavLink 
                        to="/app/members" 
                        className="nav-item" 
                        activeClassName="active"
                    >
                        <span className="nav-icon">👥</span>
                        <span className="nav-text">Membros</span>
                    </NavLink>
                    {/* ...other navigation items... */}
                </nav>
                
                {/* Footer with About link */}
                <div className="sidebar-footer">
                    <NavLink 
                        to="/app/about" 
                        className="about-link" 
                        activeClassName="active"
                    >
                        <span className="nav-icon">ℹ️</span>
                        <span className="nav-text">Sobre</span>
                    </NavLink>
                    <div className="version">v1.0.0</div>
                </div>
            </div>

            {/* Main content */}
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
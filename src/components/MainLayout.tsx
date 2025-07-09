import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  hasPermission?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hasPermission = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();
  
  // Função para navegar e fechar o menu em dispositivos móveis
  const navigateTo = (path: string) => {
    history.push(path);
    // Em dispositivos móveis, fechar o menu após navegação
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  };
  
  // Detectar a rota atual para destacar item ativo
  const currentPath = location.pathname;
  
  return (
    <div className="app-container">
      {/* Menu Lateral */}
      <>
        <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>
        <div className={`sidemenu ${menuOpen ? 'open' : ''}`}>
          <div className="sidemenu-header">
            <h3 className="sidemenu-title">ICUM/SNF</h3>
            <button className="close-menu-btn" onClick={() => setMenuOpen(false)}>✕</button>
          </div>
          <div className="sidemenu-content">
            {/* Item Dashboard */}
            <div 
              className={`menu-item ${currentPath.includes('/home') ? 'active' : ''}`}
              onClick={() => navigateTo('/app/home')}
            >
              <span className="menu-icon">📊</span>
              <span className="menu-text">Dashboard</span>
            </div>
            
            {/* Lista de Membros */}
            <div 
              className={`menu-item ${currentPath.includes('/members') ? 'active' : ''}`}
              onClick={() => navigateTo('/app/members')}
            >
              <span className="menu-icon">👥</span>
              <span className="menu-text">Membros</span>
            </div>
            
            {/* Adicionar Membro - visível apenas com permissão */}
            {hasPermission && (
              <div 
                className={`menu-item ${currentPath.includes('/add') ? 'active' : ''}`}
                onClick={() => navigateTo('/app/add')}
              >
                <span className="menu-icon">➕</span>
                <span className="menu-text">Adicionar Membro</span>
              </div>
            )}
            
            {/* Gerenciamento de Usuários - visível apenas com permissão */}
            {hasPermission && (
              <div 
                className={`menu-item ${currentPath.includes('/users') ? 'active' : ''}`}
                onClick={() => navigateTo('/app/users')}
              >
                <span className="menu-icon">👤</span>
                <span className="menu-text">Gerenciar Usuários</span>
              </div>
            )}
            
            {/* Componentes Tailwind - para desenvolvimento */}
            <div 
              className={`menu-item ${currentPath.includes('/test-tailwind') ? 'active' : ''}`}
              onClick={() => navigateTo('/app/test-tailwind')}
            >
              <span className="menu-icon">🎨</span>
              <span className="menu-text">UI Components</span>
            </div>
            
            {/* Separador */}
            <div className="menu-separator"></div>
            
            {/* Logout */}
            <div 
              className="menu-item"
              onClick={async () => {
                await supabase.auth.signOut();
                history.push('/login');
              }}
            >
              <span className="menu-icon">🚪</span>
              <span className="menu-text">Sair</span>
            </div>
          </div>
        </div>
      </>
      
      {/* Conteúdo principal */}
      <div className={`main-content ${menuOpen ? 'menu-open' : ''}`}>
        {/* Botão do menu (visível apenas em mobile) */}
        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
        
        {/* Conteúdo da página */}
        {children}
      </div>
    </div>
  );
};

export default MainLayout;

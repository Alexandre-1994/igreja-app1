import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback } from '../services/feedback';
import './Home.css';

// Componente simples de spinner
const Spinner = ({ message }: { message: string }) => (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

// Componente de card estatístico simplificado
const StatCard = ({ title, value, subtitle, icon, className }: { 
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  className?: string;
}) => (
  <div className={`stat-card ${className || ''}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h3>{title}</h3>
      <h2>{value}</h2>
      <p>{subtitle}</p>
    </div>
  </div>
);

// Cores para o gráfico de regiões
const regionColors = [
  '#3880ff', // Azul
  '#3ec170', // Verde
  '#ff9a2f', // Laranja
  '#f53d3d', // Vermelho
  '#7044ff'  // Roxo
];

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    masculino: 0,
    feminino: 0,
    recentMembers: [] as Member[],
    regioes: {} as Record<string, number>
  });
  const [userName, setUserName] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const history = useHistory();
  
  useEffect(() => {
    fetchDashboardData();
    getCurrentUser();
    
    // Esconder a mensagem de boas-vindas após 5 segundos
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Usar o email ou metadados personalizados para obter o nome
        setUserName(user.email || 'usuário');
      }
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Obter contagem total de membros
      const { count: totalCount, error: countError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Obter contagem por gênero
      const { data: genderData, error: genderError } = await supabase
        .from('members')
        .select('genero');
      
      if (genderError) throw genderError;
      
      const masculino = genderData?.filter(m => m.genero === 'Masculino').length || 0;
      const feminino = genderData?.filter(m => m.genero === 'Feminino').length || 0;
      
      // Obter membros recentes
      const { data: recentData, error: recentError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentError) throw recentError;
      
      // Obter distribuição por região
      const { data: regionData, error: regionError } = await supabase
        .from('members')
        .select('regiao');
      
      if (regionError) throw regionError;
      
      const regioes = regionData?.reduce((acc, member) => {
        acc[member.regiao] = (acc[member.regiao] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      setStats({
        total: totalCount || 0,
        masculino,
        feminino,
        recentMembers: recentData || [],
        regioes
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      showFeedback('Erro ao carregar estatísticas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular percentual por gênero
  const malePercent = stats.total > 0 ? Math.round((stats.masculino / stats.total) * 100) : 0;
  const femalePercent = stats.total > 0 ? Math.round((stats.feminino / stats.total) * 100) : 0;
  
  // Obter as três maiores regiões
  const topRegions = Object.entries(stats.regioes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="dashboard-page scrollable-content">
      {isLoading && <Spinner message="Carregando estatísticas..." />}
      
      {/* Mensagem de boas-vindas temporária */}
      {showWelcome && userName && (
        <div className="welcome-message">
          <div className="welcome-content">
            <h2>Bem-vindo(a), {userName.split('@')[0]}!</h2>
            <p>Sistema de gestão ICUM/SNF</p>
          </div>
        </div>
      )}
      
      <header className="page-header">
        <h1>Dashboard</h1>
        <button 
          className="refresh-button" 
          onClick={fetchDashboardData} 
          title="Atualizar dados"
        >
          ↻ Atualizar
        </button>
      </header>

      <main className="dashboard-content">
        {/* Estatísticas Gerais em formato de gráfico */}
        <section className="stats-overview chart-section">
          <h2 className="section-title">Estatísticas Gerais</h2>
          
          <div className="gender-stats-container">
            {/* Card do total com número grande */}
            <div className="total-members-card">
              <h3>Total de Membros</h3>
              <div className="total-number">{stats.total}</div>
              <p>Membros cadastrados no sistema</p>
            </div>
            
            {/* Gráfico de distribuição por gênero */}
            <div className="gender-chart-container">
              <h3>Distribuição por Gênero</h3>
              <div className="pie-chart-wrapper">
                <div 
                  className="pie-chart" 
                  style={{
                    background: stats.total > 0 
                      ? `conic-gradient(
                          #3880ff 0% ${malePercent}%, 
                          #ff6b9a ${malePercent}% 100%
                        )`
                      : '#f0f0f0'
                  }}
                >
                  {stats.total === 0 && <span className="no-data">Sem dados</span>}
                </div>
                
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: '#3880ff'}}></span>
                    <span className="legend-label">Masculino</span>
                    <span className="legend-value">{stats.masculino} ({malePercent}%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: '#ff6b9a'}}></span>
                    <span className="legend-label">Feminino</span>
                    <span className="legend-value">{stats.feminino} ({femalePercent}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Principais regiões - Formato de gráfico */}
        <section className="top-regions chart-section">
          <h2 className="section-title">Distribuição por Região</h2>
          
          <div className="chart-container">
            {/* Gráfico de barras horizontal */}
            <div className="horizontal-chart">
              {Object.entries(stats.regioes)
                .sort(([, a], [, b]) => b - a)
                .map(([regiao, count], index) => {
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div className="chart-row" key={regiao}>
                      <div className="chart-label">
                        <span className="region-name">{regiao}</span>
                      </div>
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar" 
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: regionColors[index % regionColors.length]
                          }}
                        >
                          <span className="chart-value">{count}</span>
                        </div>
                      </div>
                      <div className="chart-percent">{Math.round(percentage)}%</div>
                    </div>
                  );
                })
              }
            </div>
            
            {/* Informação total */}
            <div className="chart-footer">
              <span className="chart-footer-info">Total de membros: {stats.total}</span>
            </div>
          </div>
        </section>

        {/* Ações rápidas */}
        {/* <section className="quick-actions">
          <h2 className="section-title">Ações Rápidas</h2>
          <div className="actions-grid">
            <button 
              className="action-card"
              onClick={() => history.push('/app/members')}
            >
              <span className="action-icon">👥</span>
              <span className="action-text">Ver Todos os Membros</span>
            </button>
            
            <button 
              className="action-card"
              onClick={() => history.push('/app/add')}
            >
              <span className="action-icon">➕</span>
              <span className="action-text">Adicionar Novo Membro</span>
            </button>
            
            <button 
              className="action-card"
              onClick={() => history.push('/app/users')}
            >
              <span className="action-icon">👤</span>
              <span className="action-text">Gerenciar Usuários</span>
            </button>
          </div>
        </section> */}

        {/* Atividade recente */}
        {stats.recentMembers.length > 0 && (
          <section className="recent-activity">
            <h2 className="section-title">Membros Recentes</h2>
            <div className="activity-list">
              {stats.recentMembers.map(member => (
                <div className="activity-item" key={member.id}>
                  <div className="member-avatar">
                    {member.nome_completo.charAt(0).toUpperCase()}
                  </div>
                  <div className="activity-details">
                    <h3>{member.nome_completo}</h3>
                    <p>{member.regiao} • {member.paroquia}</p>
                  </div>
                  <button 
                    className="view-button"
                    onClick={() => history.push(`/app/edit/${member.id}`)}
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>
            
            <div className="view-all">
              <button 
                className="view-all-button"
                onClick={() => history.push('/app/members')}
              >
                Ver todos os membros
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
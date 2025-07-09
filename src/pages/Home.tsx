import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback, confirmAction } from '../services/feedback';
import { canManageMembers } from '../utils/permissions';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import './Home.css';

// Componente simples de spinner
const Spinner = ({ message }: { message: string }) => (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

// Componente de card estatístico
const StatCard = ({ title, value, subtitle, icon, className }: { 
  title: string;
  value: number;
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

// Componente de barra de pesquisa
const SearchBar = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Buscar membros por nome..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <button className="clear-button" onClick={() => onChange('')} style={{ visibility: value ? 'visible' : 'hidden' }}>
      ✕
    </button>
  </div>
);

// Componente de seleção simples
const Select = ({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: { value: string; label: string }[]; 
  placeholder: string;
}) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="simple-select"
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Componente de membro
const MemberCard = ({ 
  member,
  onEdit
}: { 
  member: Member;
  onEdit: (member: Member) => void;
}) => (
  <div className="member-card">
    <div className="member-avatar">
      {member.nome_completo.charAt(0).toUpperCase()}
    </div>
    <div className="member-info">
      <h4>{member.nome_completo}</h4>
      <p className="member-meta">{member.regiao} • {member.paroquia}</p>
      <span className="member-tag">{member.funcao}</span>
    </div>
    <button className="edit-button" onClick={() => onEdit(member)}>
      Editar
    </button>
  </div>
);

// Componente de menu lateral atualizado com rotas reais do sistema
interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  hasPermission: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, hasPermission }) => {
  const history = useHistory();
  
  // Função para navegar e fechar o menu em dispositivos móveis
  const navigateTo = (path: string) => {
    history.push(path);
    // Em dispositivos móveis, fechar o menu após navegação
    if (window.innerWidth <= 768) {
      onClose();
    }
  };
  
  // Detectar a rota atual para destacar item ativo
  const currentPath = history.location.pathname;
  
  return (
    <>
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidemenu ${isOpen ? 'open' : ''}`}>
        <div className="sidemenu-header">
          <h3 className="sidemenu-title">ICUM/SNF</h3>
          <button className="close-menu-btn" onClick={onClose}>✕</button>
        </div>
        <div className="sidemenu-content">
          {/* Item Dashboard */}
          <div 
            className={`menu-item ${currentPath === '/home' ? 'active' : ''}`}
            onClick={() => navigateTo('/home')}
          >
            <span className="menu-icon">📊</span>
            <span className="menu-text">Dashboard</span>
          </div>
          
          {/* Lista de Membros */}
          <div 
            className={`menu-item ${currentPath === '/members' ? 'active' : ''}`}
            onClick={() => navigateTo('/members')}
          >
            <span className="menu-icon">👥</span>
            <span className="menu-text">Membros</span>
          </div>
          
          {/* Adicionar Membro - visível apenas com permissão */}
          {hasPermission && (
            <div 
              className={`menu-item ${currentPath === '/add' ? 'active' : ''}`}
              onClick={() => navigateTo('/add')}
            >
              <span className="menu-icon">➕</span>
              <span className="menu-text">Adicionar Membro</span>
            </div>
          )}
          
          {/* Gerenciamento de Usuários - visível apenas com permissão */}
          {hasPermission && (
            <div 
              className={`menu-item ${currentPath === '/users' ? 'active' : ''}`}
              onClick={() => navigateTo('/users')}
            >
              <span className="menu-icon">👤</span>
              <span className="menu-text">Gerenciar Usuários</span>
            </div>
          )}
          
          {/* Componentes Tailwind - para desenvolvimento */}
          <div 
            className={`menu-item ${currentPath === '/test-tailwind' ? 'active' : ''}`}
            onClick={() => navigateTo('/test-tailwind')}
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
  );
};

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    masculino: 0,
    feminino: 0,
    regioes: {} as Record<string, number>
  });
  const [searchText, setSearchText] = useState('');
  const [filterRegiao, setFilterRegiao] = useState('');
  const [filterGenero, setFilterGenero] = useState('');
  const [filterParoquia, setFilterParoquia] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useHistory();
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    checkPermissions();
    fetchMembers();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [members]);

  const checkPermissions = async () => {
    try {
      const permitted = await canManageMembers();
      setHasPermission(permitted);
      
      if (!permitted) {
        showFeedback('Acesso limitado - algumas funcionalidades podem estar restritas', 'warning');
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasPermission(false);
    }
  };

  const calculateStats = () => {
    const regioes = members.reduce((acc, member) => {
      acc[member.regiao] = (acc[member.regiao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({
      total: members.length,
      masculino: members.filter(m => m.genero === 'Masculino').length,
      feminino: members.filter(m => m.genero === 'Feminino').length,
      regioes
    });
  };

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('nome_completo');

      if (error) {
        showFeedback('Erro ao carregar dados dos membros', 'error');
        return;
      }

      setMembers(data || []);
      showFeedback('Dados atualizados com sucesso', 'success');
    } catch (error) {
      showFeedback('Erro ao acessar o servidor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: Member) => {
    history.push(`/edit/${member.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const willDelete = await confirmAction(
        'Confirmar Exclusão',
        'Deseja realmente excluir este membro?',
        'Excluir',
        'Cancelar'
      );

      if (!willDelete) return;

      setIsLoading(true);
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) {
        showFeedback('Erro ao excluir membro', 'error');
        return;
      }

      await fetchMembers();
      showFeedback('Membro excluído com sucesso', 'success');
    } catch (error) {
      showFeedback('Erro ao processar a exclusão', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.nome_completo.toLowerCase().includes(searchText.toLowerCase());
    const matchesRegiao = filterRegiao ? member.regiao === filterRegiao : true;
    const matchesGenero = filterGenero ? member.genero === filterGenero : true;
    const matchesParoquia = filterParoquia ? member.paroquia === filterParoquia : true;
    return matchesSearch && matchesRegiao && matchesGenero && matchesParoquia;
  });
  
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Relatório de Membros', 14, 15);
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 25);

    doc.text(`Total de Membros: ${stats.total}`, 14, 35);
    doc.text(`Masculino: ${stats.masculino}`, 14, 42);
    doc.text(`Feminino: ${stats.feminino}`, 14, 49);

    const tableColumn = ["Nome", "Região", "Paróquia", "Função", "Gênero"];
    const tableRows = filteredMembers.map(member => [
      member.nome_completo,
      member.regiao,
      member.paroquia,
      member.funcao,
      member.genero
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('relatorio-membros.pdf');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      history.push('/login');
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setFilterRegiao('');
    setFilterGenero('');
    setFilterParoquia('');
  };

  return (
    <div className="app-container">
      <SideMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        hasPermission={hasPermission}
      />
      
      <div className={`dashboard ${menuOpen ? 'menu-open' : ''}`}>
        {isLoading && <Spinner message="Carregando dados..." />}
        
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="menu-toggle" 
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
            <div className="header-title">
              <h1>Dashboard</h1>
            </div>
          </div>
          <div className="header-actions">
            <button className="refresh-button" onClick={fetchMembers} title="Atualizar dados">
              ↻
            </button>
            <button 
              className="add-button" 
              onClick={() => history.push('/add')}
              disabled={!hasPermission}
            >
              + Novo Membro
            </button>
            <button className="logout-button" onClick={handleLogout} title="Sair">
              Sair
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          {/* Seção de boas-vindas */}
          <section className="welcome-section">
            <div>
              <h2>Bem-vindo ICUM/SNF</h2>
              <p>Gerencie membros e visualize estatísticas</p>
            </div>
            <div className="total-members">
              <strong>{stats.total}</strong>
              <span>Membros</span>
            </div>
          </section>

          {/* Seção de pesquisa */}
          <section className="search-section">
            <div className="search-container">
              <SearchBar 
                value={searchText} 
                onChange={setSearchText} 
              />
              <button 
                className="filter-button" 
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros {showFilters ? '▲' : '▼'}
              </button>
            </div>
            
            {showFilters && (
              <div className="filters-container">
                <div className="filter-row">
                  <div className="filter-group">
                    <label>Região:</label>
                    <Select
                      value={filterRegiao}
                      onChange={setFilterRegiao}
                      options={Object.keys(stats.regioes).map(regiao => ({
                        value: regiao,
                        label: regiao
                      }))}
                      placeholder="Todas as regiões"
                    />
                  </div>
                  
                  <div className="filter-group">
                    <label>Paróquia:</label>
                    <Select
                      value={filterParoquia}
                      onChange={setFilterParoquia}
                      options={Array.from(new Set(members.map(m => m.paroquia))).map(paroquia => ({
                        value: paroquia,
                        label: paroquia
                      }))}
                      placeholder="Todas as paróquias"
                    />
                  </div>
                  
                  <div className="filter-group">
                    <label>Gênero:</label>
                    <Select
                      value={filterGenero}
                      onChange={setFilterGenero}
                      options={[
                        { value: 'Masculino', label: 'Masculino' },
                        { value: 'Feminino', label: 'Feminino' }
                      ]}
                      placeholder="Todos os gêneros"
                    />
                  </div>
                </div>
                
                <div className="filter-actions">
                  <button className="clear-filters" onClick={clearFilters}>
                    Limpar Filtros
                  </button>
                  <span className="results-count">
                    {filteredMembers.length} resultados
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Cards de estatísticas */}
          <section className="stats-section">
            <div className="stats-grid">
              <StatCard
                title="Total de Membros"
                value={stats.total}
                subtitle="Membros cadastrados"
                icon="👥"
                className="total-stat"
              />
              <StatCard
                title="Masculino"
                value={stats.masculino}
                subtitle={`${stats.total > 0 ? Math.round((stats.masculino / stats.total) * 100) : 0}% do total`}
                icon="👨"
                className="male-stat"
              />
              <StatCard
                title="Feminino"
                value={stats.feminino}
                subtitle={`${stats.total > 0 ? Math.round((stats.feminino / stats.total) * 100) : 0}% do total`}
                icon="👩"
                className="female-stat"
              />
            </div>
          </section>

          {/* Distribuição por região */}
          <section className="regions-section">
            <div className="section-card">
              <h2 className="section-title">Distribuição por Região</h2>
              <div className="regions-grid">
                {Object.entries(stats.regioes).map(([regiao, count]) => (
                  <div className="region-item" key={regiao}>
                    <div className="region-info">
                      <span className="region-name">{regiao}</span>
                      <span className="region-count">{count}</span>
                    </div>
                    <div className="region-bar">
                      <div 
                        className="region-bar-fill"
                        style={{
                          width: `${(count / stats.total) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Membros recentes */}
          <section className="recent-members-section">
            <div className="section-card">
              <h2 className="section-title">Membros Recentes</h2>
              <div className="members-grid">
                {filteredMembers.slice(0, 6).map(member => (
                  <MemberCard 
                    key={member.id} 
                    member={member}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
              
              {filteredMembers.length > 6 && (
                <div className="view-all">
                  <button 
                    className="view-all-button"
                    onClick={() => history.push('/members')}
                  >
                    Ver todos os {filteredMembers.length} membros
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Botão para exportar PDF */}
          <button className="export-button" onClick={generatePDF}>
            Exportar PDF
          </button>
        </main>
      </div>
    </div>
  );
};

export default Home;
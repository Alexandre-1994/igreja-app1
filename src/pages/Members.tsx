import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback, confirmAction } from '../services/feedback';
import './Members.css';

// Spinner minimalista
const Spinner = () => <div className="spinner"></div>;

// Interfaces para os componentes
interface MemberCardProps {
    member: Member;
    onEdit: (member: Member) => void;
    onDelete: (id: string) => void;
}

interface FiltersState {
    search: string;
    regiao: string;
    genero: string;
}

interface FilterBarProps {
    onSearch: (value: string) => void;
    onFilterChange: (filterName: string, value: string) => void;
    filters: FiltersState;
}

interface StatsBarProps {
    members: Member[];
}

// Componente de card do membro
const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit, onDelete }) => {
    return (
        <div className="member-card">
            <div className="member-avatar">
                {member.nome_completo.charAt(0).toUpperCase()}
            </div>
            <div className="member-info">
                <h3 className="member-name">{member.nome_completo}</h3>
                <div className="member-details">
                    <span className="member-detail">{member.genero}</span>
                    <span className="member-detail">{member.regiao}</span>
                    <span className="member-detail">{member.paroquia}</span>
                </div>
                <div className="member-tags">
                    <span className="member-tag">{member.funcao}</span>
                    {member.sociedade && <span className="member-tag">{member.sociedade}</span>}
                </div>
            </div>
            <div className="member-actions">
                <button onClick={() => onEdit(member)} className="edit-btn">
                    Editar
                </button>
                <button onClick={() => onDelete(member.id)} className="delete-btn">
                    Excluir
                </button>
            </div>
        </div>
    );
};

// Componente de filtros
const FilterBar: React.FC<FilterBarProps> = ({ onSearch, onFilterChange, filters }) => {
    return (
        <div className="filter-bar">
            <input 
                type="text" 
                placeholder="Buscar por nome..." 
                value={filters.search}
                onChange={(e) => onSearch(e.target.value)}
                className="search-input"
            />
            <div className="filters">
                <select 
                    value={filters.regiao}
                    onChange={(e) => onFilterChange('regiao', e.target.value)}
                    className="filter-select"
                >
                    <option value="">Todas as regiões</option>
                    <option value="ESTE">ESTE</option>
                    <option value="OESTE">OESTE</option>
                    <option value="SUL">SUL</option>
                    <option value="SUDOESTE">SUDOESTE</option>
                    <option value="NORTE">NORTE</option>
                </select>
                
                <select 
                    value={filters.genero}
                    onChange={(e) => onFilterChange('genero', e.target.value)}
                    className="filter-select"
                >
                    <option value="">Todos os gêneros</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                </select>
            </div>
        </div>
    );
};

// Componente de estatísticas rápidas
const StatsBar: React.FC<StatsBarProps> = ({ members }) => {
    const totalMembers = members.length;
    const maleCount = members.filter((m: Member) => m.genero === 'Masculino').length;
    const femaleCount = members.filter((m: Member) => m.genero === 'Feminino').length;
    
    return (
        <div className="stats-bar">
            <div className="stat-item">
                <span className="stat-value">{totalMembers}</span>
                <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
                <span className="stat-value">{maleCount}</span>
                <span className="stat-label">Homens</span>
            </div>
            <div className="stat-item">
                <span className="stat-value">{femaleCount}</span>
                <span className="stat-label">Mulheres</span>
            </div>
        </div>
    );
};

const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<FiltersState>({
        search: '',
        regiao: '',
        genero: '',
    });
    const history = useHistory();

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        // Aplicar filtros quando os members ou filtros mudarem
        const filtered = members.filter(member => {
            const matchesSearch = member.nome_completo.toLowerCase().includes(filters.search.toLowerCase());
            const matchesRegiao = !filters.regiao || member.regiao === filters.regiao;
            const matchesGenero = !filters.genero || member.genero === filters.genero;
            
            return matchesSearch && matchesRegiao && matchesGenero;
        });
        
        setFilteredMembers(filtered);
    }, [members, filters]);

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .order('nome_completo');

            if (error) throw error;

            setMembers(data || []);
            showFeedback('Lista de membros atualizada', 'success');
        } catch (error) {
            console.error('Error fetching members:', error);
            showFeedback('Erro ao carregar membros', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (member: Member) => {
        history.push(`/edit/${member.id}`);
    };

    const handleDelete = async (id: string) => {
        try {
            const confirmed = await confirmAction(
                'Confirmar exclusão',
                'Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.',
                'Excluir',
                'Cancelar'
            );
            
            if (!confirmed) return;
            
            setIsLoading(true);
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMembers(members.filter(m => m.id !== id));
            showFeedback('Membro removido com sucesso', 'success');
        } catch (error) {
            console.error('Error deleting member:', error);
            showFeedback('Erro ao remover membro', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setFilters({...filters, search: value});
    };

    const handleFilterChange = (filterName: string, value: string) => {
        setFilters({...filters, [filterName]: value});
    };

    return (
        <div className="members-page">
            {isLoading && (
                <div className="loading-overlay">
                    <Spinner />
                    <p>Carregando membros...</p>
                </div>
            )}
            
            <header className="page-header">
                <h1>Lista de Membros</h1>
                <button 
                    onClick={() => history.push('/app/add')} 
                    className="add-btn"
                >
                    + Novo
                </button>
            </header>

            <main className="members-content">
                {/* Estatísticas */}
                <StatsBar members={filteredMembers} />
                
                {/* Filtros */}
                <FilterBar 
                    onSearch={handleSearch} 
                    onFilterChange={handleFilterChange}
                    filters={filters}
                />
                
                {/* Resultados */}
                <div className="results-count">
                    {filteredMembers.length} {filteredMembers.length === 1 ? 'membro encontrado' : 'membros encontrados'}
                </div>
                
                {/* Lista de membros */}
                <div className="members-list">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map(member => (
                            <MemberCard 
                                key={member.id} 
                                member={member} 
                                onEdit={handleEdit} 
                                onDelete={handleDelete} 
                            />
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>Nenhum membro encontrado com os filtros atuais.</p>
                            {filters.search || filters.regiao || filters.genero ? (
                                <button 
                                    className="clear-filters-btn"
                                    onClick={() => setFilters({search: '', regiao: '', genero: ''})}
                                >
                                    Limpar filtros
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
                
                {/* Botão para exportar dados (implementação futura) */}
                <button className="export-btn">
                    Exportar Lista
                </button>
            </main>
        </div>
    );
};

export default Members;
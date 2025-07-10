import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback } from '../services/feedback';
import './ViewMember.css';

// Spinner minimalista
const Spinner = () => <div className="spinner"></div>;

const ViewMember: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [member, setMember] = useState<Member | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMember();
    }, [id]);

    const fetchMember = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                showFeedback('Erro ao carregar dados do membro', 'error');
                history.push('/app/members');
                return;
            }

            setMember(data);
        } catch (error) {
            showFeedback('Erro ao acessar o servidor', 'error');
            history.push('/app/members');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        history.push(`/app/edit/${id}`);
    };

    const handleBack = () => {
        history.goBack();
    };

    if (isLoading) {
        return (
            <div className="view-member-page scrollable-content">
                <div className="loading-overlay">
                    <Spinner />
                    <p>Carregando dados...</p>
                </div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="view-member-page scrollable-content">
                <div className="error-container">
                    <h2>Membro não encontrado</h2>
                    <p>O membro que você está tentando visualizar não foi encontrado.</p>
                    <button 
                        className="primary-button" 
                        onClick={() => history.push('/app/members')}
                    >
                        Voltar à Lista de Membros
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="view-member-page scrollable-content">
            <header className="page-header">
                <h1>Detalhes do Membro</h1>
                <div className="header-actions">
                    <button 
                        onClick={handleEdit} 
                        className="edit-btn"
                    >
                        Editar
                    </button>
                    <button 
                        onClick={handleBack} 
                        className="back-btn"
                    >
                        Voltar
                    </button>
                </div>
            </header>

            <main className="member-details">
                <div className="member-header">
                    <div className="member-avatar large">
                        {member.nome_completo.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-title">
                        <h2>{member.nome_completo}</h2>
                        <div className="member-subtitle">
                            <span className="tag">{member.funcao}</span>
                            <span className="tag">{member.regiao}</span>
                        </div>
                    </div>
                </div>

                <div className="details-section">
                    <h3>Informações Pessoais</h3>
                    <div className="details-grid">
                        <div className="detail-item">
                            <div className="detail-label">Data de Nascimento</div>
                            <div className="detail-value">
                                {new Date(member.data_nascimento).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Gênero</div>
                            <div className="detail-value">{member.genero}</div>
                        </div>
                        {member.telefone && (
                            <div className="detail-item">
                                <div className="detail-label">Telefone</div>
                                <div className="detail-value">{member.telefone}</div>
                            </div>
                        )}
                        {member.email && (
                            <div className="detail-item">
                                <div className="detail-label">Email</div>
                                <div className="detail-value">{member.email}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="details-section">
                    <h3>Informações Eclesiásticas</h3>
                    <div className="details-grid">
                        <div className="detail-item">
                            <div className="detail-label">Região</div>
                            <div className="detail-value">{member.regiao}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Paróquia</div>
                            <div className="detail-value">{member.paroquia}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Função</div>
                            <div className="detail-value">{member.funcao}</div>
                        </div>
                        {member.estado && (
                            <div className="detail-item">
                                <div className="detail-label">Estado</div>
                                <div className="detail-value">{member.estado}</div>
                            </div>
                        )}
                        {member.sociedade && (
                            <div className="detail-item">
                                <div className="detail-label">Sociedade</div>
                                <div className="detail-value">{member.sociedade}</div>
                            </div>
                        )}
                    </div>
                </div>

                {member.endereco && (
                    <div className="details-section">
                        <h3>Endereço</h3>
                        <div className="details-grid">
                            <div className="detail-item full-width">
                                <div className="detail-label">Endereço Completo</div>
                                <div className="detail-value">{member.endereco}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="details-footer">
                    <p className="record-info">
                        Cadastrado em: {new Date(member.created_at || '').toLocaleDateString('pt-BR')}
                        {member.updated_at && member.updated_at !== member.created_at && (
                            <span> | Última atualização: {new Date(member.updated_at).toLocaleDateString('pt-BR')}</span>
                        )}
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ViewMember;

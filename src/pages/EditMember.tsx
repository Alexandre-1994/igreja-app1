import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import MemberForm from '../components/MemberForm';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback, confirmAction } from '../services/feedback';
import './EditMember.css';

// Spinner minimalista
const Spinner = () => <div className="spinner"></div>;

const EditMember: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [member, setMember] = useState<Member | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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
                history.push('/');
                return;
            }

            setMember(data);
        } catch (error) {
            showFeedback('Erro ao acessar o servidor', 'error');
            history.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (memberData: Partial<Member>) => {
        try {
            setIsSaving(true);
            
            const { error } = await supabase
                .from('members')
                .update({
                    ...memberData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) {
                showFeedback('Erro ao atualizar membro', 'error');
                return;
            }

            showFeedback('Membro atualizado com sucesso!', 'success');
            setMember(prev => prev ? { ...prev, ...memberData } : null);
            
            setTimeout(() => {
                history.push('/');
            }, 1500);
        } catch (error) {
            showFeedback('Não foi possível completar a atualização', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!member) return; // Early return if member is null

        try {
            const willDelete = await confirmAction(
                'Confirmar Exclusão',
                `Deseja realmente excluir o membro "${member.nome_completo}"? Esta ação não pode ser desfeita.`,
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

            showFeedback('Membro excluído com sucesso', 'success');
            history.push('/');
        } catch (error) {
            showFeedback('Erro ao processar a exclusão', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || isSaving) {
        return (
            <div className="edit-member-page">
                <div className="loading-overlay">
                    <Spinner />
                    <p>{isSaving ? "Salvando alterações..." : "Carregando dados..."}</p>
                </div>
            </div>
        );
    }

    // If no member is found, show an error
    if (!member) {
        return (
            <div className="edit-member-page">
                <div className="error-container">
                    <h2>Membro não encontrado</h2>
                    <p>O membro que você está tentando editar não foi encontrado.</p>
                    <button 
                        className="simple-button primary-button" 
                        onClick={() => history.push('/app/members')}
                    >
                        Voltar à Lista de Membros
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-member-page">
            <header className="page-header">
                <h1>Editar Membro</h1>
                <button onClick={handleDelete} className="delete-btn">
                    Excluir
                </button>
            </header>

            <main className="page-content">
                {/* Informações básicas do membro */}
                <div className="member-summary">
                    <div className="member-avatar">
                        {member.nome_completo.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="member-name">{member.nome_completo}</h2>
                        <div className="member-tags">
                            <span className="tag">{member.regiao}</span>
                            <span className="tag">{member.funcao}</span>
                        </div>
                    </div>
                </div>

                {/* Formulário */}
                <div className="form-container">
                    <div className="form-header">
                        <h3>Editar Dados</h3>
                        <p>Atualize as informações e clique em Salvar</p>
                    </div>
                    
                    <MemberForm 
                        onSubmit={handleSubmit} 
                        initialData={member} // Now we're sure member is not null
                    />
                    
                    <div className="form-footer">
                        <p className="update-info">
                            Última atualização: {new Date((member as any).updated_at || member.created_at).toLocaleString('pt-BR')}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditMember;
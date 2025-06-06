import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonText,
    IonChip,
    IonAvatar
} from '@ionic/react';
import { 
    pencilOutline, 
    saveOutline, 
    closeOutline,
    personOutline,
    trashOutline,
    refreshOutline,
    informationCircleOutline
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router';
import MemberForm from '../components/MemberForm';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback, confirmAction } from '../services/feedback';
import LoadingSpinner from '../components/LoadingSpinner';
import './EditMember.css';

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
            // Atualizar os dados locais
            setMember(prev => prev ? { ...prev, ...memberData } : null);
            
            // Voltar para a página anterior após um breve delay
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
        try {
            const willDelete = await confirmAction(
                'Confirmar Exclusão',
                `Deseja realmente excluir o membro "${member?.nome_completo}"? Esta ação não pode ser desfeita.`,
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

    const handleCancel = () => {
        history.goBack();
    };

    const handleRefresh = () => {
        fetchMember();
    };

    if (isLoading) {
        return (
            <IonPage className="edit-member-page">
                <LoadingSpinner message="Carregando dados do membro..." />
            </IonPage>
        );
    }

    if (!member) {
        return (
            <IonPage className="edit-member-page">
                <IonContent className="error-content">
                    <div className="error-message">
                        <IonIcon icon={informationCircleOutline} className="error-icon" />
                        <h2>Membro não encontrado</h2>
                        <p>O membro que você está tentando editar não foi encontrado.</p>
                        <IonButton onClick={() => history.push('/')}>
                            Voltar ao Início
                        </IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage className="edit-member-page">
            {(isLoading || isSaving) && (
                <LoadingSpinner message={isSaving ? "Salvando alterações..." : "Carregando..."} />
            )}
            
            <IonHeader className="edit-member-header">
                <IonToolbar className="modern-toolbar">
                    <IonButtons slot="start">
                        <IonBackButton 
                            defaultHref="/" 
                            className="back-button"
                        />
                    </IonButtons>
                    <IonTitle className="page-title">
                        <div className="title-container">
                            <IonIcon icon={pencilOutline} className="title-icon" />
                            <span>Editar Membro</span>
                        </div>
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton 
                            fill="clear"
                            className="refresh-btn"
                            onClick={handleRefresh}
                        >
                            <IonIcon icon={refreshOutline} slot="icon-only" />
                        </IonButton>
                        <IonButton 
                            fill="clear"
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            <IonIcon icon={closeOutline} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="edit-member-content">
                {/* Member Info Section */}
                <div className="member-info-section">
                    <IonCard className="member-info-card">
                        <IonCardContent>
                            <div className="member-header">
                                <div className="member-avatar-container">
                                    <IonAvatar className="member-avatar">
                                        <div className="avatar-placeholder">
                                            {member.nome_completo.charAt(0).toUpperCase()}
                                        </div>
                                    </IonAvatar>
                                </div>
                                <div className="member-details">
                                    <h2 className="member-name">{member.nome_completo}</h2>
                                    <div className="member-meta">
                                        <IonChip className="region-chip">
                                            {member.regiao}
                                        </IonChip>
                                        <IonChip className="function-chip">
                                            {member.funcao}
                                        </IonChip>
                                    </div>
                                    <p className="member-parish">{member.paroquia}</p>
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </div>

                {/* Instructions Card */}
                <IonCard className="instructions-card">
                    <IonCardContent>
                        <div className="instructions-content">
                            <IonIcon icon={informationCircleOutline} className="info-icon" />
                            <div className="instructions-text">
                                <h3>Editando Membro</h3>
                                <ul>
                                    <li>Modifique apenas os campos necessários</li>
                                    <li>Verifique os dados antes de salvar</li>
                                    <li>Use o botão "Atualizar" para confirmar as alterações</li>
                                </ul>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>

                {/* Form Container */}
                <div className="form-container">
                    <IonCard className="form-card">
                        <IonCardHeader>
                            <IonCardTitle className="form-title">
                                Dados do Membro
                            </IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <MemberForm onSubmit={handleSubmit} initialData={member} />
                        </IonCardContent>
                    </IonCard>
                </div>

                {/* Action Buttons */}
                {/* <div className="action-buttons">
                    <IonButton 
                        expand="block"
                        className="delete-button"
                        fill="outline"
                        onClick={handleDelete}
                    >
                        <IonIcon icon={trashOutline} slot="start" />
                        Excluir Membro
                    </IonButton>
                    
                    <IonButton 
                        expand="block"
                        className="cancel-button"
                        fill="outline"
                        onClick={handleCancel}
                    >
                        <IonIcon icon={closeOutline} slot="start" />
                        Cancelar
                    </IonButton>
                    
                    <IonButton 
                        expand="block"
                        className="update-button"
                        type="submit"
                        form="member-form"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <div className="button-loading">
                                <div className="spinner"></div>
                                <span>Salvando...</span>
                            </div>
                        ) : (
                            <>
                                <IonIcon icon={saveOutline} slot="start" />
                                Atualizar Membro
                            </>
                        )}
                    </IonButton>
                </div> */}

                {/* Help Section */}
                {/* <div className="help-section">
                    <IonText color="medium">
                        <p className="help-text">
                            Última atualização: {new Date(member.updated_at || member.created_at).toLocaleString('pt-BR')}
                        </p>
                    </IonText>
                </div> */}
            </IonContent>
        </IonPage>
    );
};

export default EditMember;
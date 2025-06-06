import React, { useState } from 'react';
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
    IonText
} from '@ionic/react';
import { 
    personAddOutline, 
    saveOutline, 
    closeOutline,
    informationCircleOutline 
} from 'ionicons/icons';
import { useHistory } from 'react-router';
import MemberForm from '../components/MemberForm';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback } from '../services/feedback';
import LoadingSpinner from '../components/LoadingSpinner';
import './AddMember.css';

const AddMember: React.FC = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (memberData: Partial<Member>) => {
        try {
            setIsLoading(true);

            if (!memberData.data_nascimento) {
                showFeedback('Por favor, preencha a Data de Nascimento', 'warning');
                return;
            }

            const { data, error } = await supabase
                .from('members')
                .insert([{
                    ...memberData,
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) {
                const errorMessage = error.code === '23502' 
                    ? 'Por favor, preencha todos os campos obrigatórios'
                    : 'Ocorreu um erro ao cadastrar o membro';
                    
                showFeedback(errorMessage, 'error');
                return;
            }

            showFeedback('Membro cadastrado com sucesso!', 'success');
            history.push('/');
        } catch (err) {
            showFeedback('Não foi possível completar o cadastro. Tente novamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <IonPage className="add-member-page">
            {isLoading && <LoadingSpinner message="Cadastrando membro..." />}
            
            <IonHeader className="add-member-header">
                <IonToolbar className="modern-toolbar">
                    <IonButtons slot="start">
                        <IonBackButton 
                            defaultHref="/" 
                            className="back-button"
                        />
                    </IonButtons>
                    <IonTitle className="page-title">
                        <div className="title-container">
                            <IonIcon icon={personAddOutline} className="title-icon" />
                            <span>Novo Membro</span>
                        </div>
                    </IonTitle>
                    <IonButtons slot="end">
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

            <IonContent className="add-member-content">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-content">
                        <div className="hero-icon-container">
                            <IonIcon icon={personAddOutline} className="hero-icon" />
                        </div>
                        <h1>Cadastro de Novo Membro</h1>
                        <p>Preencha as informações abaixo para adicionar um novo membro ao sistema</p>
                    </div>
                </div>

                {/* Instructions Card */}
                <IonCard className="instructions-card">
                    <IonCardContent>
                        <div className="instructions-content">
                            <IonIcon icon={informationCircleOutline} className="info-icon" />
                            <div className="instructions-text">
                                <h3>Instruções de Preenchimento</h3>
                                <ul>
                                    <li>Todos os campos marcados com * são obrigatórios</li>
                                    <li>Verifique os dados antes de salvar</li>
                                    <li>Use o formato correto para datas e telefones</li>
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
                            <MemberForm onSubmit={handleSubmit} />
                        </IonCardContent>
                    </IonCard>
                </div>

                {/* Action Buttons */}
                {/* <div className="action-buttons">
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
                        className="save-button"
                        type="submit"
                        form="member-form"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="button-loading">
                                <div className="spinner"></div>
                                <span>Salvando...</span>
                            </div>
                        ) : (
                            <>
                                <IonIcon icon={saveOutline} slot="start" />
                                Salvar Membro
                            </>
                        )}
                    </IonButton>
                </div> */}

                {/* Help Section */}
                <div className="help-section">
                    <IonText color="medium">
                        <p className="help-text">
                            Precisa de ajuda? Entre em contato com o administrador do sistema.
                        </p>
                    </IonText>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AddMember;
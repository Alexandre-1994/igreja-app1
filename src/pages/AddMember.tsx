import React, { useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
} from '@ionic/react';
import { useHistory } from 'react-router';
import MemberForm from '../components/MemberForm';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback } from '../services/feedback';
import LoadingSpinner from '../components/LoadingSpinner';

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

    return (
        <IonPage>
            {isLoading && <LoadingSpinner message="Cadastrando membro..." />}
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Novo Membro</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <MemberForm onSubmit={handleSubmit} />
            </IonContent>
        </IonPage>
    );
};

export default AddMember;
import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    useIonToast,
    IonSpinner
} from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import MemberForm from '../components/MemberForm';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';

const EditMember: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [presentToast] = useIonToast();
    const [member, setMember] = useState<Member | null>(null);

    useEffect(() => {
        fetchMember();
    }, [id]);

    const fetchMember = async () => {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            presentToast({
                message: 'Erro ao carregar dados do membro',
                duration: 2000,
                color: 'danger'
            });
            history.push('/');
            return;
        }

        setMember(data);
    };

    const handleSubmit = async (memberData: Partial<Member>) => {
        const { error } = await supabase
            .from('members')
            .update(memberData)
            .eq('id', id);

        if (error) {
            presentToast({
                message: 'Erro ao atualizar membro',
                duration: 2000,
                color: 'danger'
            });
            return;
        }

        presentToast({
            message: 'Membro atualizado com sucesso',
            duration: 2000,
            color: 'success'
        });
        history.push('/');
    };

    if (!member) {
        return (
            <IonPage>
                <IonContent className="ion-padding ion-text-center">
                    <IonSpinner />
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Editar Membro</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <MemberForm onSubmit={handleSubmit} initialData={member} />
            </IonContent>
        </IonPage>
    );
};

export default EditMember;
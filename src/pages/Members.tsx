import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    useIonViewWillEnter
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router';
import MemberList from '../components/MemberList';
import { supabase } from '../services/supabase';
// import { showFeedback } from '../services/feedback';
import { Member } from '../types/member';
import { showFeedback } from '../services/feedback';

const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const history = useHistory();

    useIonViewWillEnter(() => {
        fetchMembers();
    });

    const fetchMembers = async () => {
        try {
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
        }
    };

    const handleEdit = async (member: Member) => {
        try {
            history.push(`/edit/${member.id}`);
            showFeedback('Editando membro', 'info');
        } catch (error) {
            showFeedback('Erro ao abrir edição', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id);

            if (error) throw error;

            await fetchMembers();
            showFeedback('Membro removido com sucesso', 'success');
        } catch (error) {
            console.error('Error deleting member:', error);
            showFeedback('Erro ao remover membro', 'error');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Lista de Membros</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.push('/add')}>
                            <IonIcon icon={add} slot="start" />
                            Novo Membro
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <MemberList
                    members={members}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </IonContent>
        </IonPage>
    );
};

export default Members;
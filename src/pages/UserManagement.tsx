import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonCard,
    IonCardContent,
} from '@ionic/react';
import { personAdd, key } from 'ionicons/icons';
import { supabase } from '../services/supabase';
import { showFeedback } from '../services/feedback';
import LoadingSpinner from '../components/LoadingSpinner';

const UserManagement: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'user'
    });
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            showFeedback('Erro ao carregar usuários', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            
            const { data, error } = await supabase.auth.admin.createUser({
                email: newUser.email,
                password: newUser.password,
                user_metadata: { role: newUser.role }
            });

            if (error) throw error;

            await supabase.from('users').insert([{
                id: data.user.id,
                email: newUser.email,
                role: newUser.role,
                created_at: new Date()
            }]);

            showFeedback('Usuário criado com sucesso!', 'success');
            setNewUser({ email: '', password: '', role: 'user' });
            fetchUsers();
        } catch (error) {
            showFeedback('Erro ao criar usuário', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IonPage>
            {isLoading && <LoadingSpinner message="Processando..." />}
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Gerenciar Usuários</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardContent>
                        <form onSubmit={handleCreateUser}>
                            <IonItem>
                                <IonLabel position="floating">Email</IonLabel>
                                <IonInput
                                    type="email"
                                    value={newUser.email}
                                    onIonChange={e => setNewUser({...newUser, email: e.detail.value!})}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Senha</IonLabel>
                                <IonInput
                                    type="password"
                                    value={newUser.password}
                                    onIonChange={e => setNewUser({...newUser, password: e.detail.value!})}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel>Função</IonLabel>
                                <IonSelect
                                    value={newUser.role}
                                    onIonChange={e => setNewUser({...newUser, role: e.detail.value})}
                                >
                                    <IonSelectOption value="admin">Administrador</IonSelectOption>
                                    <IonSelectOption value="user">Usuário</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonButton expand="block" type="submit" className="ion-margin-top">
                                <IonIcon icon={personAdd} slot="start" />
                                Criar Usuário
                            </IonButton>
                        </form>
                    </IonCardContent>
                </IonCard>

                <IonList>
                    {users.map(user => (
                        <IonItem key={user.id}>
                            <IonLabel>
                                <h2>{user.email}</h2>
                                <p>Função: {user.role}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default UserManagement;
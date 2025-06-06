import React, { useState } from 'react';
import {
    IonContent,
    IonPage,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/react';
import { logIn, mail, lockClosed } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { supabase } from '../services/supabase';
import { showFeedback } from '../services/feedback';
import LoadingSpinner from '../components/LoadingSpinner';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            showFeedback('Por favor, preencha todos os campos', 'warning');
            return;
        }

        try {
            setIsLoading(true);
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim()
            });

            if (error) {
                console.error('Login error:', error.message);
                showFeedback('Email ou senha inválidos', 'error');
                return;
            }

            if (data?.user) {
                showFeedback('Login realizado com sucesso!', 'success');
                history.push('/home');
            }
        } catch (error) {
            console.error('Error:', error);
            showFeedback('Erro ao realizar login', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IonPage>
            {isLoading && <LoadingSpinner message="Autenticando..." />}
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow className="ion-justify-content-center">
                        <IonCol size="12" sizeMd="6" sizeLg="4">
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle className="ion-text-center">
                                        <h1>Login</h1>
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <form onSubmit={handleLogin}>
                                        <IonItem>
                                            <IonIcon icon={mail} slot="start" />
                                            <IonLabel position="floating">Email</IonLabel>
                                            <IonInput
                                                type="email"
                                                value={email}
                                                onIonChange={e => setEmail(e.detail.value!)}
                                                required
                                            />
                                        </IonItem>

                                        <IonItem className="ion-margin-bottom">
                                            <IonIcon icon={lockClosed} slot="start" />
                                            <IonLabel position="floating">Senha</IonLabel>
                                            <IonInput
                                                type="password"
                                                value={password}
                                                onIonChange={e => setPassword(e.detail.value!)}
                                                required
                                            />
                                        </IonItem>

                                        <IonButton
                                            expand="block"
                                            type="submit"
                                            className="ion-margin-top"
                                        >
                                            <IonIcon icon={logIn} slot="start" />
                                            Entrar
                                        </IonButton>
                                    </form>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Login;
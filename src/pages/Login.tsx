import React, { useState, useEffect } from 'react';
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
    IonText,
} from '@ionic/react';
import { logIn, mail, lockClosed, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { supabase } from '../services/supabase';
import { showFeedback } from '../services/feedback';
import LoadingSpinner from '../components/LoadingSpinner';
import './Login.css'; // Arquivo CSS específico

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const history = useHistory();

    // Animação de entrada
    useEffect(() => {
        setTimeout(() => setMounted(true), 100);
    }, []);

    // Escutar mudanças de autenticação
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    console.log('User signed in, redirecting to home');
                    history.push('/home');
                }
            }
        );

        // Verificar se já está logado
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                history.push('/home');
            }
        };
        
        checkSession();

        return () => subscription.unsubscribe();
    }, [history]);

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
            }
        } catch (error) {
            console.error('Error:', error);
            showFeedback('Erro ao realizar login', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <IonPage className="login-page">
            {isLoading && <LoadingSpinner message="Autenticando..." />}
            
            {/* Fundo animado */}
            <div className="login-background">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>

            <IonContent className="login-content">
                <IonGrid>
                    <IonRow className="ion-justify-content-center ion-align-items-center">
                        <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                            <div className={`login-container ${mounted ? 'fade-in' : ''}`}>
                                
                                {/* Logo/Título */}
                                <div className="login-header">
                                    <div className="logo-container">
                                        <div className="logo-circle">
                                            <IonIcon icon={logIn} className="logo-icon" />
                                        </div>
                                    </div>
                                    {/* <h1 className="login-title">Bem-vindo</h1> */}
                                    <h1 className="login-title">ICUM/SNF</h1>
                                    <p className="login-subtitle">Faça login para continuar</p>
                                </div>

                                {/* Card de Login */}
                                <IonCard className="login-card">
                                    <IonCardContent className="login-card-content">
                                        <form onSubmit={handleLogin}>
                                            
                                            {/* Campo Email */}
                                            <div className="input-group">
                                                <IonItem className="login-input" lines="none">
                                                    <div className="input-icon">
                                                        <IonIcon icon={mail} />
                                                    </div>
                                                    <IonInput
                                                        type="email"
                                                        placeholder="Digite seu email"
                                                        value={email}
                                                        onIonChange={e => setEmail(e.detail.value!)}
                                                        required
                                                        className="custom-input"
                                                    />
                                                </IonItem>
                                            </div>

                                            {/* Campo Senha */}
                                            <div className="input-group">
                                                <IonItem className="login-input" lines="none">
                                                    <div className="input-icon">
                                                        <IonIcon icon={lockClosed} />
                                                    </div>
                                                    <IonInput
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Digite sua senha"
                                                        value={password}
                                                        onIonChange={e => setPassword(e.detail.value!)}
                                                        required
                                                        className="custom-input"
                                                    />
                                                    <IonButton
                                                        fill="clear"
                                                        className="password-toggle"
                                                        onClick={togglePasswordVisibility}
                                                        type="button"
                                                    >
                                                        <IonIcon 
                                                            icon={showPassword ? eyeOffOutline : eyeOutline}
                                                            slot="icon-only"
                                                        />
                                                    </IonButton>
                                                </IonItem>
                                            </div>

                                            {/* Link Esqueceu Senha */}
                                            <div className="forgot-password">
                                                <IonText>
                                                    <p>Esqueceu sua senha?</p>
                                                </IonText>
                                            </div>

                                            {/* Botão Login */}
                                            <IonButton
                                                expand="block"
                                                type="submit"
                                                className="login-button"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <div className="button-loading">
                                                        <div className="spinner"></div>
                                                        <span>Entrando...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <IonIcon icon={logIn} slot="start" />
                                                        Entrar
                                                    </>
                                                )}
                                            </IonButton>
                                        </form>
                                    </IonCardContent>
                                </IonCard>

                                {/* Footer */}
                                <div className="login-footer">
                                    <IonText color="medium">
                                        <p>Sistema de Gerenciamento v1.0</p>
                                    </IonText>
                                </div>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Login;
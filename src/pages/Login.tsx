import React, { useState, useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router';
import { supabase } from '../services/supabase';
import { showFeedback } from '../services/feedback';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const history = useHistory();

  // Animação de entrada
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        showFeedback(
          error.message === 'Invalid login credentials' 
            ? 'Credenciais inválidas. Verifique seu email e senha.'
            : error.message,
          'error'
        );
      } else if (data?.user) {
        showFeedback('Login realizado com sucesso!', 'success');
      }
    } catch {
      showFeedback('Erro inesperado. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage className="login-page">
      <IonContent className="login-content" fullscreen>
        <div className={`login-container ${fadeIn ? 'fade-in' : ''}`}>
          {/* Header */}
          <div className="login-header">
            <div className="logo-circle" />
            <h1 className="login-title">Sistema de Gestão</h1>
            <p className="login-subtitle">Sociedade da Nova Familia Geral</p>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit}>
            {/* Campo Email */}
            <div className="input-group">
              <input
                type="email"
                className="custom-input"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Campo Senha */}
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="custom-input"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {/* Botão Login */}
            <div className="input-group">
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>© 2024 Mozihub - Sistema de Gestão</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
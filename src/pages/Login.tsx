import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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

  // Efeito de animação
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  // Verificar sessão existente
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        history.push('/app');
      }
    };
    
    checkSession();
    
    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          history.push('/app');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      showFeedback('Por favor, preencha todos os campos', 'warning');
      return;
    }
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Email ou senha incorretos';
        }
        
        showFeedback(errorMessage, 'error');
      } else if (data?.user) {
        showFeedback('Login realizado com sucesso!', 'success');
        history.push('/app');
      }
    } catch (error) {
      showFeedback('Ocorreu um erro inesperado. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-container ${fadeIn ? 'fade-in' : ''}`}>
      <div className="login-card">
        <div className="login-header">
          <h1 className="app-name">Ekklesia</h1>
          <p className="app-description">Gestão de Membros da Igreja</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu email"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="password">Senha</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
                tabIndex={-1}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>&copy; 2024 Ekklesia - Todos os direitos reservados</p>
          <p className="version">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
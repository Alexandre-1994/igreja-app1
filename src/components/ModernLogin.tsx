import React from 'react';
import { IonIcon } from '@ionic/react';
import { mail, lockClosed, eyeOutline, eyeOffOutline, logIn } from 'ionicons/icons';

interface ModernLoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModernLoginForm: React.FC<ModernLoginFormProps> = ({
  email,
  password,
  showPassword,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Versão alternativa com glassmorphism */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl border border-white border-opacity-20 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-glow">
            <IonIcon icon={logIn} className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h2>
          <p className="text-blue-100">Entre na sua conta</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Email Field - Glassmorphism Style */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IonIcon icon={mail} className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-20 transition-all duration-300"
            />
          </div>

          {/* Password Field - Glassmorphism Style */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IonIcon icon={lockClosed} className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Senha"
              className="w-full pl-10 pr-12 py-3 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-20 transition-all duration-300"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <IonIcon 
                icon={showPassword ? eyeOffOutline : eyeOutline}
                className="h-5 w-5 text-blue-300 hover:text-white transition-colors"
              />
            </button>
          </div>

          {/* Submit Button - Glassmorphism Style */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors">
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </div>
  );
};

export const LoginBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        {/* Large floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        
        {/* Small floating particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-purple-300/30 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-pink-300/25 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
    </div>
  );
};

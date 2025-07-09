import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent } from '@ionic/react';

const TailwindTest: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Teste Tailwind CSS</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="p-6 max-w-4xl mx-auto">
          {/* Teste de cores customizadas */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-church-darkblue mb-4">
              Tailwind CSS Funcionando! 🎉
            </h1>
            <p className="text-gray-600">
              Agora você pode usar todas as classes do Tailwind CSS no seu projeto Ionic.
            </p>
          </div>

          {/* Grid de cards teste */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="church-card">
              <h3 className="text-lg font-semibold text-church-darkblue mb-2">
                Card Personalizado
              </h3>
              <p className="text-gray-600">
                Este card usa a classe customizada "church-card"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-church-gold">
              <h3 className="text-lg font-semibold text-primary-600 mb-2">
                Card com Tailwind
              </h3>
              <p className="text-gray-600">
                Este card usa classes padrão do Tailwind
              </p>
            </div>

            <div className="stats-card">
              <h3 className="text-lg font-semibold mb-2">
                Stats Card
              </h3>
              <div className="text-2xl font-bold">156</div>
              <p className="text-sm opacity-90">Membros ativos</p>
            </div>
          </div>

          {/* Botões teste */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button className="church-button">
              Botão Igreja
            </button>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors">
              Botão Primário
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors">
              Botão Secundário
            </button>
          </div>

          {/* Combinando Ionic + Tailwind */}
          <IonCard className="shadow-lg border-t-4 border-church-gold">
            <IonCardContent className="p-6">
              <h2 className="text-xl font-bold text-church-darkblue mb-3">
                Ionic + Tailwind
              </h2>
              <p className="text-gray-600 mb-4">
                Você pode combinar componentes Ionic com classes Tailwind para criar interfaces únicas.
              </p>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✅ Funcionando
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  🎨 Estilizado
                </span>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Paleta de cores da igreja */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Paleta de Cores da Igreja</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-church-gold rounded-lg mx-auto mb-2"></div>
                <span className="text-sm">church-gold</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-church-darkblue rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-white">church-darkblue</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-church-lightblue rounded-lg mx-auto mb-2"></div>
                <span className="text-sm">church-lightblue</span>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TailwindTest;

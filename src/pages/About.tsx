import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page scrollable-content">
      <header className="page-header">
        <h1>Sobre o Ekklesia</h1>
      </header>

      <main className="about-content">
        <div className="about-card">
          <div className="about-section">
            <h2>Sistema de Gestão de Membros</h2>
            <p>
              Ekklesia é um sistema de gestão de membros desenvolvido especificamente para
              igrejas e organizações religiosas. O nome "Ekklesia" vem do grego e significa
              "assembleia" ou "congregação", representando o propósito central do sistema:
              ajudar na organização e administração da comunidade eclesiástica.
            </p>
          </div>

          <div className="about-section">
            <h2>Funcionalidades</h2>
            <ul className="feature-list">
              <li>
                <span className="feature-icon">📊</span>
                <span className="feature-text">Dashboard analítico com estatísticas</span>
              </li>
              <li>
                <span className="feature-icon">👥</span>
                <span className="feature-text">Gestão completa de membros</span>
              </li>
              <li>
                <span className="feature-icon">🔍</span>
                <span className="feature-text">Busca e filtros avançados</span>
              </li>
              <li>
                <span className="feature-icon">📱</span>
                <span className="feature-text">Interface responsiva para todos os dispositivos</span>
              </li>
              <li>
                <span className="feature-icon">🔒</span>
                <span className="feature-text">Segurança e controle de acesso</span>
              </li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Desenvolvedores</h2>
            <div className="developer-info">
              <div className="developer-card">
                <div className="developer-avatar">AS</div>
                <div className="developer-details">
                  <h3>Alexandre Sitole</h3>
                  <p className="developer-role">Desenvolvedor Principal</p>
                  <p className="developer-bio">
                    Desenvolvedor de software com experiência em tecnologias modernas
                    como React, TypeScript e soluções em nuvem.
                  </p>
                </div>
              </div>

              <div className="developer-card">
                <div className="developer-avatar">MH</div>
                <div className="developer-details">
                  <h3>Mozihub</h3>
                  <p className="developer-role">Empresa Desenvolvedora</p>
                  <p className="developer-bio">
                    Empresa especializada em desenvolvimento de soluções tecnológicas
                    para igrejas e organizações sem fins lucrativos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-footer">
            <p>&copy; 2024 Ekklesia - Todos os direitos reservados</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
                                  
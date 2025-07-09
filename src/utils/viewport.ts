/**
 * Utilitário para ajustar a altura da viewport em dispositivos móveis
 * Isso ajuda a resolver problemas de scroll especialmente em iOS
 */
export const setupViewportHeight = (): void => {
  // Primeiro define a altura
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Define a altura inicialmente
  setVH();

  // Atualiza quando o tamanho da tela muda
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
};

// Função para aplicar fixações para scroll em componentes Ionic
export const fixIonicScroll = (): void => {
  // Seleciona todos os elementos de conteúdo Ionic
  const ionContents = document.querySelectorAll('ion-content');
  
  // Aplica estilos para permitir rolagem
  ionContents.forEach(content => {
    const shadowRoot = content.shadowRoot;
    if (shadowRoot) {
      const scrollEl = shadowRoot.querySelector('.inner-scroll');
      if (scrollEl) {
        (scrollEl as HTMLElement).style.overflowY = 'auto';
        (scrollEl as HTMLElement).style.webkitOverflowScrolling = 'touch';
      }
    }
  });
};

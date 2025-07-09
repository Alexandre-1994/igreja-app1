import React, { ReactNode } from 'react';

interface ScrollableContentProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
}

/**
 * Componente de contêiner de rolagem compatível com Ionic e Tailwind
 * Resolve problemas de rolagem em diferentes dispositivos e navegadores
 */
const ScrollableContent: React.FC<ScrollableContentProps> = ({ 
  children, 
  className = '', 
  maxHeight = 'auto' 
}) => {
  return (
    <div 
      className={`scrollable-content ${className}`}
      style={{
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        maxHeight,
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

export default ScrollableContent;

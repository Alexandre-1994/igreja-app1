import React from 'react';
import { IonSpinner } from '@ionic/react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Carregando...' }) => {
    return (
        <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>{message}</p>
        </div>
    );
};

export default LoadingSpinner;
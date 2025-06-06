import { alertController, toastController } from '@ionic/core';

export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

export const showFeedback = async (
    message: string,
    type: FeedbackType = 'info',
    duration: number = 3000
) => {
    const colors: Record<FeedbackType, string> = {
        success: 'success',
        error: 'danger',
        info: 'primary',
        warning: 'warning'
    };

    const icons: Record<FeedbackType, string> = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    const toast = await toastController.create({
        message: `${icons[type]} ${message}`,
        duration: duration,
        position: 'top',
        color: colors[type],
        cssClass: `custom-toast toast-${type}`,
        buttons: [
            {
                text: 'OK',
                role: 'cancel'
            }
        ]
    });

    await toast.present();
};

export const confirmAction = async (
    header: string,
    message: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
): Promise<boolean> => {
    return new Promise((resolve) => {
        const alert = document.createElement('ion-alert');
        alert.header = header;
        alert.message = message;
        alert.buttons = [
            {
                text: cancelText,
                role: 'cancel',
                handler: () => resolve(false)
            },
            {
                text: confirmText,
                handler: () => resolve(true)
            }
        ];

        document.body.appendChild(alert);
        alert.present();
    });
};
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonDatetime,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonList,
    IonSearchbar,
    IonText,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonHeader,
    IonPage,
    IonFooter
} from '@ionic/react';
import { Member, paroquiasPorRegiao } from '../types/member';

interface MemberFormProps {
    onSubmit: (member: Partial<Member>) => void;
    initialData?: Member;
}

const MemberForm: React.FC<MemberFormProps> = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Partial<Member>>(initialData || {});
    const [paroquias, setParoquias] = useState<string[]>([]);

    useEffect(() => {
        if (formData.regiao) {
            setParoquias(paroquiasPorRegiao[formData.regiao] || []);
        }
    }, [formData.regiao]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="ion-padding">
            <IonGrid>
                <IonRow>
                    <IonCol size="12" sizeMd="6">
                        <IonItem>
                            <IonLabel position="floating">Nome Completo</IonLabel>
                            <IonInput
                                required
                                value={formData.nome_completo}
                                onIonChange={e => setFormData({...formData, nome_completo: e.detail.value!})}
                            />
                        </IonItem>
                    </IonCol>
                    
                    <IonCol size="12" sizeMd="6">
                        <IonItem>
                            <IonLabel position="floating">Data de Nascimento</IonLabel>
                            <IonInput
                                type="date"
                                value={formData.data_nascimento?.split('T')[0]}
                                onIonChange={e => setFormData({
                                    ...formData,
                                    data_nascimento: e.detail.value || undefined
                                })}
                            />
                        </IonItem>
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol size="12" sizeMd="4">
                        <IonItem>
                            <IonLabel>Gênero</IonLabel>
                            <IonSelect value={formData.genero} onIonChange={e => setFormData({...formData, genero: e.detail.value})}>
                                <IonSelectOption value="Masculino">Masculino</IonSelectOption>
                                <IonSelectOption value="Feminino">Feminino</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCol>

                    <IonCol size="12" sizeMd="4">
                        <IonItem>
                            <IonLabel>Região</IonLabel>
                            <IonSelect value={formData.regiao} onIonChange={e => setFormData({...formData, regiao: e.detail.value})}>
                                <IonSelectOption value="ESTE">ESTE</IonSelectOption>
                                <IonSelectOption value="OESTE">OESTE</IonSelectOption>
                                <IonSelectOption value="SUL">SUL</IonSelectOption>
                                <IonSelectOption value="SUDUESTE">SUDUESTE</IonSelectOption>
                                <IonSelectOption value="NORTE">NORTE</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCol>

                    <IonCol size="12" sizeMd="4">
                        <IonItem>
                            <IonLabel>Paróquia</IonLabel>
                            <IonSelect value={formData.paroquia} onIonChange={e => setFormData({...formData, paroquia: e.detail.value})} disabled={!formData.regiao}>
                                {paroquias.map(paroquia => (
                                    <IonSelectOption key={paroquia} value={paroquia}>
                                        {paroquia}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol size="12" sizeMd="4">
                        <IonItem>
                            <IonLabel>Função</IonLabel>
                            <IonSelect value={formData.funcao} onIonChange={e => setFormData({...formData, funcao: e.detail.value})}>
                                <IonSelectOption value="Pastor">Pastor</IonSelectOption>
                                <IonSelectOption value="Evangelista">Evangelista</IonSelectOption>
                                <IonSelectOption value="Monitor">Monitor</IonSelectOption>
                                <IonSelectOption value="Membro Normal">Membro Normal</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCol>

                    <IonCol size="12" sizeMd="4">
                        <IonItem>
                            <IonLabel>Estado</IonLabel>
                            <IonSelect value={formData.estado} onIonChange={e => setFormData({...formData, estado: e.detail.value})}>
                                <IonSelectOption value="Batizado">Batizado</IonSelectOption>
                                <IonSelectOption value="Confirmado">Confirmado</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCol>

                    <IonCol size="12" sizeMd="4">
                        <IonItem>
                            <IonLabel>Sociedade</IonLabel>
                            <IonSelect value={formData.sociedade} onIonChange={e => setFormData({...formData, sociedade: e.detail.value})}>
                                <IonSelectOption value="Dominical">Dominical</IonSelectOption>
                                <IonSelectOption value="Jovens">Jovens</IonSelectOption>
                                <IonSelectOption value="SNF">SNF</IonSelectOption>
                                <IonSelectOption value="SHV">SHV</IonSelectOption>
                                <IonSelectOption value="SS">SS</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol>
                        <IonButton expand="block" type="submit" className="ion-margin-top">
                            {initialData ? 'Atualizar' : 'Cadastrar'}
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </form>
    );
};

export default MemberForm;
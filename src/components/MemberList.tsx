import React, { useState } from 'react';
import {
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
} from '@ionic/react';
import { pencil, trash } from 'ionicons/icons';
import { Member } from '../types/member';

interface MemberListProps {
    members: Member[];
    onEdit: (member: Member) => void;
    onDelete: (id: string) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, onEdit, onDelete }) => {
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({
        regiao: '',
        paroquia: '',
        funcao: '',
        sociedade: ''
    });
    const [sortBy, setSortBy] = useState<'name' | 'date'>('name');

    const filteredMembers = members
        .filter(member => {
            const matchesSearch = member.nome_completo.toLowerCase()
                .includes(searchText.toLowerCase());
            const matchesRegiao = !filters.regiao || member.regiao === filters.regiao;
            const matchesParoquia = !filters.paroquia || member.paroquia === filters.paroquia;
            const matchesFuncao = !filters.funcao || member.funcao === filters.funcao;
            const matchesSociedade = !filters.sociedade || member.sociedade === filters.sociedade;

            return matchesSearch && matchesRegiao && matchesParoquia && 
                   matchesFuncao && matchesSociedade;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.nome_completo.localeCompare(b.nome_completo);
            } else {
                return new Date(a.data_nascimento).getTime() - 
                       new Date(b.data_nascimento).getTime();
            }
        });

    const stats = {
        total: members.length,
        masculino: members.filter(m => m.genero === 'Masculino').length,
        feminino: members.filter(m => m.genero === 'Feminino').length,
    };

    return (
        <div className="ion-padding">
            <IonCard className="ion-margin-bottom">
                <IonCardContent>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="4" className="ion-text-center">
                                <h2>Total de Membros</h2>
                                <h3>{stats.total}</h3>
                            </IonCol>
                            <IonCol size="4" className="ion-text-center">
                                <h2>Masculino</h2>
                                <h3>{stats.masculino}</h3>
                            </IonCol>
                            <IonCol size="4" className="ion-text-center">
                                <h2>Feminino</h2>
                                <h3>{stats.feminino}</h3>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCardContent>
            </IonCard>

            {/* Search and filters */}
            <IonGrid>
                <IonRow>
                    <IonCol size="12" sizeMd="6">
                        <IonSearchbar
                            value={searchText}
                            onIonChange={e => setSearchText(e.detail.value!)}
                            placeholder="Buscar por nome"
                        />
                    </IonCol>
                    <IonCol size="12" sizeMd="3">
                        <IonSelect
                            placeholder="Região"
                            value={filters.regiao}
                            onIonChange={e => setFilters({...filters, regiao: e.detail.value})}
                            interface="popover"
                        >
                            <IonSelectOption value="">Todas</IonSelectOption>
                            <IonSelectOption value="ESTE">ESTE</IonSelectOption>
                            <IonSelectOption value="OESTE">OESTE</IonSelectOption>
                            <IonSelectOption value="SUL">SUL</IonSelectOption>
                            <IonSelectOption value="SUDUESTE">SUDUESTE</IonSelectOption>
                            <IonSelectOption value="NORTE">NORTE</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol size="12" sizeMd="3">
                        <IonSelect
                            placeholder="Ordenar por"
                            value={sortBy}
                            onIonChange={e => setSortBy(e.detail.value)}
                            interface="popover"
                        >
                            <IonSelectOption value="name">Nome</IonSelectOption>
                            <IonSelectOption value="date">Data de Nascimento</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>

                <IonRow>
                    {filteredMembers.map(member => (
                        <IonCol size="12" sizeMd="6" sizeLg="4" key={member.id}>
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>{member.nome_completo}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <p><strong>Região:</strong> {member.regiao}</p>
                                    <p><strong>Paróquia:</strong> {member.paroquia}</p>
                                    <p><strong>Função:</strong> {member.funcao}</p>
                                    <p><strong>Sociedade:</strong> {member.sociedade}</p>
                                    <div className="ion-text-end">
                                        <IonButton 
                                            fill="clear" 
                                            onClick={() => onEdit(member)}
                                        >
                                            <IonIcon icon={pencil} slot="icon-only" />
                                        </IonButton>
                                        <IonButton 
                                            fill="clear" 
                                            color="danger" 
                                            onClick={() => onDelete(member.id)}
                                        >
                                            <IonIcon icon={trash} slot="icon-only" />
                                        </IonButton>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    ))}
                </IonRow>
            </IonGrid>

            {/* Table view */}
            <IonCard>
                <IonCardContent>
                    <div className="table-responsive">
                        <table className="ion-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Gênero</th>
                                    <th>Região</th>
                                    <th>Paróquia</th>
                                    <th>Função</th>
                                    <th>Sociedade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map(member => (
                                    <tr key={member.id}>
                                        <td>{member.nome_completo}</td>
                                        <td>{member.genero}</td>
                                        <td>{member.regiao}</td>
                                        <td>{member.paroquia}</td>
                                        <td>{member.funcao}</td>
                                        <td>{member.sociedade}</td>
                                        <td>
                                            <IonButton 
                                                fill="clear" 
                                                size="small"
                                                onClick={() => onEdit(member)}
                                            >
                                                <IonIcon icon={pencil} slot="icon-only" />
                                            </IonButton>
                                            <IonButton 
                                                fill="clear" 
                                                color="danger" 
                                                size="small"
                                                onClick={() => onDelete(member.id)}
                                            >
                                                <IonIcon icon={trash} slot="icon-only" />
                                            </IonButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </IonCardContent>
            </IonCard>
        </div>
    );
};

export default MemberList;
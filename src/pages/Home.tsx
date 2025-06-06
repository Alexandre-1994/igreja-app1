import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    useIonAlert
} from '@ionic/react';
import { add, people, man, woman, statsChart, calendar, pencil } from 'ionicons/icons';
import { useHistory } from 'react-router';
import MemberList from '../components/MemberList';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback, confirmAction } from '../services/feedback';
import LoadingSpinner from '../components/LoadingSpinner';
// import { useEffect, useState } from 'react';
import { canManageMembers } from '../utils/permissions';
// import { showFeedback } from '../services/feedback';
import { IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonFab,
    IonFabButton,
} from '@ionic/react';
import { print, downloadOutline } from 'ionicons/icons';
// Update imports at the top
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const Home: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        masculino: 0,
        feminino: 0,
        regioes: {} as Record<string, number>
    });
    const history = useHistory();
    const [presentAlert] = useIonAlert();
    const [hasPermission, setHasPermission] = useState(false);
    
    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        const permitted = await canManageMembers();
        setHasPermission(permitted);
        
        if (!permitted) {
            showFeedback('Você não tem permissão para gerenciar membros', 'warning');
            history.push('/login');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [members]);

    const calculateStats = () => {
        const regioes = members.reduce((acc, member) => {
            acc[member.regiao] = (acc[member.regiao] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        setStats({
            total: members.length,
            masculino: members.filter(m => m.genero === 'Masculino').length,
            feminino: members.filter(m => m.genero === 'Feminino').length,
            regioes
        });
    };

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .order('nome_completo');

            if (error) {
                showFeedback('Erro ao carregar dados dos membros', 'error');
                return;
            }

            setMembers(data || []);
            showFeedback('Dados atualizados com sucesso', 'success');
        } catch (error) {
            showFeedback('Erro ao acessar o servidor', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (member: Member) => {
        try {
            setIsLoading(true);
            history.push(`/edit/${member.id}`);
            showFeedback('Abrindo editor de membro...', 'info');
        } catch (error) {
            showFeedback('Erro ao abrir editor', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const willDelete = await confirmAction(
                'Confirmar Exclusão',
                'Deseja realmente excluir este membro?',
                'Excluir',
                'Cancelar'
            );

            if (!willDelete) {
                return;
            }

            setIsLoading(true);
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id);

            if (error) {
                showFeedback('Erro ao excluir membro', 'error');
                return;
            }

            await fetchMembers();
            showFeedback('Membro excluído com sucesso', 'success');
        } catch (error) {
            showFeedback('Erro ao processar a exclusão', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const [searchText, setSearchText] = useState('');
    const [filterRegiao, setFilterRegiao] = useState('');
    const [filterGenero, setFilterGenero] = useState('');

    // Add new state for parish filter
    const [filterParoquia, setFilterParoquia] = useState('');
    
    // Update filteredMembers to include parish filter
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.nome_completo.toLowerCase().includes(searchText.toLowerCase());
        const matchesRegiao = filterRegiao ? member.regiao === filterRegiao : true;
        const matchesGenero = filterGenero ? member.genero === filterGenero : true;
        const matchesParoquia = filterParoquia ? member.paroquia === filterParoquia : true;
        return matchesSearch && matchesRegiao && matchesGenero && matchesParoquia;
    });
    
    // Add parish filter in the filters row
    <IonGrid>
        <IonRow>
            {/* ... existing search and filters ... */}
            <IonCol size="12" sizeMd="3">
                <IonSelect
                    value={filterParoquia}
                    placeholder="Filtrar por paróquia"
                    onIonChange={e => setFilterParoquia(e.detail.value)}
                >
                    <IonSelectOption value="">Todas</IonSelectOption>
                    {Array.from(new Set(members.map(m => m.paroquia))).map(paroquia => (
                        <IonSelectOption key={paroquia} value={paroquia}>
                            {paroquia}
                        </IonSelectOption>
                    ))}
                </IonSelect>
            </IonCol>
        </IonRow>
    </IonGrid>
    
    // Update PDF generation to include parish
    const generatePDF = async () => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text('Relatório de Membros', 14, 15);
        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 25);

        // Add statistics
        doc.text(`Total de Membros: ${stats.total}`, 14, 35);
        doc.text(`Masculino: ${stats.masculino}`, 14, 42);
        doc.text(`Feminino: ${stats.feminino}`, 14, 49);

        // Add members table
        const tableColumn = ["Nome", "Região", "Paróquia", "Função", "Gênero"];
        const tableRows = filteredMembers.map(member => [
            member.nome_completo,
            member.regiao,
            member.paroquia,
            member.funcao,
            member.genero
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 60,
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save('relatorio-membros.pdf');
    };

    return (
        <IonPage>
            {isLoading && <LoadingSpinner message="Processando..." />}
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Dashboard</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.push('/add')}>
                            <IonIcon icon={add} slot="start" />
                            Novo Membro
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol size="12" sizeMd="3">
                            <IonSearchbar
                                value={searchText}
                                onIonChange={e => setSearchText(e.detail.value!)}
                                placeholder="Buscar por nome..."
                            />
                        </IonCol>
                        <IonCol size="12" sizeMd="3">
                            <IonSelect
                                value={filterRegiao}
                                placeholder="Filtrar por região"
                                onIonChange={e => setFilterRegiao(e.detail.value)}
                            >
                                <IonSelectOption value="">Todas</IonSelectOption>
                                {Object.keys(stats.regioes).map(regiao => (
                                    <IonSelectOption key={regiao} value={regiao}>
                                        {regiao}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonCol>
                        <IonCol size="12" sizeMd="3">
                            <IonSelect
                                value={filterParoquia}
                                placeholder="Filtrar por paróquia"
                                onIonChange={e => setFilterParoquia(e.detail.value)}
                            >
                                <IonSelectOption value="">Todas</IonSelectOption>
                                {Array.from(new Set(members.map(m => m.paroquia))).map(paroquia => (
                                    <IonSelectOption key={paroquia} value={paroquia}>
                                        {paroquia}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonCol>
                        <IonCol size="12" sizeMd="3">
                            <IonSelect
                                value={filterGenero}
                                placeholder="Filtrar por gênero"
                                onIonChange={e => setFilterGenero(e.detail.value)}
                            >
                                <IonSelectOption value="">Todos</IonSelectOption>
                                <IonSelectOption value="Masculino">Masculino</IonSelectOption>
                                <IonSelectOption value="Feminino">Feminino</IonSelectOption>
                            </IonSelect>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {/* Statistics Cards */}
                <IonRow>
                    <IonCol size="12" sizeMd="4">
                        <IonCard className="stat-card">
                            <IonCardContent className="ion-text-center">
                                <IonIcon icon={people} className="stat-icon" />
                                <h2>Total de Membros</h2>
                                <h1>{stats.total}</h1>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
                        <IonCard className="stat-card">
                            <IonCardContent className="ion-text-center">
                                <IonIcon icon={man} className="stat-icon" />
                                <h2>Masculino</h2>
                                <h1>{stats.masculino}</h1>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                    <IonCol size="12" sizeMd="4">
                        <IonCard className="stat-card">
                            <IonCardContent className="ion-text-center">
                                <IonIcon icon={woman} className="stat-icon" />
                                <h2>Feminino</h2>
                                <h1>{stats.feminino}</h1>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>

                {/* Regional Distribution */}
                <IonRow>
                    <IonCol size="12">
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    <IonIcon icon={statsChart} /> Distribuição por Região
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid>
                                    <IonRow>
                                        {Object.entries(stats.regioes).map(([regiao, count]) => (
                                            <IonCol size="6" sizeMd="3" key={regiao}>
                                                <div className="region-stat">
                                                    <h3>{regiao}</h3>
                                                    <p>{count} membros</p>
                                                </div>
                                            </IonCol>
                                        ))}
                                    </IonRow>
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>

                {/* Recent Members */}
                <IonRow>
                    <IonCol>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    <IonIcon icon={calendar} /> Membros Recentes
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="table-responsive">
                                    <table className="ion-table">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Região</th>
                                                <th>Função</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMembers.slice(0, 5).map(member => (
                                                <tr key={member.id}>
                                                    <td>{member.nome_completo}</td>
                                                    <td>{member.regiao}</td>
                                                    <td>{member.funcao}</td>
                                                    <td>
                                                        <IonButton 
                                                            fill="clear" 
                                                            size="small"
                                                            onClick={() => handleEdit(member)}
                                                        >
                                                            <IonIcon icon={pencil} slot="icon-only" />
                                                        </IonButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="ion-text-end ion-padding-top">
                                    <IonButton fill="clear" onClick={() => history.push('/members')}>
                                        Ver todos os membros
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
                {/* Add FAB buttons for export and print */}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={generatePDF}>
                        <IonIcon icon={downloadOutline} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Home;

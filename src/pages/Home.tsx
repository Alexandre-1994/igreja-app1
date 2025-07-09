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
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonFab,
    IonFabButton,
    IonText,
    IonAvatar,
    IonChip,
    IonLabel,
    useIonAlert
} from '@ionic/react';
import { 
    add, 
    people, 
    man, 
    woman, 
    statsChart, 
    calendar, 
    pencil, 
    downloadOutline,
    filterOutline,
    searchOutline,
    locationOutline,
    businessOutline,
    refreshOutline,
    logOutOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router';
import MemberList from '../components/MemberList';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback, confirmAction } from '../services/feedback';
import LoadingSpinner from '../components/LoadingSpinner';
import { canManageMembers } from '../utils/permissions';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import './Home.css';

const Home: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        masculino: 0,
        feminino: 0,
        regioes: {} as Record<string, number>
    });
    const [searchText, setSearchText] = useState('');
    const [filterRegiao, setFilterRegiao] = useState('');
    const [filterGenero, setFilterGenero] = useState('');
    const [filterParoquia, setFilterParoquia] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const history = useHistory();
    const [presentAlert] = useIonAlert();
    const [hasPermission, setHasPermission] = useState(false);
    
    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        try {
            const permitted = await canManageMembers();
            setHasPermission(permitted);
            
            if (!permitted) {
                showFeedback('Acesso limitado - algumas funcionalidades podem estar restritas', 'warning');
                // Não redirecionar automaticamente, apenas mostrar aviso
            }
        } catch (error) {
            console.error('Error checking permissions:', error);
            setHasPermission(false);
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

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.nome_completo.toLowerCase().includes(searchText.toLowerCase());
        const matchesRegiao = filterRegiao ? member.regiao === filterRegiao : true;
        const matchesGenero = filterGenero ? member.genero === filterGenero : true;
        const matchesParoquia = filterParoquia ? member.paroquia === filterParoquia : true;
        return matchesSearch && matchesRegiao && matchesGenero && matchesParoquia;
    });
    
    const generatePDF = async () => {
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('Relatório de Membros', 14, 15);
        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 25);

        doc.text(`Total de Membros: ${stats.total}`, 14, 35);
        doc.text(`Masculino: ${stats.masculino}`, 14, 42);
        doc.text(`Feminino: ${stats.feminino}`, 14, 49);

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

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            history.push('/login');
        }
    };

    const clearFilters = () => {
        setSearchText('');
        setFilterRegiao('');
        setFilterGenero('');
        setFilterParoquia('');
    };

    return (
        <IonPage className="home-page">
            {isLoading && <LoadingSpinner message="Processando..." />}
            
            <IonHeader className="home-header">
                <IonToolbar className="modern-toolbar">
                    <IonTitle className="dashboard-title">
                        <div className="title-container">
                            <IonIcon icon={statsChart} className="title-icon" />
                            <span>Dashboard</span>
                        </div>
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton 
                            className="refresh-btn"
                            fill="clear"
                            onClick={fetchMembers}
                        >
                            <IonIcon icon={refreshOutline} slot="icon-only" />
                        </IonButton>
                        <IonButton 
                            className="add-member-btn"
                            onClick={() => history.push('/add')}
                        >
                            <IonIcon icon={add} slot="start" />
                            Novo Membro
                        </IonButton>
                        <IonButton 
                            className="logout-btn"
                            fill="clear"
                            onClick={handleLogout}
                        >
                            <IonIcon icon={logOutOutline} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="home-content">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1>Bem-vindo ICUM/SNF</h1>
                        <p>Gerencie membros e visualize estatísticas em tempo real</p>
                    </div>
                    <div className="welcome-stats">
                        <div className="quick-stat">
                            <span className="stat-number">{stats.total}</span>
                            <span className="stat-label">Membros Total</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="search-section">
                    <IonCard className="search-card">
                        <IonCardContent>
                            <div className="search-header">
                                <IonSearchbar
                                    className="modern-searchbar"
                                    value={searchText}
                                    onIonChange={e => setSearchText(e.detail.value!)}
                                    placeholder="Buscar membros por nome..."
                                    showClearButton="focus"
                                />
                                <IonButton 
                                    fill="outline"
                                    className="filter-toggle-btn"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <IonIcon icon={filterOutline} slot="start" />
                                    Filtros
                                </IonButton>
                            </div>
                            
                            {showFilters && (
                                <div className="filters-container">
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol size="12" sizeMd="4">
                                                <div className="filter-group">
                                                    <IonLabel>Região</IonLabel>
                                                    <IonSelect
                                                        className="modern-select"
                                                        value={filterRegiao}
                                                        placeholder="Todas as regiões"
                                                        onIonChange={e => setFilterRegiao(e.detail.value)}
                                                    >
                                                        <IonSelectOption value="">Todas</IonSelectOption>
                                                        {Object.keys(stats.regioes).map(regiao => (
                                                            <IonSelectOption key={regiao} value={regiao}>
                                                                {regiao}
                                                            </IonSelectOption>
                                                        ))}
                                                    </IonSelect>
                                                </div>
                                            </IonCol>
                                            <IonCol size="12" sizeMd="4">
                                                <div className="filter-group">
                                                    <IonLabel>Paróquia</IonLabel>
                                                    <IonSelect
                                                        className="modern-select"
                                                        value={filterParoquia}
                                                        placeholder="Todas as paróquias"
                                                        onIonChange={e => setFilterParoquia(e.detail.value)}
                                                    >
                                                        <IonSelectOption value="">Todas</IonSelectOption>
                                                        {Array.from(new Set(members.map(m => m.paroquia))).map(paroquia => (
                                                            <IonSelectOption key={paroquia} value={paroquia}>
                                                                {paroquia}
                                                            </IonSelectOption>
                                                        ))}
                                                    </IonSelect>
                                                </div>
                                            </IonCol>
                                            <IonCol size="12" sizeMd="4">
                                                <div className="filter-group">
                                                    <IonLabel>Gênero</IonLabel>
                                                    <IonSelect
                                                        className="modern-select"
                                                        value={filterGenero}
                                                        placeholder="Todos os gêneros"
                                                        onIonChange={e => setFilterGenero(e.detail.value)}
                                                    >
                                                        <IonSelectOption value="">Todos</IonSelectOption>
                                                        <IonSelectOption value="Masculino">Masculino</IonSelectOption>
                                                        <IonSelectOption value="Feminino">Feminino</IonSelectOption>
                                                    </IonSelect>
                                                </div>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <div className="filter-actions">
                                                    <IonButton 
                                                        fill="clear" 
                                                        size="small"
                                                        onClick={clearFilters}
                                                    >
                                                        Limpar Filtros
                                                    </IonButton>
                                                    <IonChip className="results-chip">
                                                        {filteredMembers.length} resultados
                                                    </IonChip>
                                                </div>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </div>
                            )}
                        </IonCardContent>
                    </IonCard>
                </div>

                {/* Statistics Cards */}
                <div className="stats-section">
                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" sizeMd="4">
                                <IonCard className="stat-card total-card">
                                    <IonCardContent>
                                        <div className="stat-content">
                                            <div className="stat-icon-container">
                                                <IonIcon icon={people} className="stat-icon" />
                                            </div>
                                            <div className="stat-details">
                                                <h3>Total de Membros</h3>
                                                <h1>{stats.total}</h1>
                                                <p>Membros cadastrados</p>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                                <IonCard className="stat-card male-card">
                                    <IonCardContent>
                                        <div className="stat-content">
                                            <div className="stat-icon-container">
                                                <IonIcon icon={man} className="stat-icon" />
                                            </div>
                                            <div className="stat-details">
                                                <h3>Masculino</h3>
                                                <h1>{stats.masculino}</h1>
                                                <p>{stats.total > 0 ? Math.round((stats.masculino / stats.total) * 100) : 0}% do total</p>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                                <IonCard className="stat-card female-card">
                                    <IonCardContent>
                                        <div className="stat-content">
                                            <div className="stat-icon-container">
                                                <IonIcon icon={woman} className="stat-icon" />
                                            </div>
                                            <div className="stat-details">
                                                <h3>Feminino</h3>
                                                <h1>{stats.feminino}</h1>
                                                <p>{stats.total > 0 ? Math.round((stats.feminino / stats.total) * 100) : 0}% do total</p>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>

                {/* Regional Distribution */}
                <div className="regions-section">
                    <IonCard className="regions-card">
                        <IonCardHeader>
                            <IonCardTitle className="section-title">
                                <IonIcon icon={locationOutline} />
                                Distribuição por Região
                            </IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonGrid>
                                <IonRow>
                                    {Object.entries(stats.regioes).map(([regiao, count]) => (
                                        <IonCol size="6" sizeMd="3" key={regiao}>
                                            <div className="region-stat">
                                                <div className="region-count">{count}</div>
                                                <div className="region-name">{regiao}</div>
                                                <div className="region-bar">
                                                    <div 
                                                        className="region-bar-fill"
                                                        style={{
                                                            width: `${(count / stats.total) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </IonCol>
                                    ))}
                                </IonRow>
                            </IonGrid>
                        </IonCardContent>
                    </IonCard>
                </div>

                {/* Recent Members */}
                <div className="recent-section">
                    <IonCard className="recent-card">
                        <IonCardHeader>
                            <IonCardTitle className="section-title">
                                <IonIcon icon={calendar} />
                                Membros Recentes
                            </IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div className="members-grid">
                                {filteredMembers.slice(0, 6).map(member => (
                                    <div key={member.id} className="member-card">
                                        <div className="member-avatar">
                                            <IonAvatar>
                                                <div className="avatar-placeholder">
                                                    {member.nome_completo.charAt(0).toUpperCase()}
                                                </div>
                                            </IonAvatar>
                                        </div>
                                        <div className="member-info">
                                            <h4>{member.nome_completo}</h4>
                                            <p className="member-region">
                                                <IonIcon icon={locationOutline} />
                                                {member.regiao}
                                            </p>
                                            <p className="member-parish">
                                                <IonIcon icon={businessOutline} />
                                                {member.paroquia}
                                            </p>
                                            <IonChip className="member-function">
                                                {member.funcao}
                                            </IonChip>
                                        </div>
                                        <div className="member-actions">
                                            <IonButton 
                                                fill="clear" 
                                                size="small"
                                                onClick={() => handleEdit(member)}
                                            >
                                                <IonIcon icon={pencil} slot="icon-only" />
                                            </IonButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {filteredMembers.length > 6 && (
                                <div className="view-all-section">
                                    <IonButton 
                                        expand="block" 
                                        fill="outline"
                                        onClick={() => history.push('/members')}
                                    >
                                        Ver todos os {filteredMembers.length} membros
                                    </IonButton>
                                </div>
                            )}
                        </IonCardContent>
                    </IonCard>
                </div>

                {/* Floating Action Button */}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton className="export-fab" onClick={generatePDF}>
                        <IonIcon icon={downloadOutline} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Home;
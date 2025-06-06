export interface Member {
    id: string;
    nome_completo: string;
    data_nascimento: string;
    genero: 'Masculino' | 'Feminino';
    regiao: 'ESTE' | 'OESTE' | 'SUL' | 'SUDUESTE' | 'NORTE';
    paroquia: string;
    funcao: 'Pastor' | 'Evangelista' | 'Monitor' | 'Membro Normal';
    estado: 'Batizado' | 'Confirmado';
    sociedade: 'Dominical' | 'Jovens' | 'SNF' | 'SHV' | 'SS';
    created_at: string;
}

export const paroquiasPorRegiao = {
    ESTE: ['Munhava', 'Esturo', 'Massagem'],
    SUL: ['Manhangalene', 'Costa do Sol'],
    OESTE: ['Bairro 4', 'Manica', 'Tete'],
    SUDUESTE: ['Manchanga', 'Goi-Goi'],
    NORTE: []
};
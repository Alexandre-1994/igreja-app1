interface SupabaseError {
    code: string;
    message: string;
    details?: string | null;
}

export const getErrorMessage = (error: SupabaseError): string => {
    const errorMessages: Record<string, string> = {
        '23502': 'Campo obrigatório não preenchido',
        '23505': 'Este registro já existe',
        'default': 'Ocorreu um erro inesperado'
    };

    const fieldErrors: Record<string, string> = {
        'data_nascimento': 'Data de Nascimento',
        'nome_completo': 'Nome Completo',
        'genero': 'Gênero',
        'regiao': 'Região',
        'paroquia': 'Paróquia'
    };

    if (error.code === '23502') {
        const field = error.message.match(/column "([^"]+)"/)?.[1];
        const fieldName = field ? fieldErrors[field] || field : 'desconhecido';
        return `Campo "${fieldName}" é obrigatório`;
    }

    return errorMessages[error.code] || errorMessages.default;
};
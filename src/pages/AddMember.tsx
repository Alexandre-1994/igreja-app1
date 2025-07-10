import React, { useState } from 'react';
import { useHistory } from 'react-router';
import MemberForm from '../components/MemberForm';
import { supabase } from '../services/supabase';
import { Member } from '../types/member';
import { showFeedback } from '../services/feedback';
import './AddMember.css';

// Spinner minimalista
const Spinner = () => <div className="spinner"></div>;

const AddMember = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (memberData: Partial<Member>) => {
    try {
      setIsLoading(true);

      if (!memberData.data_nascimento) {
        showFeedback('Por favor, preencha a Data de Nascimento', 'warning');
        return;
      }

      const { error } = await supabase
        .from('members')
        .insert([{
          ...memberData,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        const errorMessage = error.code === '23502' 
          ? 'Por favor, preencha todos os campos obrigatórios'
          : 'Ocorreu um erro ao cadastrar o membro';
          
        showFeedback(errorMessage, 'error');
        return;
      }

      showFeedback('Membro cadastrado com sucesso!', 'success');
      history.push('/app/members');
    } catch (err) {
      showFeedback('Não foi possível completar o cadastro. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div className="add-member-page scrollable-content">
      {isLoading && (
        <div className="loading-overlay">
          <Spinner />
          <p>Cadastrando...</p>
        </div>
      )}
      
      <header className="page-header">
        <h1>Novo Membro</h1>
      </header>

      <main className="form-main">
        <div className="form-header">
          <h2>Cadastro de Membro</h2>
          <p>Preencha os dados do novo membro</p>
        </div>
        
        <MemberForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
};

export default AddMember;
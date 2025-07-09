import React from 'react';
import { people, man, woman, statsChart } from 'ionicons/icons';
import { StatsCard, ChurchButton } from './TailwindComponents';

// Exemplo de como usar os componentes Tailwind na página Home
export const TailwindStatsSection: React.FC<{
  totalMembers: number;
  maleMembers: number;
  femaleMembers: number;
  onAddMember: () => void;
}> = ({ totalMembers, maleMembers, femaleMembers, onAddMember }) => {
  return (
    <div className="p-4">
      {/* Header com Tailwind */}
      <div className="mb-6">
        <h2 className="text-2xl font-church font-bold text-church-darkblue mb-2">
          Estatísticas da Igreja
        </h2>
        <p className="text-gray-600">Acompanhe os números da sua comunidade</p>
      </div>

      {/* Grid de Cards com Tailwind */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Total de Membros"
          value={totalMembers}
          icon={<span>👥</span>}
          description="Membros ativos"
        />
        <StatsCard
          title="Homens"
          value={maleMembers}
          icon={<span>👨</span>}
          description={`${Math.round((maleMembers / totalMembers) * 100)}% do total`}
        />
        <StatsCard
          title="Mulheres"
          value={femaleMembers}
          icon={<span>👩</span>}
          description={`${Math.round((femaleMembers / totalMembers) * 100)}% do total`}
        />
      </div>

      {/* Botões com Tailwind */}
      <div className="flex flex-wrap gap-3">
        <ChurchButton onClick={onAddMember} size="lg">
          ➕ Adicionar Membro
        </ChurchButton>
        <ChurchButton variant="secondary" size="md">
          📊 Relatórios
        </ChurchButton>
      </div>

      {/* Card de resumo */}
      <div className="church-card mt-6">
        <h3 className="text-lg font-semibold text-church-darkblue mb-3">
          Resumo Rápido
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Taxa de crescimento:</span>
            <span className="text-green-600 font-semibold">+12%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Novos membros este mês:</span>
            <span className="font-semibold">8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

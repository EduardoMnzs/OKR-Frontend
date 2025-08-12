import { OKRCard } from "@/components/okr/OKRCard";
import { CreateOKRModal } from "@/components/okr/CreateOKRModal";
import { OKRFilters, FilterState } from "@/components/okr/OKRFilters";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Users, CheckCircle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";

// Mock data
const okrData = [{
  id: "1",
  title: "Aumentar Índice de Satisfação do Cliente",
  description: "Melhorar nosso índice de satisfação do cliente de 7.5 para 9.0 através da implementação de melhores processos de suporte e coleta de feedback dos clientes.",
  owner: "Sarah Chen",
  deadline: "31 Dez, 2024",
  status: "on-track" as const,
  progress: 75,
  lastUpdate: "há 2 horas",
  commentsCount: 4,
  keyResults: [{
    id: "kr1",
    title: "Reduzir tempo de resposta dos tickets de suporte",
    progress: 80,
    target: 2,
    current: 1.6,
    unit: "horas"
  }, {
    id: "kr2",
    title: "Implementar sistema de feedback do cliente",
    progress: 90,
    target: 1,
    current: 0.9,
    unit: "sistema"
  }, {
    id: "kr3",
    title: "Realizar pesquisas trimestrais de satisfação",
    progress: 60,
    target: 4,
    current: 2.4,
    unit: "pesquisas"
  }]
}, {
  id: "2",
  title: "Lançar Nova Funcionalidade do Produto",
  description: "Lançar com sucesso a funcionalidade de análises baseadas em IA e alcançar 30% de adoção pelos usuários no primeiro trimestre.",
  owner: "Marcus Johnson",
  deadline: "15 Jan, 2025",
  status: "at-risk" as const,
  progress: 45,
  lastUpdate: "há 1 dia",
  commentsCount: 8,
  keyResults: [{
    id: "kr4",
    title: "Completar desenvolvimento e testes",
    progress: 70,
    target: 100,
    current: 70,
    unit: "%"
  }, {
    id: "kr5",
    title: "Taxa de adoção pelos usuários",
    progress: 25,
    target: 30,
    current: 7.5,
    unit: "%"
  }, {
    id: "kr6",
    title: "Documentação da funcionalidade",
    progress: 40,
    target: 100,
    current: 40,
    unit: "%"
  }]
}, {
  id: "3",
  title: "Expandir Presença no Mercado",
  description: "Entrar em dois novos mercados geográficos e estabelecer parcerias com distribuidores locais para aumentar o alcance de mercado.",
  owner: "Lisa Rodriguez",
  deadline: "30 Mar, 2025",
  status: "behind" as const,
  progress: 25,
  lastUpdate: "há 3 dias",
  commentsCount: 2,
  keyResults: [{
    id: "kr7",
    title: "Identificar oportunidades de mercado",
    progress: 60,
    target: 2,
    current: 1.2,
    unit: "mercados"
  }, {
    id: "kr8",
    title: "Estabelecer parcerias",
    progress: 15,
    target: 4,
    current: 0.6,
    unit: "parceiros"
  }, {
    id: "kr9",
    title: "Pesquisa de mercado local",
    progress: 30,
    target: 100,
    current: 30,
    unit: "%"
  }]
}, {
  id: "4",
  title: "Melhorar Performance do Sistema",
  description: "Otimizar a performance da aplicação reduzindo tempo de carregamento e melhorando a experiência do usuário.",
  owner: "Alex Tech",
  deadline: "28 Fev, 2025",
  status: "completed" as const,
  progress: 100,
  lastUpdate: "há 1 semana",
  commentsCount: 3,
  keyResults: [{
    id: "kr10",
    title: "Reduzir tempo de carregamento",
    progress: 100,
    target: 2,
    current: 2,
    unit: "segundos"
  }, {
    id: "kr11",
    title: "Implementar cache otimizado",
    progress: 100,
    target: 1,
    current: 1,
    unit: "sistema"
  }]
}];
// Dynamic stats calculation will be done in component
const Dashboard = () => {
  const [okrs, setOkrs] = useState(okrData);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    period: "current",
    owner: "",
  });

  const handleOKRCreated = (newOKR: any) => {
    setOkrs([newOKR, ...okrs]);
  };

  const handleOKRUpdated = (updatedOKR: any) => {
    setOkrs(prev => prev.map(okr => okr.id === updatedOKR.id ? updatedOKR : okr));
  };

  const handleOKRDeleted = (deletedOKRId: string) => {
    setOkrs(prev => prev.filter(okr => okr.id !== deletedOKRId));
  };

  // Filter OKRs based on current filters
  const filteredOkrs = useMemo(() => {
    return okrs.filter(okr => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          okr.title.toLowerCase().includes(searchLower) ||
          okr.description.toLowerCase().includes(searchLower) ||
          okr.owner.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(okr.status)) {
        return false;
      }

      // Owner filter
      if (filters.owner && !okr.owner.toLowerCase().includes(filters.owner.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [okrs, filters]);

  // Calculate dynamic stats based on current OKRs
  const stats = useMemo(() => {
    const total = okrs.length;
    const onTrack = okrs.filter(okr => okr.status === "on-track").length;
    const completed = okrs.filter(okr => okr.status === "completed").length;
    const teamOkrs = okrs.filter(okr => okr.owner !== "Alex").length; // Assuming others are team OKRs

    return [
      {
        title: "Total de OKRs",
        value: total.toString(),
        change: "+2",
        icon: Target,
        color: "text-primary"
      },
      {
        title: "No Prazo",
        value: onTrack.toString(),
        change: "+1",
        icon: TrendingUp,
        color: "text-success"
      },
      {
        title: "OKRs de Equipe",
        value: teamOkrs.toString(),
        change: "0",
        icon: Users,
        color: "text-secondary"
      },
      {
        title: "Concluídos",
        value: completed.toString(),
        change: "+1",
        icon: CheckCircle,
        color: "text-accent"
      }
    ];
  }, [okrs]);

  return <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bem-vindo de volta, Alex!
          </h1>
          <p className="text-muted-foreground mt-1">
            Vamos fazer progresso em suas metas hoje.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <CreateOKRModal onOKRCreated={handleOKRCreated}>
            <Button className="btn-hero">
              <Plus className="w-4 h-4 mr-2" />
              Criar OKR
            </Button>
          </CreateOKRModal>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => <Card key={index} className="card-okr">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-muted/30 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {/* Filters */}
      <OKRFilters onFiltersChange={setFilters} />

      {/* OKR Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">OKRs Ativos</h2>
          <span className="text-sm text-muted-foreground">
            {filteredOkrs.length} de {okrs.length} objetivos
          </span>
        </div>
        
        <div className="grid gap-6">
          {filteredOkrs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhum OKR encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros ou criar um novo OKR.
                </p>
                <CreateOKRModal onOKRCreated={handleOKRCreated}>
                  <Button className="btn-hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro OKR
                  </Button>
                </CreateOKRModal>
              </CardContent>
            </Card>
          ) : (
            filteredOkrs.map((okr, index) => (
              <div key={okr.id} className="animate-fade-in-up" style={{
                animationDelay: `${index * 100}ms`
              }}>
                <OKRCard {...okr} onOKRUpdated={handleOKRUpdated} onOKRDeleted={handleOKRDeleted} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>;
};
export default Dashboard;
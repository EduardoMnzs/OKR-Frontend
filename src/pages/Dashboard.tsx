import { OKRCard } from "@/components/okr/OKRCard";
import { CreateOKRModal } from "@/components/okr/CreateOKRModal";
import { OKRFilters, FilterState } from "@/components/okr/OKRFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Users, CheckCircle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { OKR } from "@/types/okr.d.ts";
import { getOkrs, deleteOKR } from "@/services/okrService";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    period: "current",
    owner: "",
  });

  const { data: okrs, isLoading, isError } = useQuery<OKR[]>({
    queryKey: ['okrs'],
    queryFn: getOkrs,
  });

  const deleteOKRMutaion = useMutation({
    mutationFn: (okrId: string) => deleteOKR(okrId),
    onMutate: async (okrId: string) => {
      await queryClient.cancelQueries({ queryKey: ['okrs'] });
      const previousOkrs = queryClient.getQueryData<OKR[]>(['okrs']);
      
      queryClient.setQueryData<OKR[]>(['okrs'], (oldOkrs) => 
        oldOkrs ? oldOkrs.filter(okr => okr.id !== okrId) : []
      );
      
      return { previousOkrs };
    },
    onSuccess: () => {
      toast({
        title: "OKR excluída com sucesso!",
        description: "A OKR foi removida da sua lista.",
      });
    },
    onError: (err, okrId, context) => {
      queryClient.setQueryData(['okrs'], context?.previousOkrs);
      toast({
        title: "Erro ao excluir OKR",
        description: err.message || "Não foi possível remover a OKR. Tente novamente.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['okrs'] });
    },
  });

  const handleOKRDeleted = (okrId: string) => {
    deleteOKRMutaion.mutate(okrId);
  };
  
  const handleOKRCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['okrs'] });
  };
  const handleOKRUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['okrs'] });
  };

  const filteredOkrs = useMemo(() => {
    if (!okrs) return [];
    
    return okrs.filter(okr => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          okr.title.toLowerCase().includes(searchLower) ||
          okr.description.toLowerCase().includes(searchLower) ||
          okr.responsible.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(okr.status)) {
        return false;
      }
      if (filters.owner && !okr.responsible.toLowerCase().includes(filters.owner.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [okrs, filters]);

  const stats = useMemo(() => {
    if (!okrs) return [];
    
    const total = okrs.length;
    const onTrack = okrs.filter(okr => okr.status === "on-track").length;
    const completed = okrs.filter(okr => okr.status === "completed").length;
    const teamOkrs = okrs.filter(okr => okr.responsible !== "Alex").length;

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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Carregando OKRs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Erro ao carregar OKRs. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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
        {stats.map((stat, index) => (
          <Card key={index} className="card-okr">
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
          </Card>
        ))}
      </div>

      {/* Filters */}
      <OKRFilters onFiltersChange={setFilters} />

      {/* OKR Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">OKRs Ativos</h2>
          <span className="text-sm text-muted-foreground">
            {filteredOkrs.length} de {okrs?.length || 0} objetivos
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
                <OKRCard 
                  {...okr}
                  onOKRUpdated={handleOKRUpdated}
                  onOKRDeleted={handleOKRDeleted}
                  isDeleting={deleteOKRMutaion.isPending && deleteOKRMutaion.variables === okr.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
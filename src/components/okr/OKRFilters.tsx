import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  Filter, 
  User, 
  Target,
  X,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react";

interface OKRFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  status: string[];
  period: string;
  owner: string;
}

const statusOptions = [
  { value: "on-track", label: "No Prazo", icon: TrendingUp, color: "bg-success" },
  { value: "at-risk", label: "Em Risco", icon: AlertTriangle, color: "bg-warning" },
  { value: "behind", label: "Atrasado", icon: Clock, color: "bg-destructive" },
  { value: "completed", label: "Concluído", icon: CheckCircle, color: "bg-primary" },
];

const periodOptions = [
  { value: "current", label: "Este Trimestre" },
  { value: "previous", label: "Trimestre Anterior" },
  { value: "all", label: "Todos os Períodos" },
];

export function OKRFilters({ onFiltersChange }: OKRFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    period: "current",
    owner: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    updateFilters({ status: newStatus });
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      status: [],
      period: "current",
      owner: "",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.status.length > 0 || filters.owner || filters.period !== "current";

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search and Basic Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar OKRs..." 
                className="pl-10 border-border/50 focus:border-primary"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className={isExpanded ? "bg-muted" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                    {filters.status.length + (filters.owner ? 1 : 0) + (filters.period !== "current" ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateFilters({ period: filters.period === "current" ? "all" : "current" })}
                className={filters.period !== "current" ? "bg-primary/10 border-primary/20" : ""}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {periodOptions.find(p => p.value === filters.period)?.label}
              </Button>

              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-border/50 animate-fade-in-up">
              {/* Status Filters */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status.value}
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(status.value)}
                      className={`${
                        filters.status.includes(status.value) 
                          ? "bg-primary/10 border-primary/20 text-primary" 
                          : ""
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${status.color} mr-2`} />
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Owner Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Responsável</span>
                </div>
                <Input
                  placeholder="Filtrar por responsável..."
                  value={filters.owner}
                  onChange={(e) => updateFilters({ owner: e.target.value })}
                  className="max-w-xs"
                />
              </div>

              {/* Period Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Período</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {periodOptions.map((period) => (
                    <Button
                      key={period.value}
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilters({ period: period.value })}
                      className={`${
                        filters.period === period.value 
                          ? "bg-primary/10 border-primary/20 text-primary" 
                          : ""
                      }`}
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground">Filtros ativos:</span>
                {filters.status.map((status) => {
                  const statusOption = statusOptions.find(s => s.value === status);
                  return (
                    <Badge key={status} variant="secondary" className="text-xs">
                      {statusOption?.label}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer hover:text-foreground" 
                        onClick={() => toggleStatus(status)}
                      />
                    </Badge>
                  );
                })}
                {filters.owner && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.owner}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-foreground" 
                      onClick={() => updateFilters({ owner: "" })}
                    />
                  </Badge>
                )}
                {filters.period !== "current" && (
                  <Badge variant="secondary" className="text-xs">
                    {periodOptions.find(p => p.value === filters.period)?.label}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-foreground" 
                      onClick={() => updateFilters({ period: "current" })}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
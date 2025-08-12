import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Calendar, 
  User, 
  TrendingUp, 
  MoreHorizontal,
  Edit3,
  MessageCircle,
  Clock,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CommentModal } from "./CommentModal";
import { EditOKRModal } from "./EditOKRModal";

interface KeyResult {
  id: string;
  title: string;
  progress: number;
  target: number;
  current: number;
  unit: string;
}

interface OKRCardProps {
  id: string;
  title: string;
  description: string;
  owner: string;
  deadline: string;
  status: "on-track" | "at-risk" | "behind" | "completed";
  progress: number;
  keyResults: KeyResult[];
  lastUpdate: string;
  commentsCount: number;
  onOKRUpdated?: (updatedOKR: OKRCardProps) => void;
  onOKRDeleted?: (id: string) => void;
}

const statusConfig = {
  "on-track": { 
    color: "bg-[hsl(var(--on-track))]", 
    text: "No Prazo", 
    variant: "secondary" as const,
    bgColor: "bg-[hsl(var(--on-track)/0.1)]",
    textColor: "text-[hsl(var(--on-track))]"
  },
  "at-risk": { 
    color: "bg-[hsl(var(--warning))]", 
    text: "Em Risco", 
    variant: "secondary" as const,
    bgColor: "bg-[hsl(var(--warning)/0.1)]",
    textColor: "text-[hsl(var(--warning))]"
  },
  "behind": { 
    color: "bg-[hsl(var(--destructive))]", 
    text: "Atrasado", 
    variant: "secondary" as const,
    bgColor: "bg-[hsl(var(--destructive)/0.1)]",
    textColor: "text-[hsl(var(--destructive))]"
  },
  "completed": { 
    color: "bg-[hsl(var(--success))]", 
    text: "Concluído", 
    variant: "secondary" as const,
    bgColor: "bg-[hsl(var(--success)/0.1)]",
    textColor: "text-[hsl(var(--success))]"
  },
};

export function OKRCard({
  id,
  title,
  description,
  owner,
  deadline,
  status,
  progress,
  keyResults,
  lastUpdate,
  commentsCount,
  onOKRUpdated,
  onOKRDeleted
}: OKRCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const statusInfo = statusConfig[status];

  return (
    <Card className="card-okr group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-2">
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Editar OKR
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCommentModalOpen(true)}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Adicionar Comentário
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir OKR
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Badge variant={statusInfo.variant} className={`text-xs ${statusInfo.bgColor} ${statusInfo.textColor} border-0`}>
            <div className={`w-2 h-2 rounded-full ${statusInfo.color} mr-2`}></div>
            {statusInfo.text}
          </Badge>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            {owner}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {deadline}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm font-semibold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Key Results Preview */}
        <div className="space-y-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-sm font-medium hover:text-primary transition-colors"
          >
            <span>Resultados-Chave ({keyResults.length})</span>
            <TrendingUp className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded && (
            <div className="space-y-3 animate-fade-in-up">
              {keyResults.map((kr) => (
                <div key={kr.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium line-clamp-1">{kr.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {kr.current}/{kr.target} {kr.unit}
                    </span>
                  </div>
                  <Progress value={kr.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            Atualizado {lastUpdate}
          </div>
          
          {commentsCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="w-3 h-3" />
              {commentsCount} comentários
            </div>
          )}
        </div>
      </CardContent>

      {/* Modals */}
      <CommentModal 
        open={commentModalOpen}
        onOpenChange={setCommentModalOpen}
        okrTitle={title}
        okrId={id}
      />
      
      <EditOKRModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        okr={{
          id,
          title,
          description,
          owner,
          deadline,
          status,
          progress,
          keyResults,
          lastUpdate,
          commentsCount
        }}
        onOKRUpdated={onOKRUpdated}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o OKR "{title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onOKRDeleted?.(id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
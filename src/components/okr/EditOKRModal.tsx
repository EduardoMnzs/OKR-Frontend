import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Target, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// REMOVA AS INTERFACES LOCAIS E IMPORTE AS INTERFACES CENTRALIZADAS
import type { OKR, KeyResult } from "@/types/okr.d.ts";
import { updateOKR, updateKeyResult as apiUpdateKeyResult, createKeyResult, deleteKeyResult } from "@/services/okrService";
import type { OKRPayload, KeyResultPayload } from "@/services/okrService";

// Interface do formulário para os campos principais
interface EditOKRFormData {
  title: string;
  description: string;
  responsible: string;
  due_date: string;
}

export interface EditOKRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  okr: OKR | null;
  onOKRUpdated: (updatedOKR: OKR) => void;
}

export function EditOKRModal({ open, onOpenChange, okr, onOKRUpdated }: EditOKRModalProps) {
  const { toast } = useToast();
  const [keyResults, setKeyResults] = useState<KeyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados locais para os campos do formulário
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (okr) {
      setTitle(okr.title);
      setDescription(okr.description || "");
      setResponsible(okr.responsible);

      // CORREÇÃO: Formata a data para YYYY-MM-DD para o input type="date"
      const formattedDate = okr.due_date ? new Date(okr.due_date).toISOString().split('T')[0] : "";
      setDueDate(formattedDate);
      
      setKeyResults(okr.keyResults || []);
    }
  }, [okr]);

  const addKeyResult = () => {
    const newKeyResult: KeyResult = {
      id: `kr-${Date.now()}`,
      title: "",
      target: 100,
      current_value: 0,
      unit: "%",
      okr_id: okr!.id,
    };
    setKeyResults([...keyResults, newKeyResult]);
  };

  const updateKeyResult = (id: string, field: keyof KeyResult, value: string | number) => {
    setKeyResults(prev => prev.map(kr => 
      kr.id === id ? { ...kr, [field]: value } : kr
    ));
  };

  const removeKeyResult = async (id: string) => {
    // Se o KR já existe no backend, exclua-o
    if (!id.startsWith('kr-') && !id.startsWith('temp-')) {
      try {
        await deleteKeyResult(id);
        toast({
            title: "Resultado-Chave removido",
            description: "O KR foi removido com sucesso.",
        });
      } catch (err: any) {
        toast({
          title: "Erro ao remover KR",
          description: err.message,
          variant: "destructive"
        });
        return;
      }
    }
    setKeyResults(prev => prev.filter(kr => kr.id !== id));
  };
  
  const calculateProgress = (currentValue: number, target: number) => {
    return target > 0 ? Math.min(Math.round((currentValue / target) * 100), 100) : 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !responsible.trim() || !dueDate.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (keyResults.length === 0) {
      toast({
        title: "Erro", 
        description: "Adicione pelo menos um resultado-chave.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const okrPayload: OKRPayload = {
        title: title.trim(),
        description: description.trim(),
        responsible: responsible.trim(),
        due_date: dueDate,
      };
      
      const updatedOKRData = await updateOKR(okr!.id, okrPayload);
      
      const updatedKeyResults = await Promise.all(
        keyResults.map(async kr => {
          const krPayload: KeyResultPayload = {
            title: kr.title,
            target: kr.target,
            unit: kr.unit,
            current_value: kr.current_value,
          };
          if (kr.id.startsWith('kr-') || kr.id.startsWith('temp-')) {
            return await createKeyResult(updatedOKRData.id, krPayload);
          } else {
            return await apiUpdateKeyResult(kr.id, krPayload);
          }
        })
      );
      
      const finalUpdatedOKR: OKR = {
        ...okr!,
        ...updatedOKRData,
        keyResults: updatedKeyResults,
        comments: okr!.comments,
      };
      
      onOKRUpdated(finalUpdatedOKR);
      
      toast({
        title: "OKR atualizada com sucesso!",
        description: `"${finalUpdatedOKR.title}" foi atualizada.`,
      });

      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Erro ao atualizar OKR",
        description: err.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!okr) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            Editar OKR
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Objetivo *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Aumentar satisfação do cliente"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável *</Label>
              <Input
                id="responsible"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Nome do responsável"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o objetivo e como ele será alcançado..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Prazo *</Label>
            <Input
              id="due_date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Resultados-Chave
                </span>
                <Button onClick={addKeyResult} size="sm" variant="outline" type="button">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {keyResults.map((kr, index) => (
                <Card key={kr.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium">Resultado-Chave {index + 1}</h4>
                      <Button
                        onClick={() => removeKeyResult(kr.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <Label>Título</Label>
                        <Input
                          value={kr.title}
                          onChange={(e) => updateKeyResult(kr.id, "title", e.target.value)}
                          placeholder="Ex: Reduzir tempo de resposta"
                        />
                      </div>
                      <div>
                        <Label>Valor Atual</Label>
                        <Input
                          type="number"
                          value={kr.current_value}
                          onChange={(e) => updateKeyResult(kr.id, "current_value", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Meta</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={kr.target}
                            onChange={(e) => updateKeyResult(kr.id, "target", parseFloat(e.target.value) || 0)}
                          />
                          <Input
                            value={kr.unit}
                            onChange={(e) => updateKeyResult(kr.id, "unit", e.target.value)}
                            placeholder="unidade"
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{calculateProgress(kr.current_value, kr.target)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(kr.current_value, kr.target)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {keyResults.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum resultado-chave adicionado ainda.</p>
                  <p className="text-sm">Clique em "Adicionar" para criar seu primeiro resultado-chave.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} type="button">
              Cancelar
            </Button>
            <Button type="submit" className="btn-hero" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </div>
              ) : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
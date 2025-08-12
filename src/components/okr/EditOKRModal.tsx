import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Target, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KeyResult {
  id: string;
  title: string;
  progress: number;
  target: number;
  current: number;
  unit: string;
}

interface OKRData {
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
}

interface EditOKRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  okr: OKRData | null;
  onOKRUpdated: (updatedOKR: OKRData) => void;
}

export function EditOKRModal({ open, onOpenChange, okr, onOKRUpdated }: EditOKRModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [deadline, setDeadline] = useState("");
  const [keyResults, setKeyResults] = useState<KeyResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (okr) {
      setTitle(okr.title);
      setDescription(okr.description);
      setOwner(okr.owner);
      setDeadline(okr.deadline);
      setKeyResults([...okr.keyResults]);
    }
  }, [okr]);

  const addKeyResult = () => {
    const newKeyResult: KeyResult = {
      id: `kr-${Date.now()}`,
      title: "",
      progress: 0,
      target: 100,
      current: 0,
      unit: "%"
    };
    setKeyResults([...keyResults, newKeyResult]);
  };

  const updateKeyResult = (id: string, field: keyof KeyResult, value: string | number) => {
    setKeyResults(prev => prev.map(kr => 
      kr.id === id ? { ...kr, [field]: value } : kr
    ));
  };

  const removeKeyResult = (id: string) => {
    setKeyResults(prev => prev.filter(kr => kr.id !== id));
  };

  const calculateProgress = (current: number, target: number) => {
    return target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !owner.trim() || !deadline.trim()) {
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

    const updatedKeyResults = keyResults.map(kr => ({
      ...kr,
      progress: calculateProgress(kr.current, kr.target)
    }));

    const overallProgress = updatedKeyResults.length > 0 
      ? Math.round(updatedKeyResults.reduce((sum, kr) => sum + kr.progress, 0) / updatedKeyResults.length)
      : 0;

    const updatedOKR: OKRData = {
      ...okr!,
      title: title.trim(),
      description: description.trim(),
      owner: owner.trim(),
      deadline: deadline.trim(),
      keyResults: updatedKeyResults,
      progress: overallProgress,
      lastUpdate: "agora"
    };

    onOKRUpdated(updatedOKR);
    onOpenChange(false);
    
    toast({
      title: "OKR atualizado",
      description: "O OKR foi atualizado com sucesso.",
    });
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

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Objetivo *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Aumentar satisfação do cliente"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="owner">Responsável *</Label>
              <Input
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Nome do responsável"
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Prazo *</Label>
            <Input
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Ex: 31 Dez, 2024"
            />
          </div>

          {/* Key Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Resultados-Chave
                </span>
                <Button onClick={addKeyResult} size="sm" variant="outline">
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
                          value={kr.current}
                          onChange={(e) => updateKeyResult(kr.id, "current", parseFloat(e.target.value) || 0)}
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
                        <span>{calculateProgress(kr.current, kr.target)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(kr.current, kr.target)}%` }}
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="btn-hero">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
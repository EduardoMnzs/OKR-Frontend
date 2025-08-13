import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// REMOVA AS INTERFACES LOCAIS E IMPORTE AS INTERFACES CENTRALIZADAS
import { OKR, KeyResult } from "@/types/okr";
import { createOKR, createKeyResult, OKRPayload, KeyResultPayload } from "@/services/okrService";

// Adapte as interfaces para usar as interfaces centrais
export interface CreateOKRModalProps {
  children: React.ReactNode;
  onOKRCreated?: (okr: OKR) => void;
}

// O tipo do formulário do react-hook-form
interface OKRFormData {
  title: string;
  description: string;
  owner: string; // no backend é 'responsible'
  deadline: string; // no backend é 'due_date'
}

export function CreateOKRModal({ children, onOKRCreated }: CreateOKRModalProps) {
  const [open, setOpen] = useState(false);
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: `temp-${Date.now()}`, title: "", target: 0, unit: "", current_value: 0, okr_id: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OKRFormData>({
    defaultValues: {
      title: "",
      description: "",
      owner: "",
      deadline: ""
    }
  });

  const addKeyResult = () => {
    setKeyResults([...keyResults, { id: `temp-${Date.now()}`, title: "", target: 0, unit: "", current_value: 0, okr_id: "" }]);
  };

  const removeKeyResult = (index: number) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter((_, i) => i !== index));
    }
  };

  const updateKeyResult = (index: number, field: keyof KeyResult, value: string | number) => {
    const updated = keyResults.map((kr, i) =>
      i === index ? { ...kr, [field]: value } : kr
    );
    setKeyResults(updated);
  };

  const onSubmit = async (data: OKRFormData) => {
    setIsLoading(true);

    try {
      // 1. Cria a OKR no backend
      const okrPayload: OKRPayload = {
        title: data.title,
        description: data.description,
        responsible: data.owner,
        due_date: data.deadline,
      };

      const createdOKR = await createOKR(okrPayload);

      // 2. Cria os Key Results, associando-os à OKR recém-criada
      const newKeyResults = [];
      for (const kr of keyResults) {
        if (kr.title && kr.target && kr.unit) {
          const keyResultPayload: KeyResultPayload = {
            title: kr.title,
            target: kr.target,
            unit: kr.unit,
            current_value: 0 
          };
          const newKr = await createKeyResult(createdOKR.id, keyResultPayload);
          newKeyResults.push(newKr);
        }
      }

      const finalCreatedOKR: OKR = {
        ...createdOKR,
        keyResults: newKeyResults,
        comments: []
      };

      // 3. Sucesso: notifica e reseta o formulário
      toast({
        title: "OKR criada com sucesso!",
        description: `"${finalCreatedOKR.title}" foi adicionada aos seus objetivos.`,
      });

      onOKRCreated?.(finalCreatedOKR);

      reset();
      setKeyResults([{ id: `temp-${Date.now()}`, title: "", target: 0, unit: "", current_value: 0, okr_id: "" }]);
      setOpen(false);

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Erro ao criar OKR",
        description: err.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Criar Nova OKR
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Objetivo *</Label>
              <Input
                id="title"
                placeholder="Ex: Aumentar Satisfação do Cliente"
                {...register("title", { required: "Título é obrigatório" })}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o objetivo e como será alcançado..."
                rows={3}
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">Responsável *</Label>
                <Input
                  id="owner"
                  placeholder="Nome do responsável"
                  {...register("owner", { required: "Responsável é obrigatório" })}
                  className={errors.owner ? "border-destructive" : ""}
                />
                {errors.owner && (
                  <p className="text-sm text-destructive">{errors.owner.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo *</Label>
                <Input
                  id="deadline"
                  type="date"
                  {...register("deadline", { required: "Prazo é obrigatório" })}
                  className={errors.deadline ? "border-destructive" : ""}
                />
                {errors.deadline && (
                  <p className="text-sm text-destructive">{errors.deadline.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Key Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resultados-Chave</CardTitle>
              <p className="text-sm text-muted-foreground">
                Defina métricas específicas e mensuráveis para este objetivo
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {keyResults.map((kr, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Resultado-Chave {index + 1}
                    </Label>
                    {keyResults.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyResult(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Ex: Reduzir tempo de resposta dos tickets"
                      value={kr.title}
                      onChange={(e) => updateKeyResult(index, "title", e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        placeholder="Meta"
                        value={kr.target || ""}
                        onChange={(e) => updateKeyResult(index, "target", Number(e.target.value))}
                      />
                      <Input
                        placeholder="Unidade (ex: horas, %, clientes)"
                        value={kr.unit}
                        onChange={(e) => updateKeyResult(index, "unit", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addKeyResult}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Resultado-Chave
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="btn-hero" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando...
                </div>
              ) : "Criar OKR"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
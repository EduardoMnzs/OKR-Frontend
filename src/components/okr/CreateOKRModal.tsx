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

interface KeyResult {
  title: string;
  target: number;
  unit: string;
}

interface OKRFormData {
  title: string;
  description: string;
  owner: string;
  deadline: string;
  keyResults: KeyResult[];
}

interface CreateOKRModalProps {
  children: React.ReactNode;
  onOKRCreated?: (okr: any) => void;
}

export function CreateOKRModal({ children, onOKRCreated }: CreateOKRModalProps) {
  const [open, setOpen] = useState(false);
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { title: "", target: 0, unit: "" }
  ]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm<OKRFormData>({
    defaultValues: {
      title: "",
      description: "",
      owner: "",
      deadline: "",
      keyResults: []
    }
  });

  const addKeyResult = () => {
    setKeyResults([...keyResults, { title: "", target: 0, unit: "" }]);
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

  const onSubmit = (data: OKRFormData) => {
    const newOKR = {
      id: Math.random().toString(),
      title: data.title,
      description: data.description,
      owner: data.owner,
      deadline: new Date(data.deadline).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: "on-track" as const,
      progress: 0,
      lastUpdate: "agora",
      commentsCount: 0,
      keyResults: keyResults.map((kr, index) => ({
        id: `kr${Math.random()}`,
        title: kr.title,
        progress: 0,
        target: kr.target,
        current: 0,
        unit: kr.unit
      }))
    };

    onOKRCreated?.(newOKR);
    
    toast({
      title: "OKR criada com sucesso!",
      description: `"${data.title}" foi adicionada aos seus objetivos.`,
    });

    // Reset form and close modal
    reset();
    setKeyResults([{ title: "", target: 0, unit: "" }]);
    setOpen(false);
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-hero">
              Criar OKR
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
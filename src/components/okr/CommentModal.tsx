import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getCommentsByOkr, createComment, CommentPayload, Comment as CommentType } from "@/services/okrService";

interface CommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  okrTitle: string;
  okrId: string;
}

export function CommentModal({ open, onOpenChange, okrTitle, okrId }: CommentModalProps) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const { data: comments, isLoading, isError } = useQuery<CommentType[]>({
    queryKey: ['comments', okrId],
    queryFn: () => getCommentsByOkr(okrId),
    enabled: !!okrId && open,
  });
  
  const addCommentMutation = useMutation({
    mutationFn: (payload: CommentPayload) => createComment(okrId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', okrId] });
      setNewComment("");
      toast({
        title: "Comentário adicionado!",
        description: "Seu comentário foi salvo com sucesso.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Erro ao adicionar comentário",
        description: err.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ content: newComment });
  };
  
  if (isLoading) {
      return (
          <Dialog open={open} onOpenChange={onOpenChange}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-y-auto flex items-center justify-center">
                      <p>Carregando comentários...</p>
                  </div>
              </DialogContent>
          </Dialog>
      );
  }

  if (isError) {
      return (
          <Dialog open={open} onOpenChange={onOpenChange}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-y-auto flex items-center justify-center">
                      <p>Erro ao carregar comentários.</p>
                  </div>
              </DialogContent>
          </Dialog>
      );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Comentários - {okrTitle}
          </DialogTitle>
          <DialogDescription>
            Visualize e adicione comentários sobre o progresso desta OKR.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {comments?.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              </div>
            ) : (
              comments?.map((comment) => (
                <Card key={comment.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">
                            {comment.user?.profile?.first_name} {comment.user?.profile?.last_name}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(comment.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-sm text-card-foreground">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="border-t border-border/50 pt-4 px-1">
            <div className="space-y-3">
              <Textarea
                placeholder="Adicione um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Pressione Ctrl+Enter para enviar
                </span>
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || addCommentMutation.isPending}
                  size="sm"
                  className="btn-hero"
                >
                  {addCommentMutation.isPending ? 'Comentando...' : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Comentar
                      </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
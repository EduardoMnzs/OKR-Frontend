import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface CommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  okrTitle: string;
  okrId: string;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: "1",
    author: "Sarah Chen",
    content: "Ótimo progresso no último trimestre! Vamos manter o foco nas pesquisas de satisfação.",
    timestamp: "há 2 horas",
  },
  {
    id: "2", 
    author: "Marcus Johnson",
    content: "Precisamos acelerar a implementação do sistema de feedback. Posso ajudar com os recursos técnicos.",
    timestamp: "há 1 dia",
  },
];

export function CommentModal({ open, onOpenChange, okrTitle, okrId }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Alex (Você)",
      content: newComment.trim(),
      timestamp: "agora",
    };

    setComments([comment, ...comments]);
    setNewComment("");
    
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Comentários - {okrTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {comments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {comment.timestamp}
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

          {/* Add Comment */}
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
                  disabled={!newComment.trim()}
                  size="sm"
                  className="btn-hero"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Comentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
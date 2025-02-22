import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IComment } from "@/types"
import Image from "next/image"
import { useState } from "react"
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface ICommentModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  comments: IComment[];
}

export default function CommentModal({ postId, isOpen, onClose, comments: initialComments }: ICommentModalProps) {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(initialComments)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: IComment = {
      id: Date.now().toString(),
      postId,
      content: newComment,
      userName: "현재사용자", // 실제로는 로그인된 사용자 정보 사용
      userProfile: "https://i.pravatar.cc/150?img=11",
      createdAt: new Date().toISOString()
    }

    setComments(prev => [comment, ...prev])
    setNewComment("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>댓글</DialogTitle>
        </DialogHeader>
        
        {/* 댓글 작성 폼 */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newComment.trim()}>작성</Button>
        </form>

        {/* 댓글 목록 */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <Image
                src={comment.userProfile}
                alt={comment.userName}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.userName}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 
import { IPost, ICommunityFeedCardProps } from "@/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import CommentModal from "./CommentModal"
import { mockComments } from "@/utils/mockData"

export default function CommunityFeedCard({ post: initialPost }: ICommunityFeedCardProps) {
  const [post, setPost] = useState(initialPost)
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setPost(prev => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked
    }))
  }

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsCommentOpen(true)
  }

  return (
    <>
      <Link href={`/post/${post.postId}`}>
        <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <Image
                src={post.imageURL}
                alt="Generated Image"
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
          <CardFooter className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src={post.userProfile}
                alt={post.userName}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm font-medium">{post.userName}</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLikeClick}
                className="flex items-center gap-1 transition-all"
              >
                <Heart 
                  size={16} 
                  className={cn(
                    "transition-colors",
                    post.isLiked && "fill-blue-500 text-blue-500"
                  )} 
                />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button 
                onClick={handleCommentClick}
                className="flex items-center gap-1"
              >
                <MessageCircle size={16} />
                <span className="text-sm">{post.comments}</span>
              </button>
            </div>
          </CardFooter>
        </Card>
      </Link>

      <CommentModal
        postId={post.postId}
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        comments={mockComments[post.postId] || []}
      />
    </>
  )
} 
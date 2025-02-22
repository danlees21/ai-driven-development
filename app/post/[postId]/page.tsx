'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { mockPostDetails, mockComments } from '@/utils/mockData'
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function PostDetail() {
  const params = useParams()
  const router = useRouter()
  const postId = params.postId as string
  const [post, setPost] = useState(mockPostDetails[postId])
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [comments, setComments] = useState(mockComments[postId] || [])
  const [newComment, setNewComment] = useState("")
  const [showAllComments, setShowAllComments] = useState(false)

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>
  }

  // 표시할 댓글 목록 계산
  const displayComments = showAllComments ? comments : comments.slice(0, 3)
  const hasMoreComments = comments.length > 3

  const handleSubmitComment = (e: React.FormEvent) => {
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
    setPost(prev => ({
      ...prev,
      comments: prev.comments + 1
    }))
    setNewComment("")
  }

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked
    }))
  }

  const handleScrap = () => {
    setPost(prev => ({
      ...prev,
      scraps: prev.isScrapped ? prev.scraps - 1 : prev.scraps + 1,
      isScrapped: !prev.isScrapped
    }))
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 돌아가기 버튼 */}
      <Button
        variant="ghost"
        className="mb-4 -ml-2 text-gray-600"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        돌아가기
      </Button>

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 이미지 섹션 */}
        <div className="sticky top-8 h-fit">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden">
            <Image
              src={post.imageURL}
              alt="Generated Image"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 오른쪽: 상세 정보 섹션 */}
        <div className="space-y-6">
          {/* 작성자 정보 및 상호작용 섹션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src={post.userProfile}
                alt={post.userName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h2 className="font-medium">{post.userName}</h2>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* 상호작용 버튼 */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex gap-2"
              onClick={handleLike}
            >
              <Heart 
                className={cn(
                  "h-4 w-4",
                  post.isLiked && "fill-blue-500 text-blue-500"
                )} 
              />
              <span>{post.likes}</span>
            </Button>
            <Button
              variant="outline"
              className="flex gap-2"
              onClick={() => setIsCommentOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </Button>
            <Button
              variant="outline"
              className="flex gap-2"
              onClick={handleScrap}
            >
              <Bookmark 
                className={cn(
                  "h-4 w-4",
                  post.isScrapped && "fill-blue-500 text-blue-500"
                )} 
              />
              <span>{post.scraps}</span>
            </Button>
          </div>

          {/* 프롬프트 정보 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium mb-4">프롬프트 정보</h3>
            <p className="text-gray-700 mb-4">{post.prompt}</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">스타일</p>
                <p className="font-medium">{post.styleOptions.style}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">분위기</p>
                <p className="font-medium">{post.styleOptions.mood}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">조명</p>
                <p className="font-medium">{post.styleOptions.lighting}</p>
              </div>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="space-y-4">
            <h3 className="font-medium">댓글 {post.comments}개</h3>
            
            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성하세요..."
                className="flex-1"
              />
              <Button type="submit" disabled={!newComment.trim()}>
                작성
              </Button>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {displayComments.map(comment => (
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

              {/* 더보기 버튼 */}
              {hasMoreComments && (
                <Button
                  variant="ghost"
                  className="w-full text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  {showAllComments ? '접기' : `${comments.length - 3}개의 댓글 더보기`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
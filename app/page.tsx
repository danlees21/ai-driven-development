'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PromptInput from '@/components/PromptInput'
import CommunityFeedCard from '@/components/CommunityFeedCard'
import { mockPosts } from '@/utils/mockData'

export default function Home() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    setIsLoading(true)
    
    // URL 파라미터로 프롬프트 전달
    const encodedPrompt = encodeURIComponent(prompt)
    router.push(`/generate?prompt=${encodedPrompt}`)
  }

  return (
    <main className="min-h-screen p-4">
      {/* 프롬프트 입력 섹션 */}
      <section className="mb-12">
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </section>

      {/* 커뮤니티 피드 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">커뮤니티 피드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <CommunityFeedCard key={post.postId} post={post} />
          ))}
        </div>
      </section>
    </main>
  )
}

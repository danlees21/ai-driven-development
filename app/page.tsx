'use client'

import { useState } from 'react'
import PromptInput from '@/components/PromptInput'
import CommunityFeedCard from '@/components/CommunityFeedCard'
import { mockPosts } from '@/utils/mockData'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    setIsLoading(true)
    // 실제 API 연동 시 여기에 구현
    setTimeout(() => {
      setIsLoading(false)
      // 이미지 생성 페이지로 이동
    }, 1000)
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

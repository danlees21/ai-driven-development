'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PromptInputWithStyle from '@/components/generate/PromptInputWithStyle'
import StyleOptionSelector from '@/components/generate/StyleOptionSelector'
import GeneratedImagePreview from '@/components/generate/GeneratedImagePreview'
import { IStyleOption } from '@/types'

// 목업 데이터
const MOCK_STYLE_OPTIONS: IStyleOption[] = [
  { id: '1', category: 'color', name: '밝은 톤', value: 'bright', thumbnail: '/styles/bright.jpg' },
  { id: '2', category: 'color', name: '어두운 톤', value: 'dark', thumbnail: '/styles/dark.jpg' },
  { id: '3', category: 'texture', name: '수채화', value: 'watercolor', thumbnail: '/styles/watercolor.jpg' },
  { id: '4', category: 'texture', name: '유화', value: 'oil', thumbnail: '/styles/oil.jpg' },
  { id: '5', category: 'mood', name: '따뜻한', value: 'warm', thumbnail: '/styles/warm.jpg' },
  { id: '6', category: 'mood', name: '차가운', value: 'cool', thumbnail: '/styles/cool.jpg' },
]

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['bright', 'watercolor'])
  const [styleStrength, setStyleStrength] = useState(50)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | undefined>()

  // URL 파라미터에서 프롬프트를 가져와 설정
  useEffect(() => {
    const promptParam = searchParams.get('prompt')
    if (promptParam) {
      setPrompt(decodeURIComponent(promptParam))
      // 프롬프트가 있으면 자동으로 이미지 생성 시작
      handleGenerate()
    }
  }, [searchParams])

  const handleGenerate = async () => {
    if (!prompt.trim() || selectedStyles.length === 0) return

    setIsLoading(true)
    // 목업 데이터로 3초 후 이미지 생성 시뮬레이션
    setTimeout(() => {
      setGeneratedImage('https://picsum.photos/500/500')
      setIsLoading(false)
    }, 3000)
  }

  const handleSave = async () => {
    // 목업 저장 처리
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">이미지 생성</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <PromptInputWithStyle
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            styleOptions={MOCK_STYLE_OPTIONS}
            selectedStyles={selectedStyles}
          />
          
          <StyleOptionSelector
            options={MOCK_STYLE_OPTIONS}
            selectedOptions={selectedStyles}
            onOptionChange={setSelectedStyles}
            styleStrength={styleStrength}
            onStrengthChange={setStyleStrength}
          />
        </div>

        <div>
          <GeneratedImagePreview
            imageUrl={generatedImage}
            isLoading={isLoading}
            onRegenerate={handleGenerate}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  )
} 
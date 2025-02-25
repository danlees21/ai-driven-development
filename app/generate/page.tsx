'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import PromptInputWithStyle from '@/components/generate/PromptInputWithStyle'
import StyleOptionSelector from '@/components/generate/StyleOptionSelector'
import GeneratedImagePreview from '@/components/generate/GeneratedImagePreview'
import { IStyleOption } from '@/types'
import { toast } from 'sonner'

// 스타일 옵션 정의
const STYLE_OPTIONS: IStyleOption[] = [
  { id: 'bright', category: 'mood', name: '밝은', value: 'bright and cheerful, vibrant colors' },
  { id: 'dark', category: 'mood', name: '어두운', value: 'dark and moody, low key lighting' },
  { id: 'pastel', category: 'color', name: '파스텔', value: 'pastel colors, soft and gentle' },
  { id: 'watercolor', category: 'texture', name: '수채화', value: 'watercolor style, flowing and soft' },
  { id: 'oil', category: 'texture', name: '유화', value: 'oil painting, textured and rich' },
  { id: 'digital', category: 'texture', name: '디지털아트', value: 'digital art, clean and sharp' },
  { id: 'pencil', category: 'texture', name: '연필화', value: 'pencil sketch, detailed and precise' },
  { id: 'anime', category: 'style', name: '애니메이션', value: 'anime style, colorful and expressive' },
  { id: 'realistic', category: 'style', name: '사실적', value: 'photorealistic, highly detailed' },
  { id: 'abstract', category: 'style', name: '추상적', value: 'abstract art, non-representational' },
  
  // 여성 자세 관련 스타일 옵션 추가
  { id: 'standing', category: 'pose', name: '서있는 자세', value: 'woman standing pose, full body, natural posture' },
  { id: 'sitting', category: 'pose', name: '앉아있는 자세', value: 'woman sitting pose, relaxed position, elegant' },
  { id: 'walking', category: 'pose', name: '걷는 자세', value: 'woman walking pose, dynamic movement, confident stride' },
  { id: 'dancing', category: 'pose', name: '춤추는 자세', value: 'woman dancing pose, graceful movement, expressive' },
  { id: 'yoga', category: 'pose', name: '요가 자세', value: 'woman in yoga pose, flexible, balanced position' },
  { id: 'portrait', category: 'pose', name: '초상화', value: 'woman portrait pose, shoulders up, expressive face' },
  { id: 'casual', category: 'pose', name: '캐주얼 자세', value: 'woman in casual pose, relaxed, natural, everyday' },
  { id: 'elegant', category: 'pose', name: '우아한 자세', value: 'woman in elegant pose, sophisticated, graceful posture' },
  { id: 'action', category: 'pose', name: '액션 자세', value: 'woman in action pose, dynamic, energetic movement' },
  { id: 'fashion', category: 'pose', name: '패션 자세', value: 'woman in fashion pose, stylish, model-like stance' },
]

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState(searchParams.get('prompt') || '')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [styleStrength, setStyleStrength] = useState(0.5)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string>('')
  const [predictionId, setPredictionId] = useState<string>('')
  const [pollingCount, setPollingCount] = useState(0)
  const successToastShown = useRef(false)

  // 예측 상태를 확인하는 함수
  useEffect(() => {
    // 예측 ID가 없으면 실행하지 않음
    if (!predictionId || !isLoading) return

    // 새로운 생성 요청이 시작되면 토스트 표시 상태 초기화
    successToastShown.current = false
    
    const MAX_POLLING = 60; // 최대 60회 폴링 (약 1분)
    
    const checkPrediction = async () => {
      try {
        if (pollingCount >= MAX_POLLING) {
          setIsLoading(false);
          setPredictionId('');
          setPollingCount(0);
          toast.error('이미지 생성 시간이 초과되었습니다. 다시 시도해주세요.');
          return;
        }

        const response = await fetch(`/api/generate?id=${predictionId}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '이미지 생성 상태 확인에 실패했습니다')
        }
        
        const prediction = await response.json()
        
        if (prediction.status === 'succeeded') {
          // 이미지 생성 성공
          if (prediction.output && prediction.output.length > 0) {
            setGeneratedImage(prediction.output[0])
            setIsLoading(false)
            setPredictionId('')
            setPollingCount(0)
            
            // 토스트 메시지가 아직 표시되지 않았을 때만 표시
            if (!successToastShown.current) {
              toast.success('이미지가 생성되었습니다')
              successToastShown.current = true
            }
          } else {
            throw new Error('생성된 이미지가 없습니다')
          }
        } else if (prediction.status === 'failed') {
          // 이미지 생성 실패
          setIsLoading(false)
          setPredictionId('')
          setPollingCount(0)
          toast.error(prediction.error || '이미지 생성에 실패했습니다')
        } else if (prediction.status === 'canceled') {
          // 이미지 생성 취소됨
          setIsLoading(false)
          setPredictionId('')
          setPollingCount(0)
          toast.error('이미지 생성이 취소되었습니다')
        } else {
          // 아직 처리 중인 경우 1초 후 다시 확인
          setPollingCount(prev => prev + 1)
          setTimeout(checkPrediction, 1000)
        }
      } catch (error) {
        console.error('예측 상태 확인 중 오류:', error)
        setIsLoading(false)
        setPredictionId('')
        setPollingCount(0)
        toast.error(error instanceof Error ? error.message : '이미지 생성 상태 확인에 실패했습니다')
      }
    }

    // 상태 확인 시작
    checkPrediction()
  }, [predictionId, isLoading])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('프롬프트를 입력해주세요')
      return
    }
    
    if (prompt.trim().length < 10) {
      toast.error('프롬프트는 최소 10자 이상이어야 합니다')
      return
    }

    try {
      setIsLoading(true)
      setGeneratedImage('')
      setPredictionId('')
      setPollingCount(0)
      successToastShown.current = false
      
      // 선택된 스타일 값 추출
      const styleValues = selectedStyles.map(styleId => {
        const style = STYLE_OPTIONS.find(option => option.id === styleId)
        return style ? style.value : styleId
      })
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          styleOptions: styleValues,
          styleStrength,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '이미지 생성에 실패했습니다')
      }

      const result = await response.json()
      
      if (!result.generationId) {
        throw new Error('생성 ID가 없습니다')
      }
      
      // 예측 ID 설정 (폴링 시작)
      setPredictionId(result.generationId)
      toast.info('이미지 생성 중입니다. 잠시만 기다려주세요...')
    } catch (error) {
      console.error('이미지 생성 중 오류:', error)
      setIsLoading(false)
      toast.error(error instanceof Error ? error.message : '이미지 생성에 실패했습니다')
    }
  }

  const handleSave = async () => {
    if (!generatedImage) {
      toast.error('저장할 이미지가 없습니다')
      return
    }

    try {
      // 갤러리 저장 API 호출
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: generatedImage,
          prompt: prompt,
          styleOptions: selectedStyles.map(styleId => {
            const style = STYLE_OPTIONS.find(option => option.id === styleId)
            return style ? style.value : styleId
          }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '이미지 저장에 실패했습니다')
      }

      toast.success('이미지가 갤러리에 저장되었습니다')
    } catch (error) {
      console.error('이미지 저장 중 오류:', error)
      toast.error(error instanceof Error ? error.message : '이미지 저장에 실패했습니다')
    }
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
            styleOptions={STYLE_OPTIONS}
            selectedStyles={selectedStyles}
          />
          
          <StyleOptionSelector
            options={STYLE_OPTIONS}
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
'use client'

import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { IGeneratedImagePreview } from "@/types"
import GeneratedImageActions from './GeneratedImageActions'

export default function GeneratedImagePreview({
  imageUrl,
  isLoading,
  onRegenerate,
  onSave,
}: IGeneratedImagePreview) {
  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-semibold">생성된 이미지</h2>

      <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin mb-2 text-primary" />
            <p className="text-sm text-gray-500">이미지 생성 중...</p>
            <p className="text-xs text-gray-400 mt-1">약 30초 정도 소요됩니다</p>
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="Generated image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <p>이미지를 생성해주세요</p>
            <p className="text-xs mt-1">프롬프트를 입력하고 생성 버튼을 클릭하세요</p>
          </div>
        )}
      </div>

      {imageUrl && !isLoading && (
        <div className="space-y-2">
          <Button 
            variant="outline" 
            onClick={onRegenerate}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            재생성
          </Button>
          <GeneratedImageActions 
            imageUrl={imageUrl}
            onSave={onSave}
          />
        </div>
      )}
    </div>
  )
} 
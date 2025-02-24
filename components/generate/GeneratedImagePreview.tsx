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
    <div className="space-y-4 w-[85%]">
      <h2 className="text-xl font-semibold">생성된 이미지</h2>

      <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="Generated image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            이미지를 생성해주세요
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
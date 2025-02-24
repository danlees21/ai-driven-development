'use client'

import { Button } from "@/components/ui/button"
import { Save, Share2, Download } from "lucide-react"
import { toast } from "sonner"

interface IGeneratedImageActions {
  imageUrl?: string
  onSave: () => Promise<void>
}

export default function GeneratedImageActions({ imageUrl, onSave }: IGeneratedImageActions) {
  // 이미지 다운로드 처리
  const handleDownload = async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-image-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("다운로드 완료", {
        description: "이미지가 성공적으로 다운로드되었습니다."
      })
    } catch (error) {
      toast.error("다운로드 실패", {
        description: "이미지 다운로드 중 오류가 발생했습니다."
      })
    }
  }

  // 갤러리 저장 처리
  const handleSave = async () => {
    try {
      await onSave()
      toast.success("저장 완료", {
        description: "이미지가 갤러리에 저장되었습니다."
      })
    } catch (error) {
      toast.error("저장 실패", {
        description: "갤러리 저장 중 오류가 발생했습니다."
      })
    }
  }

  // 공유하기 처리
  const handleShare = async () => {
    toast.info("준비 중", {
      description: "공유하기 기능은 현재 개발 중입니다."
    })
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={handleSave}
        disabled={!imageUrl}
      >
        <Save className="w-4 h-4 mr-2" />
        갤러리에 저장
      </Button>
      <Button 
        variant="outline" 
        onClick={handleShare}
        disabled={!imageUrl}
      >
        <Share2 className="w-4 h-4 mr-2" />
        공유
      </Button>
      <Button 
        variant="outline" 
        onClick={handleDownload}
        disabled={!imageUrl}
      >
        <Download className="w-4 h-4 mr-2" />
        다운로드
      </Button>
    </div>
  )
} 
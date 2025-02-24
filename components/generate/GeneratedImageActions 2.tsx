"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Download, Save, Share2 } from "lucide-react"

export function GeneratedImageActions() {
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "저장 완료",
      description: "이미지가 갤러리에 저장되었습니다.",
    })
  }

  const handleShare = () => {
    toast({
      title: "준비 중",
      description: "공유 기능은 현재 개발 중입니다.",
      variant: "destructive",
    })
  }

  const handleDownload = () => {
    // 실제로는 이미지 URL을 사용하여 다운로드 구현
    toast({
      title: "다운로드 완료",
      description: "이미지가 다운로드되었습니다.",
    })
  }

  return (
    <div className="flex gap-2 justify-center">
      <Button variant="outline" onClick={handleSave}>
        <Save className="w-4 h-4 mr-2" />
        저장하기
      </Button>
      <Button variant="outline" onClick={handleShare}>
        <Share2 className="w-4 h-4 mr-2" />
        공유하기
      </Button>
      <Button variant="outline" onClick={handleDownload}>
        <Download className="w-4 h-4 mr-2" />
        다운로드
      </Button>
    </div>
  )
} 
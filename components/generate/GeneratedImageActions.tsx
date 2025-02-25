'use client'

import { Button } from "@/components/ui/button"
import { Save, Share2, Download } from "lucide-react"
import { toast } from "sonner"
import { IGeneratedImageActions } from "@/types"

/**
 * 생성된 이미지에 대한 액션 버튼 컴포넌트
 * 
 * 갤러리 저장, 공유, 다운로드 기능을 제공합니다.
 * 
 * @param imageUrl 생성된 이미지 URL
 * @param onSave 갤러리 저장 핸들러 함수
 */
export default function GeneratedImageActions({ imageUrl, onSave }: IGeneratedImageActions) {
  /**
   * 이미지 다운로드 처리
   * 브라우저의 Blob API를 사용하여 이미지를 다운로드합니다.
   */
  const handleDownload = async () => {
    if (!imageUrl) return

    try {
      // 이미지 URL에서 Blob 객체 가져오기
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-image-${Date.now()}.jpg`
      
      // 링크 클릭하여 다운로드 시작
      document.body.appendChild(a)
      a.click()
      
      // 리소스 정리
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("다운로드 완료", {
        description: "이미지가 성공적으로 다운로드되었습니다."
      })
    } catch (error) {
      console.error("이미지 다운로드 중 오류:", error)
      toast.error("다운로드 실패", {
        description: "이미지 다운로드 중 오류가 발생했습니다."
      })
    }
  }

  /**
   * 갤러리 저장 처리
   * 부모 컴포넌트에서 전달받은 onSave 함수를 호출합니다.
   */
  const handleSave = async () => {
    if (!imageUrl) return
    
    try {
      await onSave()
      toast.success("저장 완료", {
        description: "이미지가 갤러리에 저장되었습니다."
      })
    } catch (error) {
      console.error("갤러리 저장 중 오류:", error)
      toast.error("저장 실패", {
        description: "갤러리 저장 중 오류가 발생했습니다."
      })
    }
  }

  /**
   * 공유하기 처리
   * 현재는 개발 중인 기능으로 안내 메시지만 표시합니다.
   */
  const handleShare = async () => {
    toast.info("준비 중인 기능", {
      description: "공유하기 기능은 현재 개발 중입니다. 곧 제공될 예정입니다."
    })
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <Button 
        variant="outline" 
        onClick={handleSave}
        disabled={!imageUrl}
        className="flex-1 min-w-[120px]"
      >
        <Save className="w-4 h-4 mr-2" />
        갤러리에 저장
      </Button>
      <Button 
        variant="outline" 
        onClick={handleShare}
        disabled={!imageUrl}
        className="flex-1 min-w-[120px]"
      >
        <Share2 className="w-4 h-4 mr-2" />
        공유
      </Button>
      <Button 
        variant="outline" 
        onClick={handleDownload}
        disabled={!imageUrl}
        className="flex-1 min-w-[120px]"
      >
        <Download className="w-4 h-4 mr-2" />
        다운로드
      </Button>
    </div>
  )
} 
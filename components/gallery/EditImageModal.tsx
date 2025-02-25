"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { IGalleryImage, IStyleOption } from "@/types/gallery"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Copy, Loader2, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface IEditImageModal {
  isOpen: boolean;
  onClose: () => void;
  image: IGalleryImage | null;
  onGenerate: (prompt: string, styleOptions: IStyleOption[]) => Promise<void>;
}

export function EditImageModal({
  isOpen,
  onClose,
  image,
  onGenerate,
}: IEditImageModal) {
  const [basePrompt, setBasePrompt] = useState("")  // 기존 프롬프트 수정용
  const [additionalPrompt, setAdditionalPrompt] = useState("")  // 추가 프롬프트
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStyles, setSelectedStyles] = useState<IStyleOption[]>([])
  const [combinedPrompt, setCombinedPrompt] = useState("")

  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (image && isOpen) {
      setBasePrompt(image.prompt)  // 기존 프롬프트로 초기화
      setAdditionalPrompt("")  // 추가 프롬프트 초기화
      setSelectedStyles(image.styleOptions)
      setCombinedPrompt(image.prompt)
    }
  }, [image, isOpen])

  // 프롬프트 결합 로직
  useEffect(() => {
    if (basePrompt.trim() && additionalPrompt.trim()) {
      setCombinedPrompt(`${basePrompt.trim()}, ${additionalPrompt.trim()}`)
    } else if (basePrompt.trim()) {
      setCombinedPrompt(basePrompt.trim())
    } else if (additionalPrompt.trim()) {
      setCombinedPrompt(additionalPrompt.trim())
    } else {
      setCombinedPrompt("")
    }
  }, [basePrompt, additionalPrompt])

  const handleCopyPrompt = () => {
    if (combinedPrompt) {
      navigator.clipboard.writeText(combinedPrompt)
      toast.success("프롬프트가 복사되었습니다.")
    }
  }

  const handleGenerate = async () => {
    if (!combinedPrompt.trim()) {
      toast.error("프롬프트를 입력해주세요.")
      return
    }

    try {
      setIsGenerating(true)
      await onGenerate(combinedPrompt, selectedStyles)
      onClose()
    } catch (error) {
      toast.error("이미지 생성 중 오류가 발생했습니다.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!image) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>이미지 수정</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* 기존 이미지 미리보기 */}
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image
              src={image.imageUrl}
              alt={image.prompt}
              fill
              sizes="(max-width: 600px) 100vw, 600px"
              className="object-cover"
            />
          </div>

          {/* 기존 프롬프트 수정 */}
          <div className="space-y-2">
            <Label>기존 프롬프트 수정</Label>
            <div className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <Input
                  value={basePrompt}
                  onChange={(e) => setBasePrompt(e.target.value)}
                  placeholder="기존 프롬프트를 수정하세요"
                />
                <p className="text-xs text-muted-foreground">
                  {basePrompt.length}/500자
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setBasePrompt(image.prompt)}
                title="원래 프롬프트로 되돌리기"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 추가 프롬프트 입력 */}
          <div className="space-y-2">
            <Label>추가 프롬프트</Label>
            <Input
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              placeholder="추가할 프롬프트를 입력하세요"
            />
            <p className="text-xs text-muted-foreground text-right">
              {additionalPrompt.length}/500자
            </p>
          </div>

          {/* 결합된 프롬프트 미리보기 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>최종 프롬프트</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={handleCopyPrompt}
              >
                <Copy className="h-4 w-4 mr-1" />
                복사
              </Button>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm break-all">{combinedPrompt}</p>
            </div>
          </div>

          {/* 스타일 옵션 선택 UI는 Generate 페이지와 동일하게 구현 */}
          {/* TODO: StyleOptionSelector 컴포넌트 추가 */}

          {/* 작업 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !combinedPrompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                "새 버전 생성"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { IPromptInput } from "@/types"
import { Loader2 } from "lucide-react"

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
}: IPromptInput) {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="생성하고 싶은 이미지를 자세히 설명해주세요..."
        className="min-h-[80px] resize-none"
      />
      <Button 
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            생성 중...
          </>
        ) : (
          '이미지 생성하기'
        )}
      </Button>
    </div>
  )
} 
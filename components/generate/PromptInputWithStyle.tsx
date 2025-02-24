'use client'

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { IPromptInputWithStyle } from "@/types"
import { toast } from "sonner"

export default function PromptInputWithStyle({
  value,
  onChange,
  onSubmit,
  isLoading,
  styleOptions,
  selectedStyles
}: IPromptInputWithStyle) {
  const isValid = value.length >= 10 && value.length <= 1000

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">프롬프트 입력</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>10자 이상 1000자 이하로 입력해주세요.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="생성하고 싶은 이미지를 자세히 설명해주세요..."
        className="min-h-[150px]"
      />

      <div className="flex justify-between items-center">
        <span className={`text-sm ${value.length < 10 || value.length > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
          {value.length}/1000
        </span>
        <Button 
          onClick={onSubmit}
          disabled={!isValid || isLoading}
        >
          {isLoading ? '생성 중...' : '이미지 생성'}
        </Button>
      </div>
    </div>
  )
} 
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IPromptInput } from "@/types"

export default function PromptInput({ value, onChange, onSubmit, isLoading }: IPromptInput) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-4">
      <Input
        placeholder="이미지를 생성할 프롬프트를 입력하세요..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
      <Button 
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? "생성 중..." : "이미지 생성하기"}
      </Button>
    </div>
  )
} 
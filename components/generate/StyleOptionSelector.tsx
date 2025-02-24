'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { IStyleOptionSelector } from "@/types"

export default function StyleOptionSelector({
  options,
  selectedOptions,
  onOptionChange,
  styleStrength,
  onStrengthChange
}: IStyleOptionSelector) {
  const categories = ['color', 'texture', 'mood']

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">스타일 옵션</h2>

      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <label className="text-sm font-medium capitalize">{category}</label>
          <Select
            value={selectedOptions.find(opt => 
              options.find(o => o.value === opt)?.category === category
            )}
            onValueChange={(value) => {
              const newOptions = selectedOptions.filter(opt => 
                options.find(o => o.value === opt)?.category !== category
              )
              if (value) newOptions.push(value)
              onOptionChange(newOptions)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={`${category} 선택`} />
            </SelectTrigger>
            <SelectContent>
              {options
                .filter(opt => opt.category === category)
                .map(opt => (
                  <SelectItem key={opt.id} value={opt.value}>
                    {opt.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      ))}

      <div className="space-y-2">
        <label className="text-sm font-medium">스타일 강도</label>
        <Slider
          value={[styleStrength]}
          onValueChange={(values) => onStrengthChange(values[0])}
          min={0}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>약하게</span>
          <span>강하게</span>
        </div>
      </div>
    </div>
  )
} 
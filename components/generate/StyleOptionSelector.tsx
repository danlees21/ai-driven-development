'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { IStyleOptionSelector } from "@/types"
import { Label } from '@/components/ui/label'

// 카테고리 이름 매핑
const CATEGORY_NAMES: Record<string, string> = {
  'color': '색상',
  'texture': '텍스처',
  'mood': '분위기',
  'style': '스타일',
  'pose': '자세'
}

export default function StyleOptionSelector({
  options,
  selectedOptions,
  onOptionChange,
  styleStrength,
  onStrengthChange
}: IStyleOptionSelector) {
  // 카테고리별로 옵션 그룹화
  const categories = [...new Set(options.map(option => option.category))]
  
  // 카테고리별 옵션 선택 핸들러
  const handleOptionSelect = (category: string, optionId: string) => {
    // 현재 카테고리의 이전 선택 항목 찾기
    const previousSelection = selectedOptions.find(id => {
      const option = options.find(opt => opt.id === id)
      return option && option.category === category
    })
    
    // 이전 선택 항목이 있으면 제거
    const filteredOptions = previousSelection 
      ? selectedOptions.filter(id => id !== previousSelection) 
      : [...selectedOptions]
    
    // 새 옵션이 '없음'이 아니면 추가
    if (optionId !== 'none') {
      filteredOptions.push(optionId)
    }
    
    onOptionChange(filteredOptions)
  }
  
  // 카테고리별 현재 선택된 옵션 ID 가져오기
  const getSelectedOptionForCategory = (category: string) => {
    const selected = selectedOptions.find(id => {
      const option = options.find(opt => opt.id === id)
      return option && option.category === category
    })
    
    return selected || 'none'
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">스타일 옵션</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category} className="space-y-2">
            <Label htmlFor={`style-${category}`}>
              {CATEGORY_NAMES[category] || category}
            </Label>
            <Select
              value={getSelectedOptionForCategory(category)}
              onValueChange={(value) => handleOptionSelect(category, value)}
            >
              <SelectTrigger id={`style-${category}`}>
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                {options
                  .filter(option => option.category === category)
                  .map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="style-strength">스타일 강도</Label>
          <span className="text-sm text-muted-foreground">
            {Math.round(styleStrength * 100)}%
          </span>
        </div>
        <Slider
          id="style-strength"
          min={0}
          max={1}
          step={0.01}
          value={[styleStrength]}
          onValueChange={([value]) => onStrengthChange(value)}
        />
      </div>
    </div>
  )
} 
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ICategoryManager, ICategory } from '@/types/gallery'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle } from 'lucide-react'

export function CategoryManager({
  categories,
  selectedCategory,
  onCategoryChange,
  onCategoryAdd,
  onCategoryEdit,
  onCategoryDelete,
}: ICategoryManager) {
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: ICategory = {
        id: `new-${Date.now()}`,
        name: newCategoryName,
        imageCount: 0
      }
      onCategoryAdd(newCategory)
      setNewCategoryName('')
      setIsAddingCategory(false)
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name} ({category.imageCount})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {isAddingCategory ? (
        <div className="flex gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="새 카테고리 이름"
            className="w-[200px]"
          />
          <Button onClick={handleAddCategory}>추가</Button>
          <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
            취소
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAddingCategory(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          새 카테고리
        </Button>
      )}
    </div>
  )
} 
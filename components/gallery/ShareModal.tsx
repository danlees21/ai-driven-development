"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { IShareModal, IPostData } from "@/types/gallery"
import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function ShareModal({
  isOpen,
  onClose,
  selectedImage,
  onShare,
}: IShareModal) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isComposing, setIsComposing] = useState(false)

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing || e.key !== 'Enter') {
      return
    }

    e.preventDefault()
    const newTag = tagInput.trim()
    if (newTag && !tags.includes(newTag)) {
      setTags(prev => [...prev, newTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage) return

    const postData: IPostData = {
      imageId: selectedImage.id,
      title: title.trim(),
      description: description.trim(),
      isPublic,
      tags,
    }

    onShare(postData)
    // 폼 초기화
    setTitle("")
    setDescription("")
    setIsPublic(true)
    setTags([])
    setTagInput("")
  }

  if (!selectedImage) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>커뮤니티 공유</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="설명을 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">태그</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="태그를 입력하고 Enter를 누르세요"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">공개 여부</Label>
          </div>
          <Button type="submit" className="w-full">
            공유하기
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
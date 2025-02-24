"use client"

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Share2, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IGalleryGrid, IGalleryImage } from '@/types/gallery'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

// dayjs 설정
dayjs.extend(relativeTime)
dayjs.locale('ko')

interface IGalleryGridProps {
  images: IGalleryImage[];
  onImageSelect: (image: IGalleryImage) => void;
  onShareClick: (image: IGalleryImage) => void;
  onEditClick: (image: IGalleryImage) => void;
  onDeleteClick: (image: IGalleryImage) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function GalleryGrid({
  images,
  onImageSelect,
  onShareClick,
  onEditClick,
  onDeleteClick,
  isLoading
}: IGalleryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card 
          key={image.id}
          className="group relative hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-2">
            <div 
              className="relative aspect-square rounded-md overflow-hidden cursor-pointer"
              onClick={() => onImageSelect(image)}
            >
              <Image
                src={image.imageUrl}
                alt={image.prompt}
                fill
                className="object-cover"
              />
              {/* 액션 버튼 오버레이 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    onShareClick(image)
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditClick(image)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteClick(image)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600 truncate">{image.prompt}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {dayjs(image.createdAt).fromNow()}
                </span>
                {image.isPublic && (
                  <span className="text-xs text-blue-500">공개</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {isLoading && (
        <div className="col-span-full flex justify-center py-4">
          <span className="loading loading-spinner" />
        </div>
      )}
    </div>
  )
} 
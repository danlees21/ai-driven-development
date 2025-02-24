"use client"

import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { CategoryManager } from '@/components/gallery/CategoryManager'
import { ShareModal } from '@/components/gallery/ShareModal'
import { GalleryFilter } from '@/components/gallery/GalleryFilter'
import { mockCategories, mockImages } from '@/mocks/galleryData'
import { useState } from 'react'
import { ICategory, IGalleryImage, IPostData, DateRange, IStyleOption } from '@/types/gallery'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import isBetween from 'dayjs/plugin/isBetween'
import { EditImageModal } from '@/components/gallery/EditImageModal'

// dayjs 설정
dayjs.locale('ko')
dayjs.extend(isBetween)

export default function GalleryPage() {
  // 상태 관리
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dateRange, setDateRange] = useState<DateRange>()
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'name'>('latest')
  const [images, setImages] = useState(mockImages)
  const [categories, setCategories] = useState(mockCategories)
  const [selectedImage, setSelectedImage] = useState<IGalleryImage | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<IGalleryImage | null>(null)
  
  // 필터링 및 정렬 로직
  const filteredAndSortedImages = images
    .filter(img => {
      // 카테고리 필터
      if (selectedCategory !== 'all' && img.categoryId !== selectedCategory) {
        return false
      }
      
      // 날짜 필터
      if (dateRange?.from && dateRange?.to) {
        const imageDate = dayjs(img.createdAt)
        const fromDate = dayjs(dateRange.from)
        const toDate = dayjs(dateRange.to)
        if (!imageDate.isBetween(fromDate, toDate, 'day', '[]')) {
          return false
        }
      }
      
      return true
    })
    .sort((a, b) => {
      // 정렬
      switch (sortBy) {
        case 'latest':
          return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        case 'oldest':
          return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
        case 'name':
          return a.prompt.localeCompare(b.prompt)
        default:
          return 0
      }
    })

  // 이벤트 핸들러
  const handleAddCategory = (newCategory: ICategory) => {
    setCategories(prev => [...prev, newCategory])
  }

  const handleEditCategory = (categoryId: string, newName: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, name: newName } : cat
      )
    )
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
  }

  const handleImageSelect = (image: IGalleryImage) => {
    setSelectedImage(image)
    setIsShareModalOpen(true)
  }

  const handleShare = (postData: IPostData) => {
    console.log('공유 데이터:', postData)
    toast.success('커뮤니티에 공유되었습니다!')
    setIsShareModalOpen(false)
  }

  const handleFilterReset = () => {
    setSelectedCategory('all')
    setDateRange(undefined)
    setSortBy('latest')
  }

  // 이미지 공유 핸들러
  const handleShareClick = (image: IGalleryImage) => {
    setSelectedImage(image)
    setIsShareModalOpen(true)
  }

  // 이미지 수정 핸들러
  const handleEditClick = (image: IGalleryImage) => {
    setSelectedImageForEdit(image)
    setIsEditModalOpen(true)
  }

  // 새 버전 생성 핸들러
  const handleGenerateNewVersion = async (prompt: string, styleOptions: IStyleOption[]) => {
    try {
      // TODO: API 호출로 새 이미지 생성
      const newImage = {
        ...selectedImageForEdit!,
        id: `${selectedImageForEdit!.id}_v${getNextVersionNumber(selectedImageForEdit!.id)}`,
        prompt,
        styleOptions,
        createdAt: new Date().toISOString(),
      }
      
      setImages(prev => [...prev, newImage])
      toast.success("새 버전이 생성되었습니다.")
    } catch (error) {
      toast.error("이미지 생성에 실패했습니다.")
      throw error
    }
  }

  // 버전 번호 계산 함수
  const getNextVersionNumber = (originalId: string) => {
    const versions = images.filter(img => 
      img.id.startsWith(originalId.split('_v')[0])
    ).length
    return versions + 1
  }

  // 이미지 삭제 핸들러
  const handleDeleteClick = async (image: IGalleryImage) => {
    if (window.confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
      try {
        // TODO: 실제 삭제 API 호출
        setImages(prev => prev.filter(img => img.id !== image.id))
        toast.success('이미지가 삭제되었습니다.')
      } catch (error) {
        toast.error('이미지 삭제 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">내 갤러리</h1>
      
      <CategoryManager 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onCategoryAdd={handleAddCategory}
        onCategoryEdit={handleEditCategory}
        onCategoryDelete={handleDeleteCategory}
      />

      <GalleryFilter
        selectedCategory={selectedCategory}
        dateRange={dateRange}
        sortBy={sortBy}
        onCategoryChange={setSelectedCategory}
        onDateRangeChange={setDateRange}
        onSortChange={(value) => setSortBy(value as 'latest' | 'oldest' | 'name')}
        onReset={handleFilterReset}
      />

      <GalleryGrid 
        images={filteredAndSortedImages}
        onImageSelect={handleImageSelect}
        onShareClick={handleShareClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onLoadMore={() => {
          console.log('더 많은 이미지 로드')
        }}
        hasMore={false}
        isLoading={false}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        selectedImage={selectedImage}
        onShare={handleShare}
      />

      <EditImageModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        image={selectedImageForEdit}
        onGenerate={handleGenerateNewVersion}
      />
    </div>
  )
} 
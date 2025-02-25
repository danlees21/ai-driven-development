"use client"

import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { CategoryManager } from '@/components/gallery/CategoryManager'
import { ShareModal } from '@/components/gallery/ShareModal'
import { GalleryFilter } from '@/components/gallery/GalleryFilter'
import { mockCategories } from '@/mocks/galleryData'
import { useState, useEffect, useRef } from 'react'
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
  const [images, setImages] = useState<IGalleryImage[]>([])
  const [categories, setCategories] = useState(mockCategories)
  const [selectedImage, setSelectedImage] = useState<IGalleryImage | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<IGalleryImage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // 갤러리 이미지 로드
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/gallery')
        
        if (!response.ok) {
          throw new Error('갤러리 이미지를 불러오는데 실패했습니다.')
        }
        
        const data = await response.json()
        
        // API 응답을 IGalleryImage 형식으로 변환
        const galleryImages: IGalleryImage[] = data.map((item: any) => ({
          id: item.id,
          imageUrl: item.imageUrl,
          prompt: item.prompt,
          categoryId: item.categoryId || 'uncategorized',
          styleOptions: item.styleOptions.map((style: string) => ({
            id: style,
            name: style,
            value: style,
            category: 'style'
          })),
          createdAt: item.createdAt,
          isPublic: false
        }))
        
        setImages(galleryImages)
      } catch (error) {
        console.error('갤러리 이미지 로드 중 오류:', error)
        toast.error('갤러리 이미지를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchGalleryImages()
  }, [])
  
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
    const successToastShown = useRef(false);
    
    try {
      // 새 이미지 생성 API 호출
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          styleOptions: styleOptions.map(style => style.value),
          styleStrength: 0.5,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '이미지 생성에 실패했습니다')
      }

      const result = await response.json()
      
      if (!result.generationId) {
        throw new Error('생성 ID가 없습니다')
      }
      
      // 이미지 생성 상태 확인
      let generatedImageUrl = ''
      let pollingCount = 0
      const MAX_POLLING = 60
      
      const checkPrediction = async () => {
        if (pollingCount >= MAX_POLLING) {
          throw new Error('이미지 생성 시간이 초과되었습니다')
        }
        
        const statusResponse = await fetch(`/api/generate?id=${result.generationId}`)
        
        if (!statusResponse.ok) {
          const errorData = await statusResponse.json()
          throw new Error(errorData.error || '이미지 생성 상태 확인에 실패했습니다')
        }
        
        const prediction = await statusResponse.json()
        
        if (prediction.status === 'succeeded') {
          if (prediction.output && prediction.output.length > 0) {
            return prediction.output[0]
          } else {
            throw new Error('생성된 이미지가 없습니다')
          }
        } else if (prediction.status === 'failed' || prediction.status === 'canceled') {
          throw new Error(prediction.error || '이미지 생성에 실패했습니다')
        } else {
          pollingCount++
          await new Promise(resolve => setTimeout(resolve, 1000))
          return checkPrediction()
        }
      }
      
      toast.info('새 버전 생성 중입니다. 잠시만 기다려주세요...')
      generatedImageUrl = await checkPrediction()
      
      // 갤러리에 저장
      const saveResponse = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: generatedImageUrl,
          prompt,
          styleOptions: styleOptions.map(style => style.value),
        }),
      })
      
      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(errorData.error || '갤러리 저장에 실패했습니다')
      }
      
      const savedItem = await saveResponse.json()
      
      // 갤러리 이미지 목록 업데이트
      const newImage: IGalleryImage = {
        id: savedItem.item.id,
        imageUrl: savedItem.item.imageUrl,
        prompt: savedItem.item.prompt,
        categoryId: 'uncategorized',
        styleOptions: styleOptions,
        createdAt: savedItem.item.createdAt,
        isPublic: false
      }
      
      setImages(prev => [...prev, newImage])
      setIsEditModalOpen(false)
      
      if (!successToastShown.current) {
        toast.success("새 버전이 생성되었습니다.")
        successToastShown.current = true
      }
    } catch (error) {
      console.error('이미지 생성 중 오류:', error)
      toast.error(error instanceof Error ? error.message : "이미지 생성에 실패했습니다.")
    }
  }

  // 이미지 삭제 핸들러
  const handleDeleteClick = async (image: IGalleryImage) => {
    if (window.confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
      try {
        // 이미지 삭제 (현재는 클라이언트 측에서만 삭제)
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
        isLoading={isLoading}
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
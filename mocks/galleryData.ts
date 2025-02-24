import { ICategory, IGalleryImage, IStyleOption } from "@/types/gallery"

// 스타일 옵션 목데이터
export const mockStyleOptions: IStyleOption[] = [
  { id: "1", name: "수채화", value: "watercolor" },
  { id: "2", name: "유화", value: "oil-painting" },
  { id: "3", name: "팝아트", value: "pop-art" },
  { id: "4", name: "일러스트", value: "illustration" },
  { id: "5", name: "픽셀아트", value: "pixel-art" },
]

// 카테고리 목데이터
export const mockCategories: ICategory[] = [
  { id: "1", name: "풍경", imageCount: 12 },
  { id: "2", name: "인물", imageCount: 8 },
  { id: "3", name: "동물", imageCount: 5 },
  { id: "4", name: "추상", imageCount: 7 },
  { id: "5", name: "판타지", imageCount: 10 },
]

// 이미지 목데이터
export const mockImages: IGalleryImage[] = [
  {
    id: "1",
    imageUrl: "https://picsum.photos/seed/1/400",
    prompt: "평화로운 호수가 있는 산속 풍경",
    styleOptions: [mockStyleOptions[0]], // 수채화
    categoryId: "1", // 풍경
    createdAt: "2024-02-20T09:00:00Z",
    isPublic: true,
    tags: ["자연", "풍경", "호수"]
  },
  {
    id: "2",
    imageUrl: "https://picsum.photos/seed/2/400",
    prompt: "도시의 밤거리와 네온사인",
    styleOptions: [mockStyleOptions[2]], // 팝아트
    categoryId: "1", // 풍경
    createdAt: "2024-02-21T15:30:00Z",
    isPublic: false,
    tags: ["도시", "밤", "네온"]
  },
  {
    id: "3",
    imageUrl: "https://picsum.photos/seed/3/400",
    prompt: "신비로운 판타지 세계의 요정",
    styleOptions: [mockStyleOptions[3]], // 일러스트
    categoryId: "5", // 판타지
    createdAt: "2024-02-22T11:20:00Z",
    isPublic: true,
    tags: ["판타지", "요정", "마법"]
  },
  {
    id: "4",
    imageUrl: "https://picsum.photos/seed/4/400",
    prompt: "우주를 탐험하는 우주인",
    styleOptions: [mockStyleOptions[4]], // 픽셀아트
    categoryId: "5", // 판타지
    createdAt: "2024-02-23T08:45:00Z",
    isPublic: true,
    tags: ["우주", "SF", "탐험"]
  },
  {
    id: "5",
    imageUrl: "https://picsum.photos/seed/5/400",
    prompt: "고양이와 놀고 있는 소녀",
    styleOptions: [mockStyleOptions[3]], // 일러스트
    categoryId: "2", // 인물
    createdAt: "2024-02-23T16:15:00Z",
    isPublic: true,
    tags: ["인물", "동물", "일상"]
  },
  {
    id: "6",
    imageUrl: "https://picsum.photos/seed/6/400",
    prompt: "화려한 색채의 추상화",
    styleOptions: [mockStyleOptions[1]], // 유화
    categoryId: "4", // 추상
    createdAt: "2024-02-24T10:00:00Z",
    isPublic: false,
    tags: ["추상", "색채", "예술"]
  },
  {
    id: "7",
    imageUrl: "https://picsum.photos/seed/7/400",
    prompt: "해변에서 뛰노는 강아지들",
    styleOptions: [mockStyleOptions[0]], // 수채화
    categoryId: "3", // 동물
    createdAt: "2024-02-24T13:30:00Z",
    isPublic: true,
    tags: ["동물", "해변", "행복"]
  },
  {
    id: "8",
    imageUrl: "https://picsum.photos/seed/8/400",
    prompt: "중세 시대의 기사와 성",
    styleOptions: [mockStyleOptions[1]], // 유화
    categoryId: "5", // 판타지
    createdAt: "2024-02-24T14:45:00Z",
    isPublic: true,
    tags: ["중세", "기사", "성"]
  }
] 
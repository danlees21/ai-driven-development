export interface IGalleryImage {
  id: string;
  imageUrl: string;
  prompt: string;
  styleOptions: IStyleOption[];
  categoryId: string;
  createdAt: string;
  isPublic: boolean;
  tags?: string[];
}

export interface ICategory {
  id: string;
  name: string;
  imageCount: number;
}

export interface IStyleOption {
  id: string;
  name: string;
  value: string;
}

export interface IGalleryGrid {
  images: IGalleryImage[];
  onImageSelect: (imageId: string) => void;
  onShareClick: (imageId: string) => void;
  onDeleteClick: (imageId: string) => void;
}

export interface ICategoryManager {
  categories: ICategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onCategoryAdd: (newCategory: ICategory) => void;
  onCategoryEdit: (categoryId: string, newName: string) => void;
  onCategoryDelete: (categoryId: string) => void;
}

export interface IPostData {
  imageId: string;
  title: string;
  description: string;
  isPublic: boolean;
  tags: string[];
}

export interface IShareModal {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: IGalleryImage | null;
  onShare: (postData: IPostData) => void;
}

export interface IGalleryGridProps {
  images: IGalleryImage[];
  onImageSelect: (image: IGalleryImage) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface IGalleryFilter {
  selectedCategory: string;
  dateRange: DateRange | undefined;
  sortBy: 'latest' | 'oldest' | 'name';
  onCategoryChange: (category: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
} 
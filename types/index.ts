// 게시물 관련 인터페이스
export interface IPost {
  postId: string;
  imageURL: string;
  userName: string;
  userProfile: string;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

// 프롬프트 입력 관련 인터페이스
export interface IPromptInput {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

// 댓글 관련 인터페이스
export interface IComment {
  id: string;
  postId: string;
  content: string;
  userName: string;
  userProfile: string;
  createdAt: string;
}

// 게시물 상세 정보 인터페이스
export interface IPostDetail extends IPost {
  prompt: string;
  styleOptions: {
    style: string;
    mood: string;
    lighting: string;
  };
  scraps: number;
  isScrapped?: boolean;
}

// 커뮤니티 피드 카드 Props 인터페이스
export interface ICommunityFeedCardProps {
  post: IPost;
}

// 댓글 모달 Props 인터페이스
export interface ICommentModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  comments: IComment[];
}

// 헤더 컴포넌트 Props 인터페이스
export interface IHeaderProps {
  variant?: 'default' | 'transparent';
  className?: string;
}

// 내비게이션 링크 Props 인터페이스
export interface INavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// 모바일 메뉴 Props 인터페이스
export interface IMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IStyleOption {
  id: string;
  category: 'color' | 'texture' | 'mood' | 'style' | 'pose';
  name: string;
  value: string;
  thumbnail?: string;
}

export interface IPromptInputWithStyle {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  styleOptions: IStyleOption[];
  selectedStyles: string[];
}

export interface IStyleOptionSelector {
  options: IStyleOption[];
  selectedOptions: string[];
  onOptionChange: (options: string[]) => void;
  styleStrength: number;
  onStrengthChange: (value: number) => void;
}

export interface IGeneratedImagePreview {
  imageUrl?: string;
  isLoading: boolean;
  onRegenerate: () => void;
  onSave: () => Promise<void>;
}

export interface IGeneratedImageActions {
  imageUrl?: string;
  onSave: () => Promise<void>;
}

export interface IGenerationRequest {
  prompt: string;
  styleOptions: string[];
  styleStrength: number;
}

export interface IGenerationResult {
  imageUrl: string;
  generationId: string;
  prompt: string;
  appliedStyles: IStyleOption[];
}

// Replicate API 응답 타입
export interface IReplicateResponse {
  id: string;
  version: string;
  urls: {
    get: string;
    cancel: string;
  };
  created_at: string;
  started_at: string;
  completed_at: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  input: {
    prompt: string;
    [key: string]: any;
  };
  output: string[] | null;
  error: string | null;
  logs: string;
  metrics: {
    predict_time: number;
  };
} 
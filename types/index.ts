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

export interface IStyleOption {
  id: string;
  category: 'color' | 'texture' | 'mood';
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
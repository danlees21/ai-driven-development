import { IPost, IComment, IPostDetail } from '@/types';

export const mockPosts: IPost[] = [
  {
    postId: '1',
    imageURL: 'https://picsum.photos/400/400?random=1',
    userName: '창작자123',
    userProfile: 'https://i.pravatar.cc/150?img=1',
    createdAt: '2024-03-15',
    likes: 150,
    comments: 23,
    isLiked: false
  },
  {
    postId: '2',
    imageURL: 'https://picsum.photos/400/400?random=2',
    userName: '아티스트456',
    userProfile: 'https://i.pravatar.cc/150?img=2',
    createdAt: '2024-03-14',
    likes: 89,
    comments: 12,
    isLiked: false
  },
  {
    postId: '3',
    imageURL: 'https://picsum.photos/400/400?random=3',
    userName: '디자이너789',
    userProfile: 'https://i.pravatar.cc/150?img=3',
    createdAt: '2024-03-13',
    likes: 234,
    comments: 45,
    isLiked: false
  },
  {
    postId: '4',
    imageURL: 'https://picsum.photos/400/400?random=4',
    userName: '크리에이터101',
    userProfile: 'https://i.pravatar.cc/150?img=4',
    createdAt: '2024-03-12',
    likes: 67,
    comments: 8,
    isLiked: false
  },
  {
    postId: '5',
    imageURL: 'https://picsum.photos/400/400?random=5',
    userName: '작가님202',
    userProfile: 'https://i.pravatar.cc/150?img=5',
    createdAt: '2024-03-11',
    likes: 321,
    comments: 56,
    isLiked: false
  },
  {
    postId: '6',
    imageURL: 'https://picsum.photos/400/400?random=6',
    userName: '일러스트303',
    userProfile: 'https://i.pravatar.cc/150?img=6',
    createdAt: '2024-03-10',
    likes: 178,
    comments: 34,
    isLiked: false
  },
  {
    postId: '7',
    imageURL: 'https://picsum.photos/400/400?random=7',
    userName: 'AI아티스트404',
    userProfile: 'https://i.pravatar.cc/150?img=7',
    createdAt: '2024-03-09',
    likes: 445,
    comments: 67,
    isLiked: false
  },
  {
    postId: '8',
    imageURL: 'https://picsum.photos/400/400?random=8',
    userName: '그림쟁이505',
    userProfile: 'https://i.pravatar.cc/150?img=8',
    createdAt: '2024-03-08',
    likes: 267,
    comments: 41,
    isLiked: false
  },
  {
    postId: '9',
    imageURL: 'https://picsum.photos/400/400?random=9',
    userName: '포토그래퍼606',
    userProfile: 'https://i.pravatar.cc/150?img=9',
    createdAt: '2024-03-07',
    likes: 189,
    comments: 28,
    isLiked: false
  },
  {
    postId: '10',
    imageURL: 'https://picsum.photos/400/400?random=10',
    userName: '드림메이커707',
    userProfile: 'https://i.pravatar.cc/150?img=10',
    createdAt: '2024-03-06',
    likes: 512,
    comments: 89,
    isLiked: false
  }
];

export const mockComments: { [key: string]: IComment[] } = {
  '1': [
    {
      id: '1',
      postId: '1',
      content: '정말 멋진 작품이네요!',
      userName: '댓글러123',
      userProfile: 'https://i.pravatar.cc/150?img=20',
      createdAt: '2024-03-15T10:00:00Z'
    },
    {
      id: '2',
      postId: '1',
      content: '어떤 프롬프트를 사용하셨나요?',
      userName: '궁금이456',
      userProfile: 'https://i.pravatar.cc/150?img=21',
      createdAt: '2024-03-15T09:30:00Z'
    }
  ],
  '2': [
    {
      id: '3',
      postId: '2',
      content: '색감이 너무 예쁘네요',
      userName: '색감러789',
      userProfile: 'https://i.pravatar.cc/150?img=22',
      createdAt: '2024-03-14T15:00:00Z'
    }
  ],
  '3': [
    {
      id: '4',
      postId: '3',
      content: '분위기가 독특해요!',
      userName: '예술가101',
      userProfile: 'https://i.pravatar.cc/150?img=23',
      createdAt: '2024-03-13T12:00:00Z'
    }
  ],
  '4': [
    {
      id: '5',
      postId: '4',
      content: '이런 스타일 정말 좋아요',
      userName: '스타일러202',
      userProfile: 'https://i.pravatar.cc/150?img=24',
      createdAt: '2024-03-12T14:20:00Z'
    }
  ]
};

export const mockPostDetails: { [key: string]: IPostDetail } = {
  '1': {
    ...mockPosts[0],
    prompt: "밤하늘의 오로라와 함께 있는 고요한 호수",
    styleOptions: {
      style: "사실적",
      mood: "평화로움",
      lighting: "야간"
    },
    scraps: 45,
    isScrapped: false
  },
  '2': {
    ...mockPosts[1],
    prompt: "도시의 네온사인이 비치는 빗길",
    styleOptions: {
      style: "사이버펑크",
      mood: "몽환적",
      lighting: "야간"
    },
    scraps: 32,
    isScrapped: false
  },
  '3': {
    ...mockPosts[2],
    prompt: "봄날의 벚꽃이 흩날리는 정원",
    styleOptions: {
      style: "수채화",
      mood: "로맨틱",
      lighting: "자연광"
    },
    scraps: 78,
    isScrapped: false
  },
  '4': {
    ...mockPosts[3],
    prompt: "미래도시의 플라잉카가 날아다니는 풍경",
    styleOptions: {
      style: "미래적",
      mood: "역동적",
      lighting: "인공광"
    },
    scraps: 23,
    isScrapped: false
  },
  '5': {
    ...mockPosts[4],
    prompt: "고대 신전의 신비로운 내부",
    styleOptions: {
      style: "판타지",
      mood: "신비로움",
      lighting: "드라마틱"
    },
    scraps: 91,
    isScrapped: false
  },
  '6': {
    ...mockPosts[5],
    prompt: "해변가의 일몰과 야자수",
    styleOptions: {
      style: "트로피컬",
      mood: "평화로움",
      lighting: "황혼"
    },
    scraps: 67,
    isScrapped: false
  },
  '7': {
    ...mockPosts[6],
    prompt: "우주 정거장에서 바라본 지구",
    styleOptions: {
      style: "SF",
      mood: "웅장함",
      lighting: "우주"
    },
    scraps: 156,
    isScrapped: false
  },
  '8': {
    ...mockPosts[7],
    prompt: "비오는 날의 카페 창가",
    styleOptions: {
      style: "아늑함",
      mood: "편안함",
      lighting: "실내"
    },
    scraps: 88,
    isScrapped: false
  },
  '9': {
    ...mockPosts[8],
    prompt: "중세 성의 웅장한 연회장",
    styleOptions: {
      style: "고딕",
      mood: "화려함",
      lighting: "촛불"
    },
    scraps: 72,
    isScrapped: false
  },
  '10': {
    ...mockPosts[9],
    prompt: "동화 속 마법의 숲",
    styleOptions: {
      style: "동화",
      mood: "환상적",
      lighting: "마법"
    },
    scraps: 143,
    isScrapped: false
  }
};
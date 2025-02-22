feat: 타입 시스템 강화 및 기능명세서 구조화

- PostDetail 페이지에 타입 명시 추가 (IPostDetail, IComment[])
- 컴포넌트 Props 인터페이스를 types/index.ts로 통합
- 기능명세서 컴포넌트별 상세 명세 추가
- API 엔드포인트 및 데이터베이스 스키마 정의
- 테스트 항목 구체화

## 메인페이지 기능명세서

---

### 프론트엔드 기능명세서

#### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/page.tsx`

1. **프롬프트 입력 섹션** (`components/PromptInput.tsx`)
   - **UI 구성**: ShadCN의 `Input` 컴포넌트와 `Button` 컴포넌트를 결합한 형태
   - **Props 인터페이스**: 
     ```typescript
     interface IPromptInput {
       value: string;
       onChange: (value: string) => void;
       onSubmit: () => void;
       isLoading?: boolean;
     }
     ```
   - **상호작용**: 입력값 상태 관리 및 제출 처리
   - **로딩 상태**: isLoading prop을 통한 버튼 상태 표시

2. **커뮤니티 피드 섹션** (`components/CommunityFeedCard.tsx`)
   - **UI 구성**: 
     - ShadcN Card 컴포넌트 기반의 그리드 레이아웃
     - Next.js Image 컴포넌트를 활용한 이미지 최적화
     - Lucide 아이콘을 활용한 인터랙션 버튼
   - **카드 기능**:
     - 이미지 표시 (aspect-square 비율)
     - 사용자 프로필 (이미지, 이름)
     - 좋아요 기능 (상태 관리 포함)
     - 댓글 모달 연동
   - **호버 효과**: scale-[1.02] 및 shadow-lg 적용

3. **댓글 시스템** (`components/CommentModal.tsx`)
   - **UI 구성**: ShadcN Dialog 컴포넌트 활용
   - **기능**:
     - 댓글 작성 폼
     - 댓글 목록 표시 (최대 높이 400px, 스크롤 가능)
     - 댓글 시간 표시 (date-fns 활용)
   - **Props 인터페이스**:
     ```typescript
     interface ICommentModalProps {
       postId: string;
       isOpen: boolean;
       onClose: () => void;
       comments: IComment[];
     }
     ```

#### 2. 데이터 구조

1. **게시물 데이터 구조** (`types/index.ts`)
   ```typescript
   interface IPost {
     postId: string;
     imageURL: string;
     userName: string;
     userProfile: string;
     createdAt: string;
     likes: number;
     comments: number;
     isLiked?: boolean;
   }
   ```

2. **댓글 데이터 구조**
   ```typescript
   interface IComment {
     id: string;
     postId: string;
     content: string;
     userName: string;
     userProfile: string;
     createdAt: string;
   }
   ```

#### 3. 상태 관리

1. **좋아요 기능**
   - 로컬 상태로 관리 (useState)
   - 좋아요 토글 시 즉시 UI 반영
   - 서버 동기화 준비

2. **댓글 시스템**
   - 모달 상태 관리 (isOpen)
   - 댓글 목록 상태 관리
   - 새 댓글 입력 상태 관리

---

### 백엔드 기능명세서

#### 1. API 엔드포인트

1. **좋아요 API**
   - **경로**: `app/api/post/[postId]/like/route.ts`
   - **메서드**: `POST`
   - **응답**: `{ success: boolean, likes: number, isLiked: boolean }`

2. **댓글 API**
   - **경로**: `app/api/post/[postId]/comments/route.ts`
   - **메서드**: 
     - `GET`: 댓글 목록 조회
     - `POST`: 새 댓글 작성
   - **응답**: `{ comments: IComment[] }`

3. **피드 API**
   - **경로**: `app/api/feed/route.ts`
   - **메서드**: `GET`
   - **응답**: `{ posts: IPost[] }`

#### 2. 데이터베이스 스키마

1. **Posts 테이블**
   ```sql
   CREATE TABLE posts (
     postId TEXT PRIMARY KEY,
     imageURL TEXT NOT NULL,
     userName TEXT NOT NULL,
     userProfile TEXT NOT NULL,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     likes INTEGER DEFAULT 0,
     comments INTEGER DEFAULT 0
   );
   ```

2. **Comments 테이블**
   ```sql
   CREATE TABLE comments (
     id TEXT PRIMARY KEY,
     postId TEXT NOT NULL,
     content TEXT NOT NULL,
     userName TEXT NOT NULL,
     userProfile TEXT NOT NULL,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (postId) REFERENCES posts(postId)
   );
   ```

#### 3. 테스트 항목

1. **API 응답 테스트**
   - 각 엔드포인트의 성공/실패 케이스
   - 데이터 유효성 검증
   - 권한 검증

2. **데이터 정합성 테스트**
   - 좋아요 수 동기화
   - 댓글 수 동기화
   - 타임스탬프 정확성

# 이미지 생성 화면 기능명세서

## 프론트엔드 기능명세서

### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/generate/page.tsx`

1. **프롬프트 입력 섹션** (`components/PromptInputWithStyle.tsx`)
   - **UI 구성**: 
     - ShadCN의 `Textarea` 컴포넌트 활용
     - 프롬프트 입력 가이드라인 툴팁
   - **Props 인터페이스**: 
     ```typescript
     interface IPromptInputWithStyle {
       value: string;
       onChange: (value: string) => void;
       onSubmit: () => void;
       isLoading: boolean;
       styleOptions: IStyleOption[];
       selectedStyles: string[];
     }
     ```
   - **상호작용**: 
     - 입력값 실시간 유효성 검사
     - 최소 10자 이상 입력 필요
     - 최대 1000자 제한

2. **스타일 옵션 선택 섹션** (`components/StyleOptionSelector.tsx`)
   - **UI 구성**:
     - ShadCN의 `Select`, `Slider` 컴포넌트 활용
     - 카테고리별 스타일 옵션 그룹화
   - **Props 인터페이스**:
     ```typescript
     interface IStyleOptionSelector {
       options: IStyleOption[];
       selectedOptions: string[];
       onOptionChange: (options: string[]) => void;
       styleStrength: number;
       onStrengthChange: (value: number) => void;
     }
     ```
   - **스타일 옵션**:
     - 색감 조절 (슬라이더)
     - 텍스처 선택 (드롭다운)
     - 분위기 설정 (멀티 셀렉트)

3. **이미지 생성 결과 섹션** (`components/GeneratedImagePreview.tsx`)
   - **UI 구성**:
     - Next.js Image 컴포넌트 활용
     - 로딩 상태 애니메이션
     - 재생성/저장/공유 버튼
   - **Props 인터페이스**:
     ```typescript
     interface IGeneratedImagePreview {
       imageUrl?: string;
       isLoading: boolean;
       onRegenerate: () => void;
       onSave: () => void;
       onShare: () => void;
     }
     ```

### 2. 데이터 구조

1. **스타일 옵션 데이터** (`types/index.ts`)
   ```typescript
   interface IStyleOption {
     id: string;
     category: 'color' | 'texture' | 'mood';
     name: string;
     value: string;
     thumbnail?: string;
   }

   interface IGenerationRequest {
     prompt: string;
     styleOptions: string[];
     styleStrength: number;
   }

   interface IGenerationResult {
     imageUrl: string;
     generationId: string;
     prompt: string;
     appliedStyles: IStyleOption[];
   }
   ```

### 3. 상태 관리

1. **이미지 생성 프로세스**
   - 프롬프트 입력 상태
   - 선택된 스타일 옵션 상태
   - 생성 진행 상태 (로딩)
   - 결과 이미지 상태

2. **에러 처리**
   - 입력값 유효성 검증
   - API 오류 상태 관리
   - 재시도 메커니즘

## 백엔드 기능명세서

### 1. API 엔드포인트

1. **이미지 생성 API**
   - **경로**: `app/api/generate/route.ts`
   - **메서드**: `POST`
   - **요청 본문**: `IGenerationRequest`
   - **응답**: `IGenerationResult`

2. **이미지 저장 API**
   - **경로**: `app/api/generate/save/route.ts`
   - **메서드**: `POST`
   - **응답**: `{ success: boolean, savedImageId: string }`

### 2. 데이터베이스 스키마

1. **GeneratedImages 테이블**
   ```sql
   CREATE TABLE generated_images (
     generationId TEXT PRIMARY KEY,
     userId TEXT NOT NULL,
     prompt TEXT NOT NULL,
     imageUrl TEXT NOT NULL,
     styleOptions JSON NOT NULL,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     isSaved BOOLEAN DEFAULT false,
     FOREIGN KEY (userId) REFERENCES users(id)
   );
   ```

### 3. 테스트 항목

1. **이미지 생성 테스트**
   - 프롬프트 유효성 검증
   - 스타일 옵션 적용 검증
   - 생성 시간 제한 테스트
   - 에러 케이스 핸들링

2. **이미지 저장 테스트**
   - 저장 권한 검증
   - 중복 저장 방지
   - 스토리지 용량 제한 테스트

3. **성능 테스트**
   - 동시 요청 처리 능력
   - 이미지 생성 평균 소요 시간
   - 메모리 사용량 모니터링

### 4. 보안 고려사항

1. **입력값 검증**
   - 프롬프트 내용 필터링
   - XSS 방지
   - 파일 업로드 제한

2. **리소스 제한**
   - 사용자별 생성 횟수 제한
   - 동시 요청 제한
   - 스토리지 용량 제한 
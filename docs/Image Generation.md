# 이미지 생성 화면 기능명세서

## 프론트엔드 기능명세서

### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/generate/page.tsx`

1. **프롬프트 입력 섹션** (`components/generate/PromptInputWithStyle.tsx`)
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

2. **스타일 옵션 선택 섹션** (`components/generate/StyleOptionSelector.tsx`)
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
     - 색감: 파스텔
     - 텍스처: 수채화, 유화, 디지털아트, 연필화
     - 분위기: 밝은, 어두운
     - 스타일: 애니메이션, 사실적, 추상적

3. **이미지 생성 결과 섹션** (`components/generate/GeneratedImagePreview.tsx`)
   - **UI 구성**:
     - Next.js Image 컴포넌트 활용
     - 로딩 상태 애니메이션
     - 재생성 버튼
   - **Props 인터페이스**:
     ```typescript
     interface IGeneratedImagePreview {
       imageUrl?: string;
       isLoading: boolean;
       onRegenerate: () => void;
       onSave: () => Promise<void>;
     }
     ```

4. **이미지 액션 섹션** (`components/generate/GeneratedImageActions.tsx`)
   - **UI 구성**:
     - 갤러리 저장 버튼
     - 공유 버튼
     - 다운로드 버튼
   - **Props 인터페이스**:
     ```typescript
     interface IGeneratedImageActions {
       imageUrl?: string;
       onSave: () => Promise<void>;
     }
     ```
   - **기능**:
     - 이미지 다운로드: 브라우저에서 직접 다운로드
     - 갤러리 저장: API를 통해 서버에 저장
     - 공유: 준비 중 메시지 표시

### 2. 데이터 구조

1. **스타일 옵션 데이터** (`types/index.ts`)
   ```typescript
   interface IStyleOption {
     id: string;
     category: 'color' | 'texture' | 'mood' | 'style';
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

2. **Replicate API 응답 데이터**
   ```typescript
   interface IReplicateResponse {
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
   ```

### 3. 상태 관리

1. **이미지 생성 프로세스**
   - 프롬프트 입력 상태: `useState<string>`
   - 선택된 스타일 옵션 상태: `useState<string[]>`
   - 스타일 강도 상태: `useState<number>`
   - 생성 진행 상태 (로딩): `useState<boolean>`
   - 결과 이미지 상태: `useState<string>`
   - 예측 ID 상태: `useState<string>`
   - 폴링 카운트 상태: `useState<number>`

2. **에러 처리**
   - 입력값 유효성 검증: 최소 10자 이상
   - API 오류 상태 관리: try-catch 블록
   - 토스트 알림: 성공, 오류, 정보 메시지
   - 폴링 제한: 최대 60회 (약 1분)

## 백엔드 기능명세서

### 1. API 엔드포인트

1. **이미지 생성 API**
   - **경로**: `app/api/generate/route.ts`
   - **메서드**: `POST`
   - **요청 본문**: `IGenerationRequest`
   - **응답**: `IGenerationResult`
   - **기능**:
     - Replicate API를 사용하여 이미지 생성 요청
     - SDXL 모델 사용 (안정적인 결과를 위해)
     - 스타일 옵션을 프롬프트에 추가
     - 스타일 강도에 따라 inference steps 조정

2. **이미지 생성 상태 확인 API**
   - **경로**: `app/api/generate/route.ts`
   - **메서드**: `GET`
   - **쿼리 파라미터**: `id` (예측 ID)
   - **응답**: `IReplicateResponse`
   - **기능**:
     - Replicate API를 사용하여 예측 상태 확인
     - 상태에 따라 결과 반환 (starting, processing, succeeded, failed, canceled)

3. **이미지 저장 API**
   - **경로**: `app/api/gallery/route.ts`
   - **메서드**: `POST`
   - **요청 본문**: `{ imageUrl: string, prompt: string, styleOptions: string[] }`
   - **응답**: `{ message: string, item: IGalleryItem }`
   - **기능**:
     - 생성된 이미지를 갤러리에 저장
     - 현재는 메모리 내 임시 저장소 사용 (실제 프로젝트에서는 데이터베이스 사용 필요)

4. **갤러리 조회 API**
   - **경로**: `app/api/gallery/route.ts`
   - **메서드**: `GET`
   - **응답**: `IGalleryItem[]`
   - **기능**:
     - 저장된 갤러리 아이템 목록 반환 (최신순 정렬)

### 2. 데이터베이스 스키마 (향후 구현)

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

### 3. 외부 API 연동

1. **Replicate API**
   - **모델**: Stability AI의 SDXL
   - **버전**: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
   - **파라미터**:
     - prompt: 사용자 입력 + 스타일 옵션
     - negative_prompt: "ugly, blurry, low quality, deformed, distorted, disfigured"
     - num_inference_steps: 스타일 강도에 따라 25-50 사이 조정
     - guidance_scale: 7.5
     - width: 768
     - height: 768
     - scheduler: "K_EULER"
     - num_outputs: 1

### 4. 테스트 항목

1. **이미지 생성 테스트**
   - 프롬프트 유효성 검증
   - 스타일 옵션 적용 검증
   - 생성 시간 제한 테스트
   - 에러 케이스 핸들링

2. **이미지 저장 테스트**
   - 저장 기능 검증
   - 다운로드 기능 검증
   - 갤러리 조회 기능 검증

3. **성능 테스트**
   - 이미지 생성 평균 소요 시간 (약 30초)
   - 폴링 간격 최적화 (1초)
   - 최대 폴링 횟수 제한 (60회)

### 5. 보안 고려사항

1. **입력값 검증**
   - 프롬프트 길이 제한 (최소 10자)
   - API 토큰 보안 (환경 변수 사용)

2. **에러 처리**
   - 모든 API 호출에 try-catch 블록 사용
   - 사용자 친화적인 에러 메시지 제공
   - 서버 로그에 상세 에러 기록 
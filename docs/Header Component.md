# 헤더 컴포넌트 기능명세서

## 1. 개요

`Header` 컴포넌트는 Artify 애플리케이션의 모든 페이지 상단에 위치하는 공통 내비게이션 컴포넌트입니다. 사용자가 주요 기능에 빠르게 접근할 수 있도록 로고, 내 갤러리, 이미지 생성 메뉴를 제공합니다. 반응형 디자인을 적용하여 모든 디바이스에서 최적의 사용자 경험을 제공합니다.

## 2. 컴포넌트 구조

```tsx
export default function Header() {
  // 구현 내용
}
```

### 2.1 Props

현재 버전에서는 별도의 Props를 받지 않습니다. 향후 확장성을 고려하여 다음과 같은 Props를 추가할 수 있습니다:

| 속성명 | 타입 | 필수 여부 | 설명 |
|--------|------|-----------|------|
| variant | 'default' \| 'transparent' | 선택 | 헤더 스타일 변형 (기본값: 'default') |
| className | string | 선택 | 추가 CSS 클래스 |

## 3. 주요 기능

### 3.1 로고 및 홈 링크

- 좌측에 Artify 로고를 배치합니다.
- 로고 클릭 시 메인 페이지('/')로 이동합니다.
- 로고는 브랜드 아이덴티티를 강조하는 디자인을 사용합니다.

### 3.2 내비게이션 메뉴

- 중앙 또는 우측에 내비게이션 메뉴를 배치합니다.
- 다음 메뉴 항목을 포함합니다:
  - **내 갤러리**: 사용자의 개인 갤러리 페이지('/gallery')로 이동
  - **이미지 생성**: 이미지 생성 페이지('/generate')로 이동
- 현재 활성화된 페이지는 시각적으로 구분되도록 표시합니다.
- 메뉴 항목에 호버 시 부드러운 색상 변화 애니메이션을 적용합니다.

### 3.3 반응형 디자인

- 데스크톱: 전체 메뉴를 가로로 표시합니다.
- 태블릿: 필요에 따라 메뉴 항목의 간격을 조정합니다.
- 모바일: 햄버거 메뉴 아이콘을 표시하고, 클릭 시 슬라이드 메뉴를 표시합니다.
- 모바일 메뉴는 클릭 시 부드럽게 슬라이드되어 나타납니다.

## 4. 사용자 인터페이스

### 4.1 디자인 스타일

- **배경색**: 흰색 또는 매우 연한 회색(#FAFAFA)
- **높이**: 64px (데스크톱), 56px (모바일)
- **그림자**: 미세한 그림자 효과로 콘텐츠와 구분
- **패딩**: 좌우 24px (데스크톱), 16px (모바일)
- **폰트**: 메뉴 항목은 16px, Semi-Bold

### 4.2 상호작용 효과

- **메뉴 호버**: 메인 색상(#4A90E2)으로 하이라이트
- **현재 페이지**: 밑줄 또는 메인 색상으로 표시
- **모바일 메뉴 전환**: 300ms 애니메이션으로 부드럽게 슬라이드

## 5. 구현 세부사항

### 5.1 레이아웃 구성

```tsx
<header className="fixed top-0 w-full h-16 bg-white shadow-sm z-50">
  <div className="container mx-auto h-full flex items-center justify-between px-6">
    {/* 로고 */}
    <Link href="/" className="flex items-center">
      <Image src="/logo.svg" alt="Artify" width={120} height={32} />
    </Link>
    
    {/* 데스크톱 메뉴 */}
    <nav className="hidden md:flex items-center space-x-6">
      <NavLink href="/gallery">내 갤러리</NavLink>
      <NavLink href="/generate">이미지 생성</NavLink>
    </nav>
    
    {/* 모바일 메뉴 토글 */}
    <button className="md:hidden">
      <Menu className="w-6 h-6" />
    </button>
  </div>
  
  {/* 모바일 메뉴 (토글 시 표시) */}
  <MobileMenu />
</header>
```

### 5.2 NavLink 컴포넌트

현재 페이지를 시각적으로 표시하기 위한 내비게이션 링크 컴포넌트:

```tsx
function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={cn(
        "transition-colors duration-200 hover:text-primary",
        isActive ? "text-primary font-semibold" : "text-gray-700"
      )}
    >
      {children}
    </Link>
  );
}
```

### 5.3 모바일 메뉴 구현

```tsx
function MobileMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={onClose}>
      <div 
        className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4">
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link href="/gallery" className="py-2" onClick={onClose}>내 갤러리</Link>
          <Link href="/generate" className="py-2" onClick={onClose}>이미지 생성</Link>
        </nav>
      </div>
    </div>
  );
}
```

## 6. 상태 관리

### 6.1 모바일 메뉴 상태

```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const openMobileMenu = () => setIsMobileMenuOpen(true);
const closeMobileMenu = () => setIsMobileMenuOpen(false);
```

### 6.2 현재 페이지 상태

Next.js의 `usePathname` 훅을 사용하여 현재 페이지 경로를 확인합니다:

```tsx
const pathname = usePathname();
```

## 7. 접근성

- 모든 상호작용 요소에 적절한 `aria-*` 속성을 추가합니다.
- 키보드 내비게이션을 지원합니다.
- 모바일 메뉴는 `Escape` 키로 닫을 수 있습니다.
- 색상 대비를 충분히 확보하여 가독성을 보장합니다.

## 8. 향후 개선 사항

- 사용자 인증 상태에 따른 메뉴 항목 변경 (로그인/로그아웃)
- 사용자 프로필 드롭다운 메뉴 추가
- 다크 모드 지원
- 알림 기능 통합
- 검색 기능 추가

## 9. 의존성

- Next.js: App Router, Link, usePathname
- ShadCN UI: 버튼, 드롭다운 메뉴
- Lucide React: 아이콘 (Menu, X)
- TailwindCSS: 스타일링
- clsx/tailwind-merge: 조건부 클래스 적용 
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IHeaderProps, INavLinkProps, IMobileMenuProps } from '@/types'

/**
 * NavLink 컴포넌트
 * 
 * 현재 페이지를 시각적으로 표시하는 내비게이션 링크 컴포넌트
 */
function NavLink({ href, children, onClick }: INavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  
  return (
    <Link 
      href={href}
      className={cn(
        "transition-colors duration-200 hover:text-primary",
        isActive ? "text-primary font-semibold" : "text-gray-700"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

/**
 * MobileMenu 컴포넌트
 * 
 * 모바일 화면에서 표시되는 슬라이드 메뉴
 */
function MobileMenu({ isOpen, onClose }: IMobileMenuProps) {
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="모바일 메뉴"
    >
      <div 
        className={cn(
          "absolute top-0 right-0 w-64 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4">
          <button 
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <NavLink href="/" onClick={onClose}>홈</NavLink>
          <NavLink href="/gallery" onClick={onClose}>내 갤러리</NavLink>
          <NavLink href="/generate" onClick={onClose}>이미지 생성</NavLink>
        </nav>
      </div>
    </div>
  )
}

/**
 * Header 컴포넌트
 * 
 * 애플리케이션의 모든 페이지 상단에 위치하는 공통 내비게이션 컴포넌트
 */
export default function Header({ variant = 'default', className }: IHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const openMobileMenu = () => setIsMobileMenuOpen(true)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  // ESC 키로 모바일 메뉴 닫기 이벤트 핸들러
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      closeMobileMenu()
    }
  }

  // 컴포넌트 마운트 시 이벤트 리스너 등록, 언마운트 시 제거
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen]) // isMobileMenuOpen이 변경될 때마다 이벤트 리스너 업데이트

  // 모바일 메뉴가 열려있을 때 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <header 
      className={cn(
        "fixed top-0 w-full h-16 md:h-16 z-50",
        variant === 'default' ? "bg-white shadow-sm" : "bg-transparent",
        className
      )}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-6">
        {/* 로고 */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.svg" 
            alt="Artify" 
            width={120} 
            height={32}
            priority
            onError={(e) => {
              // 로고 이미지 로드 실패 시 텍스트로 대체
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                const textLogo = document.createElement('span')
                textLogo.textContent = 'Artify'
                textLogo.className = 'text-2xl font-bold text-primary'
                parent.appendChild(textLogo)
              }
            }}
          />
        </Link>
        
        {/* 데스크톱 메뉴 */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/gallery">내 갤러리</NavLink>
          <NavLink href="/generate">이미지 생성</NavLink>
        </nav>
        
        {/* 모바일 메뉴 토글 */}
        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={openMobileMenu}
          aria-label="메뉴 열기"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      
      {/* 모바일 메뉴 */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  )
} 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['picsum.photos', 'i.pravatar.cc', 'replicate.delivery', 'replicate.com'], // 외부 이미지 도메인 허용
  },
  transpilePackages: ['date-fns'],
  reactStrictMode: true,
  // 하이드레이션 오류를 방지하기 위한 설정
  compiler: {
    // 브라우저 확장 프로그램이 추가하는 속성 무시
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 
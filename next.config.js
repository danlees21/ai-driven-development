/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['picsum.photos', 'i.pravatar.cc'], // 외부 이미지 도메인 허용
  },
  transpilePackages: ['date-fns'],
}

module.exports = nextConfig 
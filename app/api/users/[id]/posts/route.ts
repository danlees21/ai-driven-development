import { NextRequest, NextResponse } from 'next/server';
import { getPostsByUserId } from '@/db/example';

// GET /api/users/[id]/posts - 특정 사용자의 모든 게시물 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다.' },
        { status: 400 }
      );
    }
    
    const posts = await getPostsByUserId(userId);
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('게시물 조회 오류:', error);
    return NextResponse.json(
      { error: '게시물 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAllUsers, getUserById } from '@/db/example';

// GET /api/users - 모든 사용자 조회
export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return NextResponse.json(
      { error: '사용자 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/users - 새 사용자 생성
export async function POST(request: NextRequest) {
  try {
    const { name, age, email } = await request.json();
    
    // 필수 필드 검증
    if (!name || !age || !email) {
      return NextResponse.json(
        { error: '이름, 나이, 이메일은 필수 항목입니다.' },
        { status: 400 }
      );
    }
    
    const newUser = await createUser(name, age, email);
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    return NextResponse.json(
      { error: '사용자 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
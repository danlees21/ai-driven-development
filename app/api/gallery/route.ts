import { NextResponse } from "next/server";

// 갤러리 아이템 타입 정의
interface IGalleryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  styleOptions: string[];
  createdAt: string;
}

// 임시 저장소 (실제 프로젝트에서는 데이터베이스를 사용해야 함)
let galleryItems: IGalleryItem[] = [];

// 에러 메시지를 문자열로 변환하는 헬퍼 함수
function getErrorMessage(error: unknown): string {
  if (error === null) return "알 수 없는 오류가 발생했습니다";
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    if ("message" in error) return String(error.message);
    if ("error" in error) return String(error.error);
    return JSON.stringify(error);
  }
  return String(error);
}

// 갤러리 아이템 저장 API
export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const { imageUrl, prompt, styleOptions } = await request.json();

    // 입력값 검증
    if (!imageUrl) {
      return NextResponse.json(
        { error: "이미지 URL이 필요합니다." },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "프롬프트가 필요합니다." },
        { status: 400 }
      );
    }

    // 새 갤러리 아이템 생성
    const newItem: IGalleryItem = {
      id: Date.now().toString(), // 임시 ID 생성
      imageUrl,
      prompt,
      styleOptions: styleOptions || [],
      createdAt: new Date().toISOString(),
    };

    // 갤러리에 아이템 추가
    galleryItems.push(newItem);

    // 응답 반환
    return NextResponse.json(
      { 
        message: "이미지가 갤러리에 저장되었습니다.",
        item: newItem 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("갤러리 저장 중 오류 발생:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// 갤러리 아이템 조회 API
export async function GET() {
  try {
    // 갤러리 아이템 반환 (최신순으로 정렬)
    const sortedItems = [...galleryItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sortedItems);
  } catch (error) {
    console.error("갤러리 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
} 
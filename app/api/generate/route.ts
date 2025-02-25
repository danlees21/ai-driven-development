import { NextResponse } from "next/server";
import Replicate from "replicate";
import { IGenerationRequest, IGenerationResult, IReplicateResponse } from "@/types";

// Replicate API 토큰 확인
if (!process.env.REPLICATE_API_TOKEN) {
  console.error("환경 변수 REPLICATE_API_TOKEN이 설정되지 않았습니다.");
}

// Replicate 클라이언트 초기화
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

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

/**
 * 이미지 생성 API 엔드포인트
 * 
 * @param request POST 요청 객체
 * @returns 생성 결과 또는 에러 응답
 */
export async function POST(request: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API 토큰이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 요청 데이터 파싱
    const { prompt, styleOptions, styleStrength }: IGenerationRequest = await request.json();

    // 입력값 검증
    if (!prompt || prompt.length < 10) {
      return NextResponse.json(
        { error: "프롬프트는 최소 10자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 스타일 옵션을 프롬프트에 추가
    const enhancedPrompt = styleOptions.length > 0 
      ? `${prompt}, style: ${styleOptions.join(", ")}`
      : prompt;

    console.log("이미지 생성 요청:", { enhancedPrompt, styleStrength });

    // 스타일 강도에 따라 inference steps 조정 (25-50 사이)
    const inferenceSteps = Math.max(25, Math.min(50, Math.floor(30 + styleStrength * 20)));
    
    // Replicate API를 사용하여 이미지 생성 요청
    // Stability AI의 SDXL 모델 사용 (안정적인 결과를 위해)
    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt: enhancedPrompt,
        negative_prompt: "ugly, blurry, low quality, deformed, distorted, disfigured",
        num_inference_steps: inferenceSteps,
        guidance_scale: 7.5,
        width: 768,
        height: 768,
        scheduler: "K_EULER",
        num_outputs: 1
      },
    });

    console.log("이미지 생성 요청 완료:", prediction.id);

    // 생성 결과 포맷팅
    const generationResult: IGenerationResult = {
      imageUrl: "", // 아직 이미지가 생성되지 않았으므로 빈 문자열
      generationId: prediction.id, // prediction ID 반환
      prompt: prompt,
      appliedStyles: styleOptions.map(style => ({
        id: style,
        category: "mood", // 기본 카테고리 설정
        name: style,
        value: style
      }))
    };

    return NextResponse.json(generationResult, { status: 201 });
  } catch (error) {
    console.error("이미지 생성 중 오류 발생:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

/**
 * 이미지 생성 상태 확인 API 엔드포인트
 * 
 * @param request GET 요청 객체
 * @returns 예측 상태 또는 에러 응답
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "예측 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // Replicate API를 사용하여 예측 상태 확인
    const prediction = await replicate.predictions.get(id);

    if (prediction?.error) {
      return NextResponse.json(
        { error: getErrorMessage(prediction.error) },
        { status: 500 }
      );
    }

    // 응답 형식화
    const response: Partial<IReplicateResponse> = {
      id: prediction.id,
      status: prediction.status as "starting" | "processing" | "succeeded" | "failed" | "canceled",
      output: prediction.output,
      error: prediction.error as string | null,
      created_at: prediction.created_at,
      started_at: prediction.started_at,
      completed_at: prediction.completed_at,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("예측 상태 확인 중 오류 발생:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
} 
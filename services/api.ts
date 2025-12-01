// FastAPI 백엔드 연동 서비스

// 🔹 API 서버 주소 설정
// - iOS 시뮬레이터: localhost 사용 가능
// - Android 에뮬레이터: 10.0.2.2 사용
// - 실제 기기: 컴퓨터 IP 주소 사용 (예: 192.168.0.10)
const API_BASE_URL = 'http://127.0.0.1:8000';

// 여행 계획 요청 타입
export interface TravelPlanRequest {
  companions: string;      // 동행자
  destination: string;     // 여행지
  start_date: string;      // 시작일
  end_date: string;        // 종료일
  style: string[];         // 여행 스타일
  budget: string;          // 예산
}

// 여행 계획 응답 타입
export interface TravelPlanResponse {
  plan: string;
}

// 피드백 응답 타입
export interface FeedbackResponse {
  reply: string;
}

/**
 * 여행 계획 생성 API
 * POST /travel-plan
 */
export const createTravelPlan = async (data: TravelPlanRequest): Promise<TravelPlanResponse> => {
  const response = await fetch(`${API_BASE_URL}/travel-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

/**
 * 피드백 API (대화형 수정)
 * POST /feedback
 */
export const sendFeedback = async (message: string): Promise<FeedbackResponse> => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

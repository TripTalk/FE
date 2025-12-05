// FastAPI 백엔드 연동 서비스

// 🔹 API 서버 주소 설정
// iOS 시뮬레이터에서는 Mac의 실제 IP를 사용해야 함
// 터미널에서 ipconfig getifaddr en0 으로 IP 확인
// FastAPI: uvicorn AI_Chat:app --host 0.0.0.0 --port 8000 --reload
const API_BASE_URL = 'http://223.194.138.67:8000';

// AI 응답은 시간이 걸리므로 타임아웃을 120초로 설정
const TIMEOUT_MS = 120000;

// 타임아웃이 있는 fetch 함수
const fetchWithTimeout = async (url: string, options: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다. 서버 연결을 확인해주세요.');
    }
    throw error;
  }
};

// 여행 계획 요청 타입
export interface TravelPlanRequest {
  companions: string;      // 동행자
  departure: string;       // 출발지
  destination: string;     // 여행지
  start_date: string;      // 시작일
  end_date: string;        // 종료일
  style: string[];         // 여행 스타일
  budget: string;          // 예산
}

// 여행 요약 정보 타입
export interface TravelSummary {
  id: string;
  title: string;
  destination: string;
  departure: string;
  start_date: string;
  end_date: string;
  companions: string;
  budget: string;
  travel_styles: string[];
  highlights: string[];
}

// 여행 계획 응답 타입
export interface TravelPlanResponse {
  plan: string;
  travel_id: string;
  message: string;
  summary: TravelSummary;
}

// 피드백 응답 타입
export interface FeedbackResponse {
  reply: string;
}

/**
 * 여행 계획 생성 API
 * POST /Travel-Plan
 */
export const createTravelPlan = async (data: TravelPlanRequest): Promise<TravelPlanResponse> => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/Travel-Plan`, {
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
export const sendFeedback = async (message: string): Promise<any> => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Raw API response:', data);
  return data;
};

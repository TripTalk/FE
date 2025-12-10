// FastAPI 백엔드 연동 서비스

// 🔹 API 서버 주소 설정
// 인증 API 서버 (Spring Boot)
const AUTH_API_BASE_URL = 'http://52.78.55.147:8080';
// AI 여행 플래너 API 서버 (FastAPI)
const AI_API_BASE_URL = 'http://52.78.55.147:8000';

// AI 응답은 시간이 걸리므로 타임아웃을 120초로 설정
const TIMEOUT_MS = 120000;

// 일반 API 타임아웃 (30초)
const DEFAULT_TIMEOUT_MS = 30000;

// 타임아웃이 있는 fetch 함수
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = TIMEOUT_MS): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
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

// =====================
// 🔐 인증 관련 API
// =====================

// 회원가입 요청 타입
export interface SignupRequest {
  email: string;
  password: string;
  nickName: string;
}

// 회원가입 응답 타입
export interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    email: string;
    password: string;
    nickName: string;
  };
}

// 이메일 중복 확인 응답 타입
export interface CheckEmailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: boolean; // true: 사용 가능, false: 중복
}

/**
 * 이메일 중복 확인 API
 * GET /api/auth/check-email?email=xxx
 */
export const checkEmailExists = async (email: string): Promise<CheckEmailResponse> => {
  const response = await fetchWithTimeout(
    `${AUTH_API_BASE_URL}/api/auth/check-email?email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    DEFAULT_TIMEOUT_MS
  );

  return await response.json();
};

/**
 * 회원가입 API
 * POST /api/auth/signup
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await fetchWithTimeout(
    `${AUTH_API_BASE_URL}/api/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
    DEFAULT_TIMEOUT_MS
  );

  const responseData = await response.json();
  
  // 에러 응답이더라도 JSON 형태로 반환
  if (!response.ok || !responseData.isSuccess) {
    const error = new Error(responseData.message || `HTTP error! status: ${response.status}`) as any;
    error.code = responseData.code;
    error.response = responseData;
    throw error;
  }

  return responseData;
};

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * 로그인 API
 * POST /api/auth/login
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetchWithTimeout(
    `${AUTH_API_BASE_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
    DEFAULT_TIMEOUT_MS
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// 로그아웃 응답 타입
export interface LogoutResponse {
  isSuccess: boolean;
  code: string;
  message: string;
}

/**
 * 로그아웃 API
 * POST /api/auth/logout
 */
export const logout = async (accessToken: string): Promise<LogoutResponse> => {
  const response = await fetchWithTimeout(
    `${AUTH_API_BASE_URL}/api/auth/logout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    },
    DEFAULT_TIMEOUT_MS
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// 토큰 재발급 요청 타입
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 토큰 재발급 응답 타입
export interface RefreshTokenResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * 토큰 재발급 API
 * POST /api/auth/refresh
 * Refresh Token으로 Access Token을 재발급받습니다.
 */
export const refreshToken = async (refreshTokenValue: string): Promise<RefreshTokenResponse> => {
  const response = await fetchWithTimeout(
    `${AUTH_API_BASE_URL}/api/auth/refresh`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    },
    DEFAULT_TIMEOUT_MS
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// =====================
// 🗺️ 여행 계획 관련 API
// =====================

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
  const response = await fetchWithTimeout(`${AI_API_BASE_URL}/Travel-Plan`, {
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
  const response = await fetchWithTimeout(`${AI_API_BASE_URL}/feedback`, {
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

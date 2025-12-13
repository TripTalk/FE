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
// 👤 사용자 정보 관련 API
// =====================

// 사용자 정보 타입
export interface UserInfo {
  userId: number;
  email: string;
  nickname: string;  // 백엔드는 소문자 nickname 사용
  profileImgUrl?: string | null;
  completedTravelCount: number;
  plannedTravelCount: number;
}

// 마이페이지 응답 타입
export interface UserInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: UserInfo;
}

/**
 * 마이페이지 조회 API
 * GET /api/user/me
 * 현재 로그인한 사용자의 정보를 조회합니다.
 */
export const getUserInfo = async (accessToken: string): Promise<UserInfoResponse> => {
  const response = await fetchWithTimeout(
    `${AUTH_API_BASE_URL}/api/user/me`,
    {
      method: 'GET',
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
  console.log('=== Travel-Plan API 요청 데이터 ===');
  console.log(JSON.stringify(data, null, 2));
  
  const response = await fetchWithTimeout(`${AI_API_BASE_URL}/Travel-Plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('=== Travel-Plan API 오류 ===');
    console.error('Status:', response.status);
    console.error('Error:', JSON.stringify(errorData, null, 2));
    throw new Error(`HTTP error! status: ${response.status}, detail: ${JSON.stringify(errorData)}`);
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

/**
 * 특정 여행 요약 정보 조회 API
 * GET /travel-summary/{travel_id}
 * 특정 여행의 요약 정보를 조회합니다.
 */
export const getTravelSummary = async (travelId: string): Promise<string> => {
  const response = await fetchWithTimeout(
    `${AI_API_BASE_URL}/travel-summary/${encodeURIComponent(travelId)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    DEFAULT_TIMEOUT_MS
  );

  if (!response.ok) {
    if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.[0]?.msg || 'Validation Error');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// =====================
// 🗺️ 여행지 관련 API
// =====================

// 테마 필터 타입
export type TripPlaceTheme = 'NATURE' | 'SEA' | 'CULTURE' | 'HEALING' | 'HISTORY';

// 여행지 정보 타입 (목록용)
export interface TripPlace {
  id: number;
  region: string;
  description: string;
  viewCount: number;
  imgUrl: string;
  themes: TripPlaceTheme[];
}

// 여행지 상세 정보 타입
export interface TripPlaceDetail {
  id: number;
  name: string;
  imageUrls: string[];
  fullDescription: string;
  address: string;
  lat: number;
  lon: number;
  tags: string[];
}

// 여행지 목록 응답 타입
export interface TripPlaceListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    tripPlaceList: TripPlace[];
    tripPlaceListSize: number;
    isFirst: boolean;
    hasNext: boolean;
    nextCursorId: number | null;
  };
}

/**
 * 여행지 목록 조회 API
 * GET /api/trip-place
 * 테마별로 여행지를 커서 기반 무한스크롤로 조회합니다.
 * theme을 비우면 전체 조회됩니다.
 */
export const getTripPlaces = async (
  theme?: TripPlaceTheme,
  cursorId?: number | null,
  accessToken?: string
): Promise<TripPlaceListResponse> => {
  const params = new URLSearchParams();
  if (theme) {
    params.append('theme', theme);
  }
  if (cursorId !== undefined && cursorId !== null) {
    params.append('cursorId', cursorId.toString());
  }
  
  const queryString = params.toString();
  const url = `${AUTH_API_BASE_URL}/api/trip-place${queryString ? `?${queryString}` : ''}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  const response = await fetchWithTimeout(
    url,
    {
      method: 'GET',
      headers,
    },
    DEFAULT_TIMEOUT_MS
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

/**
 * 여행지 상세 조회 API
 * GET /api/trip-place?id={id}
 */
export const getTripPlaceDetail = async (
  id: number,
  accessToken?: string
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: TripPlaceDetail;
}> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  console.log('🔑 API 함수 - accessToken 파라미터:', accessToken ? accessToken.substring(0, 30) + '...' : 'NONE');
  console.log('📤 전송할 헤더:', JSON.stringify(headers, null, 2));
  
  const response = await fetchWithTimeout(
    `${AUTH_API_BASE_URL}/api/trip-place?id=${id}`,
    {
      method: 'GET',
      headers,
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
// ✈️ 항공 관련 API
// =====================

// 항공권 정보 타입
export interface Flight {
  id: number;
  departure: string;
  destination: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imgUrl: string;
  airline?: string;
  departureDate?: string;
  returnDate?: string;
}

// 항공권 목록 응답 타입
export interface FlightListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    flightList: Flight[];
    flightListSize: number;
    isFirst: boolean;
    hasNext: boolean;
    nextCursorId: number | null;
  };
}

/**
 * 항공권 목록 조회 API
 * GET /api/flight
 */
export const getFlights = async (
  cursorId?: number | null,
  accessToken?: string
): Promise<FlightListResponse> => {
  const params = new URLSearchParams();
  if (cursorId !== undefined && cursorId !== null) {
    params.append('cursorId', cursorId.toString());
  }
  
  const queryString = params.toString();
  const url = `${AUTH_API_BASE_URL}/api/flight${queryString ? `?${queryString}` : ''}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetchWithTimeout(
    url,
    {
      method: 'GET',
      headers,
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
// 🏨 숙박 관련 API
// =====================

// 숙박 정보 타입
export interface Accommodation {
  id: number;
  name: string;
  location: string;
  price: number;
  imgUrl: string;
  rating?: number;
  checkIn?: string;
  checkOut?: string;
}

// 숙박 목록 응답 타입
export interface AccommodationListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accommodationList: Accommodation[];
    accommodationListSize: number;
    isFirst: boolean;
    hasNext: boolean;
    nextCursorId: number | null;
  };
}


/**
 * 숙박 목록 조회 API
 * GET /api/accommodation
 */
export const getAccommodations = async (
  cursorId?: number | null,
  accessToken?: string
): Promise<AccommodationListResponse> => {
  const params = new URLSearchParams();
  if (cursorId !== undefined && cursorId !== null) {
    params.append('cursorId', cursorId.toString());
  }
  
  const queryString = params.toString();
  const url = `${AUTH_API_BASE_URL}/api/accommodation${queryString ? `?${queryString}` : ''}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetchWithTimeout(
    url,
    {
      method: 'GET',
      headers,
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
// 💾 여행 계획 저장 API
// =====================

/**
 * 여행 계획 저장 API
 * POST /save-plan/{travel_id}
 * FastAPI가 자동으로 Spring Boot에 저장
 */
export const saveTravelPlan = async (
  travelId: string,
  accessToken?: string
): Promise<any> => {
  console.log('=== 여행 계획 저장 시작 ===');
  console.log('travel_id:', travelId);
  console.log('accessToken:', accessToken ? 'Present' : 'Missing');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetchWithTimeout(
    `${AI_API_BASE_URL}/save-plan/${encodeURIComponent(travelId)}`,
    {
      method: 'POST',
      headers,
    },
    DEFAULT_TIMEOUT_MS
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('저장 실패:', errorData);
    console.error('Status:', response.status);
    
    // 401 Unauthorized 처리
    if (response.status === 401) {
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    
    throw new Error(errorData.detail || errorData.message || `저장 실패: ${response.status}`);
  }

  const result = await response.json();
  console.log('=== 저장 성공 ===');
  console.log('Result:', result);
  
  // FastAPI가 200으로 응답하더라도 실제 결과 확인
  if (result.success === false) {
    console.error('Spring Boot 저장 실패:', result);
    throw new Error(result.error || result.detail || '저장에 실패했습니다.');
  }
  
  return result;
};

// 저장된 여행 계획 목록 조회
export interface SavedTripPlan {
  tripPlanId: number;
  title: string;
  destination: string;
  departure: string;
  startDate: string;
  endDate: string;
  companions: string;
  budget: string;
  travelStyles: string[];
  imageUrl?: string;
}

export interface SavedTripPlansResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    tripPlanList: SavedTripPlan[];
  };
}

/**
 * 저장된 여행 계획 목록 조회 API
 * GET /api/trip-plan/archive
 */
export const getSavedTripPlans = async (
  accessToken?: string
): Promise<SavedTripPlansResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  console.log('=== 저장된 여행 계획 목록 조회 ===');
  
  const response = await fetchWithTimeout(
    `${AUTH_API_BASE_URL}/api/trip-plan/archive`,
    {
      method: 'GET',
      headers,
    },
    DEFAULT_TIMEOUT_MS
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log('목록 조회 실패:', errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

/**
 * 여행 완료 상태 변경 API
 * PATCH /api/trip-plan/{tripPlanId}/traveled
 * 여행 계획의 완료 상태를 토글합니다.
 */
export const toggleTravelCompleted = async (
  tripPlanId: number,
  accessToken: string
): Promise<{ isSuccess: boolean; code: string; message: string }> => {
  console.log('=== 여행 완료 상태 변경 ===');
  console.log('tripPlanId:', tripPlanId);
  
  const response = await fetchWithTimeout(
    `${AUTH_API_BASE_URL}/api/trip-plan/${tripPlanId}/traveled`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    },
    DEFAULT_TIMEOUT_MS
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log('상태 변경 실패:', errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log('상태 변경 성공:', result);
  return result;
};



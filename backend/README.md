# TripTalk Backend API

AI 여행 플래너 백엔드 서버입니다.

## 🚀 실행 방법

### 1. Python 가상환경 생성 (권장)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
```

### 2. 패키지 설치

```bash
pip install -r requirements.txt
```

### 3. API 키 설정

`.env` 파일을 열고 Google Gemini API 키를 입력하세요:

```
GOOGLE_API_KEY=your_actual_api_key
```

API 키 발급: https://makersuite.google.com/app/apikey

### 4. 서버 실행

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. API 문서 확인

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📡 API 엔드포인트

| Method | Endpoint       | 설명             |
| ------ | -------------- | ---------------- |
| GET    | `/`            | 헬스체크         |
| POST   | `/travel-plan` | 여행 일정 생성   |
| POST   | `/feedback`    | 대화형 피드백    |
| POST   | `/reset-chat`  | 대화 기록 초기화 |

## 📱 React Native 연동

`app/ai-chat/chat.tsx`에서 API_BASE_URL을 설정하세요:

```typescript
// 로컬 테스트
const API_BASE_URL = 'http://localhost:8000';

// 실제 기기 테스트 (Mac IP 주소 확인: ifconfig)
const API_BASE_URL = 'http://192.168.x.x:8000';
```

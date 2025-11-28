from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

# 🔹 환경 변수 로드
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# 🔹 FastAPI 앱 생성
app = FastAPI(title="TripTalk AI API")

# 🔹 CORS 설정 (React Native에서 접근 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 origin 허용 (개발용)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 사용자 입력 데이터 구조 정의
class TravelInput(BaseModel):
    companions: str
    destination: str
    start_date: str
    end_date: str
    style: list[str]
    budget: str

# 🔹 1️⃣ 여행 계획 자동 생성 API
@app.post("/travel-plan")
async def create_travel_plan(data: TravelInput):
    prompt = f"""
    다음 정보를 기반으로 여행 일정을 만들어줘.

    - 여행지: {data.destination}
    - 동행자: {data.companions}
    - 여행 기간: {data.start_date} ~ {data.end_date}
    - 여행 스타일: {', '.join(data.style)}
    - 예산: {data.budget}

    요청 조건:
    1. 일자별(1일차, 2일차...) 일정으로 구성
    2. 오전/오후/저녁 단위로 나누고 짧은 설명을 추가
    3. 여행지의 주요 관광지나 맛집 위주로 추천
    4. 한국어로 작성
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return {"plan": response.text}


# 🔹 2️⃣ 피드백(대화형 수정) 기능
chat_history = []  # 대화 저장용 리스트

class FeedbackInput(BaseModel):
    message: str

@app.post("/feedback")
async def feedback(data: FeedbackInput):
    """
    사용자의 피드백 메시지를 받아서 AI가 기존 대화 내용을 기반으로 수정/답변함.
    """
    chat_history.append({"role": "user", "parts": [data.message]})

    model = genai.GenerativeModel("gemini-1.5-flash")

    # 이전 대화 내용 포함해서 전달
    response = model.generate_content(contents=chat_history)

    reply = response.text
    chat_history.append({"role": "model", "parts": [reply]})

    return {"reply": reply}


# 🔹 대화 기록 초기화 API
@app.post("/reset-chat")
async def reset_chat():
    """대화 기록을 초기화합니다."""
    global chat_history
    chat_history = []
    return {"message": "대화 기록이 초기화되었습니다."}


# 🔹 헬스체크 API
@app.get("/")
async def health_check():
    return {"status": "ok", "message": "TripTalk AI API is running!"}

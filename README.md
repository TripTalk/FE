# 🌍 TripTalk

**여행 계획과 추억을 공유하는 모바일 앱**

안녕하세요.
TripTalk는 React Native와 Expo Router로 개발된 여행 관리 및 공유 플랫폼입니다. 사용자가 여행 계획을 세우고, 완료된 여행을 관리하며, 친구들과 여행 정보를 공유할 수 있는 종합 여행 앱입니다.

## ✨ 주요 기능

### 📱 **홈 화면**

- 여행 추천 카드 및 배너
- 인기 여행지 소개 (제주도, 부산, 파리, 뉴욕 등)
- 카테고리별 여행 상품 탐색

### 📁 **저장소**

- **계획 완료**: 예정된 여행 목록 관리
- **여행 완료**: 완료된 여행 기록 보관
- 여행 카드 형태의 직관적인 UI
- 상세보기를 통한 일정 및 가격 정보 확인

### 👤 **마이페이지**

- 개인 프로필 관리
- 여행 통계 (완료한 여행, 계획 중인 여행, 적립 포인트)
- 뱃지 시스템 (첫 여행, 시간 마니아, 한번가 등)
- 계정 설정 및 개인정보 변경

### 🔄 **여행 상세 화면**

- 날짜별 상세 일정 표시
- 가격 정보 (항공료, 숙박비, 식비 등)
- 여행 하이라이트 및 추천 포인트
- 소셜 공유 기능

### 📤 **공유 기능**

- 메시지로 공유하기
- 링크 공유하기
- 카카오톡으로 공유
- 여행 정보 미리보기 카드

## 🛠️ 기술 스택

- **Frontend**: React Native
- **라우팅**: Expo Router v6 (파일 기반 라우팅)
- **언어**: TypeScript
- **UI/UX**: SafeAreaView, Custom Themed Components
- **상태 관리**: React Hooks (useState)
- **이미지**: Expo Image, Unsplash API
- **아이콘**: Expo Vector Icons (Material Icons)

## 📂 프로젝트 구조

```
TripTalk/
├── app/                          # 앱 라우팅 및 화면
│   ├── (tabs)/                   # 탭 네비게이션
│   │   ├── index.tsx            # 홈 화면
│   │   ├── explore.tsx          # 저장소 화면
│   │   ├── Mypage.tsx           # 마이페이지 화면
│   │   └── _layout.tsx          # 탭 레이아웃
│   ├── travel/
│   │   └── [id].tsx             # 동적 여행 상세 화면
│   ├── _layout.tsx              # 루트 레이아웃
│   └── modal.tsx                # 모달 화면
├── components/                   # 재사용 컴포넌트
│   ├── home/                    # 홈 관련 컴포넌트
│   ├── repository/              # 저장소 관련 컴포넌트
│   │   ├── TabSelector.tsx      # 탭 선택기
│   │   ├── TravelCard.tsx       # 여행 카드
│   │   ├── TravelDetailHeader.tsx # 상세 헤더
│   │   ├── DaySchedule.tsx      # 일정 컴포넌트
│   │   ├── PriceInfo.tsx        # 가격 정보
│   │   └── ShareModal.tsx       # 공유 모달
│   ├── mypage/                  # 마이페이지 관련 컴포넌트
│   └── shared/                  # 공통 컴포넌트
│       ├── themed-text.tsx      # 테마 텍스트
│       ├── themed-view.tsx      # 테마 뷰
│       └── ui/                  # UI 컴포넌트
├── constants/                   # 상수 정의
├── hooks/                       # 커스텀 훅
└── assets/                      # 이미지 및 정적 파일
```

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone https://github.com/TripTalk/FE.git
cd TripTalk
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 시작

```bash
npx expo start
```

### 4. 앱 실행 옵션

실행 후 다음 옵션들을 선택할 수 있습니다:

- **i**: iOS 시뮬레이터에서 열기
- **a**: Android 에뮬레이터에서 열기
- **w**: 웹 브라우저에서 열기
- **r**: 앱 새로고침
- **m**: 개발자 메뉴 토글

## 📋 주요 스크립트

```bash
# 개발 서버 시작
npm start

# 캐시 클리어 후 시작
npx expo start --clear

# TypeScript 타입 체크
npx tsc --noEmit

# 프로젝트 리셋 (초기 상태로)
npm run reset-project
```

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: #4ECDC4 (터코이즈)
- **Background**: #F8F9FA (라이트 그레이)
- **Text Primary**: #333333
- **Text Secondary**: #666666
- **Card Background**: #FFFFFF

### 컴포넌트 스타일

- **Border Radius**: 12px (카드), 16px (배너)
- **Shadow**: elevation 3-4, shadowOpacity 0.1
- **Typography**: 시스템 폰트, 14-24px 범위

## 🔧 개발 가이드

### 새로운 화면 추가

1. `app/` 폴더에 새 파일 생성
2. Expo Router의 파일 기반 라우팅 활용
3. `SafeAreaView`로 안전 영역 처리

### 새로운 컴포넌트 추가

1. 적절한 `components/` 하위 폴더에 생성
2. TypeScript 인터페이스 정의
3. `ThemedText`, `ThemedView` 활용 권장

### 라우팅 구조

```typescript
// 기본 라우팅
router.push('/travel/123');

// 탭 네비게이션
router.push('/(tabs)/explore');

// 모달
router.push('/modal');
```

## 🐛 문제 해결

### Hot Reload가 작동하지 않을 때

```bash
npx expo start --clear
```

### 모듈을 찾을 수 없다는 오류

```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### iOS 시뮬레이터 연결 문제

1. Xcode가 최신 버전인지 확인
2. iOS 시뮬레이터가 실행 중인지 확인
3. 터미널에서 `i` 키 다시 입력

## 📱 지원 플랫폼

- **iOS**: 13.0 이상
- **Android**: API 21 (Android 5.0) 이상
- **Web**: 모던 브라우저 지원

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 GitHub Issues를 통해 연락해주세요.

---

**TripTalk** - 여행의 시작부터 끝까지, 함께하는 여행 동반자 🌟

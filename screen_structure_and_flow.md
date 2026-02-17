# 화면 구조 및 흐름 문서

이 문서는 `GABOJAGO` 프로젝트의 화면 구조와 라우팅 흐름을 상세하게 설명합니다.

## 1. 프로젝트 구조 개요

이 프로젝트는 기능(Feature) 단위로 디렉토리가 구성되어 있어, 각 화면과 관련된 로직이 `src/features` 아래에 모듈화되어 있습니다.

### 주요 디렉토리 구조 (`src/features`)

- **auth/**: 인증 관련 화면 (로그인, 회원가입)
- **onboarding/**: 앱 실행 시 초기 흐름 및 여행 생성 설문 (Splash, Intro, 설문 단계)
- **dashboard/**: 메인 홈 화면
- **trip/**: 여행 목록, 여행 생성 결과, 지도 보기 등
- **trip-detail/**: 특정 여행의 상세 정보, 카메라 기능
- **place/**: 장소 상세 정보

---

## 2. 화면 흐름 (User Flow)

앱의 전체적인 화면 흐름은 다음과 같습니다.

### 2.1. 진입 및 온보딩 (Entry & Onboarding)

1.  **Splash Screen** (`/splash`)
    - 앱 실행 시 가장 먼저 표시됩니다.
    - 로그인 여부를 확인하여 분기 처리합니다.
      - 로그인 됨 -> **Home Dashboard** (`/home`)로 이동
      - 로그인 안됨 -> **Intro (Guest Landing)** (`/intro`)로 이동

2.  **Intro / Guest Landing** (`/intro`)
    - 게스트 사용자에게 보여지는 첫 화면입니다.
    - "AI 여행 일정 생성하기" 선택 시 온보딩 설문(`onboarding/...`) 시작
    - 기존 사용자 로그인은 별도 경로(`Login`)로 접근 가능할 것으로 예상

3.  **Onboarding (여행 생성 설문)** (`/onboarding/...`)
    - 여행 일정을 생성하기 위한 단계별 설문입니다.
    - `LocationInput` (여행지) -> `AccommodationSearch` (숙소) -> `DateSelection` (날짜) -> `CompanionSelection` (동행) -> `PeopleCount` (인원) -> `TransportSelection` (교통) -> `TravelStyle` (스타일) -> `BudgetInput` (예산)
    - 모든 입력 완료 -> `GenerateLoading` (생성 중) -> `Result` (생성 완료)

### 2.2. 메인 서비스 (Main Service)

4.  **Home Dashboard** (`/home`)
    - 로그인한 사용자의 메인 화면입니다.
    - **현재 진행 중인 여행**: 가장 상단에 크게 카드 형태로 표시 (잔여 예산, 바로가기 버튼 포함)
    - **다가오는 일정**: 하단에 리스트 형태로 표시
    - **AI 일정 생성**: 헤더의 `+` 버튼으로 새로운 여행 생성 가능

5.  **Trip List** (`/trips`)
    - 나의 모든 여행 일정을 확인하는 목록 화면입니다.
    - '여정'(예정된 여행)과 '기록'(지난 여행) 탭으로 구분됩니다.

### 2.3. 여행 상세 (Trip Detail)

6.  **Trip Detail Page** (`/trips/:tripId`)
    - 특정 여행의 상세 정보를 보여줍니다.
    - **지도(Map)**: 배경에 전체 일정을 지도로 표시
    - **BottomSheet**: 하단에서 끌어올려 상세 정보를 확인
      - **일정(Schedule)**: 일자별(`1일차`, `2일차`...) 코스 및 타임라인
      - **예산(Budget)**: 예산 지출 내역 (준비 중)
      - **준비물(Checklist)**: 체크리스트 (준비 중)
      - **동행자(Companion)**: 동행 관리 (준비 중)
    - **Floating Actions**: 카메라(사진/영수증) 촬영 버튼

7.  **Camera** (`/trips/:tripId/camera/:mode`)
    - 여행 중 사진 촬영 또는 영수증 스캔을 위한 카메라 화면입니다.
    - 모드(`mode`): `photo` (일반 촬영) / `receipt` (영수증 스캔)

---

## 3. 라우팅 구성 상세 (`App.jsx`)

| 경로 (Path)                   | 컴포넌트 (Component) | 설명                         |
| :---------------------------- | :------------------- | :--------------------------- |
| `/`, `/splash`                | `Splash`             | 초기 로딩 및 로그인 체크     |
| `/intro`                      | `OnboardingHome`     | 비로그인 유저 랜딩 페이지    |
| `/home`                       | `HomeDashboard`      | 메인 대시보드                |
| `/onboarding/*`               | (Various)            | 여행 생성 설문 단계별 페이지 |
| `/trips`                      | `TripsListPage`      | 전체 여행 목록               |
| `/trips/:tripId`              | `TripDetailPage`     | 여행 상세 및 지도 보기       |
| `/trips/:tripId/camera/:mode` | `TravelCameraPage`   | 카메라 촬영 (사진/영수증)    |
| `/login`, `/signup`           | `Login`, `Signup`    | 로그인 및 회원가입           |

## 4. 주요 컴포넌트 상세 설명

### `HomeDashboard.jsx`

- 사용자의 관문 역할을 하며, 가장 중요한 정보인 '현재 여행'을 최상단 `PrimaryTripCard`로 강조합니다.
- 사진 등록, 영수증 등록, 지도 보기 등의 빠른 액션(`QuickActionButton`)을 제공하여 사용자 편의성을 높였습니다.

### `TripDetailPage.jsx`

- 지도가 배경 전면에 깔려있고(`Full Screen Map`), 그 위에 일정 정보가 담긴 `BottomSheet`가 올라오는 구조입니다.
- `BottomSheet`는 스냅 포인트(높이 조절)를 가지고 있어 지도를 넓게 보거나 일정을 자세히 보는 인터랙션이 가능합니다.
- 일자별 탭(`DetailTabs`)을 통해 N일차 일정을 쉽게 전환할 수 있습니다.

### `OnboardingHome.jsx`

- 로그인 상태에 따라 다른 뷰를 제공합니다.
  - **Guest**: 서비스 소개 및 AI 일정 생성 유도
  - **User**: 사용자 이름 환영 메시지 및 내 여행 요약 표시

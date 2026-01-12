# Learning Scheduler

학습 계획과 실행을 시각적으로 관리하는 타임라인 기반 웹 애플리케이션

## 📋 프로젝트 개요

Learning Scheduler는 하루 단위로 학습 계획을 세우고 실행 기록을 타임라인으로 관리하는 애플리케이션입니다.
Plan(계획)과 Execution(실행)을 분리하여 계획 대비 실행 결과를 시각적으로 비교할 수 있습니다.

## 🛠 기술 스택

### Frontend
- **React.js 18** + **TypeScript**
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **React Router** - 라우팅

### 아키텍처
- **Feature-Sliced Design (FSD)** - 확장 가능한 모듈형 아키텍처

## 📁 프로젝트 구조

```
src/
├─ app/                 # 앱 초기화 및 Provider
│   ├─ providers/       # Theme, Settings Provider
│   ├─ routes/          # 라우팅 설정
│   └─ App.tsx
│
├─ pages/               # 페이지 컴포넌트
│   └─ DayTimelinePage/ # 하루 타임라인 화면
│
├─ widgets/             # 복합 UI 컴포넌트
│   └─ Timeline/        # 타임라인 위젯
│
├─ features/            # 기능 모듈
│   ├─ plan/            # 계획 관련
│   ├─ execution/       # 실행 관련
│   └─ schedule-edit/   # 드래그/리사이즈 등 편집 기능
│
├─ entities/            # 비즈니스 엔티티
│   ├─ subject/         # 과목
│   └─ date-event/      # 대표 일정
│
└─ shared/              # 공통 모듈
    ├─ ui/              # 공통 UI 컴포넌트
    ├─ lib/             # 유틸리티 함수
    └─ types/           # 공통 타입 정의
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 빌드

```bash
npm run build
```

### 4. 빌드 미리보기

```bash
npm run preview
```

## 🎯 주요 기능

### 현재 구현
- ✅ Feature-Sliced Design 아키텍처 기반 폴더 구조
- ✅ 타임라인 그리드 (24시간, 30분 단위)
- ✅ Plan/Execution 2열 구조
- ✅ Theme Provider (다크/라이트 모드 지원)
- ✅ Settings Provider (스냅 설정 등)
- ✅ 시간 계산 유틸리티
- ✅ 겹침 계산 유틸리티
- ✅ Mock 데이터 구조

### 향후 구현 예정
- ⬜ 드래그로 계획 생성
- ⬜ 드래그로 일정 이동
- ⬜ 리사이즈로 시간 조정
- ⬜ 30분 단위 스냅 기능
- ⬜ 겹침 시각화
- ⬜ 과목별 색상 표시
- ⬜ 주/월 단위 요약
- ⬜ 달성률 분석

## 📐 설계 원칙

1. **관심사 분리**: FSD 아키텍처로 계층별 명확한 역할 구분
2. **타입 안정성**: TypeScript로 컴파일 타임 에러 방지
3. **재사용성**: shared/lib에 공통 로직 집중
4. **확장성**: 기능별 독립적인 모듈 구조

## 🎨 UI/UX 특징

- Tailwind CSS 기반 모던한 디자인
- 반응형 레이아웃
- 직관적인 타임라인 인터페이스
- 과목별 색상 구분
- WebView 호환 (향후 모바일 앱 지원)

## 📝 Mock 데이터

초기 개발 단계에서는 `public/mock/data.json` 파일의 목업 데이터를 사용합니다.
향후 FastAPI 백엔드와 연동 시 동일한 데이터 구조를 유지합니다.

## 🔧 개발 가이드

### Path Alias 사용

```typescript
import { Button } from '@/shared/ui';
import { timeToPixel } from '@/shared/lib';
import { Plan } from '@/features/plan';
```

### 컴포넌트 작성 규칙

- 함수형 컴포넌트 사용
- Props는 인터페이스로 정의
- Tailwind CSS 클래스 사용 (인라인 스타일 지양)
- 비즈니스 로직은 커스텀 훅으로 분리

### 커밋 컨벤션

- `feat:` 새로운 기능
- `fix:` 버그 수정
- `refactor:` 리팩토링
- `style:` 스타일 변경
- `docs:` 문서 수정
- `test:` 테스트 추가/수정

## 📄 라이선스

MIT License

## 👥 기여

이슈와 PR은 언제나 환영합니다!

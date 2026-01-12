TRD (Technical Requirements Document)

1. 기술 스택

Frontend
	•	React.js
	•	TypeScript
  • tailwind CSS
	•	모바일: React Native + WebView

Backend (Optional)
	•	Python
	•	FastAPI
	•	초기: JSON Mock

⸻

2. 프론트엔드 폴더 구조 (주석 포함)

src/
 ├─ app/
 │   ├─ providers/        # 전역 Provider (theme, settings, snap 옵션 등)
 │   └─ routes/           # 라우팅 정의
 │
 ├─ pages/
 │   └─ DayTimelinePage/  # 하루 단위 타임라인 화면
 │       ├─ DayTimelinePage.tsx
 │       ├─ Header.tsx    # 날짜, 대표 일정, 총 시간 표시
 │       └─ styles.ts
 │
 ├─ widgets/
 │   └─ Timeline/         # 타임라인 핵심 UI
 │       ├─ Timeline.tsx
 │       ├─ Column.tsx    # Plan / Execution 컬럼
 │       ├─ Grid.tsx      # 시간 / 30분 그리드
 │       └─ DragLayer.tsx # 드래그 중 UI 처리
 │
 ├─ features/
 │   ├─ plan/             # 계획 관련 기능
 │   │   ├─ PlanBlock.tsx
 │   │   └─ plan.model.ts
 │   │
 │   ├─ execution/        # 실행 관련 기능
 │   │   ├─ ExecutionBlock.tsx
 │   │   └─ execution.model.ts
 │   │
 │   └─ schedule-edit/    # 드래그/리사이즈 로직
 │       ├─ useCreate.ts
 │       ├─ useMove.ts
 │       ├─ useResize.ts
 │       └─ useSnap.ts
 │
 ├─ entities/
 │   ├─ subject/          # 과목 엔티티
 │   └─ date-event/       # 대표 일정
 │
 ├─ shared/
 │   ├─ ui/               # 공통 UI 컴포넌트
 │   ├─ lib/              # 시간 계산, 겹침 계산
 │   └─ types/            # 공통 타입


⸻

3. 백엔드 폴더 구조 (FastAPI 기준)

backend/
 ├─ app/
 │   ├─ main.py           # FastAPI 엔트리포인트
 │   ├─ api/              # API 라우터
 │   │   ├─ plans.py
 │   │   ├─ executions.py
 │   │   └─ date_events.py
 │   │
 │   ├─ models/           # 데이터 모델
 │   │   ├─ plan.py
 │   │   ├─ execution.py
 │   │   └─ subject.py
 │   │
 │   ├─ services/         # 비즈니스 로직
 │   │   └─ achievement.py
 │   │
 │   └─ schemas/          # Request / Response 스키마
 │
 └─ mock/
     └─ data.json         # 초기 JSON 목업 데이터


⸻

4. 핵심 기술 포인트
	•	시간 계산 로직은 shared/lib로 분리
	•	겹침 계산은 프론트 단독 처리 가능
	•	JSON Mock ↔ API Response 구조 동일 유지
	•	WebView 환경에서 스와이프 / 드래그 충돌 방지 처리 필요

⸻

5. 확장 고려 사항
	•	주/월 단위 요약
	•	실행 패턴 분석
	•	달성률 히트맵
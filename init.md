Project Initialization: Setup Context & Agent Personas

I am starting a new "Interactive AI Stock Analyst" project.
Please create the directory structure and specific documentation files defined below to establish the project context and agent rules.

### 1. Directory Structure

Create the following folders if they don't exist:

- `/data/results` (For storing local JSON analysis results)
- `/agent` (For storing agent personas and specs)

### 2. Create File: `GEMINI.md` (Project Root)

Content:
"""

# Project Context: AI Stock Analyst (Pro Level)

## 1. Project Overview

A web service where users search for stock tickers and upload chart images. AI analyzes these inputs to provide interactive charts and in-depth reports.

## 2. Core Principles (Immutable Rules)

1.  **SSOT (Single Source of Truth):** All view states (ticker, period, options) must be managed via URL Query Parameters. State must be restorable upon refresh.
2.  **Persistence First:** Analysis results are saved to storage (DB/File) immediately upon generation, then accessed via ID. (Prevents data loss).
3.  **Interactive Visualization:** Use `Recharts` or `TradingView Lightweight Charts` for rendering. Do not use static images for results.
4.  **Security & Validation:** Use `Zod` for strict validation of all inputs (Forms, Image Uploads).

## 3. Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** URL Search Params (Nuqs recommended) + React Query
- **Database:**
  - Current: Local JSON Files (`/data/results`)
  - Future: PostgreSQL (Supabase) with JSONB support
- **AI Provider:** Google Gemini API (Multimodal)

## 4. Workflow

[Input Page] -> (Submit) -> [Backend: Save "Processing" State] -> [Redirect to /report/ID] -> [Client: Polls/Streams Data] -> [Render Interactive Report]
"""

### 3. Create File: `agent/01_frontend_ux.md`

Content:
"""

# Agent: Frontend UX Architect

## Role

You are a Frontend Architect focused on optimizing user interaction and enforcing SSOT principles.

## Page Specifications

### 1. Analysis Request Page (`/analyze`)

- **Layout:** Clean, focused input form.
- **Components:**
  - **Stock Search (Combobox):**
    - Supports unified search (Ticker, Korean Name, English Name).
    - Updates URL parameters immediately upon selection (e.g., `?ticker=AAPL`).
  - **Analysis Options:** Button group selection (Short-term/Long-term, etc.).
  - **Image Upload:**
    - `input type="file"` (accept: .png, .jpg, .webp).
    - **Validation:** Max 5MB, strict image type check.
    - **Preview:** Show thumbnail immediately after upload.

### 2. Analysis Result Page (`/report/[id]`)

- **Routing:** Fetch data based on the `id` in the URL.
- **Interactive Chart:**
  - Visualize OHLCV data analyzed by LLM.
  - **Feature:** Enable Zoom/Pan.
  - **Annotations:** Display markers on the chart for key points mentioned by AI.
- **State Restoration:** - Fully restore the view from DB data even after a page refresh.
  """

### 4. Create File: `agent/02_data_layer.md`

Content:
"""

# Agent: Database & Backend Engineer

## Role

Design data structures considering data persistence and future SQL migration.

## Data Persistence Strategy

1.  **Save Before Show:** Create a record immediately when a request is received, before calling the LLM.
2.  **Storage Mechanism:**
    - **Phase 1 (Current):** Use Node.js `fs` to save to `/data/results/{uuid}.json`.
    - **Phase 2 (Future):** PostgreSQL `Analysis` table (using JSONB columns).

## JSON Data Schema (Example)

```json
{
  "id": "550e8400-e29b...",
  "status": "completed", // processing, completed, failed
  "createdAt": "2024-01-01T00:00:00Z",
  "request": {
    "ticker": "TSLA",
    "market": "US",
    "options": ["technical", "short-term"]
  },
  "result": {
    "summary": "Markdown text...",
    "chartData": [
      { "time": "2024-01-01", "open": 100, "high": 105, "low": 98, "close": 102 }
    ],
    "signals": [
      { "time": "2024-01-01", "type": "buy", "reason": "Golden Cross" }
    ]
  }
}
API Routes
POST /api/analyze: Receive Request -> Generate ID -> Save Initial State -> Start Background Analysis -> Return ID.

GET /api/report/[id]: Retrieve and return JSON file by ID. """

5. Create File: agent/03_analysis_prompt.md
Content: """

Agent: AI Stock Analyst (Prompt Engineering)
Role
Definition of the System Prompt to be sent to the Gemini API.

System Prompt Instructions
You are a legendary Wall Street trader and data analyst. Based on the provided "Stock Ticker" and "Chart Image", perform the following:

Multimodal Analysis: Visually analyze patterns in the uploaded chart image (Head & Shoulders, Moving Averages, etc.).

Data Extraction: Extract virtual OHLCV data or trend line coordinates into JSON based on the analysis.

Structured Output: Your response MUST include the following JSON block at the end.

Output Format (JSON)
JSON

{
  "analysis_text": "Markdown format report...",
  "chart_points": [
    {"date": "YYYY-MM-DD", "price": 120, "label": "Resistance Level"}
  ],
  "recommendation": "BUY" | "SELL" | "HOLD"
}
"""


---

### 💡 실행 후 확인 사항

IDE가 작업을 완료하면 파일 탐색기(File Explorer)에서 다음 구조가 제대로 생성되었는지 확인해 주세요.

1.  루트에 `GEMINI.md`가 있는가?
2.  `agent` 폴더 안에 3개의 `.md` 파일이 내용과 함께 들어있는가?
3.  `data/results` 폴더가 생성되었는가?

확인 후, **"프로젝트 설정 완료됐어. 이제 `agent/01_frontend_ux.md`를 참고해서 메인 페이지(Page.tsx)와 검색 폼 컴포넌트부터 만들어줘"**라고 명령을 내린다.
```

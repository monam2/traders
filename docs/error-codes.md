# 커스텀 에러 코드 정의

## 형식

```
5자리: XYYYZ

X  = HTTP 상태 앞자리 (2, 4, 5)
YY = 도메인 코드
Z  = 세부 코드
```

## 도메인

| 코드 | 도메인 |
| ---- | ------ |
| 00   | 공통   |
| 01   | 인증   |
| 02   | 분석   |
| 03   | 리포트 |

---

## 에러 코드 표

### 2XXXX - 성공

| 코드  | 의미          |
| ----- | ------------- |
| 20000 | 성공          |
| 20001 | 생성 성공     |
| 20002 | 업데이트 성공 |
| 20003 | 삭제 성공     |

### 4XXXX - 클라이언트 에러

#### 공통 (400XX)

| 코드  | 의미               |
| ----- | ------------------ |
| 40000 | 잘못된 요청        |
| 40001 | 필수 필드 누락     |
| 40002 | 유효하지 않은 형식 |

#### 인증 (401XX)

| 코드  | 의미             |
| ----- | ---------------- |
| 40100 | 인증 필요        |
| 40101 | 토큰 만료        |
| 40102 | 권한 없음        |
| 40103 | 일일 사용량 초과 |

#### 분석 (402XX)

| 코드  | 의미                      |
| ----- | ------------------------- |
| 40200 | 분석 요청 실패            |
| 40201 | 티커 형식 오류            |
| 40202 | 지원하지 않는 이미지 형식 |
| 40203 | 분석 불가 콘텐츠          |
| 40204 | 이미지 크기 초과          |

#### 리포트 (403XX)

| 코드  | 의미                  |
| ----- | --------------------- |
| 40300 | 리포트 조회 실패      |
| 40301 | 리포트 없음           |
| 40302 | 리포트 접근 권한 없음 |

### 5XXXX - 서버 에러

#### 공통 (500XX)

| 코드  | 의미              |
| ----- | ----------------- |
| 50000 | 내부 서버 오류    |
| 50001 | 데이터베이스 오류 |

#### 분석 (502XX)

| 코드  | 의미            |
| ----- | --------------- |
| 50200 | 분석 처리 실패  |
| 50201 | Gemini API 오류 |
| 50202 | API 할당량 초과 |
| 50203 | 응답 파싱 실패  |
| 50204 | 스트리밍 오류   |

---

## 응답 형식

### 성공

```json
{
  "code": 20000,
  "message": "Success",
  "data": { ... }
}
```

### 에러

```json
{
  "code": 40201,
  "message": "티커 형식이 올바르지 않습니다. 예: AAPL, 005930",
  "data": null
}
```

---

## 사용 예시

### API Route

```typescript
export async function POST(req: Request) {
  try {
    const result = await analyze(data);
    return Response.json({ code: 20000, message: "Success", data: result });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        { code: 40201, message: error.message, data: null },
        { status: 400 },
      );
    }
    return Response.json(
      { code: 50000, message: "Internal Error", data: null },
      { status: 500 },
    );
  }
}
```

### 클라이언트

```typescript
const response = await api.analyze(data);

if (response.code === 20000) {
  // 성공 처리
} else if (response.code === 40103) {
  // 일일 사용량 초과 → API 키 등록 안내
} else {
  // 에러 표시
}
```

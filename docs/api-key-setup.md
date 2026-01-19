# API 키 설정 가이드

## 하이브리드 전략

### 개요

| 타입 | 키        | 제한        |
| ---- | --------- | ----------- |
| 기본 | 서버 키   | 3회/일/계정 |
| BYOK | 사용자 키 | 무제한      |

### 남용 방지

| 방법                | 제한          |
| ------------------- | ------------- |
| IP 제한             | 5회/일/IP     |
| 디바이스 핑거프린트 | 브라우저 식별 |

## 서버 키 설정

### 환경 변수

```env
GEMINI_API_KEY=your_server_key
```

### 사용량 추적

```typescript
// 일일 사용량 테이블
interface DailyUsage {
  userId: string;
  ipAddress: string;
  date: string;
  count: number;
}
```

## 사용자 키 (BYOK)

### 암호화 저장

```typescript
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET = process.env.ENCRYPTION_SECRET!;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET, "hex"),
    iv,
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(":");

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET, "hex"),
    Buffer.from(ivHex, "hex"),
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
```

### 키 검증

```typescript
async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 간단한 테스트 요청
    await model.generateContent("test");
    return true;
  } catch {
    return false;
  }
}
```

## UI 플로우

### 설정 모달

1. 설정 아이콘 클릭
2. API 키 입력 필드
3. "테스트" 버튼 → 유효성 확인
4. "저장" 버튼 → 암호화 후 DB 저장

### 상태 표시

```
✅ 내 API 키 사용 중 (무제한)
⚠️ 서버 키 사용 중 (오늘 3회 중 1회 사용)
```

## Supabase 테이블

```sql
create table user_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  encrypted_key text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table user_api_keys enable row level security;

create policy "Users can manage own keys"
  on user_api_keys
  for all
  using (auth.uid() = user_id);
```

## 환경 변수

```env
# 서버 키
GEMINI_API_KEY=xxx

# 암호화 시크릿 (32바이트 = 64 hex)
ENCRYPTION_SECRET=your_64_char_hex_string
```

시크릿 생성:

```bash
openssl rand -hex 32
```

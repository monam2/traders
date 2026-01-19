---
name: i18n
description: 다국어 지원 스킬 (한국어, 영어)
---

# 다국어 (i18n) 스킬

## 지원 언어

| 언어   | 코드 |
| ------ | ---- |
| 한국어 | ko   |
| 영어   | en   |

## 라이브러리

```bash
pnpm add next-intl
```

## 설정

### 디렉토리 구조

```
messages/
├── ko.json
└── en.json
```

### 메시지 예시

```json
// messages/ko.json
{
  "common": {
    "login": "로그인",
    "logout": "로그아웃"
  },
  "analyze": {
    "title": "종목 분석",
    "placeholder": "종목명 또는 티커를 입력하세요"
  }
}
```

### 사용법

```tsx
import { useTranslations } from "next-intl";

function AnalyzePage() {
  const t = useTranslations("analyze");

  return (
    <h1>{t("title")}</h1> // "종목 분석"
  );
}
```

## 언어 전환

```tsx
// 헤더에서 언어 전환
<select onChange={(e) => setLocale(e.target.value)}>
  <option value="ko">한국어</option>
  <option value="en">English</option>
</select>
```

## 체크리스트

- [ ] next-intl 설정
- [ ] 메시지 파일 작성 (ko, en)
- [ ] 헤더에 언어 전환 추가
- [ ] 모든 텍스트 키로 변환

---
description: 개발 서버 실행
---

# 개발 서버 실행

// turbo-all

1. 의존성 설치

```bash
pnpm install
```

2. 환경 변수 설정

```bash
cp .env.example .env.local
# .env.local 파일에 필요한 값 입력
```

3. 개발 서버 시작

```bash
pnpm dev
```

4. Storybook 시작 (선택)

```bash
pnpm storybook
```

---
name: Storybook
description: 컴포넌트 문서화 및 UI 개발 스킬
---

# Storybook 스킬

## 설치

```bash
npx storybook@latest init
```

## 실행

```bash
pnpm storybook
# http://localhost:6006
```

## 스토리 작성

### 기본 구조

```tsx
// components/Button/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Button",
  },
};
```

### 스켈레톤 컴포넌트

```tsx
// components/Skeleton/Skeleton.stories.tsx
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
};

export default meta;

export const Card: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};
```

## 파일 구조

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.stories.tsx
│   └── index.ts
├── Skeleton/
│   ├── Skeleton.tsx
│   ├── Skeleton.stories.tsx
│   └── index.ts
```

## 빌드

```bash
pnpm build-storybook
# storybook-static/ 폴더에 빌드
```

## 체크리스트

- [ ] 모든 공통 컴포넌트에 스토리 작성
- [ ] 다크 모드 프리뷰 추가
- [ ] 접근성 애드온 활성화
- [ ] 인터랙션 테스트 추가

---
name: Accessibility
description: WCAG 2.1 AA 접근성 구현 스킬
---

# 접근성 (Accessibility) 스킬

## 기준

WCAG 2.1 Level AA 준수

## 체크리스트

### 키보드 네비게이션

- [ ] 모든 인터랙티브 요소 Tab으로 접근 가능
- [ ] 포커스 순서 논리적
- [ ] 포커스 표시자(outline) 시각적으로 명확
- [ ] Escape로 모달 닫기
- [ ] Enter/Space로 버튼 활성화

### ARIA 레이블

```tsx
// 버튼
<button aria-label="분석 시작">
  <SearchIcon />
</button>

// 폼
<input aria-describedby="ticker-help" />
<span id="ticker-help">예: AAPL, 005930</span>

// 로딩 상태
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? '로딩 중...' : content}
</div>
```

### 색상 대비

- 최소 4.5:1 (일반 텍스트)
- 최소 3:1 (큰 텍스트, 아이콘)

### 스크린 리더

- [ ] 이미지에 alt 텍스트
- [ ] 아이콘 버튼에 aria-label
- [ ] 상태 변화 시 aria-live 사용
- [ ] 폼 에러 메시지 연결

### 포커스 관리

```tsx
// 모달 열릴 때 포커스 이동
useEffect(() => {
  if (isOpen) {
    modalRef.current?.focus();
  }
}, [isOpen]);

// 포커스 트랩
<FocusTrap active={isOpen}>
  <ModalContent />
</FocusTrap>;
```

## 테스트 도구

- axe DevTools (브라우저 확장)
- Lighthouse Accessibility 감사
- 키보드만으로 전체 사이트 탐색 테스트

## 참고

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Shadcn UI Accessibility](https://ui.shadcn.com/docs/components/dialog#accessibility)

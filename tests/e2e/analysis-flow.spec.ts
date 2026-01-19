import { test, expect } from "@playwright/test";

test.describe("Analysis Flow", () => {
  test("Complete analysis journey for valid ticker", async ({ page }) => {
    // 1. Visit Home Page
    await page.goto("/");
    await expect(page).toHaveTitle(/AI Stock Analyst/);

    // 2. Input Ticker
    const tickerInput = page.locator('input[name="ticker"]'); // Assuming input has name="ticker"
    await expect(tickerInput).toBeVisible();
    await tickerInput.fill("AAPL");

    // 3. Submit Form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // 4. Verify Redirection to Analyze Page
    await expect(page).toHaveURL(/\/analyze\?ticker=AAPL/);

    // 5. Verify Processing State (Progress Bar)
    // Wait for ID to be generated and URL to change (if applicable) OR just check for processing UI
    // In Mock Mode, it might redirect to /analyze?ticker=AAPL&id=... quickly
    await expect(page).toHaveURL(/id=/);

    // Check for "AI Analysis for AAPL" (Processing View)
    await expect(page.getByText("AI Analysis for AAPL")).toBeVisible();

    // Check for Progress Bar or Mock Status
    // "초기화 중..." might be skipped quickly in Mock Mode.
    // Mock Mode sends "Initializing AI (Mock Mode)..." and waits 1s.
    await expect(
      page.getByText("Initializing AI (Mock Mode)..."),
    ).toBeVisible();

    // 6. Verify Completed State
    // Wait for "Analysis Report" and Ticker
    await expect(page.getByText("Analysis Report")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("heading", { name: "AAPL" })).toBeVisible();

    // Verify Chart
    const chart = page.locator(".w-full.h-\\[300px\\]"); // Chart container class
    await expect(chart).toBeVisible();

    // Verify Signals
    await expect(page.getByText("골든크로스 발생 직전")).toBeVisible();

    // Verify Recommendation
    await expect(page.getByText("BUY", { exact: true })).toBeVisible();
  });
});

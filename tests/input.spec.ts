import { test, expect } from '@playwright/test';

test('input test after authentication', async ({ page }) => {
  // 로그인된 상태로 시작 (Google 또는 Kakao)
  await page.goto('https://getliner.com/');

  // 1. 쿠키 확인
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(cookie => cookie.name === 'connect.sid');

  // expect를 사용하여 확실하게 테스트 실패시키기
  expect(sessionCookie, 'User authentication failed: No session cookie found').toBeTruthy();

  console.log('✅ User is already logged (session cookie found)');

  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('pre div').first().fill('hello world');
  await page.locator('.css-mk0anw').click();

  // Stop 버튼이 나타날 때까지 기다림
  await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible();

  // Stop 버튼이 사라질 때까지 기다림 (최대 60초)
  await page.getByRole('button', { name: 'Stop' }).waitFor({ state: 'hidden', timeout: 60000 });

  await expect(page.locator('pre')).toBeVisible();
  await expect(page.getByText('Was this answer helpful?')).toBeVisible();
});

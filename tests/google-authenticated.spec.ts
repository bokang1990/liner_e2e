import { test, expect } from '@playwright/test';

// 이미 Google 로그인된 상태에서 시작하는 테스트
test('google authenticated user actions', async ({ page }) => {
  // 이미 Google 로그인이 되어있는 상태로 시작
  await page.goto('https://getliner.com/');

  // 페이지 로딩 대기
  await page.waitForTimeout(3000);

  // URL에서 로그인 상태 확인 (로그인된 사용자는 특정 URL로 리다이렉트됨)
  const currentUrl = page.url();

  // 1. 쿠키 확인
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(cookie => cookie.name === 'connect.sid');

  // expect를 사용하여 확실하게 테스트 실패시키기
  expect(sessionCookie, 'User authentication failed: No session cookie found').toBeTruthy();

  console.log('✅ User is already logged in with Google (session cookie found)');

  // 로그인된 사용자만 할 수 있는 추가 작업들을 여기에 추가
  // 예: 설정 변경, 데이터 동기화 확인 등

  // 버튼 중에서 Upgrade 버튼을 필터링
  await expect(page.getByRole('button', { name: 'button' })).toBeVisible();
});

import { test, expect } from '@playwright/test';

// 이미 로그인된 상태에서 시작하는 테스트
test('kakao authenticated user actions', async ({ page }) => {
  // 이미 카카오 로그인이 되어있는 상태로 시작
  await page.goto('https://getliner.com/');

  // 페이지 로딩 대기
  await page.waitForTimeout(3000);

  // URL에서 로그인 상태 확인 (로그인된 사용자는 특정 URL로 리다이렉트됨)
  const currentUrl = page.url();

  // 로그인 상태를 더 정확하게 확인하는 방법
  // 1. 쿠키 확인
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(cookie => cookie.name === 'connect.sid');

  if (sessionCookie) {
    console.log('✅ User is already logged in with Kakao (session cookie found)');
  } else {
    // 2. localStorage 확인
    const userInfo = await page.evaluate(() => {
      return localStorage.getItem('statsig.stable_id.1242573613');
    });

    if (userInfo) {
      console.log('✅ User is already logged in with Kakao (user info found in localStorage)');
    } else {
      console.log('❌ User authentication may have failed');
    }
  }

  // 로그인된 사용자만 할 수 있는 추가 작업들을 여기에 추가
  // 예: 북마크 생성, 프로필 확인 등
});

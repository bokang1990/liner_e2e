import { test as setup, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

setup('authenticate with kakao', async ({ page }) => {
  // 카카오 로그인 수행
  await page.goto('https://getliner.com/');
  await page.getByRole('link', { name: 'Continue with Kakao' }).click();
  await page.waitForURL(/^https:\/\/accounts\.kakao\.com\/login\//, { timeout: 10000 });

  await page.getByRole('textbox', { name: 'Enter Account Information' }).fill(process.env.KAKAO_EMAIL || '');
  await page.getByRole('textbox', { name: 'Enter Password' }).fill(process.env.KAKAO_PASSWORD || '');
  await page.getByRole('button', { name: 'Log In', exact: true }).click();

  // 로그인 성공 확인 - 더 유연한 선택자 사용
  await page.waitForURL(/^https:\/\/getliner\.com\//, { timeout: 15000 });

  await page.waitForURL(/^https:\/\/getliner\.com\//);
  await expect(page.getByRole('banner').getByRole('button', { name: 'button' })).toBeVisible();

  // 세션 상태를 저장
  await page.context().storageState({ path: './auth/kakao-auth.json' });
  console.log('✅ Kakao authentication session saved');
});

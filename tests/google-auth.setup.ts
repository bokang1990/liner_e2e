import { test as setup, expect, chromium } from '@playwright/test';
import * as dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

setup('authenticate with google', async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',           // 실제 Chrome
    args: [
      '--disable-blink-features=AutomationControlled',
      '--lang=ko-KR'
    ]
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'America/New_York',
    viewport: { width: 1368, height: 864 },
  });

  // webdriver 흔적 감추기
  await context.addInitScript(() => {
    // @ts-ignore
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await context.newPage();

  await page.goto('https://getliner.com/');
  await page.locator('button').filter({ hasText: 'Continue another way' }).click();
  await page.getByRole('link', { name: 'Continue with Google' }).click();
  await page.getByRole('textbox', { name: 'Email or phone' }).fill(process.env.GOOGLE_EMAIL || '');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.GOOGLE_PASSWORD || '');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('link', { name: 'Confirm your recovery email' })).toBeVisible();
  await page.getByRole('link', { name: 'Confirm your recovery email' }).click();
  await expect(page.getByRole('textbox', { name: 'Enter recovery email address' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter recovery email address' }).click();
  await page.getByRole('textbox', { name: 'Enter recovery email address' }).fill(process.env.KAKAO_EMAIL || '');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.waitForURL(/^https:\/\/getliner\.com\//);
  await expect(page.getByRole('banner').getByRole('button', { name: 'button' })).toBeVisible();

  await context.storageState({ path: './auth/auth.json' });
  console.log('✅ Google authentication session saved');
});

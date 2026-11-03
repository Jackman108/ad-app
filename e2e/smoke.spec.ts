import { expect, test } from '@playwright/test';

test('home feed loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Объявления' })).toBeVisible();
  await expect(page.getByText('Частные лица · Беларусь')).toBeVisible();
});

test('login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /вход/i })).toBeVisible();
});

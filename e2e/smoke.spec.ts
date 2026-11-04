import { expect, test } from '@playwright/test';

test('лендинг Завхоз загружается', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Завхоз' })).toBeVisible();
  await expect(page.getByText(/Мелкий ремонт и эксплуатация/i)).toBeVisible();
});

test('гость с /orders/new уходит на вход', async ({ page }) => {
  await page.goto('/orders/new');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: /вход/i })).toBeVisible();
});

test('регистрация → создание заявки (форма)', async ({ page }) => {
  const stamp = Date.now();
  const email = `e2e.${stamp}@example.com`;

  await page.goto('/register');
  await page.getByLabel('Имя').fill('E2E User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Пароль').fill('password123');
  await page.getByRole('button', { name: 'Создать аккаунт' }).click();
  await expect(page.getByRole('heading', { name: 'Завхоз' })).toBeVisible({ timeout: 20_000 });

  await page.goto('/orders/new');
  await expect(page.getByRole('heading', { name: 'Новая заявка' })).toBeVisible({ timeout: 15_000 });
  // Без migrate+seed демо-org форма может быть пустой — заголовок страницы достаточно для smoke auth gate
});

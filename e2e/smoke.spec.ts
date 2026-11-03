import { expect, test } from '@playwright/test';

test('лента загружается', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Объявления' })).toBeVisible();
  await expect(page.getByText('Частные лица · Беларусь')).toBeVisible();
});

test('гость с /listings/new уходит на вход', async ({ page }) => {
  await page.goto('/listings/new');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: /вход/i })).toBeVisible();
});

test('регистрация → создание объявления → карточка', async ({ page }) => {
  const stamp = Date.now();
  const email = `e2e.${stamp}@example.com`;
  const title = `E2E диван ${stamp}`;

  await page.goto('/register');
  await page.getByLabel('Имя').fill('E2E User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Пароль').fill('password123');
  await page.getByRole('button', { name: 'Создать аккаунт' }).click();
  await expect(page.getByRole('heading', { name: 'Объявления' })).toBeVisible({ timeout: 20_000 });

  await page.goto('/listings/new');
  await expect(page.getByRole('heading', { name: 'Новое объявление' })).toBeVisible();
  await page.getByLabel('Заголовок').fill(title);
  await page.getByLabel('Описание').fill('Описание для smoke e2e, не короче десяти символов.');
  await page.getByLabel('Цена, BYN (пусто = договорная)').fill('99');
  await page.getByLabel('Категория').selectOption({ index: 1 });
  await page.getByLabel('Населённый пункт').selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Опубликовать' }).click();

  await expect(page).toHaveURL(/\/listings\//, { timeout: 20_000 });
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await expect(page.getByText(/Продавец:/)).toBeVisible();

  await page.goto('/');
  await expect(page.getByRole('link', { name: title })).toBeVisible();
});

import { expect, test } from '@playwright/test';

/**
 * Ядро сделки: продавец публикует → покупатель пишет in-app → тред в inbox.
 * Два browser context = два аккаунта (без увода во внешние каналы).
 */
test('ядро: объявление → написать → диалог', async ({ browser }) => {
  const stamp = Date.now();
  const title = `Сделка диван ${stamp}`;

  const sellerCtx = await browser.newContext();
  const buyerCtx = await browser.newContext();
  const seller = await sellerCtx.newPage();
  const buyer = await buyerCtx.newPage();

  await seller.goto('/register');
  await seller.getByLabel('Имя').fill('Seller Core');
  await seller.getByLabel('Email').fill(`seller.${stamp}@example.com`);
  await seller.getByLabel('Пароль').fill('password123');
  await seller.getByRole('button', { name: 'Создать аккаунт' }).click();
  await expect(seller.getByRole('heading', { name: 'НаТочку' })).toBeVisible({ timeout: 20_000 });

  await seller.goto('/listings/new');
  await seller.getByLabel('Заголовок').fill(title);
  await seller.getByLabel('Описание').fill('Описание для ядра сделки, достаточно длинное.');
  await seller.getByLabel('Цена, BYN (пусто = договорная)').fill('120');
  await seller.getByLabel('Категория').selectOption({ index: 1 });
  await seller.getByTestId('listing-region').selectOption({ index: 1 });
  const locality = seller.getByTestId('listing-locality');
  await expect(locality).toBeEnabled({ timeout: 10_000 });
  await locality.selectOption({ index: 1 });
  await seller.getByRole('button', { name: 'Опубликовать' }).click();
  await expect(seller).toHaveURL(/\/listings\/(?!new(?:\/|$))[^/?#]+/, { timeout: 20_000 });
  await expect(seller.getByRole('heading', { name: title })).toBeVisible({ timeout: 15_000 });
  await expect(seller.getByText(/Это ваше объявление/)).toBeVisible();
  const listingUrl = seller.url();

  await buyer.goto('/register');
  await buyer.getByLabel('Имя').fill('Buyer Core');
  await buyer.getByLabel('Email').fill(`buyer.${stamp}@example.com`);
  await buyer.getByLabel('Пароль').fill('password123');
  await buyer.getByRole('button', { name: 'Создать аккаунт' }).click();
  await expect(buyer.getByRole('heading', { name: 'НаТочку' })).toBeVisible({ timeout: 20_000 });

  await buyer.goto(listingUrl);
  await expect(buyer.getByRole('heading', { name: title })).toBeVisible();
  await expect(buyer.getByText('Связаться с продавцом')).toBeVisible();
  await buyer.getByPlaceholder('Здравствуйте! Объявление ещё актуально?').fill('Здравствуйте, ещё актуально?');
  await buyer.getByRole('button', { name: 'Отправить', exact: true }).click();
  await expect(buyer).toHaveURL(/\/inbox\//, { timeout: 20_000 });
  await expect(buyer.getByText('Здравствуйте, ещё актуально?')).toBeVisible();

  await seller.goto('/inbox');
  await expect(seller.getByRole('link', { name: title })).toBeVisible({ timeout: 15_000 });
  await seller.getByRole('link', { name: title }).click();
  await expect(seller.getByText('Здравствуйте, ещё актуально?')).toBeVisible();

  await sellerCtx.close();
  await buyerCtx.close();
});

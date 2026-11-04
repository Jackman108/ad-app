import { expect, test } from '@playwright/test';
import { ensureMasterByEmail, promoteAdminByEmail } from './helpers/db';

/**
 * Счастливый путь Завхоз: заявка → оценка → offer → accept → AFTER → confirm.
 * Нужны migrate+seed (демо Org/Site + work categories).
 */
test('ядро: заявка → диспетчер → мастер → подтверждение', async ({ browser }) => {
  const stamp = Date.now();
  const orgEmail = `org.${stamp}@example.com`;
  const adminEmail = `admin.${stamp}@example.com`;
  const masterEmail = `master.${stamp}@example.com`;
  const title = `Кран течёт ${stamp}`;

  const orgCtx = await browser.newContext();
  const adminCtx = await browser.newContext();
  const masterCtx = await browser.newContext();
  const org = await orgCtx.newPage();
  const admin = await adminCtx.newPage();
  const master = await masterCtx.newPage();

  // --- org: register + create order ---
  await org.goto('/register');
  await org.getByLabel('Имя').fill('Org Manager');
  await org.getByLabel('Email').fill(orgEmail);
  await org.getByLabel('Пароль').fill('password123');
  await org.getByRole('button', { name: 'Создать аккаунт' }).click();
  await expect(org.getByRole('heading', { name: 'НаТочку' })).toBeVisible({ timeout: 20_000 });

  await org.goto('/orders/new');
  await expect(org.getByRole('heading', { name: 'Новая заявка' })).toBeVisible({ timeout: 15_000 });
  await org.getByLabel('Заголовок').fill(title);
  await org.getByLabel('Описание проблемы').fill('Течёт смеситель на точке Немига, нужна замена.');
  // org/site/category from seed + demo membership
  const cat = org.locator('select[name="categoryId"]');
  await expect(cat).toBeVisible();
  await cat.selectOption({ index: 1 });
  await org.getByRole('button', { name: 'Создать заявку' }).click();
  await expect(org).toHaveURL(/\/orders\/[^/]+$/, { timeout: 20_000 });
  await expect(org.getByRole('heading', { name: title })).toBeVisible();
  const orderUrl = org.url();

  // --- admin: estimate + offer ---
  await admin.goto('/register');
  await admin.getByLabel('Имя').fill('Dispatcher');
  await admin.getByLabel('Email').fill(adminEmail);
  await admin.getByLabel('Пароль').fill('password123');
  await admin.getByRole('button', { name: 'Создать аккаунт' }).click();
  await expect(admin.getByRole('heading', { name: 'НаТочку' })).toBeVisible({ timeout: 20_000 });
  await promoteAdminByEmail(adminEmail);

  await master.goto('/register');
  await master.getByLabel('Имя').fill('Master Pro');
  await master.getByLabel('Email').fill(masterEmail);
  await master.getByLabel('Пароль').fill('password123');
  await master.getByRole('button', { name: 'Создать аккаунт' }).click();
  await expect(master.getByRole('heading', { name: 'НаТочку' })).toBeVisible({ timeout: 20_000 });
  await ensureMasterByEmail(masterEmail);

  await admin.goto('/dispatch');
  await expect(admin.getByRole('heading', { name: 'Диспетчер' })).toBeVisible({ timeout: 15_000 });
  await expect(admin.getByRole('link', { name: title })).toBeVisible();
  const card = admin.locator('li', { hasText: title });
  await card.getByPlaceholder('Цена BYN').fill('80');
  await card.getByRole('button', { name: 'Оценить' }).click();
  await expect(card.getByText('Оценена')).toBeVisible({ timeout: 10_000 });
  await card.getByRole('button', { name: 'Назначить' }).click();
  await expect(card.getByText('Предложена мастеру')).toBeVisible({ timeout: 10_000 });

  // --- master: accept → start → after photo ---
  await master.goto('/master/orders');
  await expect(master.getByRole('heading', { name: 'Кабинет мастера' })).toBeVisible();
  const mCard = master.locator('li', { hasText: title });
  await mCard.getByRole('button', { name: 'Принять' }).click();
  await expect(mCard.getByText('Принята мастером')).toBeVisible({ timeout: 10_000 });
  await mCard.getByRole('button', { name: 'В работу' }).click();
  await expect(mCard.getByText('В работе')).toBeVisible({ timeout: 10_000 });

  // минимальный jpeg 1x1
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );
  await mCard.locator('input[name="images"]').setInputFiles({
    name: 'after.png',
    mimeType: 'image/png',
    buffer: png,
  });
  await mCard.getByRole('button', { name: 'Сдать на подтверждение' }).click();
  await expect(mCard.getByText('Ждёт подтверждения')).toBeVisible({ timeout: 15_000 });

  // --- org: confirm ---
  await org.goto(orderUrl);
  await org.getByRole('button', { name: 'Подтвердить и закрыть' }).click();
  await expect(org.getByTestId('order-closed')).toBeVisible({ timeout: 15_000 });

  await orgCtx.close();
  await adminCtx.close();
  await masterCtx.close();
});

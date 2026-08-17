const { test, expect, request } = require('@playwright/test');
const fr15Cases = require('../data/fr15_product_crud.json');

const API_URL = process.env.ESHOP_API_URL || 'http://localhost:3000';
const ADMIN_URL = process.env.ESHOP_ADMIN_URL || 'http://localhost:5174';

async function login(api, email, password) {
  const response = await api.post(`${API_URL}/api/login`, { data: { email, password } });
  expect(response.ok(), `login ${email}`).toBeTruthy();
  return response.json();
}

async function products(api) {
  const response = await api.get(`${API_URL}/api/products`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function productById(api, id) {
  const response = await api.get(`${API_URL}/api/products/${id}`);
  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function createProduct(api, data) {
  const response = await api.post(`${API_URL}/api/products`, { data });
  expect(response.ok(), `create product ${data.name}`).toBeTruthy();
  return response.json();
}

async function deleteProduct(api, id) {
  await api.delete(`${API_URL}/api/products/${id}`);
}

async function cleanupMarker(api, marker) {
  const rows = await products(api);
  for (const product of rows.filter((item) => String(item.imageUrl || '').includes(marker))) {
    await deleteProduct(api, product.id);
  }
}

function markerFor(testInfo, testCaseId) {
  return `${testInfo.project.name}-${testCaseId}-${Date.now()}`.replace(/[^a-zA-Z0-9-]/g, '-');
}

function productPayload(testCase, marker, overrides = {}) {
  const data = testCase.testData;
  return {
    name: Object.prototype.hasOwnProperty.call(overrides, 'name') ? overrides.name : String(data.name ?? `FR15 ${testCase.testCaseId}`),
    price: Object.prototype.hasOwnProperty.call(overrides, 'price') ? overrides.price : String(data.price ?? 100),
    description: `HW04 ${testCase.testCaseId} ${marker}`,
    imageUrl: `https://example.test/${marker}.png`,
    category_id: 1,
  };
}

async function openProducts(page, token) {
  await page.addInitScript(({ adminToken }) => {
    window.localStorage.setItem('adminToken', adminToken);
  }, { adminToken: token });
  await page.goto(ADMIN_URL);
  await page.locator('li').nth(2).click();
  await expect(page.locator('form').first()).toBeVisible();
}

function productForm(page) {
  return page.locator('form').first();
}

async function fillProductForm(page, payload) {
  const form = productForm(page);
  const inputs = form.locator('input');
  await inputs.nth(0).fill(String(payload.name));

  if (String(payload.price) === 'abc') {
    await expect(async () => {
      await inputs.nth(1).fill('abc');
    }).rejects.toThrow();
    return;
  }

  await inputs.nth(1).fill(String(payload.price));
  await inputs.nth(2).fill(String(payload.imageUrl));
  await form.locator('textarea').fill(payload.description);
  await form.locator('select').selectOption(String(payload.category_id));
}

async function submitProductForm(page) {
  await productForm(page).locator('button').first().click();
}

async function findByMarker(api, marker) {
  const rows = await products(api);
  return rows.filter((item) => String(item.imageUrl || '').includes(marker));
}

async function editProductFromList(page, name) {
  const row = page.locator('tbody tr').filter({ hasText: name }).first();
  await expect(row).toBeVisible();
  await row.locator('button').first().click();
}

function watchDialogs(page) {
  const messages = [];
  page.on('dialog', async (dialog) => {
    messages.push(dialog.message());
    await dialog.accept();
  });
  return messages;
}

test.describe('FR-15 Quản lý sản phẩm CRUD - data-driven', () => {
  let api;
  let admin;

  test.beforeAll(async () => {
    api = await request.newContext();
    admin = await login(api, 'admin@eshop.com', 'Admin123!');
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  for (const testCase of fr15Cases) {
    test(`${testCase.testCaseId} - ${testCase.technique} - ${testCase.partition}`, async ({ page }, testInfo) => {
      test.info().annotations.push(
        { type: 'featureId', description: testCase.featureId },
        { type: 'sourceFile', description: testCase.sourceFile },
        { type: 'hw2Status', description: testCase.hw2Evidence.status },
        { type: 'hw2BugId', description: testCase.hw2Evidence.bugId || 'N/A' },
      );

      const marker = markerFor(testInfo, testCase.testCaseId);
      const expected = testCase.expectedAutomation;
      const dialogs = watchDialogs(page);

      try {
        await openProducts(page, admin.token);

        if (expected.type === 'numberInputBlocksInvalid') {
          await fillProductForm(page, productPayload(testCase, marker));
          await expect(page.locator('input[type="number"]').first()).toHaveValue('');
          return;
        }

        if (expected.type === 'createSuccess') {
          const payload = productPayload(testCase, marker);
          await fillProductForm(page, payload);
          await submitProductForm(page);
          await expect.poll(async () => (await findByMarker(api, marker)).length).toBe(1);
          await expect(page.getByText(payload.name).first()).toBeVisible();
          return;
        }

        if (expected.type === 'requiredField') {
          const payload = productPayload(testCase, marker);
          await fillProductForm(page, payload);
          await submitProductForm(page);
          const selector = expected.field === 'name' ? productForm(page).locator('input').nth(0) : productForm(page).locator('input').nth(1);
          const valid = await selector.evaluate((input) => input.checkValidity());
          expect(valid).toBe(false);
          return;
        }

        if (expected.type === 'nameError' || expected.type === 'nameTooLongError' || expected.type === 'priceError') {
          if (testCase.testData.operation === 'update') {
            const original = productPayload(testCase, marker, { name: `Target ${marker}`, price: 100 });
            const created = await createProduct(api, original);
            await page.reload();
            await page.locator('li').nth(2).click();
            await editProductFromList(page, original.name);
            const invalidPayload = productPayload(testCase, marker);
            await fillProductForm(page, invalidPayload);
            await submitProductForm(page);
            await page.waitForTimeout(400);
            const after = await productById(api, created.id);
            expect(String(after.name), `${testCase.testCaseId} should keep original product name`).toBe(original.name);
            expect(Number(after.price), `${testCase.testCaseId} should keep original product price`).toBe(Number(original.price));
          } else {
            const payload = productPayload(testCase, marker);
            await fillProductForm(page, payload);
            await submitProductForm(page);
            await page.waitForTimeout(400);
            expect(await findByMarker(api, marker), `${testCase.testCaseId} should not create an invalid product`).toHaveLength(0);
          }
          return;
        }

        if (expected.type === 'viewSuccess') {
          const payload = productPayload(testCase, marker, { name: `View ${marker}`, price: 100 });
          const created = await createProduct(api, payload);
          await page.reload();
          await page.locator('li').nth(2).click();
          await expect(page.getByText(payload.name).first()).toBeVisible();
          expect(await productById(api, created.id)).toMatchObject({ name: payload.name });
          return;
        }

        if (expected.type === 'deleteSuccess') {
          const payload = productPayload(testCase, marker, { name: `Delete ${marker}`, price: 100 });
          await createProduct(api, payload);
          await page.reload();
          await page.locator('li').nth(2).click();
          const row = page.locator('tbody tr').filter({ hasText: payload.name }).first();
          await expect(row).toBeVisible();
          await row.locator('button').last().click();
          await expect.poll(async () => (await findByMarker(api, marker)).length).toBe(0);
          return;
        }

        if (expected.type === 'cancelUpdateNoChange') {
          const payload = productPayload(testCase, marker, { name: `Cancel ${marker}`, price: 100 });
          const created = await createProduct(api, payload);
          await page.reload();
          await page.locator('li').nth(2).click();
          await editProductFromList(page, payload.name);
          await productForm(page).locator('input').nth(0).fill(`Changed ${marker}`);
          await productForm(page).locator('button').nth(1).click();
          expect(await productById(api, created.id)).toMatchObject({ name: payload.name });
          return;
        }

        if (expected.type === 'updateOneProductOnly') {
          const first = productPayload(testCase, marker, { name: `First ${marker}`, price: 100 });
          const second = productPayload(testCase, `${marker}-second`, { name: `Second ${marker}`, price: 100 });
          await createProduct(api, first);
          await createProduct(api, second);
          await page.reload();
          await page.locator('li').nth(2).click();
          await editProductFromList(page, first.name);
          await fillProductForm(page, { ...first, name: `Updated ${marker}`, price: 150 });
          await submitProductForm(page);
          await expect.poll(() => dialogs.at(-1) || '').toMatch(/th.*nh c.*ng|success/i);
          await expect(page.getByText(second.name).first()).toBeVisible();
          await expect(page.getByText(`Updated ${marker}`).first()).toBeVisible();
          return;
        }

        if (expected.type === 'listReflectsUpdate') {
          const payload = productPayload(testCase, marker, { name: `Old ${marker}`, price: 100 });
          await createProduct(api, payload);
          await page.reload();
          await page.locator('li').nth(2).click();
          await editProductFromList(page, payload.name);
          await fillProductForm(page, { ...payload, name: `Updated ${marker}`, price: 150 });
          await submitProductForm(page);
          await expect(page.getByText(`Updated ${marker}`).first()).toBeVisible();
          return;
        }

        throw new Error(`Unsupported expectedAutomation type: ${expected.type}`);
      } finally {
        await cleanupMarker(api, marker);
        await cleanupMarker(api, `${marker}-second`);
      }
    });
  }
});

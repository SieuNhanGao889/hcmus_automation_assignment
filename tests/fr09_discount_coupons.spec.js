const { test, expect, request } = require('@playwright/test');
const fr09Cases = require('../data/fr09_discount_coupons.json');

const API_URL = process.env.ESHOP_API_URL || 'http://localhost:3000';
const SUPPORT_COUPONS = [
  { code: 'TEST', type: 'fixed', discount_value: 10000, min_order_amount: 30000000, expired_at: '2099-12-31', max_uses_per_user: 2 },
  { code: 'NEW10', type: 'fixed', discount_value: 100000000, min_order_amount: 10000, expired_at: '2099-12-31', max_uses_per_user: 2 },
  { code: 'TEST1', type: 'fixed', discount_value: 10000, min_order_amount: 28000000, expired_at: '2099-12-31', max_uses_per_user: 1 },
  { code: 'TEST2', type: 'fixed', discount_value: 10000, min_order_amount: 27999998, expired_at: '2099-12-31', max_uses_per_user: 1 },
  { code: 'TEST3', type: 'fixed', discount_value: 10000, min_order_amount: 280000001, expired_at: '2099-12-31', max_uses_per_user: 1 },
  { code: 'VIP100', type: 'fixed', discount_value: 100000, min_order_amount: 299999, expired_at: '2099-12-31', max_uses_per_user: 1 },
];

async function login(api, email, password) {
  const response = await api.post(`${API_URL}/api/login`, { data: { email, password } });
  expect(response.ok(), `login ${email}`).toBeTruthy();
  return response.json();
}

async function ensureUser(api, testInfo, testCaseId) {
  const stamp = `${Date.now()}-${testInfo.project.name}-${testCaseId}`.replace(/[^a-zA-Z0-9-]/g, '-');
  const email = `fr09-${stamp}@eshop.test`;
  const password = 'Test1234!';
  await api.post(`${API_URL}/api/register`, {
    data: { name: `FR09 ${testCaseId}`, email, password },
  });
  return login(api, email, password);
}

async function ensureSupportCoupons(api) {
  const admin = await login(api, 'admin@eshop.com', 'Admin123!');
  const headers = { Authorization: `Bearer ${admin.token}` };
  const currentResponse = await api.get(`${API_URL}/api/coupons`, { headers });
  expect(currentResponse.ok()).toBeTruthy();
  const currentCoupons = await currentResponse.json();

  for (const coupon of currentCoupons.filter((item) => SUPPORT_COUPONS.some((support) => support.code === item.code))) {
    await api.delete(`${API_URL}/api/admin/coupons/${coupon.id}`, { headers });
  }

  for (const coupon of SUPPORT_COUPONS) {
    const createResponse = await api.post(`${API_URL}/api/admin/coupons`, { headers, data: coupon });
    expect(createResponse.ok(), `create support coupon ${coupon.code}`).toBeTruthy();
  }
}

async function getCouponId(api, code, token) {
  const response = await api.post(`${API_URL}/api/apply-coupon`, {
    data: { code, total_amount: 999999999, user_id: null },
  });
  expect(response.ok(), `lookup coupon ${code}`).toBeTruthy();
  const body = await response.json();
  expect(body.coupon_id).toBeTruthy();
  return body.coupon_id;
}

async function recordCouponUsage(api, code, count, token) {
  if (!count) return;
  const couponId = await getCouponId(api, code, token);
  for (let index = 0; index < count; index += 1) {
    const response = await api.post(`${API_URL}/api/coupon-usage`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { coupon_id: couponId },
    });
    expect(response.ok(), `record ${code} usage ${index + 1}`).toBeTruthy();
  }
}

async function openCheckoutAsUser(page, userSession) {
  await page.addInitScript(({ token }) => {
    window.localStorage.setItem('token', token);
  }, { token: userSession.token });
  await page.goto('/checkout');
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole('link', { name: new RegExp(userSession.user.name) })).toBeVisible();
}

async function applyCoupon(page, testCase) {
  const totalInput = page.getByRole('spinbutton');
  const couponInput = page.getByRole('textbox');
  const applyButton = page.getByRole('button').filter({ hasText: /p d.*ng|apply/i });

  await expect(totalInput).toBeVisible();
  await totalInput.fill(String(testCase.testData.total_amount));
  await expect(totalInput).toHaveValue(String(testCase.testData.total_amount));

  await couponInput.fill(testCase.testData.code);
  await expect(couponInput).toHaveValue(testCase.testData.code);
  await applyButton.click();
}

function couponResult(page) {
  return page.locator('div').filter({ hasText: /Ti|Th|Áp|Ãp|thành|thÃ nh/ }).filter({
    has: page.locator('strong'),
  }).last();
}

function couponError(page) {
  return page.locator('p').filter({ hasText: /./ }).last();
}

test.describe('FR-09 Discount Coupons - HW02 data-driven automation', () => {
  let api;

  test.beforeAll(async () => {
    api = await request.newContext();
    await ensureSupportCoupons(api);
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  for (const testCase of fr09Cases) {
    test(`${testCase.testCaseId} - ${testCase.technique} - ${testCase.partition}`, async ({ page }, testInfo) => {
      test.info().annotations.push(
        { type: 'featureId', description: testCase.featureId },
        { type: 'sourceFile', description: testCase.sourceFile },
        { type: 'hw2Status', description: testCase.hw2Evidence.status },
        { type: 'hw2BugId', description: testCase.hw2Evidence.bugId || 'N/A' },
      );

      const userSession = await ensureUser(api, testInfo, testCase.testCaseId);
      await recordCouponUsage(api, testCase.testData.code, testCase.testData.preUsedCount || 0, userSession.token);
      await openCheckoutAsUser(page, userSession);
      await applyCoupon(page, testCase);

      const expected = testCase.expectedAutomation;
      if (expected.type === 'success') {
        const result = couponResult(page);
        await expect(result).toBeVisible();
        await expect(result).toContainText(expected.discountText);
        await expect(result).toContainText(expected.finalText);
        await expect(page.getByText(new RegExp(`T.{1,12}ng thanh to.{1,12}n: ${expected.finalText}`))).toBeVisible();
      } else if (expected.type === 'error') {
        const error = couponError(page);
        await expect(error).toBeVisible();
        await expect(error).toContainText(new RegExp(expected.messagePattern, 'i'));
      } else if (expected.type === 'nonNegativeFinal') {
        const result = couponResult(page);
        await expect(result).toBeVisible();
        const text = await result.textContent();
        const finalMatch = text.match(/(-?[\d,]+)\s*[₫â‚«]/g)?.at(-1);
        expect(finalMatch, 'final amount should be displayed').toBeTruthy();
        const finalAmount = Number(finalMatch.replace(/[^\d-]/g, ''));
        expect(finalAmount).toBeGreaterThanOrEqual(0);
      } else {
        throw new Error(`Unsupported expectedAutomation type: ${expected.type}`);
      }
    });
  }
});

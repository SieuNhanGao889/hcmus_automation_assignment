const { test, expect, request } = require('@playwright/test');
const fr03Cases = require('../data/fr03_forgot_password.json');

const API_URL = process.env.ESHOP_API_URL || 'http://localhost:3000';

async function ensureUser(api, testInfo, testCaseId) {
  const stamp = `${Date.now()}-${testInfo.project.name}-${testCaseId}`.replace(/[^a-zA-Z0-9-]/g, '-');
  const email = `fr03-${stamp}@eshop.test`;
  const password = 'OldPass123!';
  await api.post(`${API_URL}/api/register`, {
    data: { name: `FR03 ${testCaseId}`, email, password },
  });
  return { email, password };
}

async function openForgotPassword(page) {
  await page.goto('/forgot-password');
  await expect(page).toHaveURL(/\/forgot-password$/);
  await expect(page.locator('input').first()).toBeVisible();
}

async function requestOtp(page, email) {
  await openForgotPassword(page);
  const emailInput = page.locator('input').first();
  await emailInput.fill(email);
  await expect(emailInput).toHaveValue(email);
  await page.locator('button[type="submit"]').first().click();
}

async function getValidOtp(page, email) {
  await requestOtp(page, email);
  const message = page.locator('.bg-green-100');
  await expect(message).toBeVisible();
  const text = await message.textContent();
  const match = text.match(/\d{4}/);
  expect(match, 'OTP should be visible in this demo SUT so reset preconditions can continue').toBeTruthy();
  return match[0];
}

function watchDialogs(page) {
  const messages = [];
  page.on('dialog', async (dialog) => {
    messages.push(dialog.message());
    await dialog.accept();
  });
  return messages;
}

async function submitReset(page, resetToken, newPassword) {
  const inputs = page.locator('input');
  await inputs.nth(0).fill(resetToken);
  await expect(inputs.nth(0)).toHaveValue(resetToken);
  await inputs.nth(1).fill(newPassword);
  await expect(inputs.nth(1)).toHaveValue(newPassword);
  await page.locator('button[type="submit"]').click();
}

test.describe('FR-03 Quên mật khẩu và đặt lại mật khẩu - data-driven', () => {
  let api;

  test.beforeAll(async () => {
    api = await request.newContext();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  for (const testCase of fr03Cases) {
    test(`${testCase.testCaseId} - ${testCase.technique} - ${testCase.partition}`, async ({ page }, testInfo) => {
      test.info().annotations.push(
        { type: 'featureId', description: testCase.featureId },
        { type: 'sourceFile', description: testCase.sourceFile },
        { type: 'hw2Status', description: testCase.hw2Evidence.status },
        { type: 'hw2BugId', description: testCase.hw2Evidence.bugId || 'N/A' },
      );

      const expected = testCase.expectedAutomation;

      if (testCase.step === '1') {
        const dialogs = watchDialogs(page);
        const email = testCase.testData.email === 'test@eshop.com'
          ? (await ensureUser(api, testInfo, testCase.testCaseId)).email
          : testCase.testData.email;

        await requestOtp(page, email);

        if (expected.type === 'otpSuccess') {
          const message = page.locator('.bg-green-100');
          await expect(message).toBeVisible();
          await expect(message).toContainText(/\d{4}/);
          if (expected.shouldExposeOtp === false) {
            await expect(message, 'OTP must not be exposed on UI according to the requirement').not.toContainText(/\d{4}/);
          }
        } else if (expected.type === 'emailFormatError') {
          await expect.poll(() => dialogs.at(-1) || '').toMatch(/format|email|invalid|User not found/i);
          expect(dialogs.at(-1), 'Invalid email should not be treated as an unknown account').not.toMatch(/User not found/i);
        } else if (expected.type === 'requiredField') {
          const valid = await page.locator('input').first().evaluate((input) => input.checkValidity());
          expect(valid).toBe(false);
        } else if (expected.type === 'requiredOrTrimError') {
          await expect.poll(() => dialogs.at(-1) || '').toMatch(/required|vui|User not found/i);
          expect(dialogs.at(-1), 'Whitespace-only email should be rejected as empty after trimming').not.toMatch(/User not found/i);
        } else {
          await expect.poll(() => dialogs.at(-1) || '').toMatch(new RegExp(expected.messagePattern, 'i'));
        }
        return;
      }

      const user = await ensureUser(api, testInfo, testCase.testCaseId);
      const validOtp = await getValidOtp(page, user.email);
      const resetToken = String(testCase.testData.resetToken)
        .replace('validOtp', validOtp)
        .replace('valid4DigitOtp', validOtp);
      const dialogs = watchDialogs(page);

      await submitReset(page, resetToken, testCase.testData.newPassword);

      if (expected.type === 'resetSuccess') {
        await expect.poll(() => dialogs.at(-1) || '').toMatch(/th.*nh c.*ng|success/i);
        await expect(page).toHaveURL(/\/login$/);
      } else if (expected.type === 'otpRequired') {
        const valid = await page.locator('input').nth(0).evaluate((input) => input.checkValidity());
        expect(valid).toBe(false);
      } else if (expected.type === 'passwordRequired') {
        const valid = await page.locator('input').nth(1).evaluate((input) => input.checkValidity());
        expect(valid).toBe(false);
      } else if (expected.type === 'passwordPolicyError') {
        await expect.poll(() => dialogs.at(-1) || '').toMatch(/y.*u|weak|m.*t kh/i);
      } else {
        await expect.poll(() => dialogs.at(-1) || '').toMatch(/otp|token|m.*kh.*ng|invalid/i);
        expect(dialogs.at(-1), 'OTP errors should not be masked by password validation').not.toMatch(/y.*u|weak|m.*t kh/i);
      }
    });
  }
});

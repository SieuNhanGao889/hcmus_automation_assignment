# GitHub Issue Descriptions

## BUG-FR03-001: OTP is displayed directly on forgot password UI

### Description
The forgot password flow displays the OTP directly on the user interface after a password reset request. This exposes sensitive authentication data and weakens the reset password security flow.

### Steps to Reproduce
1. Open the forgot password page.
2. Enter a registered email address.
3. Submit the forgot password request.
4. Observe the message shown on the UI.

### Expected Result
The system should send the OTP through a secure channel and should not display it directly on the UI.

### Actual Result
The OTP is displayed directly on the UI after the request is submitted.

### Test Information
- Feature: FR-03 - Forgot Password and Reset Password
- Test case: FR03-DT-01
- Severity: High
- Automation: Playwright
- Evidence: `screenshots/FR03-DT-01-chromium.png`

## BUG-FR03-002: Invalid email format is handled as user not found

### Description
The forgot password form does not validate an invalid email format correctly. Input such as `abc` is processed as a lookup request and returns a user-not-found message.

### Steps to Reproduce
1. Open the forgot password page.
2. Enter `abc` in the email field.
3. Submit the form.
4. Observe the validation message.

### Expected Result
The system should reject the input with an email format validation error.

### Actual Result
The system returns a user-not-found message instead of an invalid email format message.

### Test Information
- Feature: FR-03 - Forgot Password and Reset Password
- Test case: FR03-DT-02
- Severity: Medium
- Automation: Playwright
- Evidence: `screenshots/FR03-DT-02-chromium.png`

## BUG-FR03-003: Whitespace-only email is not validated as empty input

### Description
The forgot password form does not trim or validate a whitespace-only email value as an empty input.

### Steps to Reproduce
1. Open the forgot password page.
2. Enter only spaces in the email field.
3. Submit the form.
4. Observe the validation behavior.

### Expected Result
The system should trim the input and display a required email validation error.

### Actual Result
The whitespace-only value is not handled correctly as an empty email value.

### Test Information
- Feature: FR-03 - Forgot Password and Reset Password
- Test case: FR03-DT-05
- Severity: Medium
- Automation: Playwright
- Evidence: `screenshots/FR03-DT-05-chromium.png`

## BUG-FR03-004: Valid new password is rejected and masks OTP validation errors

### Description
The reset password flow rejects a valid password such as `NewPass123!`. In some cases, the password validation error is shown before or instead of the expected OTP validation error.

### Steps to Reproduce
1. Request a password reset for a registered account.
2. Open the reset password flow.
3. Enter an invalid or boundary OTP value.
4. Enter `NewPass123!` as the new password.
5. Submit the reset password form.

### Expected Result
The system should accept `NewPass123!` as a valid password and validate the OTP according to the test case condition.

### Actual Result
The system reports the valid password as weak, which can hide the actual OTP validation behavior.

### Test Information
- Feature: FR-03 - Forgot Password and Reset Password
- Test cases: FR03-DT-07, FR03-DT-08
- Severity: High
- Automation: Playwright
- Evidence: `screenshots/FR03-DT-07-chromium.png`

## BUG-FR09-001: SAVE10 coupon calculates incorrect discount amount

### Description
The `SAVE10` coupon calculates an incorrect discount amount for a valid order total.

### Steps to Reproduce
1. Open the customer web application.
2. Add products to create an order total of `28,000,000`.
3. Go to checkout.
4. Apply coupon code `SAVE10`.
5. Observe the discount and final amount.

### Expected Result
The `SAVE10` coupon should apply a 10% discount to the order total.

### Actual Result
The UI displays an incorrect discount and final amount. Automation observed an abnormal value such as `-252,000,000`.

### Test Information
- Feature: FR-09 - Discount Coupons
- Test case: FR09-DT-01
- Severity: High
- Automation: Playwright
- Evidence: `screenshots/FR09-DT-01-chromium.png`

## BUG-FR09-002: Coupon at exact minimum order boundary is rejected

### Description
The coupon validation rejects an order at the exact minimum order boundary, although the boundary value should be accepted.

### Steps to Reproduce
1. Open the customer web application.
2. Add products to create an order total of exactly `28,000,000`.
3. Go to checkout.
4. Apply coupon code `TEST1`.
5. Observe the coupon validation result.

### Expected Result
The coupon should be accepted when the order total is exactly equal to the minimum required amount.

### Actual Result
The coupon is rejected at the exact boundary value.

### Test Information
- Feature: FR-09 - Discount Coupons
- Test case: FR09-BVA-02
- Severity: Medium
- Automation: Playwright
- Evidence: `screenshots/FR09-BVA-02-chromium.png`

## BUG-FR09-003: Fixed discount coupon can produce negative final amount

### Description
A fixed discount coupon can reduce the final checkout amount below zero.

### Steps to Reproduce
1. Open the customer web application.
2. Add products with a total lower than the fixed coupon discount impact.
3. Go to checkout.
4. Apply coupon code `NEW10`.
5. Observe the final amount.

### Expected Result
The final amount should never be negative. The system should cap the discount or reject the coupon when it exceeds the payable amount.

### Actual Result
The final amount becomes negative. Automation observed a value such as `-72,000,000`.

### Test Information
- Feature: FR-09 - Discount Coupons
- Test case: FR09-DT-07
- Severity: High
- Automation: Playwright
- Evidence: `screenshots/FR09-DT-07-chromium.png`

## BUG-FR15-001: Whitespace-only product name is accepted

### Description
The product management form accepts a product name that contains only whitespace characters.

### Steps to Reproduce
1. Open the admin product management page.
2. Create a new product.
3. Enter only spaces in the product name field.
4. Fill in the other required fields with valid values.
5. Submit the form.

### Expected Result
The system should trim the product name and reject it as an empty required value.

### Actual Result
The product is created successfully with an invalid whitespace-only name.

### Test Information
- Feature: FR-15 - Product Management CRUD
- Test case: FR15-DT-08
- Severity: Medium
- Automation: Playwright
- Evidence: `screenshots/FR15-DT-08-chromium.png`

## BUG-FR15-002: Empty product price is accepted when creating or updating product

### Description
The product management form accepts an empty price value when creating or updating a product.

### Steps to Reproduce
1. Open the admin product management page.
2. Create or edit a product.
3. Leave the price field empty.
4. Fill in the other required fields with valid values.
5. Submit the form.

### Expected Result
The system should reject the submission and display a required price validation error.

### Actual Result
The empty price value is accepted, causing invalid product data to be created or existing product data to be changed incorrectly.

### Test Information
- Feature: FR-15 - Product Management CRUD
- Test case: FR15-DT-05
- Severity: High
- Automation: Playwright
- Evidence: `screenshots/FR15-DT-05-chromium.png`

## BUG-FR15-003: Zero or negative product price is accepted

### Description
The product management form accepts invalid product prices such as `0` or negative values.

### Steps to Reproduce
1. Open the admin product management page.
2. Create or edit a product.
3. Enter `0` or a negative value in the price field.
4. Fill in the other required fields with valid values.
5. Submit the form.

### Expected Result
The system should reject zero and negative product prices.

### Actual Result
The product is created or updated successfully with an invalid price value.

### Test Information
- Feature: FR-15 - Product Management CRUD
- Test cases: FR15-DT-15, FR15-BVA-07
- Severity: High
- Automation: Playwright
- Evidence: `screenshots/FR15-DT-15-chromium.png`

## BUG-FR15-004: Product name longer than 255 characters is accepted

### Description
The product management form accepts product names longer than the expected maximum length.

### Steps to Reproduce
1. Open the admin product management page.
2. Create or edit a product.
3. Enter a product name longer than 255 characters.
4. Fill in the other required fields with valid values.
5. Submit the form.

### Expected Result
The system should reject product names longer than 255 characters.

### Actual Result
The long product name is accepted successfully.

### Test Information
- Feature: FR-15 - Product Management CRUD
- Test case: FR15-DT-13
- Severity: Medium
- Automation: Playwright
- Evidence: `screenshots/FR15-DT-13-chromium.png`

## BUG-FR15-005: Updating one product changes multiple product rows in UI

### Description
Updating one product causes multiple product rows in the UI to display the same updated information.

### Steps to Reproduce
1. Open the admin product management page.
2. Select one product to edit.
3. Change the product information.
4. Submit the update.
5. Observe the product list.

### Expected Result
Only the selected product should be updated.

### Actual Result
Multiple product rows in the UI are changed to the same updated information.

### Test Information
- Feature: FR-15 - Product Management CRUD
- Test case: FR15-DT-03
- Severity: High
- Automation: Playwright
- Evidence: `screenshots/FR15-DT-03-chromium.png`

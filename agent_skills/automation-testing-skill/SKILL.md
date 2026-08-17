# Automation Testing Skill

Use this skill to convert reviewed HW02 test cases into executable, data-driven Playwright automation for the EShop SUT. This skill does not replace test design; it automates existing test cases selected for HW04.

## Purpose

Support the HW04 automation workflow for:

- FR-03: Forgot password and password reset
- FR-09: Discount coupons
- FR-15: Product management CRUD

The expected result is runnable Playwright specs, external JSON/CSV test data, multi-browser execution evidence, and notes for the AI Audit Report.

## Required Inputs

Provide the HW02 test case folder or copied tables before generating automation. The input should include, when available:

- Feature ID and feature name
- Test case ID
- Preconditions
- Test steps
- Test data
- Expected result
- Related bug ID or screenshot from HW02
- HW02 actual result and status, if already recorded

Example input path:

```text
../../hw2_features/test_cases_summary.md
```

## Output Structure

Create or update only HW04 deliverables:

```text
data/
tests/
reports/
bug_reports/
screenshots/
```

Do not modify or commit `EShop-source/`. Treat it as the SUT/reference bundle.

## Procedure

1. Read the selected HW02 feature folder and identify the test cases that belong to FR-03, FR-09, or FR-15.
2. Map each HW02 test case to one automation case. Keep the original test case ID in the data file.
   Preserve HW02 `actualResult`, `status`, and `bugId` as source/reference fields; do not use HW02 status as the final HW04 automation result.
3. Store all input data in `data/*.json` or `data/*.csv`; do not hardcode test case arrays in `.spec.js`.
4. Generate Playwright specs in `tests/*.spec.js`.
5. Use stable selectors first: role, label, placeholder, accessible name, visible text. Avoid brittle CSS chains.
6. Use at least three assertion patterns across the suite, such as `toBeVisible`, `toHaveText`, `toContainText`, `toHaveURL`, and `toHaveValue`.
7. Run the suite on Chromium, Firefox, and WebKit.
8. Review failures as a human tester. Fix weak selectors, missing waits, weak assertions, and mismatches between HW02 expected results and actual SUT behavior.
9. Record what the AI generated incorrectly or incompletely in `reports/ai_audit_report.md` and `reports/main_report.md`.
10. If a failing assertion reveals a real SUT defect, document it in `bug_reports/bug_report.md` with screenshot evidence and a GitHub Issue link.

## Automation Rules

- Reuse HW02 test cases as the test basis.
- Do not invent replacement test cases unless HW02 input is incomplete; if adding a supporting case, label it clearly as an automation support case.
- Keep HW02 status and bug IDs in summaries or data files when they explain known SUT behavior, but separate them from Playwright execution status.
- Keep each feature at 12 or more automated cases for HW04.
- Keep test data external to the spec files.
- Keep credentials, URLs, and environment-dependent values configurable.
- Preserve trace, screenshot, video, and HTML report evidence from real execution.

## Review Checklist

Before considering a generated script final, verify:

- The script maps back to HW02 test case IDs.
- The test can run from a clean state or documents required setup.
- Assertions check meaningful behavior, not only page loading.
- Negative cases assert the expected error state.
- Coupon and product CRUD tests clean up created data where practical.
- The Playwright HTML report includes `Run by: 23127364` and an ISO timestamp.

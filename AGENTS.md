# Repository Guidelines

## Project Structure & Module Organization

This repository contains an EShop homework/testing project. Application code is under `EShop-source/`:

- `backend/`: Node.js, Express, SQLite API. Key files are `server.js`, `database.js`, `database.sqlite`, and `test_profile.js`.
- `frontend-web/`: customer-facing React + Vite + Tailwind app. Source lives in `src/`, with pages in `src/pages/`, shared state in `src/context/`, and static assets in `src/assets/` and `public/`.
- `frontend-admin/`: admin React + Vite + Tailwind app. Source is in `src/`, assets in `src/assets/` and `public/`.
- `docs/`: assignment and requirements documentation for test design and validation.

## Build, Test, and Development Commands

Run commands from each package directory after `npm install`.

- Backend: `cd EShop-source/backend && node server.js` starts the API on `http://localhost:3000`.
- Customer web: `cd EShop-source/frontend-web && npm run dev` starts Vite, typically on `http://localhost:5173`.
- Admin web: `cd EShop-source/frontend-admin && npm run dev` starts Vite, typically on `http://localhost:5174`.
- Frontend build: `npm run build` creates production assets.
- Frontend lint: `npm run lint` runs ESLint.

`run_servers.sh` contains machine-specific absolute paths, so prefer the commands above unless you update it locally.

## Coding Style & Naming Conventions

Use JavaScript/JSX throughout. Existing code uses 2-space indentation, semicolons, React functional components, and PascalCase component/page filenames such as `ProductDetail.jsx`. Keep context providers in `src/context/` and route pages in `src/pages/`. Prefer parameterized SQL queries in backend code and avoid rendering user input with `dangerouslySetInnerHTML`.

## Testing Guidelines

No automated test framework is configured yet; `backend/package.json` has only the default failing `npm test` placeholder. For now, validate changes manually against `EShop-source/README.md`, `api_specification.md`, and `docs/`. When adding tests, place backend API tests near `backend/` and frontend tests next to the component or page they cover, using names like `Login.test.jsx` or `orders.api.test.js`.

## Commit & Pull Request Guidelines

This checkout does not include Git history, so no local commit convention can be inferred. Use concise imperative commit messages, for example `Fix coupon usage validation` or `Add admin product import checks`. Pull requests should include a short summary, manual test steps, affected areas (`backend`, `frontend-web`, `frontend-admin`), linked issues or requirement IDs, and screenshots for UI changes.

## Security & Configuration Tips

Do not commit real secrets or production databases. The backend uses a hard-coded JWT secret and plaintext demo credentials; treat these as teaching fixtures and replace them with environment variables before non-demo deployment.

## Assignment Scope

Treat `EShop-source/` and assignment-provided files as reference material unless the homework explicitly requires changing them. Do not push `EShop-source/` or unrelated generated files. Keep `.gitignore` aligned with the assignment so submissions include only required deliverables and exclude local dependencies, build output, databases, logs, and environment files.

# AtLast — Frontend

> **Status**: Active Development  
> **Version**: 0.1.0
> Last updated: 2026-01-28

An immersive hacking-simulation interface built with modern web technologies, aiming for a premium "Apple-like Dark Mode" aesthetic blended with cyberpunk interactions.

## ⚡ Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion
- Leaflet (maps)
- Lucide React (icons)

(Badges removed from this file to keep README lightweight — re-add if you prefer image badges.)

## 🚀 Key Features

Core / Hacking Simulation
- Immersive Intro Sequence: cinematic entry into the command center (`/intro`).
- Breach Protocol: interactive hacking mechanics (`/breach`) with dynamic success/fail states.
- Geospatial Tracking: real-time map visualizations using Leaflet.
- Seamless Handoff: dedicated workflows for user state transition (`/handoff`).

UI / UX
- Premium Dark Mode: deep blacks and glassmorphism effects.
- Fluid Animations: high-performance transitions powered by Framer Motion.
- Responsive Design: mobile-first architecture with tailored experiences across devices.

## 🛠️ Quick Start (local development)

1. Clone the repository
   ```bash
   git clone https://github.com/ManishRShetty/AtLast.git
   cd AtLast/FrontEnd
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn
   ```

3. Run the development server
   ```bash
   npm run dev
   # or pnpm dev / yarn dev
   ```

4. Open http://localhost:3000 in your browser.

## 📦 Available Scripts

From the `FrontEnd` folder:

- `dev` — Run Next.js in development mode.
- `build` — Create an optimized production build.
- `start` — Start the production server (after `build`).
- `lint` — Run linter (if configured).
- `type-check` — Run TypeScript checks (if applicable).
- `preview` — Preview the production build locally.

(Exact scripts live in `package.json` — check there for precise commands.)

## 📂 Project Structure

- `/app` — Next.js App Router
  - `/breach` — Main hacking game logic
  - `/intro` — Application entry sequence
  - `/handoff` — State transition interface
  - `/play` — Gameplay components
- `/components` — Reusable UI components (buttons, cards, map widgets)
- `/public` — Static assets
- `/styles` — Global and Tailwind configuration (if present)

## 🔧 Environment

Place runtime configuration (API endpoints, keys) in environment files as appropriate:

- `.env.local` — local development environment variables
- `.env.production` — production variables (do NOT commit secrets)

Example:
```
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_MAPBOX_TOKEN=your-map-token
```

## 🚢 Deployment

This project is compatible with common Next.js hosts (Vercel, Netlify, Render). Typical flow:

1. Build: `npm run build`
2. Start server: `npm start` (or platform-managed)

Ensure environment variables are set in your deployment target.

## ✅ Testing & Quality

- Add unit/integration tests as needed (Jest/React Testing Library recommended).
- Run type checks and linters before creating PRs.
- Use CI to enforce checks on branches.

## ♻️ Contributing

Contributions are welcome!

- Fork the repo
- Create a feature branch: `git checkout -b feat/your-feature`
- Make changes with clear commit messages
- Open a Pull Request describing the change and why it's needed

Please follow any CONTRIBUTING.md or CODE_OF_CONDUCT in the root if present.

## 📝 Changelog (recent)

- 2026-01-28 — README updated with improved setup, scripts, environment and deployment guidance.

(For larger changes, maintain a dedicated CHANGELOG.md or use GitHub releases.)

## ⚠️ Known Issues & TODOs

- Add comprehensive tests for core gameplay (`/breach`).
- Improve accessibility (contrast issues in certain overlays).
- Add CI workflow to run lint/type/test on PRs.
- Expand documentation for each route/component.

## 📫 Contact / Support

For questions or help, open an issue or reach out via GitHub Discussions (or create a PR with fixes).

---

If you'd like, I can:
- Commit this updated README directly to the `main` branch,
- Create a new branch with the update and open a PR,
or
- Make further edits (add badges, more detailed environment examples, or a full CHANGELOG).

Tell me which option you prefer and whether I should push the change now.

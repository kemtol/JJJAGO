# JAGOALGO.id - Project Context

## Project Overview
JAGOALGO.id is an e-learning platform aimed at young students and professionals to learn creative and technical skills (UI/UX, Web Development, Illustration). It provides an affordable and flexible learning experience with high-quality courses from experienced instructors.

### Architecture & Technologies
- **Frontend:** HTML5, CSS3, Bootstrap 5.3, jQuery.
- **Backend/Hosting:** Cloudflare Workers (`workers/www`), managed via Wrangler.
- **Storage:** Cloudflare KV (`CLASSES_KV` bound via `wrangler.toml`). Static assets are served from the `workers/www/public` directory using `@cloudflare/kv-asset-handler`.
- **Design:** Uses Inter font, Bootstrap Icons 1.11, and a specific color palette (Primary: `#7c6fcd`, Accent: `#5dbfb0`).

## Building and Running
The project is built as a Cloudflare Worker that serves a static site from the `workers/www/public` directory.

- **Deployment/Development:** The project uses `wrangler` (Cloudflare CLI). You would typically run `npx wrangler dev` inside the `workers/www` directory for local development, and `npx wrangler deploy` to push to production. 
- *(Note: Ensure dependencies in `workers/www` are installed via `npm install` before running Wrangler).*

## Development Conventions
- **Directory Structure:**
  - `workers/www/`: Contains the Cloudflare Worker setup.
  - `workers/www/public/`: Contains the static frontend files (HTML, CSS, JSON data, images).
  - `workers/www/src/index.js`: The main entry point for the Cloudflare Worker script.
- **Design Guidelines:** The UI should be friendly, youthful, and professional, utilizing a border-radius of `1rem` and emphasizing mobile responsiveness (desktop-first approach).
- **Product Roadmap:** Future features include complete course lists, user authentication (OTP), user dashboards, payment integration, and video players.

*(Refer to `PRD.md` for complete product requirements and feature roadmaps).*
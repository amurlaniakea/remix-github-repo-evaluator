# github-repo-evaluator

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.txt)

**GitHub Repository Evaluator** — A React/TypeScript application for evaluating GitHub repositories.

## Features

- **Repository Analysis**: Evaluate GitHub repos with dependency scoring, issue tracking, and quality metrics
- **PDF Report Generation**: Generate detailed PDF reports with score gauges and dependency cards
- **Modern Stack**: React 19 + TypeScript + Vite + TailwindCSS 4 + Express backend
- **AI Integration**: Uses Google GenAI for intelligent repository analysis

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set your `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual Gemini API key
   ```

   > ⚠️ **Security Note**: `.env.local` is already included in `.gitignore` (via `.env*`) to prevent accidental credential commits to GitHub.

3. Run the app:
   ```bash
   npm run dev
   ```

## ⚠️ React 19 Compatibility Note

This project uses **React 19**, which introduces significant changes to hooks and concurrent rendering. Some third-party libraries (especially PDF generation or charting libraries) may emit console warnings or require updates for full compatibility. If you encounter issues with PDF rendering or score gauges, check the browser console and consider updating those dependencies.

## License

AGPL-3.0-or-later — Copyright (C) 2026 Pedro Sordo Martínez — amurlaniakea@gmail.com

See [LICENSE](LICENSE) for the full license text.
   `npm run dev`

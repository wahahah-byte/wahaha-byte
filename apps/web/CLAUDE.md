# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 application (App Router) with React 19, TypeScript 5, and Tailwind CSS 4. Package manager is npm.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm start` — Serve production build
- `npm run lint` — Run ESLint

No test framework is configured yet.

## Architecture

- **App Router**: All routes live under `src/app/` using Next.js App Router conventions
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS v4 via PostCSS plugin (`@tailwindcss/postcss`), global styles in `src/app/globals.css`
- **Fonts**: Geist font family loaded via `next/font`
- **TypeScript**: Strict mode enabled

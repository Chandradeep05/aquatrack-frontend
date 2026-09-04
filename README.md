# AquaTrack — Frontend Web Application

Modern, responsive web application for **AquaTrack** — an intuitive daily water intake tracker designed for seamless hydration logging, progress visualization, historical tracking, and comprehensive administrative oversight.

Developed for the **Kravix Tech Fullstack Internship Assignment**.

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Application Architecture](#application-architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Routes & Role-Based Guarding](#routes--role-based-guarding)
- [Design Decisions & Fallbacks](#design-decisions--fallbacks)
- [Verification & Build](#verification--build)

---

## Overview

AquaTrack frontend delivers a SaaS-grade, mobile-responsive user experience across two separate user roles:
1. **User Experience**:
   - Visual daily progress card displaying today's intake against the target goal (with guaranteed 2000 ml default fallback).
   - Quick-add buttons for instant logging (+250ml cup, +500ml bottle, +750ml flask, +1000ml carafe) alongside custom volume input.
   - Real-time entry timeline with timestamps and inline deletion.
   - Comprehensive history view grouping past hydration by calendar date with achievement badges.
2. **Admin Experience**:
   - System overview cards: Total Users, Total Intake Logs, Today's Total System Volume, and Current Active Goal.
   - User management table with one-click user intake history inspection.
   - Safe user deletion with confirmation modal and explicit cascade deletion warnings.
   - Client-side safeguard locking out admin self-deletion.
   - Global recommended daily goal configuration form with immediate feedback.

---

## Key Features

- **Modern & Clean UI**: Built with Tailwind CSS, custom hydration palettes (brand blues, cyans, emeralds), smooth SVG progress rings, and Lucide icons.
- **Route Guarding & State**: JWT-backed `AuthContext` with automatic session restoration via `GET /api/auth/me` and role-based `<ProtectedRoute />` redirects.
- **Defensive Error Handling & Toasts**: Non-intrusive toast notifications for feedback on logs, updates, deletions, and error responses.
- **Zero-Crash Goal Fallback**: Always falls back defensively to `2000 ml` if backend data or settings are uninitialized.
- **Axios Interceptor Pipeline**: Transparently injects Bearer JWT on requests and automatically redirects on expired session `401` responses.

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors

---

## Application Architecture

```
aquatrack-frontend/
├── src/
│   ├── api/
│   │   ├── client.ts          # Configured Axios instance with JWT & 401 interceptors
│   │   ├── authApi.ts         # Register, Login, GetMe session restore
│   │   ├── intakeApi.ts       # Log intake, Today summary, History, Delete entry
│   │   ├── adminApi.ts        # All users with metrics, user inspection, user delete
│   │   └── settingsApi.ts     # Daily goal get & update
│   ├── components/
│   │   ├── common/
│   │   │   ├── ProtectedRoute.tsx # Role-aware route guard
│   │   │   └── Modal.tsx          # Accessible modal dialog
│   │   └── layout/
│   │       ├── Navbar.tsx         # Responsive navbar with user profile & role badge
│   │       └── Layout.tsx         # Outer app shell with footer
│   ├── context/
│   │   ├── AuthContext.tsx        # Persistent user session, login, register, logout
│   │   └── ToastContext.tsx       # Global toast notifications
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx          # Login view with demo credentials helper
│   │   │   └── Register.tsx       # Registration form with validation
│   │   ├── user/
│   │   │   ├── Dashboard.tsx      # Today progress, quick add, entry list
│   │   │   └── History.tsx        # Calendar-grouped history with stats
│   │   └── admin/
│   │       └── Dashboard.tsx      # Metrics, user table, goal config, delete modal
│   ├── types/
│   │   └── index.ts               # Complete TypeScript data contracts
│   ├── App.tsx                    # Route definitions
│   ├── index.css                  # Tailwind styles
│   └── main.tsx                   # React root entrypoint
├── .env.example                   # Environment configuration template
├── package.json                   # Dependencies, build, and verify scripts
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript compiler settings
├── vite.config.ts                 # Vite bundler configuration
└── README.md                      # Documentation
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Running AquaTrack backend API (`http://localhost:5000`)

### Installation
1. Clone the repository and navigate into the directory:
   ```bash
   git clone https://github.com/Chandradeep05/aquatrack-frontend.git
   cd aquatrack-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Default `.env` points to:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open your browser at `http://localhost:5173`.

---

## Routes & Role-Based Guarding

| Path | Access | Description |
|---|:---:|---|
| `/login` | Public | User & Administrator sign-in |
| `/register` | Public | Account registration (always creates standard user) |
| `/` | Authenticated (User) | User dashboard with today summary & quick add |
| `/history` | Authenticated (User) | Chronological intake history grouped by date |
| `/admin` | Admin Only | Admin console: metrics, user management, goal config |

---

## Design Decisions & Fallbacks

- **Defensive Goal Fallback**: If the API returns `null` or undefined for `dailyGoalMl`, the frontend falls back seamlessly to `2000 ml` without breaking or showing NaN percentages.
- **Admin Self-Deletion Safeguard**: Admins cannot delete their own account. The button is disabled on their own row, and any attempt is trapped client-side before reaching the server's `400 Bad Request` guard.
- **Single Active Goal Evaluation**: Historical records are evaluated against the currently configured system-wide daily goal.

---

## Verification & Build

Verify TypeScript compilation and production build:
```bash
npm run verify
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

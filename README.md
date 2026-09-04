# Team Directory

A modern, polished **Employee Directory** web app built with Next.js (App Router), PostgreSQL, and Prisma ORM. Features a clean dashboard with search, department filters, and full CRUD via modals and dialogs.

## Features

- **Create** — add employees via a validated modal form (name, email, department, role, status, avatar color).
- **Read** — responsive dashboard with live search (by name) and department filter, count badges, and status pills.
- **Update** — edit any employee through a pre-filled modal form.
- **Delete** — safe removal with a confirmation dialog.
- Polished UI: Tailwind CSS, status badges (green/amber/red), hover transitions, inline validation errors, and a mobile-responsive layout.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, React, TypeScript)
- [Prisma ORM](https://www.prisma.io/) + PostgreSQL
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/) for form validation
- [Lucide](https://lucide.dev/) icons

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the database connection in `.env`:

   ```env
   DATABASE_URL="postgresql://postgres:apple@localhost:5432/employee_directory?schema=public"
   ```

3. Create the database schema:

   ```bash
   npm run prisma:push
   ```

4. Seed with sample employees (optional):

   ```bash
   npm run seed
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

| Command                  | Description                       |
| ------------------------ | --------------------------------- |
| `npm run dev`            | Start the development server      |
| `npm run build`          | Create a production build         |
| `npm run start`          | Start the production server       |
| `npm run lint`           | Lint the codebase                 |
| `npm run prisma:push`    | Sync the Prisma schema to the DB  |
| `npm run seed`           | Seed the database with sample data|

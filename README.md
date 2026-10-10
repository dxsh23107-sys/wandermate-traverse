This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin portal and database setup

The admin portal is available at `/admin/login`; after a successful login it opens `/admin/dashboard`.

The app uses PostgreSQL. Set `DATABASE_URL` in the environment where the app runs (for Vercel, add it to the project's Environment Variables). The build command runs `prisma db push` before building Next.js so the database schema is present. A database connection must be available during the build.

To create the initial admin account in a new or intentionally reset database, run `npx prisma db seed` after configuring `DATABASE_URL`. The seed script clears existing application records before inserting sample data, so do not run it against a database whose data must be preserved. The seeded development credentials are defined in `prisma/seed.ts`; change them before using the portal in production.

If login returns “Internal server error,” inspect the server or deployment logs for the `Login error:` entry. A Prisma `P1001` error points to database connectivity; `P2021` means a table is missing.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

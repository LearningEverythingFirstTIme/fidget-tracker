# 🎯 Fidget Tracker

A collection manager for fidget toy enthusiasts. Track your spinners, sliders, clickers, and more.

## Tech Stack

- **Frontend:** Next.js 15+ (App Router), Tailwind CSS
- **Auth:** Clerk
- **Database:** Neon (Postgres)
- **ORM:** Prisma
- **Deployment:** Vercel

## Setup

### 1. Clone and Install

```bash
cd fidget-tracker
npm install
```

### 2. Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Copy the connection string from the dashboard
3. It looks like: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 3. Set Up Clerk

1. Go to [clerk.com](https://clerk.com) and create a new application
2. Get your **Publishable Key** and **Secret Key** from the dashboard
3. (Optional) Set up a webhook for user sync:
   - URL: `https://your-domain.com/api/webhook/clerk`
   - Events: `user.created`
   - Copy the signing secret

### 4. Configure Environment Variables

Create `.env.local` with:

```env
DATABASE_URL="your_neon_connection_string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
CLERK_WEBHOOK_SECRET=whsec_your_secret  # optional
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 5. Run Database Migration

```bash
npx prisma generate
npx prisma db push
```

### 6. Seed Categories

```bash
npx prisma db seed
```

This seeds 12 parent categories with 60+ subcategories covering all fidget toy types.

### 7. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy!

## Categories

The app comes pre-seeded with:

| Category | Subcategories |
|----------|--------------|
| Spinners | Classic, Bar, Compact/Mini, Transformable, Precision, Gear, Top, Fidget Disc |
| Sliders | Magnetic, Multi-Stage, Linear, Ratchet, Curved, Omni-Directional, Ceramic Ball, Gear |
| Clickers/Pushers | Pill Pusher, Dimpler, Multi-Click, Tactile Switch, Snap Click, Piston Pusher, Platform Clicker |
| Rockers | See-Saw, Magnetic, Weighted, Pivot |
| Cubes & Multi-Function | Fidget Cube, Fidget Pad, Infinity Cube, Shape-Shifting Cube |
| Bolt Actions | Linear, Rotary, Tactical |
| Coins & Discs | Worry Coin, Haptic Coin, Spinning Coin, Press Coin, Slider Coin |
| Rollers | Orbital, Frictionless, Thumb, Marble |
| Twistables | Tangle, Wacky Tracks, Flexible Chain, Twist Lock |
| Squishables | Stress Ball, Slow-Rise Foam, Squishy Toy, Putty, Sensory Ball |
| Bead & String | Begleri, Worry Beads, Flippy Chain, Baoding Balls |
| Mechanical/Specialty | Piston, Gyroscope, Spring, Pop Mechanism, Zipper, Lanyard Snapper |

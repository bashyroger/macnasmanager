# Studio Macnas Platform

Bespoke handcrafted bags management and public showcase platform.

## 🚀 Features

- **Product Passport**: Public-facing showcase for handcrafted products with sustainability and financial transparency.
- **Project Management**: Internal dashboard for tracking client projects, from inquiry to delivery.
- **Resource Management**: Comprehensive tracking of materials, costs, and labor time.
- **Deterministic Math**: Centralized business logic for financial calculations, sustainability scoring, and product tiering.
- **Calendar Integration**: Automatic time entry syncing from Google Calendar via project short codes.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database/Auth**: Supabase
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Premium Aesthetics)
- **Testing**: Vitest (Business Logic)
- **CI/CD**: GitHub Actions

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- Supabase account & project

### Environment Variables

Create a `.env.local` file in the `application` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Calendar Integration (Optional for local dev)
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### Installation

```bash
cd application
npm install
```

### Database Setup

1. Run the migrations in the `supabase/migrations` folder against your project.
2. Ensure the `v_project_public_showcase` view is created.

### Running Locally

```bash
npm run dev
```

## 🧪 Testing

The platform uses `vitest` for deterministic business logic validation.

```bash
npx vitest run
```

Critical logic is centralized in `lib/business-logic.ts`.

## 🔒 Security & Hardening

- **UTF-8 Enforcement**: All files must be UTF-8 encoded.
- **ARIA/a11y**: All core forms and public routes are optimized for screen readers.
- **Performance**: Image optimization via `next/image` with Supabase Storage integration.

## 📄 License

Internal Studio Macnas Property.

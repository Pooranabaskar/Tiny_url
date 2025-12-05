# TinyLink - URL Shortener

A full-featured URL shortener application similar to bit.ly, built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- ✅ Create short links with optional custom codes (6-8 alphanumeric characters)
- ✅ URL validation before saving
- ✅ Automatic code generation if no custom code provided
- ✅ Click tracking and statistics
- ✅ Delete links (returns 404 after deletion)
- ✅ Dashboard with search/filter functionality
- ✅ Individual link statistics page
- ✅ Health check endpoint
- ✅ Clean, responsive UI with proper error handling

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or Neon/other cloud provider)
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd tiny-home
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your database URL:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

For production, set `NEXT_PUBLIC_BASE_URL` to your deployed URL (e.g., `https://your-app.vercel.app`).

### 4. Set up the database

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Create Link

```
POST /api/links
Body: { "url": "https://example.com", "code": "optional" }
Returns: 201 with link data, 409 if code exists, 400 if validation fails
```

### List All Links

```
GET /api/links
Returns: Array of all non-deleted links
```

### Get Link Stats

```
GET /api/links/:code
Returns: Link data or 404 if not found
```

### Delete Link

```
DELETE /api/links/:code
Returns: Success message or 404 if not found
```

### Health Check

```
GET /healthz
Returns: { "ok": true, "version": "1.0", "uptime": number }
```

## Routes

- `/` - Dashboard (list, add, delete links)
- `/code/:code` - Statistics page for a specific link
- `/:code` - Redirect to original URL (302 redirect)
- `/healthz` - Health check endpoint

## Code Requirements

- Short codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`
- Custom codes are globally unique
- URLs are validated before saving
- Deleted links return 404

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXT_PUBLIC_BASE_URL` - Your Vercel deployment URL
4. Deploy!

### Database Setup (Neon)

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `DATABASE_URL` environment variable
4. Run `npx prisma db push` to set up the schema

## Testing

The application follows the specified URL conventions for automated testing:

- `/healthz` returns 200
- Creating a link works; duplicate codes return 409
- Redirect works and increments click count
- Deletion stops redirect (404)
- UI meets expectations (layout, states, form validation, responsiveness)

## Project Structure

```
app/
  api/
    links/
      [code]/route.ts    # GET/DELETE individual link
      route.ts           # POST/GET all links
  [code]/
    route.ts             # Redirect handler
  code/
    [code]/
      page.tsx           # Stats page
  components/
    Dashboard.tsx        # Main dashboard component
    LinkForm.tsx         # Form to create links
    LinkTable.tsx        # Table displaying links
  healthz/
    route.ts             # Health check endpoint
lib/
  prisma.ts              # Prisma client instance
  utils.ts               # Utility functions
prisma/
  schema.prisma          # Database schema
```

## License

MIT

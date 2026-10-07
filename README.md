# AI Automation Opportunity Scanner

An AI-powered tool that analyzes websites to identify business automation opportunities. It uses Firecrawl for web scraping, Gemini AI for intelligent analysis, and provides detailed automation recommendations with implementation blueprints.

## Features

- **Website Analysis**: Deep analysis of website structure, forms, CTAs, and customer touchpoints
- **Customer Journey Mapping**: Visual representation of how customers discover and engage with your business
- **Automation Opportunity Detection**: AI-powered identification of processes that can be automated
- **Priority Scoring**: Opportunities ranked by business impact, frequency, automation fit, and confidence
- **Automation Blueprints**: Step-by-step implementation guides for each opportunity
- **Full Report Generation**: Comprehensive PDF-ready reports with all findings

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **AI Engine**: Gemini AI (Google)
- **Web Research**: Firecrawl
- **Database**: Supabase (PostgreSQL)

## Architecture

```
┌─────────────────────┐
│  Next.js Frontend   │
│  React + Tailwind   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Next.js Backend    │
│  API Routes / Server│
└──────────┬──────────┘
           │
    ┌──────┼──────┐
    ▼      ▼      ▼
┌───────┐ ┌────┐ ┌──────────┐
│ Web   │ │ AI │ │ Database │
│Research│ │Engine│ │Supabase │
│Firecrawl│ │Gemini│ │PostgreSQL│
└───┬───┘ └──┬─┘ └────┬────┘
    │        │         │
    └────────┴────┬────┘
                 ▼
         ┌──────────────┐
         │  Analysis    │
         │  Pipeline    │
         └──────┬───────┘
                ▼
    ┌───────────────────────┐
    │  Automation Scanner   │
    │  + Report Generator   │
    └───────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm, pnpm, or yarn
- Supabase account
- Firecrawl API key
- Gemini AI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-scanner
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your API keys in `.env.local`

### Database Setup

Run the SQL schema in `supabase/schema.sql` in your Supabase SQL editor to create the required tables.

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the application.

### Build

```bash
npm run build
npm run start
```

## Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions to:

- Railway (recommended)
- Render
- Vercel
- Docker

## Usage

1. Enter a website URL to analyze
2. Optionally provide company information (name, industry, location)
3. Click "Scan Business" to start the analysis
4. Wait for the AI to complete its analysis
5. Review the results in the dashboard:
   - **Overview**: Business profile summary
   - **Process Map**: Visual customer journey
   - **Opportunities**: Ranked automation opportunities
   - **Blueprints**: Implementation steps for each opportunity
   - **Full Report**: Complete analysis report

## License

MIT

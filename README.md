# BillSage - AI-Powered Medical Bill Analysis

BillSage helps families save money on medical bills through AI-powered analysis and transparent pricing data. Upload your medical bill and let our AI identify overcharges, billing errors, and potential savings.

## Features

- 🤖 **AI-Powered Analysis** - Advanced AI scans every line item to identify overcharges
- 💰 **Instant Savings** - Get immediate insights into potential savings
- 🔒 **HIPAA Compliant** - Bank-level encryption and HIPAA-compliant security
- 📊 **Transparent Pricing** - Access fair market pricing data
- 📱 **Multi-Format Support** - Upload PDFs, CSVs, or images of your bills
- 📈 **Dashboard Analytics** - Track your savings over time

## Tech Stack

- **Framework**: Next.js 16.0.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Authentication**: Clerk
- **AI**: Google Gemini 2.0 Flash
- **Database**: PostgreSQL (with temp localStorage fallback)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (optional - uses localStorage by default)
- Clerk account for authentication
- Google AI API key for Gemini

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bill-sage-saa-s-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# PostgreSQL (Optional)
POSTGRES_URL=your_postgres_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── features/          # Features page
│   ├── pricing/           # Pricing page
│   ├── about/             # About page
│   ├── blog/              # Blog page
│   ├── careers/           # Careers page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── hipaa/             # HIPAA compliance
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── landing/           # Landing page components
│   ├── modals/            # Modal components
│   ├── ui/                # Shadcn UI components
│   └── upload/            # Upload-related components
├── lib/                   # Utility functions and configurations
│   ├── auth-context.tsx   # Authentication context
│   ├── temp-storage.ts    # localStorage-based storage
│   ├── db-server.ts       # PostgreSQL database operations
│   ├── gemini-analyzer.ts # AI bill analysis
│   └── types.ts           # TypeScript type definitions
└── public/                # Static assets
```

## Key Features Implementation

### Free Tier Limits
- Free users are limited to 3 bill uploads
- Upgrade modal appears when limit is reached
- "My Plan" section on dashboard shows usage

### Bill Analysis Flow
1. User uploads bill (PDF, CSV, or image)
2. OCR extraction (for PDFs and images)
3. AI analysis using Google Gemini
4. Savings calculation and report generation
5. Results stored in database/localStorage

### Dashboard Metrics
- Total bills analyzed
- Total savings identified
- Savings rate with trend calculation
- Monthly savings chart
- Recent bills list

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `GEMINI_API_KEY` | Google AI API key | Yes |
| `POSTGRES_URL` | PostgreSQL connection string | No |

## Security & Compliance

- ✅ HIPAA-compliant data handling
- ✅ End-to-end encryption
- ✅ Secure authentication with Clerk
- ✅ No data sharing with third parties
- ✅ Regular security audits

## Contributing

This is a private project. For questions or issues, please contact the development team.

## License

Proprietary - All rights reserved

## Support

For support, email support@billsage.com or visit our help center.

---

Built with ❤️ by the BillSage Team

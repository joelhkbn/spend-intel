# Spend Intel

**Minimalist wealth intelligence.**

Spend Intel is a premium, fast, and minimal personal spending intelligence app. It allows you to upload bank transactions or analyze spending graphs using AI to instantly gain insights into your wealth.

## ✨ Key Features

- **Multi-Source Ingestion**:
  - **CSV Upload**: Parse and normalize data from any flexible CSV format.
  - **AI Vision Analysis**: Upload screenshots of bank statements, charts, or summaries. Powered by **Gemini 1.5 Flash**.
- **Modern Dashboard**:
  - **Category Breakdown**: Interactive donut charts for instant spending analysis.
  - **Summary Metrics**: High-level view of total spend and top categories.
  - **Interactive Table**: Searchable, paginated transaction history with CSV export support.
- **Intelligent Engine**:
  - **Auto-Categorization**: Deterministic rules engine mapping merchants to categories.
  - **Deduplication**: Intelligent hashing to prevent duplicate transaction entries.
- **Premium Design**: Sleek glassmorphism UI built with vanilla CSS for a high-end "iOS-style" feel.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS (Custom Glassmorphism System)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: [Auth.js (NextAuth)](https://next-auth.js.org/)
- **AI**: [Google Gemini Pro Vision](https://ai.google.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance
- Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/spend-intel.git
   cd spend-intel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/spend_intel"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Initialize Database**:
   Run the schema provided in `schema.sql` on your Postgres database.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Access the app**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Repository Structure

- `src/app/api`: Backend routes for transactions, AI vision, and auth.
- `src/components`: UI components (Glassmorphism containers, charts, tables).
- `src/lib`: Core logic (CSV parser, categorization engine, AI utilities).
- `schema.sql`: Database schema definition.

## 🛡 Security & Reliability

- **Hashing**: Every transaction is uniquely hashed (`user_id + date + amount + description`) to ensure zero duplicates.
- **Validation**: Strict server-side validation for all file and image uploads.
- **Auth**: Secure session management via NextAuth.

## 🔮 Roadmap

- [ ] Interactive Category Editing
- [ ] Multi-Currency Support
- [ ] Custom Subscriptions Detection
- [ ] Detailed Trend Analysis (6-12 month views)

---

Built with 🤍 for better financial intelligence.

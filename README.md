# Alumni Hub - École Multimédia

Alumni Hub is a comprehensive platform designed to manage and foster the professional network of École Multimédia graduates. It provides tools for administrators to track alumni data and for alumni to network, find jobs, and stay engaged with school events.

## 🚀 Features

- **Admin Dashboard**: Centralized interface for managing alumni data with scraping status tracking and statistics.
- **Alumni Directory**: A searchable and filterable directory of all alumni with privacy protection (data curtain).
- **Job Board**: Career opportunities platform with AI-powered suggestions for relevant cohorts.
- **Events Module**: Social hub for upcoming events, RSVPs, and past event archives with galleries.
- **Internal Messaging**: Secure mediated contact system between alumni.
- **Profile Management**: Self-service profile editing and privacy settings for alumni.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Auth**: React Context (V1 Mock / V2 Roadmap with Magic Links & LinkedIn OAuth)
- **State**: React Context & Hooks

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd alumni-front
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤖 AI-Native Development

This project is optimized for AI-assisted development using **Gemini**.

- **GEMINI.md**: See the [Developer & AI Agent Guide](GEMINI.md) for architecture details and custom CLI commands.
- **PRP Workflow**: We use Product Requirement Prompts for all feature implementations. Check the `PRPs/` directory.

### Custom Commands

- `gemini create-prp "feature"`: Research and generate a new PRP.
- `gemini epct "task"`: Full development cycle (Explore, Plan, Code, Test).

## 📄 Documentation

- [Project PRPs](PRPs/): Functional specifications for each module.
- [Developer Guide](GEMINI.md): Technical standards and CLI usage.

## ⚖️ License

Private project for École Multimédia.

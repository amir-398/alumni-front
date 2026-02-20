# GEMINI.md - Developer & AI Agent Guide

Welcome to the **Alumni Hub** project of École Multimédia. This document explains the project architecture, code conventions, and the PRP-based workflow (Product Requirement Prompts).

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Context (`lib/auth-context.tsx`)
- **Data:** Mock data (`lib/mock-data.ts`) for V1

---

## 🏛 Project Architecture

The project is currently structured as a **Single Page Application (SPA)** within Next.js:

- `app/page.tsx`: Main entry point handling internal routing via tabs (`dashboard`, `directory`, `jobs`, `events`, `logs`, `my-profile`).
- `components/`: React components organized by module.
- `PRPs/`: List of functional specifications per module (Source of truth for development).
- `lib/`: Utilities, auth context, and mock data.

---

## 📝 PRP Workflow (Product Requirement Prompt)

Every major feature must be documented in a PRP file within the `PRPs/` folder. A PRP is a structured document containing:

1. **Goal & Why**: Objective and business justification.
2. **What**: Scope, User Stories, and functional details.
3. **Technical Context**: Files to modify/reference and patterns to follow.
4. **Validation Criteria**: Acceptance criteria and testing steps.

Use the template located in `concept_library/cc_PRP_flow/PRPs/base_template_v1.md` to create new ones.

---

## 🤖 Gemini CLI Commands

This project includes custom commands for the Gemini agent (located in `.gemini/commands/`):

### 1. Create a PRP

```bash
gemini create-prp "feature name"
```

_Analyzes the codebase and generates a complete PRP document for validation before implementation._

### 2. EPCT Workflow (Explore, Plan, Code, Test)

```bash
gemini epct "task description"
```

_Launches a full development cycle: exploring files, creating a plan, writing code, and running validation tests._

---

## 🚦 Conventions & Standards

- **Components:** Prefer composition with elements from `components/ui/` (shadcn).
- **Hooks:** Use `useAuth()` to access user information and permissions.
- **Responsive:** All new components must be "mobile-first" (use Tailwind's `md:`, `lg:` breakpoints).
- **Language:** UI in French, Code and Comments in English (industry standard).

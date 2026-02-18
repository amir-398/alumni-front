# 🤖 PROJECT CONTEXT: ALUMNI PLATFORM

## 🛠 TECH STACK

- **Frontend:** Nuxt 4 (Composition API) + Nuxt UI (Tailwind CSS)
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **Package Manager:** bun

## 📐 ARCHITECTURE & PATTERNS

- **Workflow:** - **PRP (Plan-Resolve-Polish):** Pour les grosses features (Backoffice, Annuaire).
  - **EPCT (Expliciter-Proposer-Coder-Tester):** Pour les modifs rapides et fix.
- **Data Privacy:** - Emails jamais visibles en clair.
  - Accès restreint aux Alumnis validés pour les fonctionnalités de contact.

## 📋 DATA MODEL (Alumni)

- `first_name`, `last_name`, `email` (unique), `linkedin_url`, `graduation_year`, `degree`.
- `status`: `pending` | `active` | `rejected`
- `role`: `alumni` | `admin`

## 📂 DIRECTORY STRUCTURE (Key items)

- `.gemini/slash-commands/`: Custom CLI commands.
- `prp-contexts/`: Folder for complex feature plans.
- `types/`: TypeScript interfaces.

# AGENTS.md — Master AI Coding Agent Runtime Harness

This file serves as the primary operational harness for all AI coding agents, assistants, and automated workflows operating on this codebase.

---

## 1. Primary Execution Workflows

### 1.1 Development Engine Commands
- **Package Manager:** `pnpm` (strictly enforce workspace filters in monorepos)
- **Dev Server:** `pnpm dev`
- **Build Check:** `pnpm build`
- **Type Check:** `pnpm typecheck`
- **Linting:** `pnpm lint --fix`
- **Unit & Integration Tests:** `pnpm test`
- **End-to-End Tests:** `pnpm test:e2e`

### 1.2 Mandatory Pre-Completion Verification
Before marking any feature, refactor, or bug fix as complete, the agent **MUST** run:
1. `pnpm typecheck` — zero type errors allowed.
2. `pnpm lint` — zero linter violations allowed.
3. `pnpm test` — all existing and new unit tests must pass.
4. **Design Audit** (if modifying UI): execute `npx skills add Leonxlnx/taste-skill` and verify contrast, spacing, and tap targets against `ui_ux_directive.md`.

---

## 2. Hard Limits & Unconditional Rules (NEVER)

- **NEVER** commit secrets, API keys, certificates, private tokens, or `.env` files into version control.
- **NEVER** delete database tables, run destructive migrations, or execute data purges without explicit user authorization.
- **NEVER** bypass or silence type errors (`@ts-ignore`, `any` casting) or suppress test failures without user sign-off.
- **NEVER** introduce raw, parameterized SQL strings; always use parameterized queries or ORM abstractions.
- **NEVER** store raw credit card numbers (PANs), CVVs, passwords in plain text, or unencrypted PII/PHI in application logs.
- **NEVER** hardcode platform URLs, third-party credentials, or environment-specific configuration strings in code logic.
- **NEVER** ship low-contrast UI elements (< 4.5:1 ratio) or touch targets smaller than 44pt/48dp on mobile interfaces.

---

## 3. Human Approval Triggers (ASK)

The agent **MUST** pause and prompt the user for explicit confirmation before:
1. Executing database schema migrations on remote or production-like environments.
2. Installing new third-party npm/pip/cargo packages or changing core framework versions.
3. Modifying public API schemas, routing structures, or authentication flows.
4. Deleting existing test suites or modifying coverage thresholds.
5. Altering workspace configuration files (`tsconfig.json`, `package.json`, `docker-compose.yml`, CI/CD pipelines).

---

## 4. Required Skill Invocations & Setup Commands

Agents must invoke these commands when initializing or working on design and component tasks:

```bash
# Add Hallmark design skill
npx skills add nutlope/hallmark

# Add Taste / Anti-Slop design skill
npx skills add Leonxlnx/taste-skill
```

---

## 5. Linked Repository Context Directives

AI agents **MUST** read and adhere to the specialized rules in these linked files:

* [agent_system_instructions.md](./agent_system_instructions.md) — **111 Production Engineering & Backend Directives** (Rate limiting, caching, queues, database indexing, circuit breakers, event-driven patterns, etc.).
* [global_compliance_directive.md](./global_compliance_directive.md) — **Global Legal & Regulatory Compliance** (GDPR, CCPA/CPRA, HIPAA, PCI DSS 4.0, DPDP, WCAG 2.2 AA accessibility, App Store rules).
* [ui_ux_directive.md](./ui_ux_directive.md) — **UI/UX & Design System Rules** (Typography scales, 8pt spacing grid, 5 UX laws, mobile vs web targets, icon & UI library mappings).

---

## 6. Git & Version Control Conventions

- Follow **Conventional Commits**:
  - `feat: <description>` — New feature for the user
  - `fix: <description>` — Bug fix
  - `docs: <description>` — Documentation changes only
  - `refactor: <description>` — Code change that neither fixes a bug nor adds a feature
  - `test: <description>` — Adding missing tests or correcting existing tests
  - `chore: <description>` — Updating build tasks, package manager configs, etc.
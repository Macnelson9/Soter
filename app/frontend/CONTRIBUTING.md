# Contributing to Soter Frontend

Thank you for your interest in contributing to the Soter frontend! This document provides guidelines and conventions for developing, testing, and submitting changes.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Commit Conventions](#commit-conventions)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [UI/UX Guidelines](#uiux-guidelines)
- [Common Tasks](#common-tasks)

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js ≥ 18 installed
- pnpm package manager (`npm install -g pnpm`)
- Git configured with your identity
- A Stellar Testnet wallet (Freighter extension)
- Familiarity with Next.js, React, TypeScript, and Tailwind CSS

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/soter.git
   cd soter/app/frontend
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```
5. **Run the dev server**:
   ```bash
   pnpm dev
   ```

## Development Workflow

### 1. Create a Feature Branch

Always work on a feature branch, never directly on `main` or `develop`.

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write clean, readable code following our [Code Standards](#code-standards)
- Add or update tests as needed
- Update documentation if you change APIs or add features
- Test your changes locally

### 3. Commit Your Changes

Follow our [Commit Conventions](#commit-conventions):

```bash
git add .
git commit -m "feat(ui): add campaign creation dialog"
```

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with a clear description.

## Branching Strategy

We use **Git Flow** with the following branches:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `release/*` - Release preparation

### Branch Naming

Use descriptive, kebab-case names:

- ✅ `feature/wallet-integration`
- ✅ `bugfix/map-marker-positioning`
- ✅ `hotfix/auth-token-expiry`
- ❌ `new-feature`
- ❌ `fix`
- ❌ `myBranch`

## Commit Conventions

We follow **Conventional Commits** for clear, semantic commit history.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style/formatting (no logic change)
- `refactor` - Code restructuring (no feature change)
- `perf` - Performance improvement
- `test` - Adding or updating tests
- `chore` - Maintenance tasks (deps, config)
- `ci` - CI/CD changes

### Scopes

Use component or feature names:

- `ui` - UI components
- `api` - API integration
- `wallet` - Wallet integration
- `maps` - Leaflet maps
- `auth` - Authentication
- `campaign` - Campaign features
- `claim` - Claim workflows

### Examples

```bash
# Good commits
git commit -m "feat(wallet): add Freighter wallet connection"
git commit -m "fix(maps): resolve marker icon not displaying"
git commit -m "docs(readme): update environment variable instructions"
git commit -m "refactor(api): extract fetch logic to custom hook"
git commit -m "style(ui): improve button hover states"

# Bad commits
git commit -m "update stuff"
git commit -m "fixes"
git commit -m "WIP"
```

### Multi-line Commits

For complex changes:

```bash
git commit -m "feat(campaign): add multi-currency support

- Add currency selector dropdown
- Update contract interaction to pass currency type
- Add conversion rate display
- Update tests

Closes #123"
```

## Code Standards

### TypeScript

- **Always use TypeScript** - No `.js` or `.jsx` files
- **Define interfaces** for component props and data structures
- **Avoid `any`** - Use `unknown` or proper types
- **Use type inference** where possible

```tsx
// ✅ Good
interface CampaignCardProps {
  title: string;
  amount: number;
  onClaim: () => void;
}

export function CampaignCard({ title, amount, onClaim }: CampaignCardProps) {
  return <div onClick={onClaim}>{title}</div>;
}

// ❌ Bad
export function CampaignCard(props: any) {
  return <div>{props.title}</div>;
}
```

### React Components

- **Use functional components** with hooks
- **Name components in PascalCase**
- **Use named exports** (not default exports for components)
- **Destructure props** in function parameters
- **Use fragment shorthand** (`<>` not `<React.Fragment>`)

```tsx
// ✅ Good
export function UserAvatar({ name, imageUrl }: UserAvatarProps) {
  return (
    <>
      <img src={imageUrl} alt={name} />
      <span>{name}</span>
    </>
  );
}

// ❌ Bad
export default (props) => {
  return (
    <div>
      <img src={props.imageUrl} />
    </div>
  );
};
```

### Styling with Tailwind

- **Prefer Tailwind utilities** over custom CSS
- **Use responsive modifiers**: `sm:`, `md:`, `lg:`
- **Use dark mode**: `dark:` prefix
- **Extract repeated patterns** into components

```tsx
// ✅ Good
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500">
  Submit
</button>

// ❌ Bad - inline styles
<button style={{ padding: "8px 16px", backgroundColor: "blue" }}>
  Submit
</button>
```

### File Organization

```
src/components/
├── ui/                 # Reusable UI primitives
│   ├── button.tsx
│   ├── dialog.tsx
│   └── input.tsx
├── features/           # Feature-specific components
│   ├── campaign/
│   │   ├── campaign-card.tsx
│   │   └── campaign-form.tsx
│   └── wallet/
│       └── wallet-connect.tsx
└── layout/             # Layout components
    ├── header.tsx
    └── footer.tsx
```

### Import Order

1. React and Next.js
2. External libraries
3. Internal components/utils
4. Types
5. Styles

```tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Campaign } from "@/types/campaign";
import "./styles.css";
```

### Naming Conventions

- **Components**: `PascalCase` (e.g., `CampaignCard`)
- **Files**: `kebab-case` (e.g., `campaign-card.tsx`)
- **Hooks**: `camelCase` with `use` prefix (e.g., `useCampaigns`)
- **Types/Interfaces**: `PascalCase` (e.g., `CampaignData`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`)

## Testing Requirements

### Before Submitting a PR

- [ ] Code compiles without TypeScript errors (`pnpm type-check`)
- [ ] No ESLint errors or warnings (`pnpm lint`)
- [ ] All existing tests pass (`pnpm test`)
- [ ] New features include tests (when applicable)
- [ ] Manual testing completed in dev environment
- [ ] Tested in both light and dark modes
- [ ] Tested responsive behavior on mobile/tablet/desktop

### Writing Tests

(To be expanded as testing framework is implemented)

```tsx
// Example test structure
import { render, screen } from "@testing-library/react";
import { CampaignCard } from "./campaign-card";

describe("CampaignCard", () => {
  it("renders campaign title", () => {
    render(<CampaignCard title="Food Aid" amount={1000} />);
    expect(screen.getByText("Food Aid")).toBeInTheDocument();
  });
});
```

## Pull Request Process

### PR Checklist

Before submitting, ensure:

- [ ] Branch is up-to-date with `develop`
- [ ] Commits follow conventional commit format
- [ ] Code passes all lint and type checks
- [ ] Tests are added/updated and passing
- [ ] Documentation is updated (README, inline comments)
- [ ] Screenshots included for UI changes
- [ ] PR description clearly explains the change
- [ ] Linked to related issue (if applicable)

### PR Description Template

```markdown
## Description

Brief summary of the change and motivation.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested on Testnet

## Screenshots (if applicable)

[Add screenshots for UI changes]

## Related Issues

Closes #123
```

### Review Process

1. **Automated Checks**: CI runs linting, type checks, and tests
2. **Code Review**: At least one maintainer reviews your PR
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, a maintainer will merge

### Merge Strategy

- **Squash and merge** for feature branches
- **Rebase and merge** for hotfixes
- Ensure commit messages remain clean and semantic

## UI/UX Guidelines

### Design Principles

- **Accessibility First**: Use semantic HTML, ARIA labels, keyboard navigation
- **Mobile-First**: Design for mobile, enhance for desktop
- **Dark Mode**: Always support dark mode
- **Performance**: Lazy load images, use Next.js Image component
- **Internationalization**: Prepare for i18n (even if not implemented yet)

### Component Patterns

- **Loading States**: Show skeletons or spinners during data fetching
- **Error States**: Display clear error messages with retry options
- **Empty States**: Provide helpful guidance when no data exists
- **Confirmation Dialogs**: Use for destructive actions

### Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add `alt` text to all images
- Ensure color contrast meets WCAG AA standards
- Test keyboard navigation (Tab, Enter, Escape)
- Use Radix UI primitives for accessible components

```tsx
// ✅ Accessible button
<button type="button" aria-label="Close dialog" onClick={onClose}>
  <XIcon aria-hidden="true" />
</button>

// ❌ Inaccessible
<div onClick={onClose}>X</div>
```

## Common Tasks

### Adding a New Page

1. Create file in `src/app/your-route/page.tsx`
2. Export default component
3. Add navigation link if needed

```tsx
// src/app/campaigns/page.tsx
export default function CampaignsPage() {
  return <div>Campaigns</div>;
}
```

### Adding a New Component

1. Create file in appropriate directory (`src/components/ui/` or `src/components/features/`)
2. Define props interface
3. Implement component with TypeScript
4. Export as named export

### Adding a New API Route

1. Create file in `src/app/api/your-route/route.ts`
2. Export `GET`, `POST`, etc. handlers

```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: "value" });
}
```

### Integrating a New Library

1. Install via pnpm: `pnpm add library-name`
2. Update `package.json` if needed
3. Add types: `pnpm add -D @types/library-name`
4. Document usage in README

### Updating Environment Variables

1. Add to `.env.example` with placeholder value
2. Document in README.md under "Environment Setup"
3. Update Vercel dashboard for production

## Getting Help

- **Questions**: Open a discussion on GitHub
- **Bugs**: Open an issue with reproduction steps
- **Chat**: Join our Discord/Slack (if available)
- **Docs**: Check the [README](./README.md) first

## Code of Conduct

Be respectful, inclusive, and constructive. We're building this for humanitarian impact.

---

Thank you for contributing to Soter! Every line of code helps deliver aid more efficiently. 💙

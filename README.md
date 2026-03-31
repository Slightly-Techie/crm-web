# Slightly Techie CRM - Web Frontend

<div align="center">

  ![Status](https://img.shields.io/badge/status-active-success.svg)
  ![GitHub issues](https://img.shields.io/github/issues/Slightly-Techie/crm-web?color=yellow)
  ![GitHub pull requests](https://img.shields.io/github/issues-pr/Slightly-Techie/crm-web?color=success)
  [![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Frontend for Slightly Techie CRM built with Next.js
    <br> 
</p>

## 📝 Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [Project Structure](#structure)
- [Building & Deployment](#building)
- [Testing](#testing)
- [Contributing](#contributing)
- [Built Using](#built_using)

## About <a name = "about"></a>
This is the frontend for the Slightly Techie CRM system. It's a modern web application built with Next.js, TypeScript, and Tailwind CSS that provides an intuitive interface for managing CRM operations.

## 🏁 Getting Started <a name = "getting_started"></a>

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**: Package manager (npm comes with Node.js)
- **Git**: For cloning the repository
- **Backend API**: The crm-api running locally or deployed (see [crm-api README](../crm-api/README.md))

### Installation

#### Step 1: Clone the repository

```bash
git clone https://github.com/Slightly-Techie/crm-web.git
cd crm-web
```

Or with GitHub CLI:

```bash
gh repo clone Slightly-Techie/crm-web
```

#### Step 2: Install dependencies

```bash
yarn install
# or
npm install
```

#### Step 3: Set up environment variables

Create a `.env.local` file in the project root and add:

```bash
# Backend API URL (point to your crm-api instance)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: NextAuth configuration (if using authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

> **Note**: `NEXT_PUBLIC_` prefix makes variables available in the browser. Sensitive secrets should NOT use this prefix.

#### Step 4: Run the development server

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

The page auto-updates as you edit files. Any changes to `src/app/page.tsx` will be reflected immediately.

## ⚙️ Project Structure <a name = "structure"></a>

```
crm-web/
├── public/              # Static assets (images, fonts, etc.)
├── src/
│   ├── app/            # Next.js app directory (pages, layouts, API routes)
│   │   ├── api/        # API route handlers
│   │   ├── (admin)/    # Admin dashboard routes
│   │   ├── (root)/     # Public-facing routes
│   │   ├── login/      # Login page
│   │   ├── signup/     # Signup page
│   │   ├── users/      # User management pages
│   │   └── layout.tsx  # Root layout
│   ├── components/     # React components
│   │   ├── admin/      # Admin-specific components
│   │   ├── Feed/       # Feed components
│   │   ├── layout/     # Layout components (header, sidebar, etc.)
│   │   ├── org-chart/  # Organization chart components
│   │   ├── projects/   # Project-related components
│   │   └── ...         # Other feature components
│   ├── hooks/          # Custom React hooks
│   │   ├── useAxiosAuth.ts      # Authenticated axios requests
│   │   ├── useApplicantsHook.ts # Applicant-related logic
│   │   └── ...         # Other hooks
│   ├── lib/            # Utility libraries
│   │   ├── axios.ts    # Axios configuration
│   │   └── auth.ts     # Authentication setup
│   ├── context/        # React Context for state management
│   ├── services/       # API service calls
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── assets/         # Images, fonts, icons
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── images/
│   └── constants/      # Application constants
├── tests/              # Test files and test utilities
├── vitest.config.ts    # Vitest configuration
├── playwright.config.ts # E2E testing configuration
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🏗️ Building & Deployment <a name = "building"></a>

### Build for Production

```bash
yarn build
# or
npm run build
```

This creates an optimized production build in the `.next` folder.

### Start Production Server

```bash
yarn start
# or
npm start
```

Starts the server on [http://localhost:3000](http://localhost:3000)

### Docker Deployment

```bash
# Build the Docker image
docker build -t crm-web .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-url \
  crm-web
```

## 🧪 Testing <a name = "testing"></a>

### Unit & Component Tests (Vitest)

```bash
# Run all tests
yarn test
# or
npm test

# Run tests in watch mode
yarn test:watch
npm run test:watch

# Run tests with coverage
yarn test:coverage
npm run test:coverage
```

### End-to-End Tests (Playwright)

```bash
# Run E2E tests
yarn test:e2e
# or
npm run test:e2e

# Run E2E tests in UI mode (interactive)
yarn test:e2e:ui
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
yarn test:e2e:headed
npm run test:e2e:headed
```

Test files are located in:
- `src/tests/` - Vitest unit/component tests
- `tests-examples/` - Playwright E2E test examples

## ✏️ Contributing <a name = "contributing"></a>

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. Clone the project to your local machine.
2. Create a new branch with a descriptive name:

```bash
git checkout -b <your-initials>/<feature-or-issue>
```

3. Make your changes and ensure code quality:
   - Follow the existing code style and patterns
   - Write clear, well-documented code
   - Ensure tests pass before pushing

4. Commit your changes with clear messages:

```bash
git commit -m "feat: add new feature" 
# or
git commit -m "fix: resolve issue with component"
```

5. Push your branch to the repository:

```bash
git push -u origin <branch-name>
```

6. Open a pull request with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots if UI changes are involved

**⚠️ Important**: Test your changes locally before pushing. Run `yarn build` to ensure the production build succeeds.

### Code Style Guidelines

- Follow the existing code architecture and patterns
- Use TypeScript for type safety
- Write meaningful variable and function names
- Add comments for complex logic
- Keep components focused and reusable
- Use Tailwind CSS for styling

### Commit Message Format

```
<type>: <description>

<optional body>
<optional footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example: `feat: add user profile page`

## ⛏️ Built Using <a name = "built_using"></a>
- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Axios](https://axios-http.com/) - HTTP client
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Vitest](https://vitest.dev/) - Unit testing framework
- [Playwright](https://playwright.dev/) - E2E testing framework
- [Redux](https://redux.js.org/) - State management (optional)

## 🚀 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)



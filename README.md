# Pump Master - Quick Start

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Run all tests**
   ```bash
   npm test
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Lint and format code**
   ```bash
   npm run lint
   npm run format
   ```

---

## Demo User Accounts

You can use the following test accounts to log in and experience different permission levels:

| Role      | Username           | Password    | Permissions                |
|-----------|--------------------|-------------|----------------------------|
| Admin     | admin@test.com     | admin123    | view, edit, delete, manage |
| Operator  | operator@test.com  | operator123 | view, edit                 |
| Viewer    | viewer@test.com    | viewer123   | view                       |

---

# InformAG Technical Assessment - Pump Master Web Application

## Project Overview

Pump Master is a web-based platform that provides pump asset management functionality for agricultural customers. These pump devices are installed on farms with automated CI/CD pipelines already established.

### Core Features
- 🔐 **Secure Tenancy Login**
- 👤 **User Permission Management** - Supports role-based and fine-grained permission allocation with comprehensive front-end permission validation
- 📊 **Pump Overview**
- 🔍 **Search & Filtering**
- ⚙️ **Pump Management** - Partially completed (delete functionality)
- 🔧 **Pump Inspection** - Not implemented

## Technical Assessment Deliverables

### 1. Assumptions and Dependencies

#### Backend API Assumptions
- Assumes the existence of a complete and fully functional microservice as the backend. During front-end integration, API specifications are more important than implementation language.
- Assumes backend is based on RESTful API specifications, providing complete CRUD interfaces for related resources (also supports GraphQL and other specifications).
- Assumes backend supports pagination, search, and indexing functionality to enable front-end interactions based on these features.
- Assumes JWT-based authentication API, where standard JWT implementation includes basic user information in tokens.
- Assumes backend data contains complete fields required by the front-end, such as pump ID, geographical location, etc.

### 2. Web Application Architecture & Code Structure

#### Development Methodology
- **Agile Development**: Adopts agile development methodology, following KISS/DRY principles, gradually iterating from simple design to complete functionality.
- **Progressive Development**: Starting with a simple React project, supporting future horizontal and vertical scaling.
- **CI/CD Pipeline**: Following industry-standard CI/CD practices, implementing continuous integration through GitHub Actions, ultimately deploying to Azure Static Web Apps.

#### Code Structure Design
- **Route-based Folder Structure**: Adopts route-driven file organization, with globally shared utils, components, etc. placed in the src root directory.
- **Feature Aggregation**: Organized by routes in src/app, aggregating features of the same route to improve file discoverability, code readability, maintainability, and reusability.
- **Avoid Over-abstraction**: Avoid structural over-development, with file structure centered around components, conforming to React's component-first design philosophy.
- **Fractal Design**: Apply fractal concepts to improve code reusability, supporting flexible component lifting and reuse.

```
src/
├── app/                          # Application core code
│   ├── components/               # Page-level components
│   │   ├── LoginPage/           # Login page
│   │   │   ├── components/      # Login page sub-components
│   │   │   │   ├── LoginForm/   # Login form
│   │   │   │   ├── LoginHeader/ # Login page header
│   │   │   │   └── LoginFooter/ # Login page footer
│   │   │   └── LoginPage.tsx
│   │   └── PumpsPage/           # Pump device management page
│   │       ├── components/      # Pump page sub-components
│   │       │   ├── PageHeader/  # Page header
│   │       │   ├── PumpsTable/  # Pump device table
│   │       │   ├── PumpsToolbar/# Toolbar
│   │       │   └── SearchModal/ # Search modal
│   │       └── PumpsPage.tsx
│   ├── contexts/                # React Context
│   │   └── AuthContext.tsx      # Authentication context
│   ├── hooks/                   # Custom Hooks
│   │   ├── usePermissions.ts    # Permission management Hook
│   │   ├── useSearch.ts         # Search functionality Hook
│   │   ├── usePagination.ts     # Pagination functionality Hook
│   │   ├── useFilter.ts         # Filter functionality Hook
│   │   └── useSelection.ts      # Selection functionality Hook
│   ├── services/                # API service layer
│   │   ├── mockAuthService.ts   # Authentication service Mock
│   │   ├── mockPumpService.ts   # Pump device service Mock
│   │   └── data/                # Mock data
│   ├── types/                   # TypeScript type definitions
│   │   ├── Auth.ts              # Authentication-related types
│   │   ├── PumpDevice.ts        # Pump device types
│   │   ├── User.ts              # User types
│   │   └── Permissions.ts       # Permission types
│   └── utils/                   # Utility functions
│       ├── tokenStorage.ts      # Token storage utilities
│       └── mockDatabase.ts      # Mock database
├── shared/                      # Shared components and utilities
│   ├── components/              # Common components
│   │   ├── AppLayout/           # Application layout
│   │   ├── FormInput/           # Form input component
│   │   ├── LoadingButton/       # Loading button
│   │   ├── ErrorAlert/          # Error alert
│   │   ├── ProtectedRoute/      # Route protection
│   │   └── NavBar/              # Navigation bar
│   └── schemas/                 # Zod validation schemas
└── tests/                       # Test-related configuration
```

### 3. Integration with Existing Backend

#### Integration Testing Strategy
- **"Trust Nobody" Principle**: Although assuming backend services are complete and available, development follows the "Trust Nobody" principle, conducting comprehensive testing of backend integration to ensure interface contracts run correctly.
- **Pipeline Integration**: Integrate integration testing into GitHub Actions pipeline to ensure project availability.

#### BFF Architecture Considerations
- **Multi-client Support**: Consider introducing Backend for Frontend (BFF) architecture based on backend service scale. Large microservices may need to serve multiple clients (mobile, desktop, IoT devices, etc.).
- **Generic API Issues**: When APIs need to satisfy multiple business requirements, they may be designed too generically.
- **Web-specific Optimization**: In such cases, consider introducing BFF to handle web-specific business logic, improving code security and availability.

### 4. Tooling & Technologies

#### Core Principles
- **KISS Principle**: Starting with a simple React application, following KISS principles, developing through agile iteration. Maintain caution in initial tool selection to avoid over-development and tight coupling issues, improving project scalability.

#### Technology Stack Selection

##### Core Technologies
- **TypeScript**: Provides type safety, enhancing code maintainability.
- **Context API**: Used for state management. Based on current design and requirements analysis, the project currently has no complex data changes and association requirements. Starting with Context API, can seamlessly migrate to Redux and other state management frameworks in the future.

##### UI Framework
- **Bootstrap**: Choose Bootstrap for rapid development. Based on design and requirements analysis, this is a To-B project with no need for overly complex UI effects. For To-C beautiful UI, can maintain custom UI component library using Tailwind CSS or CSS Modules.

##### Data Processing
- **Axios**: Used for backend interaction, utilizing axios instantiation functionality to optimize logging and alerting features in backend interactions.
- **React Hook Form**: Based on design and requirements analysis, the project involves form-related functionality, using React Hook Form to manage form state.
- **Zod**: Used for form validation

### 5. Testing and Validation

#### Continuous Integration Validation
- **GitHub Actions**: Use GitHub Actions to implement real-time code validation pipeline, including static code analysis and unit testing.

#### Static Code Analysis
- **Code Style**: Use Prettier to ensure code style consistency, improving code readability and maintainability.
- **Code Format**: Use ESLint to ensure code format consistency, helping early problem detection.
- **Commit Checks**: Use commit hooks for mandatory checks on every commit, ensuring code quality.
- **Commit Standards**: Use commitlint to check commit message format standards.

#### Testing Strategy
- **Unit Testing**: Use Jest/Vitest with React Testing Library for unit logic testing, aiming for 100% test coverage to achieve high-confidence continuous delivery.
- **E2E Testing**: Use Playwright for end-to-end testing when conditions allow, serving as the final line of defense for code delivery.

### 6. Project Timeline & Iteration Plan

(Mock - actual progress is faster, the following plan is just to simulate real development scenarios)

#### Development Cycle
- **Sprint Cycle**: Adopt 2-week Sprint development cycle, following MVP (Minimum Viable Product) delivery principles.

#### Iteration Plan

##### Sprint 1: Project Initialization
**Goal**: Build project architecture, create pipeline and deployment environment
- Initialize GitHub repository
- Configure ESLint and Prettier static checking tools
- Set up GitHub Actions

##### Sprint 2: Login Feature MVP
**Goal**: Deliver minimum viable product for login functionality
- Implement Header component
- Create login page form UI
- Integrate React Hook Form

##### Sprint 3: Complete Login Feature
**Goal**: Complete login functionality and deliver registration feature MVP
- Complete login logic
- Implement user registration functionality
- Integrate JWT authentication

##### Sprint 4: Pump List Page MVP
**Goal**: Deliver pump device list page MVP
- Implement pump overview page basic functionality
- Implement basic data display

##### Sprint 5: Complete Pump List Features
**Goal**: Complete pump device list page functionality
- Implement search and filtering functionality
- Implement pagination functionality
- Optimize responsive design

##### Sprint 6: Pump Management Features
**Goal**: Implement detailed pump device management functionality
- Implement pump detail page
- Implement pump editing functionality
- Implement pump inspection functionality
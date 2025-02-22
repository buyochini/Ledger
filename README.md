# Ledger Test Automation Framework

## Overview
This project is a BDD-based test automation framework for the Ledger's Tester Contact List application, using TypeScript, Cucumber, and Playwright.

## Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v18+ recommended, tested with v18.17.0)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [Docker](https://docs.docker.com/get-docker/) (optional for containerized execution)
- Playwright browsers (install via `npx playwright install` after setup)

## Project Structure
📂 Ledger/
├── 📜 package.json                 # Project dependencies
├── 📜 tsconfig.json                # TypeScript configuration
├── 📜 cucumber.js                  # Cucumber configuration
├── 📜 playwright.config.ts         # Playwright configuration for test execution
├── 📜 README.md                    # Project documentation
├── 📜 Dockerfile                   # Docker configuration for containerized tests
├── 📂 .github/                      # GitHub Actions for CI/CD
│   └── 📂 workflows/
│       └── 📜 test.yml              # CI/CD pipeline configuration
├── 📂 tests/                        # Test directory
│   ├── 📂 api/                      # API test utilities
│   │   ├── 📜 apiHelper.ts          # Helper functions for GraphQL API tests
│   ├── 📂 features/                 # Feature files for tests
│   │   ├── 📜 api.feature           # API test scenarios
│   │   ├── 📜 ui.feature            # UI test scenarios
│   ├── 📂 steps/                    # Step definitions for BDD
│   │   ├── 📜 uiSteps.ts            # UI test step definitions
│   │   ├── 📜 apiSteps.ts           # API test step definitions
│   ├── 📂 pages/                    # Page Object Model for UI testing
│   │   ├── 📜 BasePage.ts           # Base class for all page objects
│   │   ├── 📜 RegistrationPage.ts   # Registration page object
│   │   ├── 📜 LoginPage.ts          # Login page object
│   │   ├── 📜 ContactsPage.ts       # Contacts page object
├── 📂 reports/                      # Test report storage

## Setup
1. Clone the repository or unzip folder.
2. Run `npm install` to install dependencies.

## Running Tests
Tests are executed via Cucumber with Playwright, using the configuration in `cucumber.js`. Available commands (defined in `package.json`):
- `npm test`: Runs all UI and API tests using the default configuration.
- `npm run test:api`: Runs only API tests (tagged `@api` in feature files).
- `npm run test:ui`: Runs only UI tests (tagged `@ui` in feature files).
- Add `-- --grep "specific scenario"` to filter by scenario name (e.g., `npm run test:ui -- --grep "user registration"`).

Reports are generated as HTML in `reports/cucumber-report.html` after each run.

### Quick Test Run
To verify setup, try a sample UI test:
```bash
npm run test:ui -- --grep "user registration"
```

## Framework Overview
This framework automates end-to-end testing for the Tester Contact List app with:
- **UI Tests**: Validate user registration, contact creation, and editing via Playwright’s browser automation.
- **API Tests**: Verify authentication, contact CRUD operations using Playwright’s `APIRequestContext`.
- **CI/CD**: GitHub Actions runs tests on every push, ensuring reliability.
- **Containerization**: Docker ensures consistent execution across environments.

## Design Choices
- Modular test files for maintainability.
- HTML reports generated for better test result visualization.
- Separation of UI and API tests to isolate concerns.

## Docker

To run tests in a container, build and run the Docker image:

```bash
docker build -t ledger .
docker run ledger
```

## Reports & Troubleshooting
- Test reports are saved as HTML in `reports/` after execution.
- If Playwright browsers fail to launch, ensure `npx playwright install` has been run.
- For Docker issues, verify the image built successfully with `docker images`.

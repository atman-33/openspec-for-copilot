# Development Policy

## TypeScript Coding Guidelines

### File and Folder Naming
- Use kebab-case for all file names and folder names.
  - ✅ Good: `user-handler.ts`, `api-client-utils/`, `data-processors/`
  - ❌ Bad: `userHandler.ts`, `ApiClient.ts`, `DataProcessors/`, `apiClientUtils/`

### Functions
- Prefer arrow functions (`const fn = () => {}`) over function declarations.
  - ✅ Good:
    ```typescript
    const handleUserRequest = (id: string) => {
      // implementation
    };
    ```
  - ❌ Bad:
    ```typescript
    function handleUserRequest(id: string) {
      // implementation
    }
    ```

## Code Quality

- Use Biome for formatting and linting
- Run `npm run compile` to check TypeScript errors
- Fix all errors before committing

## Branch Strategy

- Main branch: `main`
- Feature branches: `feature/*`
- Work on feature branches, merge via PR

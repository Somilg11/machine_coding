# Git Hooks & Husky: Code Quality Automation

### Overview
Git hooks are scripts triggered automatically by Git before or after events like commit, push, or receive. They enforce code quality standards (testing, linting, formatting) locally before code reaches a remote repository.



---

### The Problem: Unchecked Commits
1. A developer modifies code (e.g., commenting out a `capitalize` logic block to reuse a function).
2. The developer forgets to run local tests.
3. The developer runs `git commit` and `git push`.
4. Broken code enters the shared staging/production repository.

---

### The Solution: Pre-Commit Hooks
By intercepting the commit lifecycle, we can enforce test execution. If tests fail, the commit is aborted. 

While Git has native hooks (e.g., `pre-commit`, `pre-push`), they are difficult to share across a team. **Husky** solves this for Node.js environments.

#### **Husky Features:**
* **Lightweight & Fast:** 2KB footprint.
* **Cross-platform:** Works on macOS, Linux, and Windows.
* **Team-Sync:** Configurations live in the repository, automatically syncing for all developers.

---

### Implementation Guide

#### 1. Initialize Husky
Run the initialization command. This automatically creates a `.husky` folder and adds the necessary scripts to `package.json`.
```bash
npx husky init
```

#### 2. Configure the Pre-Commit Hook
Open the generated `.husky/pre-commit` file. Replace its contents with the command you want to enforce (e.g., running tests).

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run tests before allowing the commit
pnpm run test
```

#### 3. The Automation Workflow
* **Action:** Developer runs `git commit -m "add new feature"`.
* **Trigger:** Husky executes `pnpm run test`.
* **Outcome A (Failure):** Test fails. Husky blocks the commit. The developer is forced to fix the code.
* **Outcome B (Success):** Test passes. The commit is successfully saved to the Git tree.

---

### Optimization: `lint-staged`
Running linters/formatters on the *entire* codebase during every commit is slow. 

**`lint-staged`** is a package that runs tasks *only* on the files currently staged in Git (the ones actively being modified).

#### Integration:
1. Install `lint-staged`.
2. Update `package.json` to configure target files:
```json
"lint-staged": {
  "*.js": [
    "eslint --fix",
    "prettier --write"
  ]
}
```
3. Update the `.husky/pre-commit` hook to run `lint-staged` alongside tests:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
pnpm run test
```
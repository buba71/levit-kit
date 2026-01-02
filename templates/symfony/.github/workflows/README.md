# GitHub Actions Workflows

This directory contains CI/CD workflows for levit-kit projects.

## Available Workflows

### `levit-validate.yml`

Validates the levit-kit project structure on every push and pull request.

**What it does**:
- Runs `levit validate` to check project structure
- Fails the build if validation errors are found
- Uploads validation results as artifacts
- Displays results in GitHub Actions summary

**When it runs**:
- On pushes to `main`, `master`, or `develop` branches
- On pull requests targeting these branches

**How to use**:
1. This workflow is automatically included in levit-kit projects
2. No configuration needed - it works out of the box
3. Customize the `on:` section if you use different branch names

**Customization**:
Edit `.github/workflows/levit-validate.yml` to:
- Change branch names
- Add additional validation steps
- Integrate with other workflows
- Add notifications

## Adding Custom Workflows

You can add additional workflows for:
- Feature status checks
- Decision record validation
- Handoff completeness checks
- Custom evals

Example structure:
```yaml
name: Custom Validation
on: [push, pull_request]
jobs:
  custom-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: your-custom-script.sh
```

---

*For more information, see the [levit-kit documentation](https://github.com/buba71/levit-kit).*


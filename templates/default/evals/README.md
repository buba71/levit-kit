# Evaluations (Evals)

This directory is dedicated to testing the **intentions** and the **quality** of the AI output, rather than just the code implementation.

## Why Evals?
While unit tests verify if the code works (logic), Evals verify if the AI respected the "Social Contract" and the "Human Intent".

## Example Evals
- **Conformance**: Does the generated code follow our naming conventions?
- **Security**: Did the AI introduce any obvious secret leaks in the prompts?
- **Compliance**: Does the output still match the rules in `.levit/AGENT_ONBOARDING.md`?

---
*Verify then Trust.*

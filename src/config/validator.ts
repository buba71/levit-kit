import { ProjectConfig } from "./types";

export function validateConfig(config: ProjectConfig) {
  if (config.agents.devops && !config.agents.security) {
    console.warn(
      "⚠️ DevOps enabled without Security agent. Consider enabling Security."
    );
  }

  if (config.agents.code_reviewer && !config.agents.developer) {
    throw new Error(
      "Code Reviewer requires Developer agent"
    );
  }

  if (config.ux.feedback_collector && !config.ux.presenter) {
    throw new Error(
      "UX Feedback requires UX Presenter"
    );
  }
}

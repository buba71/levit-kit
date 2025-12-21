import { ProjectConfig } from "./types";

export function validateConfig(config: ProjectConfig) {
  if (config.agents.devops && !config.agents.security) {
    throw new Error(
      "DevOps agent requires Security agent to be enabled"
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

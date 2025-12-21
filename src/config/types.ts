export interface ProjectConfig {
  projectName: string;

  agents: {
    product_owner?: boolean;
    developer: boolean;
    code_reviewer: boolean;
    qa: boolean;
    security: boolean;
    devops: boolean;
  };

  ux: {
    presenter: boolean;
    feedback_collector: boolean;
  };

  quality: {
    tests_required: boolean;
    code_review_required: boolean;
    human_validation_required: boolean;
  };

  devops: {
    enabled: boolean;
    environments: {
      staging: boolean;
      production: boolean;
    };
    require_human_approval_for_prod: boolean;
  };
}


export interface Frontmatter {
  id?: string;
  status: "active" | "draft" | "deprecated";
  owner: string;
  last_updated: string;
  depends_on?: string[];
}

export interface Feature extends Frontmatter {
  title: string;
  vision: string;
  success_criteria: string[];
  boundaries: string[];
  technical_constraints: string[];
  agent_task: string;
}

export interface Decision extends Frontmatter {
  title: string;
  context: string;
  decision: string;
  rationale: string;
  consequences: string;
}

export interface Handoff extends Frontmatter {
  role: string;
  feature_ref: string;
  deliverables: string[];
}

export interface ProjectManifest {
  version: string;
  name: string;
  standard_version: string;
  contract_active: boolean;
}

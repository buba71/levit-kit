export interface FeatureRef {
  id: string;
  slug: string;
  status: 'active' | 'draft' | 'deprecated' | 'completed';
  title: string;
  path: string;
}

export interface RoleRef {
  name: string;
  description?: string;
  path: string;
}

export interface ProjectConstraints {
  max_file_size?: number;
  allowed_dependencies?: string[];
  forbidden_patterns?: string[];
  custom?: Record<string, any>;
}

export interface LevitManifest {
  version: string;
  project: {
    name: string;
    description?: string;
  };
  governance: {
    autonomy_level: 'low' | 'medium' | 'high';
    risk_tolerance: 'low' | 'medium' | 'high';
  };
  features: FeatureRef[];
  roles: RoleRef[];
  constraints: ProjectConstraints;
  paths: {
    features: string;
    decisions: string;
    handoffs: string;
  };
}

export const DEFAULT_MANIFEST: LevitManifest = {
  version: "1.0.0",
  project: {
    name: "my-project",
    description: "AI-Driven Development project powered by levit-kit"
  },
  governance: {
    autonomy_level: "low",
    risk_tolerance: "low",
  },
  features: [],
  roles: [],
  constraints: {
    max_file_size: 1000000, // 1MB
    allowed_dependencies: [],
    forbidden_patterns: []
  },
  paths: {
    features: "features",
    decisions: ".levit/decisions",
    handoffs: ".levit/handoff",
  },
};

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
  },
  governance: {
    autonomy_level: "low",
    risk_tolerance: "low",
  },
  paths: {
    features: "features",
    decisions: ".levit/decisions",
    handoffs: ".levit/handoff",
  },
};

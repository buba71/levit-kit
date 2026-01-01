export type FeatureStatus = 'active' | 'draft' | 'deprecated' | 'completed';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Owner = 'human' | string;

export interface Frontmatter {
  id: string;
  status: FeatureStatus | string;
  owner: Owner;
  last_updated: string;
  risk_level?: RiskLevel;
  depends_on?: string[];
}

export interface Feature extends Frontmatter {
  title: string;
  slug: string;
  // Future: parsed sections like 'Vision', 'Boundaries'
}

export interface Decision extends Frontmatter {
  title: string;
  feature_ref?: string;
}

export interface Handoff extends Frontmatter {
  role: string;
  feature_ref: string;
}

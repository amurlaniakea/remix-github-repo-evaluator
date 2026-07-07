export interface DependencyItem {
  name: string;
  version: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  recommendation: string;
}

export interface DependencyAnalysis {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  details: string;
  items: DependencyItem[];
}

export interface LegibilityAnalysis {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  details: string;
  highlights: string[];
}

export interface TestsAnalysis {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  details: string;
  coverageEst: string;
}

export interface CodeIssue {
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file?: string;
  fix?: string;
}

export interface RepoScores {
  overall: number;
  dependencies: number;
  legibility: number;
  tests: number;
  reliability: number;
}

export interface RepoAnalysis {
  summary: string;
  dependencies: DependencyAnalysis;
  legibility: LegibilityAnalysis;
  tests: TestsAnalysis;
  issues: CodeIssue[];
}

export interface EvaluationResult {
  repoName: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  tree: string[];
  scores: RepoScores;
  analysis: RepoAnalysis;
}

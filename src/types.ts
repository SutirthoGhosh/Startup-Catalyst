export interface StartupIdea {
  id: string;
  title: string;
  problem: string;
  targetUsers: string;
  mvp: string;
  monetization: string;
  scalability: string;
  validationScore: number;
}

export interface GenerationState {
  isLoading: boolean;
  ideas: StartupIdea[];
  error: string | null;
}

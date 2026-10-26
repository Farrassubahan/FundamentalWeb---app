export type WorldId = 'html' | 'css' | 'javascript' | 'projects';

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'order_lines'
  | 'find_bug';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[] | boolean | number;
  explanation: string;
  initialCode?: string;
  lines?: string[];
  buggyLine?: number;
}

export interface LessonContentBlock {
  type: 'heading' | 'text' | 'code' | 'callout' | 'interactive_preview';
  content: string;
  codeLanguage?: 'html' | 'css' | 'javascript';
  calloutType?: 'tip' | 'info' | 'warning';
}

export interface Lesson {
  id: string;
  worldId: WorldId;
  worldTitle: string;
  level: number;
  levelTitle: string;
  order: number;
  title: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  estimatedMinutes: number;
  xpReward: number;
  content: LessonContentBlock[];
  questions: Question[];
  playgroundStarter?: {
    html: string;
    css: string;
    js: string;
  };
}

export interface WebProject {
  id: string;
  worldId: 'projects';
  title: string;
  description: string;
  difficulty: 'Pemula' | 'Menengah' | 'Mahir';
  prerequisites: string[];
  xpReward: number;
  criteria: string[];
  hints: string[];
  starterCode: {
    html: string;
    css: string;
    js: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  goalMinutes: number;
  createdAt: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  heartsLastRegen: string;
}

export type LessonStatus = 'locked' | 'unlocked' | 'completed';

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  score: number;
  attempts: number;
  completedAt?: string;
}

export interface QuizHistoryItem {
  id: number;
  lessonId: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  timestamp: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'lesson' | 'streak' | 'xp' | 'project';
  targetValue: number;
  unlocked?: boolean;
  unlockedAt?: string;
}

export interface ProjectSubmission {
  projectId: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  completed: boolean;
  completedAt?: string;
}

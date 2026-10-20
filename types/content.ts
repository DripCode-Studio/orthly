export type Chapter = {
  id: string;
  number: number;
  title: string;
  description: string;
  color: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  type: "lesson" | "practice" | "checkpoint";
  durationMinutes: number;
  status?: "completed" | "current" | "available";
};

export type ProgressState = {
  completedLessons: string[];
  xp: number;
  streak: number;
  lastActivityDate?: string;
};

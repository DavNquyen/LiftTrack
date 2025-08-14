export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: {
    favoriteExercises: string[];
    lastTemplate?: string;
  };
}

export interface Exercise {
  _id: string;
  name: string;
  category: string;
  muscleGroup: string;
  equipment?: string;
  isCustom?: boolean;
  isFavorite?: boolean;
}

export interface WorkoutSet {
  exerciseId: string | Exercise;
  weight: number;
  reps: number;
  rpe?: number;
}

export interface Workout {
  _id: string;
  userId: string;
  date: Date | string;
  sets: WorkoutSet[];
  notes?: string;
  duration?: number;
  templateUsed?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Template {
  _id: string;
  name: string;
  userId: string;
  description?: string;
  exercises: TemplateExercise[];
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TemplateExercise {
  exerciseId: string | Exercise;
  sets: number;
  reps: number;
  weight?: number;
}
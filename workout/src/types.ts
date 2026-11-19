export type Muscle =
  | 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps'
  | 'Legs' | 'Glutes' | 'Core' | 'Cardio' | 'Full body'

/** weight: weight × reps · bodyweight: reps only · time: seconds (stored in `reps`) */
export type ExerciseKind = 'weight' | 'bodyweight' | 'time'

export interface Exercise {
  id: string
  name: string
  muscle: Muscle
  kind: ExerciseKind
  custom?: boolean
}

export interface RoutineExercise {
  exerciseId: string
  sets: number
  reps: number
  weight: number | null
  restSec: number
}

export interface Routine {
  id: string
  name: string
  exercises: RoutineExercise[]
  createdAt: number
}

export interface SetEntry {
  id: string
  reps: number | null
  weight: number | null
  done: boolean
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  restSec: number
  sets: SetEntry[]
}

export interface Workout {
  id: string
  name: string
  routineId: string | null
  startedAt: number
  finishedAt: number | null
  exercises: WorkoutExercise[]
}

export type Unit = 'kg' | 'lb'

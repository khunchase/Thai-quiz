import type { Exercise, ExerciseKind, Muscle, Routine } from '../types'

export const MUSCLES: Muscle[] = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Cardio', 'Full body',
]

const e = (id: string, name: string, muscle: Muscle, kind: ExerciseKind = 'weight'): Exercise => ({ id, name, muscle, kind })

export const BUILT_IN_EXERCISES: Exercise[] = [
  e('bench-press', 'Bench Press (Barbell)', 'Chest'),
  e('incline-bench', 'Incline Bench Press', 'Chest'),
  e('db-bench', 'Dumbbell Bench Press', 'Chest'),
  e('incline-db-press', 'Incline Dumbbell Press', 'Chest'),
  e('cable-fly', 'Cable Fly', 'Chest'),
  e('push-up', 'Push-up', 'Chest', 'bodyweight'),
  e('dips', 'Dips', 'Chest', 'bodyweight'),

  e('deadlift', 'Deadlift', 'Back'),
  e('barbell-row', 'Barbell Row', 'Back'),
  e('pull-up', 'Pull-up', 'Back', 'bodyweight'),
  e('chin-up', 'Chin-up', 'Back', 'bodyweight'),
  e('lat-pulldown', 'Lat Pulldown', 'Back'),
  e('cable-row', 'Seated Cable Row', 'Back'),
  e('db-row', 'Dumbbell Row', 'Back'),
  e('face-pull', 'Face Pull', 'Back'),

  e('ohp', 'Overhead Press', 'Shoulders'),
  e('db-shoulder-press', 'Dumbbell Shoulder Press', 'Shoulders'),
  e('lateral-raise', 'Lateral Raise', 'Shoulders'),
  e('rear-delt-fly', 'Rear Delt Fly', 'Shoulders'),
  e('arnold-press', 'Arnold Press', 'Shoulders'),

  e('barbell-curl', 'Barbell Curl', 'Biceps'),
  e('db-curl', 'Dumbbell Curl', 'Biceps'),
  e('hammer-curl', 'Hammer Curl', 'Biceps'),
  e('preacher-curl', 'Preacher Curl', 'Biceps'),

  e('pushdown', 'Tricep Pushdown', 'Triceps'),
  e('skull-crusher', 'Skull Crusher', 'Triceps'),
  e('oh-tricep-ext', 'Overhead Tricep Extension', 'Triceps'),
  e('close-grip-bench', 'Close-grip Bench Press', 'Triceps'),

  e('squat', 'Back Squat', 'Legs'),
  e('front-squat', 'Front Squat', 'Legs'),
  e('leg-press', 'Leg Press', 'Legs'),
  e('rdl', 'Romanian Deadlift', 'Legs'),
  e('lunge', 'Dumbbell Lunge', 'Legs'),
  e('split-squat', 'Bulgarian Split Squat', 'Legs'),
  e('leg-extension', 'Leg Extension', 'Legs'),
  e('leg-curl', 'Leg Curl', 'Legs'),
  e('calf-raise', 'Calf Raise', 'Legs'),

  e('hip-thrust', 'Hip Thrust', 'Glutes'),
  e('glute-bridge', 'Glute Bridge', 'Glutes', 'bodyweight'),

  e('plank', 'Plank', 'Core', 'time'),
  e('hanging-leg-raise', 'Hanging Leg Raise', 'Core', 'bodyweight'),
  e('cable-crunch', 'Cable Crunch', 'Core'),
  e('ab-wheel', 'Ab Wheel Rollout', 'Core', 'bodyweight'),
  e('russian-twist', 'Russian Twist', 'Core', 'bodyweight'),

  e('run', 'Running', 'Cardio', 'time'),
  e('row-erg', 'Rowing Machine', 'Cardio', 'time'),
  e('jump-rope', 'Jump Rope', 'Cardio', 'time'),
  e('burpee', 'Burpees', 'Cardio', 'bodyweight'),

  e('kb-swing', 'Kettlebell Swing', 'Full body'),
  e('clean-press', 'Clean and Press', 'Full body'),
]

const re = (exerciseId: string, sets: number, reps: number, restSec = 90) => ({ exerciseId, sets, reps, weight: null, restSec })

export const STARTER_ROUTINES: Routine[] = [
  {
    id: 'starter-push', name: 'Push', createdAt: 1,
    exercises: [re('bench-press', 4, 6, 150), re('ohp', 3, 8, 120), re('incline-db-press', 3, 10), re('lateral-raise', 3, 15, 60), re('pushdown', 3, 12, 60)],
  },
  {
    id: 'starter-pull', name: 'Pull', createdAt: 2,
    exercises: [re('deadlift', 3, 5, 180), re('pull-up', 3, 8, 120), re('cable-row', 3, 10), re('face-pull', 3, 15, 60), re('hammer-curl', 3, 12, 60)],
  },
  {
    id: 'starter-legs', name: 'Legs', createdAt: 3,
    exercises: [re('squat', 4, 6, 180), re('rdl', 3, 8, 120), re('leg-press', 3, 12), re('leg-curl', 3, 12, 60), re('calf-raise', 4, 15, 60)],
  },
  {
    id: 'starter-full', name: 'Full Body', createdAt: 4,
    exercises: [re('squat', 3, 8, 150), re('bench-press', 3, 8, 120), re('barbell-row', 3, 10), re('plank', 3, 45, 60)],
  },
]

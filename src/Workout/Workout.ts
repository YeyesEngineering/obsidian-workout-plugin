export interface workout {
    workoutName: string;
    weight: number;
    reps: (number | number[] | string);
    workoutTarget: workoutTarget[];
}

export type workoutTarget = 'Chest'|'Back'|'Shoulders'|'Biceps'| 'Triceps'|'Quadriceps'|'Hamstrings'|'Glutes'|'Calves';
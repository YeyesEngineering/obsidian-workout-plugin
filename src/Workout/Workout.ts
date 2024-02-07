export interface workout {
    workoutName: string;
    weight: number;
    trainingWeight: number;
    // reps: (number | number[] | string);
    reps: number;
    workoutTarget: workoutTarget[];
}

export type workoutTarget =
    | ''
    | 'Chest'
    | 'Back'
    | 'Shoulders'
    | 'Biceps'
    | 'Triceps'
    | 'Quadriceps'
    | 'Hamstrings'
    | 'Glutes'
    | 'Calves';

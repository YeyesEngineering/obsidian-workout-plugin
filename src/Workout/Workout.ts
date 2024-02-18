export interface workout {
    workoutName: string;
    type: string;
    weight: number;
    trainingWeight: number;
    // reps: (number | number[] | string);
    reps: number;
    workoutTarget: workoutTarget[];
}

//Target 수정 예정
export type workoutTarget =
    | ''
    | 'Cardio'
    | 'Chest'
    | 'Back'
    | 'Shoulders'
    | 'Biceps'
    | 'Triceps'
    | 'Quadriceps'
    | 'Hamstrings'
    | 'Glutes'
    | 'Calves';




// export type workoutType = 'CARDIO' | 'WEIGHT' | 'BODYWEIGHT';

// export interface workoutTest<T extends workoutType> {
//     workoutName: string;
//     type: T;
//     weight?: T extends 'Cardio' ? never : number;
//     weightAdd?: T extends 'Bodyweight' ? number : never;
//     trainingWeight?: T extends 'Cardio' ? never : number;
//     time?: T extends 'Cardio' ? number : never;
//     reps?: T extends 'Cardio' ? never : number;
//     workoutTarget: workoutTarget[];
// }

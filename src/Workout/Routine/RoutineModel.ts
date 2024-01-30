export interface RoutineModel {
    Today: string;
    Workout: boolean;
    Program: string;
    Session: string;
    Progress: string;
    Workoutvolumn: number;
    Bodyweight: number;
    Bigthree: number;
    Squat1rm: number;
    Benchpress1rm: number;
    Deadlift1rm: number;
}

export type gender = 'Male' | 'Female' | 'None';

export interface workoutsession {
    sessionname: string;
    workoutname: string[];
    reps: (number | number[] | string)[];
    sets: number[];
    weight: string[];
}

export interface routineTemplate {
    name: string;
    gender: string;
    session: workoutsession[];
    week: string[][];
}

export interface todayRoutine {
    date: string;
    sessionname: string;
    progress: string;
    workout: string[];
    weight: string[];
    //reps 스트링으로 변경 예정
    reps: (number | number[] | string)[];
    sets: number[];
}

import { workout } from '../Workout';

//REPS 변경 예정
// 만약에 max를 표기하고 싶으면 10000을 입력
//만약에 범위를 지정하고 싶으면 숫자를 붙여서 입력 예를들어 10 ~ 12 이면 10.12 이런형식으로 구현
// reps: (number | number[] | string)[];

export interface RoutineModel {
    Today: string;
    Workout: boolean;
    Program: string;
    Session: string;
    Progress: string;
    Workout_Volume: number;
    Bodyweight: number;
    Bigthree: number;
    Squat_1rm: number;
    Benchpress_1rm: number;
    Deadlift_1rm: number;
}

export interface parseModel {
    workout: string;
    weight: number;
    reps: number;
    set: number;
}

export interface mainModel {
    Bigthree: number;
    Wilks_Point: number;
    DOTS_Score: number;
}

export type gender = 'Male' | 'Female' | 'None';

// export type type = 'None' | 'CONSTANT' | 'PERCENT' | 'HYBRID';

export interface workoutsession {
    sessionname: string;
    workoutname: string[];
    reps: number[];
    sets: number[];
    weight: string[];
    add: number[][];
}

export interface routineTemplate {
    name: string;
    // type: type;
    workoutList: workout[];
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
    add: number[][];
    reps: number[];
    sets: number[];
    volume: number;
}

export interface todayRoutineCheck extends todayRoutine {
    check: boolean[][];
}

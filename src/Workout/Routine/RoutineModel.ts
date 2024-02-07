import { workout } from '../Workout';

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

export interface parseModel {
    workout:string;
    weight:number;
    reps:number;
}

export interface mainModel {
    Bigthree: number;
    Wilks_Point: number;
    DOTS_Score: number;
}

export type gender = 'Male' | 'Female' | 'None';

export interface workoutsession {
    sessionname: string;
    workoutname: string[];
    //REPS 최적화 예정
    // 만약에 max를 표기하고 싶으면 10000을 입력
    //만약에 범위를 지정하고 싶으면 숫자를 붙여서 입력 예를들어 10 ~ 12 이면 1012 이런형식으로 구현

    // reps: (number | number[] | string)[];
    reps: number[];
    sets: number[];
    weight: string[];
    add: number[][];
}

export interface routineTemplate {
    name: string;
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
    //REPS 최적화 예정
    // 만약에 max를 표기하고 싶으면 10000을 입력
    //만약에 범위를 지정하고 싶으면 숫자를 붙여서 입력 예를들어 10 ~ 12 이면 1012 이런형식으로 구현
    // reps: (number | number[] | string)[];
    reps: number[];
    sets: number[];
}

import WorkoutPlugin from 'main';
// import { Notice } from 'obsidian';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';
import { routineTemplate } from './RoutineModel';
import { Calculator } from '../Calculator';

export class WeightUpdate {
    plugin: WorkoutPlugin;
    settings: WorkoutPluginSettings;
    Routine: routineTemplate;
    Gender: string;
    bigthree: number[];

    constructor(plugin: WorkoutPlugin) {
        this.plugin = plugin;
        this.Routine = this.plugin.settings.routineTemplate;
        this.Gender = this.plugin.settings.gender;
        this.bigthree = this.plugin.settings.bigThree;
        this.settings = this.plugin.settings;
    }

    async oneRMUpdater(workout: string, weight: number, reps: number) {
        const tempBigthree = [...this.plugin.settings.bigThree];
        console.log(tempBigthree);
        switch (workout) {
            case 'SQUAT':
                if (tempBigthree[0] < (await Calculator.onerm(weight, reps))) {
                    const updateData = await Calculator.onerm(weight, reps);
                    this.plugin.settings.bigThree = [
                        updateData,
                        tempBigthree[1],
                        tempBigthree[2],
                        updateData + tempBigthree[1] + tempBigthree[2],
                    ];
                }
                break;
            case 'BENCHPRESS':
                if (tempBigthree[1] < (await Calculator.onerm(weight, reps))) {
                    const updateData = await Calculator.onerm(weight, reps);
                    console.log('update upcoming', updateData);
                    this.plugin.settings.bigThree = [
                        tempBigthree[0],
                        updateData,
                        tempBigthree[2],
                        updateData + tempBigthree[1] + tempBigthree[2],
                    ];
                }
                break;
            case 'DEADLIFT':
                if (tempBigthree[2] < (await Calculator.onerm(weight, reps))) {
                    const updateData = await Calculator.onerm(weight, reps);
                    this.plugin.settings.bigThree = [
                        tempBigthree[0],
                        tempBigthree[1],
                        updateData,
                        updateData + tempBigthree[1] + tempBigthree[2],
                    ];
                }
                break;
        }
    }

    async trainingWeightUpdater(workouts: string, set: number) {
        if (this.settings.todayRoutine.add) {
            const index = this.settings.todayRoutine.workout.findIndex((val) => val === workouts);
            console.log('index', index);
            this.settings.todayRoutine.check[index][set - 1]++;
            await this.plugin.saveSettings();
            console.log(this.settings.todayRoutine.check[index]);

            if (this.settings.todayRoutine.check[index].every((element) => element === 1)) {
                const workoutlistsIndex = this.settings.workoutLists.findIndex((val) => val.workoutName === workouts);
                // console.log(this.settings.workoutLists[workoutlistsIndex]);
                this.settings.workoutLists[workoutlistsIndex].trainingWeight =
                    this.settings.workoutLists[workoutlistsIndex].trainingWeight +
                    this.settings.todayRoutine.add[index][0];
            }
            await this.plugin.saveSettings();
        }
    }

    // async todayRoutineUpdater(date: string): Promise<number[]> {
    //     const today = date;
    //     //이전 데이터 초기화
    //     this.settings.todayRoutine.workout = [];
    //     this.settings.todayRoutine.weight = [];
    //     this.settings.todayRoutine.reps = [];
    //     this.settings.todayRoutine.sets = [];
    //     this.settings.todayRoutine.add = [];
    //     await this.plugin.saveSettings();
    //     //데이터 설정
    //     const todaydata = this.settings.routinePlan.find((value) => value.date === today);
    //     console.log(todaydata);
    //     if (todaydata) {
    //         this.settings.todayRoutine.date = today;
    //         this.settings.todayRoutine.progress = todaydata.progress;
    //         this.settings.todayRoutine.sessionname = todaydata.sessionname;
    //         this.settings.todayRoutine.workout = todaydata.workout;
    //         this.settings.todayRoutine.weight = todaydata.weight;
    //         this.settings.todayRoutine.reps = todaydata.reps;
    //         this.settings.todayRoutine.sets = todaydata.sets;
    //         this.settings.todayRoutine.add = todaydata.add;
    //         await this.plugin.saveSettings();
    //     } else {
    //         //연장 하는 옵션 추가
    //         new Notice('초기화 후 다시 시도해주세요');
    //     }

    //     return [];
    // }
}

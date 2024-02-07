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

    async oneRMUpdator(workout: string, weight: number, reps: number) {
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

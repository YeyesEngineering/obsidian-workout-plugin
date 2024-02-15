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
        const Bigthree = [...this.plugin.settings.bigThree];
        switch (workout) {
            case 'SQUAT':
                if (Bigthree[0] < (await Calculator.onerm(weight, reps))) {
                    const updateData = await Calculator.onerm(weight, reps);
                    this.plugin.settings.bigThree = [
                        updateData,
                        Bigthree[1],
                        Bigthree[2],
                        updateData + Bigthree[1] + Bigthree[2],
                    ];
                }
                break;
            case 'BENCH PRESS':
                if (Bigthree[1] < (await Calculator.onerm(weight, reps))) {
                    const updateData = await Calculator.onerm(weight, reps);
                    this.plugin.settings.bigThree = [
                        Bigthree[0],
                        updateData,
                        Bigthree[2],
                        updateData + Bigthree[0] + Bigthree[2],
                    ];
                }
                break;
            case 'DEADLIFT':
                if (Bigthree[2] < (await Calculator.onerm(weight, reps))) {
                    const updateData = await Calculator.onerm(weight, reps);
                    this.plugin.settings.bigThree = [
                        Bigthree[0],
                        Bigthree[1],
                        updateData,
                        updateData + Bigthree[0] + Bigthree[1],
                    ];
                }
                break;
        }
    }

    async trainingWeightUpdater(workout: string, set: number) {
        if (this.settings.todayRoutine.add) {
            const index = this.settings.todayRoutine.workout.findIndex((val) => val === workout);
            this.settings.todayRoutine.check[index][set - 1]++;
            await this.plugin.saveSettings();
            if (this.settings.todayRoutine.check[index].every((element) => element === 1)) {
                ////만약에 add는 존재하나 특정 운동만 증량하고 싶을때 해결하는 코드 작성
                //실패시 적용할 코드 작성 실패를 어떻게 카운팅 할까
                if (this.settings.todayRoutine.add[index].length !== 0) {
                    const workoutlistsIndex = this.settings.workoutLists.findIndex(
                        (val) => val.workoutName === workout,
                    );
                    this.settings.workoutLists[workoutlistsIndex].trainingWeight =
                        this.settings.workoutLists[workoutlistsIndex].trainingWeight +
                        this.settings.todayRoutine.add[index][0];
                    await this.plugin.saveSettings();
                }
            }
        }
    }
}

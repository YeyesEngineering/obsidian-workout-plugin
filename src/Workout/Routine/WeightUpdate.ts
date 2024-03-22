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
        const Bigthree = [...this.bigthree];
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

        await this.plugin.saveSettings();
        return this.plugin.settings.bigThree;
    }

    async trainingWeightUpdater(workout: string, set: number) {
        if (this.settings.todayRoutine.add) {
            const index = this.settings.todayRoutine.workout.findIndex((val) => val === workout);
            this.settings.todayRoutine.check[index][set - 1] = true;
            await this.plugin.saveSettings();
            if (this.settings.todayRoutine.check[index].every((element) => element === true)) {
                ////만약에 add는 존재하나 특정 운동만 증량하고 싶을때 해결하는 코드 작성
                //실패시 적용할 코드 작성 실패를 어떻게 카운팅 할까
                if (this.settings.todayRoutine.add[index].length === 2) {
                    //코드 테스트 및 확인
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

    async volumeUpdater(workout: string, weight: number, reps: number, set: number) {

        const index = this.settings.todayRoutine.workout.findIndex((val) => val === workout);
        if (this.settings.todayRoutine.check[index][set - 1] === false) {
            let volume = this.settings.volume;
            volume += weight * reps;
            this.settings.volume = volume;
            //add가 없을때 체크 반영
            if (!this.settings.todayRoutine.add) {
                this.settings.todayRoutine.check[index][set - 1] = true;
                await this.plugin.saveSettings();
            }
            if (this.settings.todayRoutine.check.flat().every((element) => element === true)) {
                this.settings.volume = 0;
            }
            await this.plugin.saveSettings();
        }
    }
}

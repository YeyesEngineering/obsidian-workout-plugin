import WorkoutPlugin from 'main';
import { Notice, moment } from 'obsidian';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';
import { parseModel, routineTemplate } from 'src/Workout/Routine/RoutineModel';
// import { WeightUpdate } from 'src/Workout/Routine/WeightUpdate';

export class ParseWorkout {
    plugin: WorkoutPlugin;
    settings: WorkoutPluginSettings;

    constructor(plugin: WorkoutPlugin) {
        this.plugin = plugin;
        this.settings = this.plugin.settings;
    }

    public static jsonChecker(file: routineTemplate) {
        console.log('file', file);
        for (const workoutlist of file.workoutList) {
            if (typeof workoutlist.workoutName !== 'string') {
                new Notice('Check Json file workout name');
                return false;
            }
            if (
                !(
                    workoutlist.workoutName === 'WEIGHT' ||
                    workoutlist.workoutName === 'BODYWEIGHT' ||
                    workoutlist.workoutName === 'CARDIO'
                )
            ) {
                new Notice('Check Json File type');
                return false;
            }
            if (
                typeof workoutlist.trainingWeight !== 'number' ||
                typeof workoutlist.reps !== 'number' ||
                typeof workoutlist.weight !== 'number'
            ) {
                new Notice('Check Json file weight series');
                return false;
            }

            for (const target of workoutlist.workoutTarget) {
                if (
                    !(
                        target === '' ||
                        target === 'Cardio' ||
                        target === 'Chest' ||
                        target === 'Back' ||
                        target === 'Biceps' ||
                        target === 'Calves' ||
                        target === 'Glutes' ||
                        target === 'Hamstrings' ||
                        target === 'Quadriceps' ||
                        target === 'Shoulders' ||
                        target === 'Triceps'
                    )
                ) {
                    new Notice('Check Json file workout Target');
                    return false;
                }
            }
        }


        for (const session of file.session) {
            //개수 비교
            if (session.add.length === session.reps.length && session.sets.length === session.workoutname.length  && session.add.length === session.weight.length)
            if (typeof session.sessionname !== 'string') {
                new Notice('Check Session Name');
                return false;
            }
            for (const name of session.workoutname) {
                // 개수 체크도 진행해야할 듯

                if (
                    !file.workoutList.some(
                        (value) => value.workoutName.toUpperCase().trim() === name.toUpperCase().trim(),
                    )
                ) {
                    new Notice('Check Session Workout Name');
                    return false;
                }
            }
        }

        return true;
    }

    public static numberChecker(string: string) {
        const num = parseFloat(string);
        if (isNaN(num)) {
            new Notice('enter only number');
            return 0;
        } else {
            return num;
        }
    }

    public static dayChecker(string: string) {
        return moment(string, moment.ISO_8601, true).isValid();
    }

    public static titleParser(string: string) {
        const date = string.match(/\d{4}-\d{2}-\d{2}/);
        if (date) {
            return date[0];
        }
    }

    public static parser(string: string): parseModel {
        const zerowidth = string.replace(/\u200B/g, '');
        const workoutName = zerowidth.split(':');
        const weight = workoutName[1].split('X');
        const reps = weight[1].split('-');
        const set = reps[1].replace(/[^0-9]/g, '');
        const data = {
            workout: workoutName[0].trim(),
            weight: parseFloat(weight[0].trim()),
            reps: parseInt(reps[0].trim()),
            set: parseInt(set.trim()),
        };
        return data;
    }
}

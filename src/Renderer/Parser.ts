import WorkoutPlugin from 'main';
// import { Notice } from 'obsidian';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';
import { parseModel } from 'src/Workout/Routine/RoutineModel';
// import { WeightUpdate } from 'src/Workout/Routine/WeightUpdate';

export class ParseWorkout {
    plugin: WorkoutPlugin;
    settings: WorkoutPluginSettings;

    constructor(plugin: WorkoutPlugin) {
        this.plugin = plugin;
        this.settings = this.plugin.settings;
    }

    public static titleParser(string: string){
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

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

    
    public parser(string: string): parseModel{
        const workoutName = string.replaceAll(' ', '').split(':');
        const weight = workoutName[1].split('X');
        const reps = weight[1].split('-');
        const data = {
            workout: workoutName[0],
            weight: parseFloat(weight[0]),
            reps: parseInt(reps[0]),
        }
        return data;
    }
}

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

    public parser(string: string): parseModel {
        const workoutName = string.split(':');
        //띄어쓰기 Parser 수정
        //note 뒷부분 스트링 제거 예정
        const weight = workoutName[1].split('X');
        const reps = weight[1].split('-');
        const set = reps[1].replace(/[^0-9]/g, '');
        const data = {
            workout: workoutName[0].trim(),
            weight: parseFloat(weight[0].trim()),
            reps: parseInt(reps[0].trim()),
            set: parseInt(set.trim()),
        };
        console.log(data);
        return data;
    }
}

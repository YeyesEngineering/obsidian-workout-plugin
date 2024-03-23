// import WorkoutPlugin from 'main';
import { TFile, App } from 'obsidian';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';

export class NoteUpdate {
    // plugin: WorkoutPlugin;
    app: App;
    settings: WorkoutPluginSettings;

    constructor(app: App, settings: WorkoutPluginSettings) {
        this.app = app;
        this.settings = settings;
    }

    MainNoteUpdate(file: TFile): Promise<string> {
        const Bigthree_regex = /Bigthree:\s*(\d+)/;
        const Wilks_regex = /Wilks_Point:\s*([+-]?\d*\.?\d+)/;
        const DOTS_regex = /DOTS_Score:\s*([+-]?\d*\.?\d+)/;
        return this.app.vault.process(file, (data) => {
            return data
                .replace(Bigthree_regex, `Bigthree: ${this.settings.bigThree[3]}`)
                .replace(Wilks_regex, `Wilks_Point: ${this.settings.wilks2point}`)
                .replace(DOTS_regex, `DOTS_Score: ${this.settings.dotspoint}`);
        });
    }

    IndividualNoteUpdate(file: TFile, weight: number, reps: number): Promise<string> {
        const Bigthree_regex = /Bigthree:\s*(\d+)/;
        const Workoutvolume_regex = /Workout_Volume:\s*([+-]?\d*\.?\d+)/;
        const Squat1rm_regex = /Squat_1rm:\s*(\d+)/;
        const Benchpress1rm_regex = /Benchpress_1rm:\s*(\d+)/;
        const Deadlift1rm_regex = /Deadlift_1rm:\s*(\d+)/;

        return this.app.vault.process(file, (data) => {
            //volume
            const volume = this.settings.todayRoutine.volume;

            return data
                .replace(Bigthree_regex, `Bigthree: ${this.settings.bigThree[3]}`)
                .replace(Squat1rm_regex, `Squat_1rm: ${this.settings.bigThree[0]}`)
                .replace(Benchpress1rm_regex, `Benchpress_1rm: ${this.settings.bigThree[1]}`)
                .replace(Deadlift1rm_regex, `Deadlift_1rm: ${this.settings.bigThree[2]}`)
                .replace(Workoutvolume_regex, `Workout_Volume: ${volume}`);
        });
    }
}

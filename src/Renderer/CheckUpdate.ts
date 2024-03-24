import { Notice, TFile, App, moment, normalizePath } from 'obsidian';
import WorkoutPlugin from 'main';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';
import { ParseWorkout } from 'src/Renderer/Parser';
import { WeightUpdate } from 'src/Workout/Routine/WeightUpdate';

import { NoteUpdate } from 'src/Markdown/Noteupdate';
import { Calculator } from 'src/Workout/Calculator';

export class CheckUpdate {
    plugin: WorkoutPlugin;
    app: App;
    settings: WorkoutPluginSettings;

    constructor(plugin: WorkoutPlugin) {
        this.plugin = plugin;
        this.app = this.plugin.app;
        this.settings = this.plugin.settings;
    }

    async CheckUpdater(text: string) {
        const { workout, weight, reps, set } = ParseWorkout.parser(text, this.settings.bodyWeight);
        const Weight_Update = new WeightUpdate(this.plugin);
        const Cal = new Calculator(this.plugin);
        const Note = new NoteUpdate(this.app, this.settings);

        //Volume Update
        await Weight_Update.volumeUpdater(workout, weight, reps, set);

        //Training Weight Update
        Weight_Update.trainingWeightUpdater(workout, set);

        //1rm Update
        await Weight_Update.oneRMUpdater(workout, weight, reps);

        //Wilks Update
        await Cal.wilks2Calculator();

        //Dots Update
        await Cal.dotsCalculator();

        //Main Note Update
        const mainPage = this.app.vault.getAbstractFileByPath(
            normalizePath(`${this.settings.mainPageFolder}/${this.settings.mainPageName}.md`),
        );
        if (mainPage instanceof TFile) {
            Note.MainNoteUpdate(mainPage);
        }

        //Individual Note Update
        const today = moment().format('YYYY-MM-DD');
        const todayPage = this.app.vault.getAbstractFileByPath(
            normalizePath(`${this.plugin.settings.workoutFolder}/Workout ${today}.md`),
        );

        if (todayPage instanceof TFile) {
            Note.IndividualNoteUpdate(todayPage, weight, reps);
        }

        new Notice('Update done');
    }
}

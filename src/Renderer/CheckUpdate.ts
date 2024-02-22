import { Notice, TFile, App, moment } from 'obsidian';
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
        const { workout, weight, reps, set } = ParseWorkout.parser(text,this.settings.bodyWeight);

        //Training Weight Update
        new WeightUpdate(this.plugin).trainingWeightUpdater(workout, set);

        //1rm Update
        await new WeightUpdate(this.plugin).oneRMUpdater(workout, weight, reps);

        //Wilks Update
        await new Calculator(this.plugin).wilks2Calculator();

        //Dots Update
        await new Calculator(this.plugin).dotsCalculator();

        //Main Note Update
        const mainPage = this.app.vault.getAbstractFileByPath(
            `${this.settings.workoutFolder}/${this.settings.mainPageName}.md`,
        );
        if (mainPage instanceof TFile) {
            new NoteUpdate(this.app, this.settings).MainNoteUpdate(mainPage);
        }

        //Individual Note Update
        const today = moment().format('YYYY-MM-DD');
        const todayPage = this.app.vault.getAbstractFileByPath(
            `${this.plugin.settings.workoutFolder}/Workout ${today}.md`,
        );

        if (todayPage instanceof TFile) {
            new NoteUpdate(this.app, this.settings).IndividualNoteUpdate(todayPage,weight,reps);
        }

        new Notice('Update done');
    }
}

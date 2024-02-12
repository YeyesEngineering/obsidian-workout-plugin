import { App, Notice, TFile, TFolder, moment } from 'obsidian';
import WorkoutPlugin from 'main';
import { Calculator } from 'src/Workout/Calculator';
import { WorkoutButtonModal } from 'src/Modal/ButtonModal';
import { FirstWorkoutButtonModal } from 'src/Modal/FirstButtonModal';
import { SecondWorkoutButtonModal } from 'src/Modal/SecondButtonModal';
import { NotworkoutButtonModal } from 'src/Modal/NormalButtonModal';
import { ThirdWorkoutButtonModal } from 'src/Modal/ThirdButtonModal';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';

export class BaseModal {
    plugin: WorkoutPlugin;
    app: App;
    settings: WorkoutPluginSettings;
    startday: string;

    constructor(app: App, plugin: WorkoutPlugin, settings: WorkoutPluginSettings) {
        this.app = app;
        this.plugin = plugin;
        this.settings = settings;
    }

    onOpen(): void {
        const workoutFolder = this.app.vault.getAbstractFileByPath(this.settings.workoutFolder);
        if (this.settings.startday === 'None') {
            if (
                this.settings.gender === 'None' &&
                this.settings.bodyWeight === '' &&
                this.settings.workoutLists[0].weight === 0
            ) {
                new Notice('Please Settings First');
            } else {
                new Calculator(this.plugin).Setup();
                const workoutInnerFile = this.app.vault.getAbstractFileByPath(
                    `${this.settings.workoutFolder}/${this.settings.mainPageName}.md`,
                );
                if (workoutFolder instanceof TFolder && workoutInnerFile instanceof TFile) {
                    new ThirdWorkoutButtonModal(this.app, this.plugin).open();
                } else if (workoutFolder instanceof TFolder && !(workoutInnerFile instanceof TFile)) {
                    new SecondWorkoutButtonModal(this.app, this.plugin).open();
                } else if (!(workoutFolder instanceof TFolder) && !(workoutInnerFile instanceof TFile)) {
                    new FirstWorkoutButtonModal(this.app, this.plugin).open();
                }
            }
        } else {
            if (!(workoutFolder instanceof TFolder)) {
                new Notice('Check Directory and Change Directory');
                // this.settings.startday = 'None';
                // this.plugin.saveSettings();
                // console.log(this.settings.startday);
                // new Notice('StartDay Reset')
            } else {
                const today = moment().format('YYYY-MM-DD');
                if (this.settings.routinePlan.some((value) => value.date === today)) {
                    new WorkoutButtonModal(this.app, this.plugin).open();
                } else {
                    new NotworkoutButtonModal(this.app, this.plugin).open();
                }
            }
        }
    }
}

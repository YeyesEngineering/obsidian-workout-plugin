import { App, Notice, TFile, TFolder, moment, normalizePath } from 'obsidian';
import WorkoutPlugin from 'main';
import { Calculator } from 'src/Workout/Calculator';
import { WorkoutStartModal } from 'src/Modal/WorkoutStartModal';
import { NotworkoutdayStartModal } from 'src/Modal/NotworkoutdayStartModal';
import { WorkoutSetupModal } from 'src/Modal/WorkoutSetupModal';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';

export class BaseModal {
    plugin: WorkoutPlugin;
    app: App;
    settings: WorkoutPluginSettings;
    startday: string;

    constructor(app: App, plugin: WorkoutPlugin) {
        this.app = app;
        this.plugin = plugin;
        this.settings = this.plugin.settings;
    }

    onOpen(): void {
        const workoutFolder = this.app.vault.getAbstractFileByPath(normalizePath(this.settings.workoutFolder));
        const workoutInnerFile = this.app.vault.getAbstractFileByPath(
            normalizePath(`${this.plugin.settings.mainPageFolder}/${this.plugin.settings.mainPageName}.md`),
        );
        const workoutInnerFolder = this.app.vault.getAbstractFileByPath(normalizePath(this.plugin.settings.mainPageFolder));
        if (
            this.settings.startday === 'None' ||
            !(workoutFolder instanceof TFolder) ||
            !(workoutInnerFile instanceof TFile) ||
            !(workoutInnerFolder instanceof TFolder)
        ) {
            //Setting Check
            if (
                this.settings.gender === 'None' &&
                this.settings.bodyWeight === 0 &&
                this.settings.workoutLists[0].weight === 0 &&
                this.settings.routineTemplate.name === 'None'
            ) {
                new Notice('Please Settings First');
            } else {
                new Calculator(this.plugin).Setup();
                new WorkoutSetupModal(this.app, this.plugin).open();
            }
        } else {
            const today = moment().format('YYYY-MM-DD');

            if (this.settings.routinePlan.some((value) => value.date === today)) {
                new WorkoutStartModal(this.app, this.plugin).open();
            } else {
                new NotworkoutdayStartModal(this.app, this.plugin).open();
            }
        }
    }
}

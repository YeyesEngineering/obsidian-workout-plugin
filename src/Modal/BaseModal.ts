import { App, Notice, TFile, TFolder, moment } from 'obsidian';
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

    constructor(app: App, plugin: WorkoutPlugin, settings: WorkoutPluginSettings) {
        this.app = app;
        this.plugin = plugin;
        this.settings = settings;
    }

    onOpen(): void {
        const workoutFolder = this.app.vault.getAbstractFileByPath(this.settings.workoutFolder);
        const workoutInnerFile = this.app.vault.getAbstractFileByPath(
            `${this.plugin.settings.workoutFolder}/${this.plugin.settings.mainPageName}.md`,
        );
        if (
            this.settings.startday === 'None' ||
            !(workoutFolder instanceof TFolder) ||
            !(workoutInnerFile instanceof TFile)
        ) {
            if (
                this.settings.gender === 'None' &&
                this.settings.bodyWeight === 0 &&
                this.settings.workoutLists[0].weight === 0
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

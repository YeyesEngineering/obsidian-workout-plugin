import { Notice, Plugin } from 'obsidian';
import { WorkoutPluginSettings, DEFAULT_SETTINGS, WorkoutPluginSettingTab } from 'src/Setting/SettingTab';
import { ParseWorkout } from 'src/Renderer/Parser';
import { WeightUpdate } from 'src/Workout/Routine/WeightUpdate';
import { BaseModal } from 'src/Modal/BaseModal';
import { OneRMModal } from 'src/Modal/OneRMModal';

export default class WorkoutPlugin extends Plugin {
    settings: WorkoutPluginSettings;

    async onload() {
        await this.loadSettings();

        const ribbonIconEl = this.addRibbonIcon('dumbbell', 'Workout Plugin', (evt: MouseEvent) => {
            new BaseModal(this.app, this, this.settings).onOpen();
        });

        ribbonIconEl.addClass('obsidian-workout-ribbon-class');

        this.addCommand({
            id: 'Workout Plugin',
            name: 'Workout Plugin',
            callback: () => {
                new BaseModal(this.app, this, this.settings).onOpen();
            },
        });

        //1RM Calculator

        this.addCommand({
            id: 'Workout Plugin - 1RM Calculator',
            name: '1RM Calculator',
            callback: () => {
                new OneRMModal(this.app).open();
            },
        });

        this.addSettingTab(new WorkoutPluginSettingTab(this.app, this));

        // CheckBOX Update

        this.registerDomEvent(document, 'click', (event: MouseEvent) => {
            const { target } = event;

            if (!target || !(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
                return false;
            }
            if (
                event.doc.title.startsWith('Workout') &&
                event.doc.activeElement?.textContent?.includes('Today Workout List')
            ) {
                const text = target.offsetParent?.textContent;
                if (text) {
                    const { workout, weight, reps, set } = new ParseWorkout(this).parser(text);
                    //1rm Update
                    new WeightUpdate(this).oneRMUpdater(workout, weight, reps);
                    //Training Weight Update
                    new WeightUpdate(this).trainingWeightUpdater(workout, set);
                    new Notice('Update Done');
                }
            }
        });
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

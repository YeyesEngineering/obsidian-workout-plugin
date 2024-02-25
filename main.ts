import { Notice, Plugin, moment } from 'obsidian';
import { WorkoutPluginSettings, DEFAULT_SETTINGS, WorkoutPluginSettingTab } from 'src/Setting/SettingTab';
import { ParseWorkout } from 'src/Renderer/Parser';
import { BaseModal } from 'src/Modal/BaseModal';
import { OneRMModal } from 'src/Modal/OneRMModal';
// import { NoteUpdate } from 'src/Markdown/Noteupdate';
import { CheckUpdate } from 'src/Renderer/CheckUpdate';

export default class WorkoutPlugin extends Plugin {
    settings: WorkoutPluginSettings;

    async onload() {
        await this.loadSettings();

        const ribbonIconEl = this.addRibbonIcon('dumbbell', 'Workout Plugin', (evt: MouseEvent) => {
            new BaseModal(this.app, this).onOpen();
        });

        ribbonIconEl.addClass('obsidian-workout-ribbon-class');

        this.addCommand({
            id: 'Workout Plugin',
            name: 'Workout Plugin',
            callback: () => {
                new BaseModal(this.app, this).onOpen();
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
                //text blank Check
                if (text && text.length > 2) {
                    // Date Check
                    if (moment().format('YYYY-MM-DD') !== ParseWorkout.titleParser(event.doc.title)) {
                        new Notice("It's not a workout for today");
                        return false;
                    }
                    // Add Error Handler //
                    //
                    new CheckUpdate(this).CheckUpdater(text);
                } else {
                    return false;
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

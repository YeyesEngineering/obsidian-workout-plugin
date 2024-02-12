import { Notice, Plugin } from 'obsidian';
import {
    WorkoutPluginSettings,
    DEFAULT_SETTINGS,
    WorkoutPluginSettingTab,
} from '../obsidian-workout-main/src/Setting/SettingTab';
import { ParseWorkout } from 'src/Renderer/Parser';
import { WeightUpdate } from 'src/Workout/Routine/WeightUpdate';
import { BaseModal } from 'src/Modal/BaseModal';

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

        this.addSettingTab(new WorkoutPluginSettingTab(this.app, this));

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.

        // let flag = false;
        // this.registerEvent(
        //     this.app.workspace.on('active-leaf-change', () => {
        //         const page = this.app.workspace.getActiveFile();
        //         console.log(page);
        //         if (page?.path.startsWith(this.settings.workoutFolder) && page?.name.startsWith('Workout')) {
        //             console.log('this page is workout');
        //             console.log('flag', flag);
        //             flag = true;
        //         } else {
        //             //disable 코드 설정?
        //             flag = false;
        //             console.log('flag', flag);
        //         }
        //     }),
        // );

        this.registerDomEvent(document, 'click', (event: MouseEvent) => {
            const { target } = event;
            // if (flag === false) {
            //     event.preventDefault();
            //     return false;
            // }

            if (!target || !(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
                return false;
            }
            if (
                event.doc.title.startsWith('Workout') &&
                event.doc.activeElement?.textContent?.includes('Today Workout List')
            ) {
                // console.log('target', event.view);
                // console.log('target', event);
                // console.log('target', event.doc.title);
                // console.log(event.doc.activeElement?.getText());
                // console.log(event.doc.activeElement);
                // console.log(target.labels);
                const text = target.offsetParent?.textContent;
                if (text) {
                    const { workout, weight, reps, set } = new ParseWorkout(this).parser(text);
                    //1rm Update
                    new WeightUpdate(this).oneRMUpdater(workout, weight, reps);
                    //Training Weight Update
                    new WeightUpdate(this).trainingWeightUpdater(workout, set);
                    new Notice('Update Finish');
                }
            }
        });

        //     const { target } = event;
        //     if (!target || !(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
        //         return false;
        //     }
        //     if (
        //         event.doc.title.startsWith('Workout') &&
        //         event.doc.activeElement?.textContent?.includes('Today Workout List')
        //     ) {
        //         // console.log('target', event.view);
        //         // console.log('target', event);
        //         // console.log('target', event.doc.title);
        //         // console.log(event.doc.activeElement?.getText());
        //         // console.log(event.doc.activeElement);
        //         // console.log(target.labels);
        //         const text = target.offsetParent?.textContent;
        //         if (text) {
        //             const { workout, weight, reps, set } = new ParseWorkout(this).parser(text);
        //             console.log(set);
        //             //1rm 업데이트
        //             new WeightUpdate(this).oneRMUpdater(workout, weight, reps);
        //             //Training Weight Update
        //             new WeightUpdate(this).trainingWeightUpdater(workout, set);
        //             new Notice('업데이트 완료');
        //         }
        //     }
        // });

        // const workoutFolder = this.app.vault.getAbstractFileByPath(this.settings.workoutFolder);
        // const workoutInnerFile = this.app.vault.getAbstractFileByPath(
        //     `${this.settings.workoutFolder}/${this.settings.mainPageName}.md`,
        // );
        // if (workoutFolder instanceof TFolder && workoutInnerFile instanceof TFile) {
        //     console.log('t');
        // }

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        // this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

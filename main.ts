import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile, TFolder, moment } from 'obsidian';
import {
    WorkoutPluginSettings,
    DEFAULT_SETTINGS,
    WorkoutPluginSettingTab,
} from '../obsidian-workout-main/src/Setting/SettingTab';
import { Calculator } from 'src/Workout/Calculator';
import { WorkoutButtonModal } from 'src/Modal/ButtonModal';
import { FirstWorkoutButtonModal } from 'src/Modal/FirstButtonModal';
import { SecondWorkoutButtonModal } from 'src/Modal/SecondButtonModal';
import { NotworkoutButtonModal } from 'src/Modal/NormalButtonModal';
import { ThirdWorkoutButtonModal } from 'src/Modal/ThirdButtonModal';
import { Renderer } from 'src/Renderer/Renderer';
import { ParseWorkout } from 'src/Renderer/Parser';
import { WeightUpdate } from 'src/Workout/Routine/WeightUpdate';
// import { PreviewExtension } from 'src/Renderer/PreviewExtension';
//타입 체크

export default class WorkoutPlugin extends Plugin {
    settings: WorkoutPluginSettings;
    renderer: Renderer;

    async onload() {
        await this.loadSettings();

        // 특정 페이지에서만 작동하는 Renderer를 제작?
        // this.renderer = new Renderer({ plugin: this });
        // this.registerEditorExtension(PreviewExtension());

        const ribbonIconEl = this.addRibbonIcon('dumbbell', 'Workout Plugin', (evt: MouseEvent) => {
            if (this.settings.startday === 'None') {
                if (
                    this.settings.gender === 'None' &&
                    this.settings.bodyWeight === '' &&
                    this.settings.workoutLists[0].weight === 0
                ) {
                    new Notice('Please Settings First');
                } else {
                    new Calculator(this).basicSetup();
                    const workoutFolder = this.app.vault.getAbstractFileByPath(this.settings.workoutFolder);
                    const workoutInnerFile = this.app.vault.getAbstractFileByPath(
                        `${this.settings.workoutFolder}/${this.settings.mainPageName}.md`,
                    );
                    if (workoutFolder instanceof TFolder && workoutInnerFile instanceof TFile) {
                        new ThirdWorkoutButtonModal(this.app, this).open();
                    } else if (workoutFolder instanceof TFolder && !(workoutInnerFile instanceof TFile)) {
                        new SecondWorkoutButtonModal(this.app, this).open();
                    } else if (!(workoutFolder instanceof TFolder) && !(workoutInnerFile instanceof TFile)) {
                        new FirstWorkoutButtonModal(this.app, this).open();
                    }
                }
            } else {
                //폴더를 옮겼을 경우를 대비하는 코드 작성
                const workoutFolder = this.app.vault.getAbstractFileByPath(this.settings.workoutFolder);
                if (!(workoutFolder instanceof TFolder)) {
                    new Notice('Check Directory');
                    //
                } else {
                    const today = moment().format('YYYY-MM-DD');
                    if (this.settings.routinePlan.some((value) => value.date === today)) {
                        new WorkoutButtonModal(this.app, this).open();
                    } else {
                        new NotworkoutButtonModal(this.app, this).open();
                    }
                }
            }
        });
        // Perform additional things with the ribbon

        ribbonIconEl.addClass('obsidian-workout-ribbon-class');

        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: 'open-sample-modal-simple',
            name: 'Open sample modal (simple)',
            callback: () => {
                new SampleModal(this.app).open();
            },
        });
        // This adds an editor command that can perform some operation on the current editor instance
        this.addCommand({
            id: 'sample-editor-command',
            name: 'Sample editor command',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                console.log(editor.getSelection());
                editor.replaceSelection('Sample Editor Command');
            },
        });
        // This adds a complex command that can check whether the current state of the app allows execution of the command
        this.addCommand({
            id: 'open-sample-modal-complex',
            name: 'Open sample modal (complex)',
            checkCallback: (checking: boolean) => {
                // Conditions to check
                const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (markdownView) {
                    // If checking is true, we're simply "checking" if the command can be run.
                    // If checking is false, then we want to actually perform the operation.
                    if (!checking) {
                        new SampleModal(this.app).open();
                    }

                    // This command will only show up in Command Palette when the check function returns true
                    return true;
                }
            },
        });

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new WorkoutPluginSettingTab(this.app, this));

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.

        /// 특정페이지를 확인하고 특정 페이지면 실행 되도록 수정 예정
        this.registerDomEvent(document, 'click', (event: MouseEvent) => {
            const { target } = event;
            if (!target || !(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
                return false;
            }
            console.log(event.doc.title.startsWith('Workout'));
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
                    const {workout,weight,reps,set} = new ParseWorkout(this).parser(text);
                    console.log(set);
                    //1rm 업데이트
                    new WeightUpdate(this).oneRMUpdater(workout,weight,reps);
                    //Training Weight Update
                    new WeightUpdate(this).trainingWeightUpdater(workout,set);
                    new Notice('업데이트 완료');
                }
            }
        });

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

class SampleModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.setText('Woah!');
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

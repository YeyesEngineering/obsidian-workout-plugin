import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import {
    WorkoutPluginSettings,
    DEFAULT_SETTINGS,
    WorkoutPluginSettingTab,
} from '../obsidian-workout-main/src/Setting/SettingTab';
import { Calculator } from 'src/Workout/Calculator';
import { WorkoutButtonModal } from 'src/Modal/ButtonModal';
import { FirstWorkoutButtonModal } from 'src/Modal/FirstButtonModal';

export default class WorkoutPlugin extends Plugin {
    settings: WorkoutPluginSettings;

    async onload() {
        await this.loadSettings();

        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon('dice', 'Workout Plugin', (evt: MouseEvent) => {
            new Notice('This is a notice!');
            new Calculator(this).oneRmCalculator();
            // new Calculator(this).wilks2Caculator();
            // new Calculator(this).dotsCaculator();
            // TEMP PART
            // new FirstWorkoutButtonModal(this.app, this).open();
            if (this.settings.startday === 'None') {
                //이부분에 파일도 확인하는 절차를 거치는 것이 좋아보인다.
                //또한 startday 부분 타입도 확인
                new FirstWorkoutButtonModal(this.app, this).open();
            } else {
                new WorkoutButtonModal(this.app, this).open();
            }
        });
        // Perform additional things with the ribbon

        ribbonIconEl.addClass('my-plugin-ribbon-class');

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
        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            // console.log('click', evt);
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

import { Modal, App, Setting, Notice, moment } from 'obsidian';
import WorkoutPlugin from 'main';
import { RoutineUpdate } from 'src/Workout/Routine/RoutineUpdate';

export class ThirdWorkoutButtonModal extends Modal {
    plugin: WorkoutPlugin;
    startday: string;

    constructor(app: App, plugin: WorkoutPlugin) {
        super(app);
        this.plugin = plugin;
        this.startday = 'None';
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h1', { text: 'When do you start working out?' });

        new Setting(contentEl).setName('When do you start working out?').addText((text) =>
            text.setPlaceholder('YYYY-MM-DD').onChange((value) => {
                this.startday = value;
            }),
        );

        new Setting(contentEl).addButton((btn) =>
            btn.setButtonText('Submit').onClick(async () => {
                this.startday === 'None' ? (this.startday = moment().format('YYYY-MM-DD')) : this.startday;
                if (moment(this.startday, moment.ISO_8601, true).isValid()) {
                    this.plugin.settings.startday = this.startday;
                    await this.plugin.saveSettings();
                    //Routine Planner
                    new RoutineUpdate(this.plugin).routinePlanner();
                } else {
                    new Notice('Wrong Date Format');
                }
                this.close();
            }),
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

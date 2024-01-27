import { Modal, App, Setting } from 'obsidian';
import WorkoutPlugin from 'main';

export class NotworkoutButtonModal extends Modal {
    plugin: WorkoutPlugin;
    startday: string;

    constructor(app: App, plugin: WorkoutPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h1', { text: 'Today is not a workout day.' });
        contentEl.createEl('h2', { text: "It's your day off, but do you want to work out?" });

        new Setting(contentEl)
            .addButton((btn) =>
                btn.setButtonText('OK').onClick(async () => {
                    this.close();
                }),
            )
            .addButton((btn) =>
                btn.setButtonText('Cancel').onClick(async () => {
                    this.close();
                }),
            );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

import { Modal, App, Setting } from 'obsidian';
import WorkoutPlugin from 'main';

export class WorkoutButtonModal extends Modal {
    plugin: WorkoutPlugin;
    startday: string;

    constructor(app: App, plugin: WorkoutPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h1', { text: 'Want to start working out?' });

        new Setting(contentEl)
            .addButton((btn) =>
                btn.setButtonText('OK').onClick(async () => {
                    //이부분에 데이터 파싱후 오늘의 계획 표 생성
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

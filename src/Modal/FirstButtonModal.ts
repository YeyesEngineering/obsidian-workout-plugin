import { Modal, App, Setting, Notice, moment } from 'obsidian';
import WorkoutPlugin from 'main';
import { Markdown } from 'src/Markdown/Markdown';
import { RoutineUpdate } from 'src/Workout/Routine/RoutineUpdate';

export class FirstWorkoutButtonModal extends Modal {
    plugin: WorkoutPlugin;
    startday: string;

    constructor(app: App, plugin: WorkoutPlugin) {
        super(app);
        this.plugin = plugin;
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
                if (moment(this.startday, moment.ISO_8601, true).isValid()) {
                    this.plugin.settings.startday = this.startday;
                    //만약에 오늘부터 스타트를 한다면 바로 폴더 만드는 기능 추가
                    console.log(this.plugin.settings.startday);
                    await this.plugin.saveSettings();
                    const filePath = this.plugin.settings.workoutFolder ?? '/Workout';
                    //폴더 생성
                    try {
                        await this.app.vault.createFolder(filePath);
                    } catch (error) {
                        new Notice(error);
                        this.plugin.settings.startday = 'None';
                        await this.plugin.saveSettings();
                    }
                    const dataviewData = '```dataview\n    TASK\n    FROM "' + filePath + '"\n```';
                    const StringData = `# Today Workout\n\n${dataviewData}\n\n## Workout Trend\n\n## Your Score\n\n### Big Three : \n### Wilks Score : \n### Dots Point :`;

                    new Markdown(this.plugin, this.app).createNote(this.plugin.settings.mainPageName, StringData);

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

    // async createFolder() {}

    // async creatNote(){

    // }
}

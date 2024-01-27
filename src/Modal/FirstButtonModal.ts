import { Modal, App, Setting, Notice } from 'obsidian';
import WorkoutPlugin from 'main';
import { Markdown } from 'src/Markdown/Markdown';

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
            text.onChange((value) => {
                this.startday = value;
            }),
        );
        // 날짜 기반 체크 구문 추가

        new Setting(contentEl).addButton((btn) =>
            btn.setButtonText('Submit').onClick(async () => {
                this.close();
                this.plugin.settings.startday = this.startday;
                console.log(this.plugin.settings.startday);
                await this.plugin.saveSettings();
                const filePath = this.plugin.settings.workoutFolder ?? '/Workout';
                //폴더 생성
                try {
                    await this.app.vault.createFolder(filePath);
                } catch (error) {
                    new Notice(error);
                }
                //폴더 내 메인 마크다운 파일 생성

                const workoutData = `
## Today Workout

\`\`\`dataview
TASK
FROM "${filePath}/${this.plugin.settings.startday}"
\`\`\`

## Workout Trend

## Your Score

### Big Three : 
### Wilks Score : 

### Dots Point : 
`;

                new Markdown(this.plugin, this.app).createNote('Workout Main', workoutData);
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

import { Modal, App, Setting, Notice } from 'obsidian';
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
            text.onChange((value) => {
                this.startday = value;
            }),
        );
        // 날짜 기반 체크 구문 추가

        new Setting(contentEl).addButton((btn) =>
            btn.setButtonText('Submit').onClick(async () => {
                // this.close();
                this.plugin.settings.startday = this.startday;
                //삭제 예정?
                //프로그래스를 퍼센트로 나타내주면 좋을듯

                this.plugin.settings.todayRoutine.progress = [1,1];
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
                // 이부분 stringify로 수정
                
                const workoutData = `
## Today Workout

\`\`\`dataview
TASK
FROM "${filePath}"
\`\`\`

## Workout Trend

## Your Score

### Big Three : 
### Wilks Score : 

### Dots Point : 
`;

                new Markdown(this.plugin, this.app).createNote('Workout Main', workoutData);

                //루틴 플래너 코드 작성
                new RoutineUpdate(this.plugin).routinePlanner();

                //close 위치 변경
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

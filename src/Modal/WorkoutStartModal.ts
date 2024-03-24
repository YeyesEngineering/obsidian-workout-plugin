import { Modal, App, Setting, moment, Notice, TFile, normalizePath } from 'obsidian';
import WorkoutPlugin from 'main';
import { RoutineModelApp } from 'src/Workout/Routine/RoutineUpdate';

export class WorkoutStartModal extends Modal {
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
                    const today = moment().format('YYYY-MM-DD');
                    const workoutInnerFile = this.app.vault.getAbstractFileByPath(
                        normalizePath(`${this.plugin.settings.workoutFolder}/Workout ${today}.md`),
                    );
                    const todayIndex = this.plugin.settings.routinePlan.findIndex((value) => value.date === today);
                    if (!(workoutInnerFile instanceof TFile)) {
                        new RoutineModelApp(this.plugin, this.app).workoutNoteMaker(today);
                    } else {
                        //Data Update
                        //데이터를 유지하면서 특정 부분만 수정할 수 있도록 수정예정
                        //중복된 파일이 존재하면 변경뒤 생성?
                        if (workoutInnerFile) {
                            // await this.app.vault.delete(workoutInnerFile);
                            await this.app.vault.trash(workoutInnerFile, false);
                        }
                        new RoutineModelApp(this.plugin, this.app).workoutNoteMaker(today);
                    }
                    //NextDay Setup
                    if (todayIndex + 1 < this.plugin.settings.routinePlan.length) {
                        const nextday = this.plugin.settings.routinePlan[todayIndex + 1].date;
                        if (
                            !(
                                this.app.vault.getAbstractFileByPath(
                                    `${normalizePath(this.plugin.settings.workoutFolder)}/Workout ${nextday}.md`,
                                ) instanceof TFile
                            )
                        ) {
                            new RoutineModelApp(this.plugin, this.app).workoutNoteMaker(nextday, true);
                        }
                    } else {
                        new Notice('Routine ended Please register a new routine');
                        //Routine Reset
                        this.plugin.settings.startday = 'None';
                        await this.plugin.saveSettings();
                    }
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

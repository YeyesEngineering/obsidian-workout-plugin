import { Modal, App, Setting, moment, Notice, TFile } from 'obsidian';
import WorkoutPlugin from 'main';
// import { Markdown } from 'src/Markdown/Markdown';
// import { RoutineModel } from 'src/Workout/Routine/RoutineModel';
import { RoutineModelApp } from 'src/Workout/Routine/RoutineUpdate';

//this is workout day using modal

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
                    const today = moment().format('YYYY-MM-DD');
                    const workoutInnerFile = this.app.vault.getAbstractFileByPath(
                        `${this.plugin.settings.workoutFolder}/Workout ${today}.md`,
                    );
                    //To be optimized

                    // for (let i = 0; i < this.plugin.settings.routinePlan.length; i++) {
                    //     if (today === this.plugin.settings.routinePlan[i].date) {
                    //         console.log('in for');
                    //         if (!(workoutInnerFile instanceof TFile)) {
                    //             new RoutineModelApp(this.plugin, this.app).workoutNoteMaker(today);
                    //         } else {
                    //             //이부분에 데이터를 업데이트 하는 부분을 추가
                    //             await this.app.workspace
                    //                 .getUnpinnedLeaf()
                    //                 .openFile(workoutInnerFile, { state: { mode: 'source' } });
                    //         }
                    //         //NextDay Setup
                    //         if (i + 1 < this.plugin.settings.routinePlan.length) {
                    //             const nextday = this.plugin.settings.routinePlan[i + 1].date;
                    //             if (
                    //                 !(
                    //                     this.app.vault.getAbstractFileByPath(
                    //                         `${this.plugin.settings.workoutFolder}/Workout ${nextday}.md`,
                    //                     ) instanceof TFile
                    //                 )
                    //             ) {
                    //                 new RoutineModelApp(this.plugin, this.app).workoutNoteMaker(nextday, true);
                    //             }
                    //         } else {
                    //             new Notice('today is endding template going to new template?');
                    //             //템플릿 초기화 코드
                    //             this.plugin.settings.startday = 'None';
                    //             // this.close();
                    //         }
                    //         break;
                    //     }
                    // }

                    //만약 파일이 존재하면 존재하는 파일로 이동시키기
                    const todayIndex = this.plugin.settings.routinePlan.findIndex((value) => value.date === today);
                    if (!(workoutInnerFile instanceof TFile)) {
                        new RoutineModelApp(this.plugin, this.app).workoutNoteMaker(today);
                    } else {
                        //Data Update
                        //데이터를 유지하면서 특정 부분만 수정할 수 있도록 수정예정
                        if (workoutInnerFile) {
                            await this.app.vault.delete(workoutInnerFile);
                        }
                        new RoutineModelApp(this.plugin, this.app).workoutNoteMaker(today);
                        await this.app.workspace
                            .getUnpinnedLeaf()
                            .openFile(workoutInnerFile, { state: { mode: 'source' } });
                    }
                    //NextDay Setup
                    if (todayIndex + 1 < this.plugin.settings.routinePlan.length) {
                        const nextday = this.plugin.settings.routinePlan[todayIndex + 1].date;
                        if (
                            !(
                                this.app.vault.getAbstractFileByPath(
                                    `${this.plugin.settings.workoutFolder}/Workout ${nextday}.md`,
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

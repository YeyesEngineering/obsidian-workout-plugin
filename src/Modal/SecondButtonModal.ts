import { Modal, App, Setting, Notice, moment, stringifyYaml } from 'obsidian';
import WorkoutPlugin from 'main';
import { Markdown } from 'src/Markdown/Markdown';
import { RoutineUpdate } from 'src/Workout/Routine/RoutineUpdate';
import { mainModel } from 'src/Workout/Routine/RoutineModel';

export class SecondWorkoutButtonModal extends Modal {
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
                    const filePath = this.plugin.settings.workoutFolder;

                    const workoutMainProperites: mainModel = {
                        Bigthree: this.plugin.settings.bigThree[3],
                        Wilks_Point: this.plugin.settings.wilks2point,
                        DOTS_Score: this.plugin.settings.dotspoint,
                    };

                    const dataviewData =
                        '```dataview\n    TASK\n    FROM "' + filePath + '"\n    WHERE file.day = date(today) \n ```';
                    const nextWorkoutDay = this.plugin.settings.nextdayRoutine.date;
                    const StringData = `---\n${stringifyYaml(
                        workoutMainProperites,
                    )}---\n# Today Workout\n\n${dataviewData}\n\n## Next Workout Day\n\n${nextWorkoutDay}\n\n## Workout Trend`;
                    //폴더를 옮길 수 도 있으니까 현재 위치를 가져오는게 안전할듯

                    new Markdown(this.plugin, this.app).createNote(this.plugin.settings.mainPageName, StringData, true);

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

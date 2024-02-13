import { Modal, App, Setting, moment, Notice, stringifyYaml } from 'obsidian';
import WorkoutPlugin from 'main';
import { Markdown } from 'src/Markdown/Markdown';
import { RoutineModel } from 'src/Workout/Routine/RoutineModel';
import { RoutineUpdate } from 'src/Workout/Routine/RoutineUpdate';

export class NotworkoutdayStartModal extends Modal {
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
                    const today = moment().format('YYYY-MM-DD');

                    //Propreties make
                    const workoutProperites: RoutineModel = {
                        Today: moment().format(),
                        Workout: true,
                        Program: '',
                        Progress: '',
                        Session: 'Training',
                        Workoutvolumn: 0,
                        Bodyweight: parseFloat(this.plugin.settings.bodyWeight),
                        Bigthree: this.plugin.settings.bigThree[3],
                        Squat1rm: this.plugin.settings.bigThree[0],
                        Benchpress1rm: this.plugin.settings.bigThree[1],
                        Deadlift1rm: this.plugin.settings.bigThree[2],
                    };
                    const contextData = await new RoutineUpdate(this.plugin).workoutContextMaker(false);

                    const filedata = `---\n${stringifyYaml(workoutProperites)}---\n` + contextData;
                    try {
                        //제목 형식도 변경 할수 있도록 수정 예정
                        new Markdown(this.plugin, this.app).createNote(`Workout ${today}`, filedata, true);
                    } catch (error) {
                        new Notice(error);
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

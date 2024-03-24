import { Modal, App, Setting, Notice, moment, stringifyYaml, TFolder, TFile, normalizePath } from 'obsidian';
import WorkoutPlugin from 'main';
import { Markdown } from 'src/Markdown/Markdown';
import { RoutineUpdate } from 'src/Workout/Routine/RoutineUpdate';
import { mainModel } from 'src/Workout/Routine/RoutineModel';
import { RoutineModelApp } from 'src/Workout/Routine/RoutineUpdate';
import { ParseWorkout } from 'src/Renderer/Parser';

export class WorkoutSetupModal extends Modal {
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
                if (ParseWorkout.dayChecker(this.startday)) {
                    this.plugin.settings.startday = this.startday;
                    await this.plugin.saveSettings();

                    const workoutFolder = this.app.vault.getAbstractFileByPath(
                        normalizePath(this.plugin.settings.workoutFolder),
                    );
                    const workoutInnerFile = this.app.vault.getAbstractFileByPath(
                        normalizePath(`${this.plugin.settings.mainPageFolder}/${this.plugin.settings.mainPageName}.md`),
                    );
                    const workoutInnerFolder = this.app.vault.getAbstractFileByPath(
                        normalizePath(this.plugin.settings.mainPageFolder),
                    );
                    let filePath = normalizePath(this.plugin.settings.workoutFolder);
                    // Mac Check
                    if (filePath === '' || filePath === '/') {
                        filePath = 'Workout';
                        this.plugin.settings.workoutFolder = filePath;
                        this.plugin.saveSettings();
                    }
                    if (
                        normalizePath(this.plugin.settings.mainPageFolder) === '' ||
                        normalizePath(this.plugin.settings.mainPageFolder) === '/'
                    ) {
                        this.plugin.settings.mainPageFolder = filePath;
                        this.plugin.saveSettings();
                    }

                    if (!(workoutFolder instanceof TFolder)) {
                        //Folder Create
                        try {
                            await this.app.vault.createFolder(filePath);
                        } catch (error) {
                            new Notice(error);
                            this.plugin.settings.startday = 'None';
                            await this.plugin.saveSettings();
                        }
                    }
                    //만약에 두 폴더가 같다면 생성하지 않는 코드 작성

                    if (
                        normalizePath(this.plugin.settings.mainPageFolder) !== filePath &&
                        !(workoutInnerFolder instanceof TFolder)
                    ) {
                        //Folder Create
                        try {
                            await this.app.vault.createFolder(normalizePath(this.plugin.settings.mainPageFolder));
                        } catch (error) {
                            new Notice(error);
                            this.plugin.settings.startday = 'None';
                            await this.plugin.saveSettings();
                        }
                    }

                    if (!(workoutInnerFile instanceof TFile)) {
                        const workoutMainProperites: mainModel = {
                            Bigthree: this.plugin.settings.bigThree[3],
                            Wilks_Point: this.plugin.settings.wilks2point,
                            DOTS_Score: this.plugin.settings.dotspoint,
                        };

                        const dataviewData =
                            '```dataview\n    TASK\n    FROM "' +
                            filePath +
                            '"\n    WHERE file.day = date(today) \n ```';
                        const nextWorkoutDay =
                            '```dataview\n    TABLE Today as Day\n    FROM "' +
                            filePath +
                            '"\n    SORT Today DESC\n    LIMIT 1\n ```';
                        const StringData = `---\n${stringifyYaml(
                            workoutMainProperites,
                        )}---\n# Today Workout\n\n${dataviewData}\n\n## Next Workout Day\n\n${nextWorkoutDay}\n\n## Workout Trend`;

                        new Markdown(this.plugin, this.app).createNote(
                            this.plugin.settings.mainPageFolder,
                            this.plugin.settings.mainPageName,
                            StringData,
                            true,
                        );
                    }
                    //Routine Planner
                    await new RoutineUpdate(this.plugin).routinePlanner();

                    //First Setup

                    const today = moment().format('YYYY-MM-DD');
                    const firstCheck = this.app.vault.getAbstractFileByPath(
                        normalizePath(
                            `${this.plugin.settings.workoutFolder}/Workout ${this.plugin.settings.routinePlan[0].date}.md`,
                        ),
                    );
                    if (moment(this.plugin.settings.routinePlan[0].date).isAfter(today) && !firstCheck) {
                        new RoutineModelApp(this.plugin, this.app).workoutNoteMaker(
                            this.plugin.settings.routinePlan[0].date,
                        );
                    }
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

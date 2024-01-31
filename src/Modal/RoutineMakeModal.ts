import { Modal, App, Setting } from 'obsidian';
import WorkoutPlugin from 'main';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';
import { workoutTarget } from 'src/Workout/Workout';

export class RoutineMakeModal extends Modal {
    plugin: WorkoutPlugin;
    setting: WorkoutPluginSettings;
    startday: string;

    constructor(app: App, plugin : WorkoutPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h1', { text: 'Routine Maker.' });

        const workoutAdd = new Setting(contentEl)
            .setName('Workout add')
            .setDesc('You can add a exercise')
            //기존에 들어있던 운동목록과 겹치지 않도록 코드 추가 예정
            .addText((text) =>
                text
                    .setPlaceholder('Workout Name')
                    // .setValue(this.plugin.settings.tempWorkoutLists.workoutName)
                    .onChange(async (value) => {
                        this.plugin.settings.tempWorkoutLists.workoutName = value;
                        await this.plugin.saveSettings();
                    }),
            )
            .addText((text) =>
                text
                    .setPlaceholder('Weight')
                    // .setValue(String(this.plugin.settings.tempWorkoutLists.weight))
                    .onChange(async (value) => {
                        this.plugin.settings.tempWorkoutLists.weight = parseInt(value);
                        await this.plugin.saveSettings();
                    }),
            )
            .addText((text) =>
                text
                    .setPlaceholder('Reps')
                    // .setValue(String(this.plugin.settings.tempWorkoutLists.reps))
                    .onChange(async (value) => {
                        this.plugin.settings.tempWorkoutLists.reps = parseInt(value);
                        await this.plugin.saveSettings();
                    }),
            )
            .addDropdown((target) =>
                target
                    .addOptions({
                        Chest: 'Chest',
                        Back: 'Back',
                        Shoulders: 'Shoulders',
                        Biceps: 'Biceps',
                        Tricep: 'Triceps',
                        Quadriceps: 'Quadriceps',
                        Hamstrings: 'Hamstrings',
                        Glutes: 'Glutes',
                        Calves: 'Calves',
                    })
                    // .setValue(String(this.plugin.settings.tempWorkoutLists.workoutTarget))
                    .onChange(async (value: workoutTarget) => {
                        const tempContainer: workoutTarget[] = [];
                        //멀티플로  선택 할 수 있도록 설정
                        tempContainer.push(value);
                        this.plugin.settings.tempWorkoutLists.workoutTarget = [...tempContainer];
                        await this.plugin.saveSettings();
                    }),
            )
            .addButton((bt) => {
                bt.setButtonText('Apply').onClick(async () => {
                    this.plugin.settings.workoutLists.push(this.plugin.settings.tempWorkoutLists);
                    this.plugin.settings.tempWorkoutLists = {
                        workoutName: '',
                        weight: 0,
                        reps: 0,
                        workoutTarget: ['Chest'],
                    };
                    console.log(workoutAdd);
                    // this.saveSettings(true);
                    //다른방법으로 모달을 띄워서 설정하는 방법
                    // console.log(this.plugin.settings.tempWorkoutLists);
                    await this.plugin.saveSettings()
                    this.close();
                });
            });

            new Setting(this.containerEl)
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

import { App, PluginSettingTab, Setting } from 'obsidian';
import WorkoutPlugin from 'main';

export type gender = 'Male' | 'Female' | 'None';

export interface WorkoutPluginSettings {
    bodyWeight: string;

    gender: gender;
    bigThree: number[];
    wilks2point: number;
    dotspoint: number;
    workoutFolder: string;
    routineTemplate: string;
    mySquatWeight: string;
    mySquatReps: string;
    myBenchpressWeight: string;
    myBenchpressReps: string;
    myDeadliftWeight: string;
    myDeadliftReps: string;
}

export const DEFAULT_SETTINGS: WorkoutPluginSettings = {
    bodyWeight: '',
    gender: 'None',
    bigThree: [0, 0, 0, 0],
    wilks2point: 0,
    dotspoint: 0,
    workoutFolder: 'Workout/',
    routineTemplate: '',
    mySquatWeight: '',
    mySquatReps: '',
    myBenchpressWeight: '',
    myBenchpressReps: '',
    myDeadliftWeight: '',
    myDeadliftReps: '',
};

export class WorkoutPluginSettingTab extends PluginSettingTab {
    plugin: WorkoutPlugin;

    constructor(app: App, plugin: WorkoutPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Body Weight')
            .setDesc('Please enter your weight')
            .addText((text) =>
                //숫자가 아닌 문자가 들어왔을떄 에러 모달을 띄우는 기능을 추가
                text
                    .setPlaceholder('Body Weight')
                    .setValue(this.plugin.settings.bodyWeight)
                    .onChange(async (value) => {
                        this.plugin.settings.bodyWeight = value;
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(containerEl)
            .setName('Gender')
            .setDesc('Please enter your Gender')
            .addDropdown((gender) =>
                gender
                    .addOptions({ Male: 'Male', Female: 'Female' })
                    .setValue(this.plugin.settings.gender)
                    .onChange(async (value: gender) => {
                        this.plugin.settings.gender = value;
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(containerEl)
            .setName('Workout Folder')
            .setDesc('Please enter your Workout Folder')
            .addText((text) =>
                text
                    .setPlaceholder(DEFAULT_SETTINGS.workoutFolder)
                    .setValue(this.plugin.settings.routineTemplate)
                    .onChange(async (value) => {
                        this.plugin.settings.workoutFolder = value;
                        await this.plugin.saveSettings();
                    }),
            );

        // new Setting(containerEl)
        //     .setName('RoutineTemplate')
        //     .setDesc('Please enter your RoutineTemplate directory')
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('')
        //             .setValue(this.plugin.settings.routineTemplate)
        //             .onChange(async (value) => {
        //                 this.plugin.settings.routineTemplate = value;
        //                 await this.plugin.saveSettings();
        //             }),
        //     );

        new Setting(containerEl)
            .setName('SquatWeight')
            .setDesc('Please enter your maximum Squat weight')
            .addText((text) =>
                text
                    .setPlaceholder('Squat Weight')
                    .setValue(this.plugin.settings.mySquatWeight)
                    .onChange(async (value) => {
                        this.plugin.settings.mySquatWeight = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(containerEl)
            .setName('SquatReps')
            .setDesc('Enter the maximum number of times you can lift the weight entered above. (Squat)')
            .addText((text) =>
                text
                    .setPlaceholder('Squat Reps')
                    .setValue(this.plugin.settings.mySquatReps)
                    .onChange(async (value) => {
                        this.plugin.settings.mySquatReps = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(containerEl)
            .setName('Benchpress Weight')
            .setDesc('Please enter your maximum Benchpress Weight')
            .addText((text) =>
                text
                    .setPlaceholder('Benchpress Weight')
                    .setValue(this.plugin.settings.myBenchpressWeight)
                    .onChange(async (value) => {
                        this.plugin.settings.myBenchpressWeight = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(containerEl)
            .setName('Benchpress Reps')
            .setDesc('Enter the maximum number of times you can lift the weight entered above. (Benchpress)')
            .addText((text) =>
                text
                    .setPlaceholder('Benchpress Reps')
                    .setValue(this.plugin.settings.myBenchpressReps)
                    .onChange(async (value) => {
                        this.plugin.settings.myBenchpressReps = value;
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(containerEl)
            .setName('Deadlift Weight')
            .setDesc('Please enter your maximum Deadlift Weight')
            .addText((text) =>
                text
                    .setPlaceholder('Deadlift Weight')
                    .setValue(this.plugin.settings.myDeadliftWeight)
                    .onChange(async (value) => {
                        this.plugin.settings.myDeadliftWeight = value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(containerEl)
            .setName('Deadlift Reps')
            .setDesc('Enter the maximum number of times you can lift the weight entered above. (Deadlift)')
            .addText((text) =>
                text
                    .setPlaceholder('Deadlift Reps')
                    .setValue(this.plugin.settings.myDeadliftReps)
                    .onChange(async (value) => {
                        this.plugin.settings.myDeadliftReps = value;
                        await this.plugin.saveSettings();
                    }),
            );

        //설정값 초기화 버튼
        new Setting(containerEl)
            .setName('Deadlift Reps')
            .setDesc('This will initialize the data entered in your Workout.')
            .addButton((button) =>
                button
                    .setWarning()
                    .setTooltip('This will initialize the data entered in your Workout.')
                    .setButtonText('Reset Settings Button')
                    .onClick(async () => {
                        this.plugin.settings = Object.assign({}, DEFAULT_SETTINGS, DEFAULT_SETTINGS);
                        await this.plugin.saveSettings();
                    }),
            );

        //pound kg 버튼 생성
        //날짜 형식 변경 탭 생성
    }
}

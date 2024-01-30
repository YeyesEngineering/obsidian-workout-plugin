import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import WorkoutPlugin from 'main';
import { gender, routineTemplate, todayRoutine } from 'src/Workout/Routine/RoutineModel';
import { workout, workoutTarget } from 'src/Workout/Workout';

export interface WorkoutPluginSettings {
    bodyWeight: string;
    startday: string;
    gender: gender;
    bigThree: number[];
    wilks2point: number;
    dotspoint: number;
    workoutFolder: string;
    mainPageName: string;
    routineTemplate: routineTemplate;
    todayRoutine: todayRoutine; // Routine
    routinePlan: todayRoutine[];
    tempWorkoutLists: workout;
    workoutLists: workout[];
    mySquatWeight: string;
    mySquatReps: string;
    myBenchpressWeight: string;
    myBenchpressReps: string;
    myDeadliftWeight: string;
    myDeadliftReps: string;
}

export const DEFAULT_SETTINGS: WorkoutPluginSettings = {
    bodyWeight: '',
    startday: 'None',
    gender: 'None',
    bigThree: [0, 0, 0, 0],
    wilks2point: 0,
    dotspoint: 0,
    workoutFolder: '/Workout',
    mainPageName: 'Workout Main',

    routineTemplate: {
        name: 'None',
        gender: 'None',
        session: [
            {
                sessionname: 'First Session',
                workoutname: ['SQUAT', 'BENCH PRESS', 'DEADLIFT'],
                reps: [3, [10, 20], 'MAX'],
                sets: [1, 2],
                weight: ['none', 'none', '100%'],
            },
        ],

        week: [['SESSION_1', 'SESSION_2'], ['SESSION_2'], [], ['SESSION_1'], ['SESSION_2'], [], []],
    },
    todayRoutine: {
        date: 'None',
        sessionname: 'None',
        progress: '0',
        workout: ['', '', '', ''],
        weight: ['', '', '', ''],
        reps: [0, 0, 0, 0],
        sets: [0, 0, 0, 0],
    },
    routinePlan: [],
    tempWorkoutLists: {
        workoutName: '',
        weight: 0,
        reps: 0,
        workoutTarget: ['Back'],
    },
    workoutLists: [
        { workoutName: 'SQUAT', weight: 0, reps: 0, workoutTarget: ['Hamstrings', 'Quadriceps', 'Glutes'] },
        {
            workoutName: 'BENCH PRESS',
            weight: 0,
            reps: 0,
            workoutTarget: ['Chest', 'Triceps'],
        },
        { workoutName: 'DEADLIFT', weight: 0, reps: 0, workoutTarget: ['Hamstrings', 'Quadriceps', 'Back', 'Glutes'] },
    ],
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

    // public async saveSettings(update?: boolean): Promise<void> {
    //     await this.plugin.saveSettings();

    //     if (update) {
    //         this.display();
    //     }
    // }
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
                    .setValue(this.plugin.settings.workoutFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.workoutFolder = value;
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(containerEl)
            .setName('Mainpage name')
            .setDesc('Enter a name for your page')
            .addText((text) =>
                text
                    .setPlaceholder('Workout Main')
                    .setValue(this.plugin.settings.mainPageName)
                    .onChange(async (value) => {
                        this.plugin.settings.mainPageName = value;
                        await this.plugin.saveSettings();
                    }),
            );


        const workoutAdd = new Setting(containerEl)
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
                        this.plugin.settings.tempWorkoutLists.reps = value;
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
                        workoutName: 'SQUAT',
                        weight: 0,
                        reps: 0,
                        workoutTarget: ['Hamstrings', 'Quadriceps', 'Glutes'],
                    };
                    console.log(workoutAdd);
                    // this.saveSettings(true);
                    //다른방법으로 모달을 띄워서 설정하는 방법
                    // console.log(this.plugin.settings.tempWorkoutLists);
                    await this.plugin.saveSettings();
                    this.display();
                });
            });

        //Select from list of suggestions제안 모드 적용
        const routineInput = new Setting(containerEl)
            .setName('RoutineTemplate')
            // .setDesc('Please enter your RoutineTemplate')
            .setDesc(`now your Template is ${this.plugin.settings.routineTemplate.name}`);

        const inputDataFile = routineInput.controlEl.createEl('input', {
            attr: {
                type: 'file',
                multiple: false,
                accept: '.json',
            },
        });
        routineInput.addButton((button) => {
            //모바일도 체크 해봐야 할듯
            button
                .setWarning()
                .setButtonText('Import')
                .onClick(async () => {
                    const file = inputDataFile.files ? inputDataFile.files[0] : null;
                    //extension Checker
                    const fileExtension = file?.name.slice(-4);
                    if (file && fileExtension === 'json') {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            if (e.target) {
                                const fileContent = e.target.result;
                                const jsonParseFile = JSON.parse(String(fileContent));
                                this.plugin.settings.routineTemplate = await jsonParseFile;
                                await this.plugin.saveSettings();
                            }
                        };
                        reader.readAsText(file);
                    } else {
                        new Notice('Add a JSON file.');
                    }
                    //날짜 및 루틴 데이터 초기화 코드 추가 예정

                    new Notice('Import Complete');
                });
        });

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
                        this.display();
                    }),
            );

        //pound kg 버튼 생성
        //날짜 형식 변경 탭 생성
    }
}

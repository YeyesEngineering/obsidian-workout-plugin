import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import WorkoutPlugin from 'main';
import { gender, routineTemplate, todayRoutine, todayRoutineCheck } from 'src/Workout/Routine/RoutineModel';
import { workout } from 'src/Workout/Workout';
import { RoutineUpdate } from 'src/Workout/Routine/RoutineUpdate';
// import { RoutineMakeModal } from 'src/Modal/RoutineMakeModal';

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
    todayRoutine: todayRoutineCheck; // Routine
    nextdayRoutine: todayRoutineCheck;
    routinePlan: todayRoutine[];
    tempWorkoutLists: workout;
    workoutLists: workout[];
    // mySquatWeight: string;
    // mySquatReps: string;
    // myBenchpressWeight: string;
    // myBenchpressReps: string;
    // myDeadliftWeight: string;
    // myDeadliftReps: string;
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
        workoutList: [],
        session: [
            {
                sessionname: 'First Session',
                workoutname: ['SQUAT', 'BENCH PRESS', 'DEADLIFT'],
                //[10,20] -> 1020  ,  'MAX' -> 1000000
                //100 같은 3자리수 케이스 확인 및 1RM 10개 미만으로 입력하는 것으로 세팅
                reps: [3, 1020, 1000000],
                sets: [1, 2],
                weight: ['none', 'none', '100%'],
                add: [],
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
        add: [],
        check: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    },
    nextdayRoutine: {
        date: 'None',
        sessionname: 'None',
        progress: '0',
        workout: ['', '', '', ''],
        weight: ['', '', '', ''],
        reps: [0, 0, 0, 0],
        sets: [0, 0, 0, 0],
        add: [],
        check: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    },
    routinePlan: [],
    tempWorkoutLists: {
        workoutName: '',
        trainingWeight: 0,
        weight: 0,
        reps: 0,
        workoutTarget: [''],
    },
    workoutLists: [
        {
            workoutName: 'SQUAT',
            trainingWeight: 0,
            weight: 0,
            reps: 0,
            workoutTarget: ['Hamstrings', 'Quadriceps', 'Glutes'],
        },
        {
            workoutName: 'BENCH PRESS',
            trainingWeight: 0,
            weight: 0,
            reps: 0,
            workoutTarget: ['Chest', 'Triceps'],
        },
        {
            workoutName: 'DEADLIFT',
            trainingWeight: 0,
            weight: 0,
            reps: 0,
            workoutTarget: ['Hamstrings', 'Quadriceps', 'Back', 'Glutes'],
        },
    ],
    // mySquatWeight: '',
    // mySquatReps: '',
    // myBenchpressWeight: '',
    // myBenchpressReps: '',
    // myDeadliftWeight: '',
    // myDeadliftReps: '',
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
        //미완성 Template Maker
        // new Setting(containerEl)
        //     .setName('Routine Templater maker')
        //     .setDesc('YOU can make your routine')
        //     .addButton((button) =>
        //         button.setButtonText('Make my Routine').onClick(() => {
        //             new RoutineMakeModal(this.app, this.plugin).open();
        //         }),
        //     );

        // const workoutAdd = new Setting(containerEl)
        //     .setName('Workout add')
        //     .setDesc('You can add a exercise')
        //     //삭제 기능 추가
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('Workout Name')
        //             // .setValue(this.plugin.settings.tempWorkoutLists.workoutName)
        //             .onChange(async (value) => {
        //                 this.plugin.settings.tempWorkoutLists.workoutName = value;
        //                 await this.plugin.saveSettings();
        //             }),
        //     )
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('Weight')
        //             // .setValue(String(this.plugin.settings.tempWorkoutLists.weight))
        //             .onChange(async (value) => {
        //                 this.plugin.settings.tempWorkoutLists.weight = parseFloat(value);
        //                 await this.plugin.saveSettings();
        //             }),
        //     )
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('Reps')
        //             // .setValue(String(this.plugin.settings.tempWorkoutLists.reps))
        //             .onChange(async (value) => {
        //                 this.plugin.settings.tempWorkoutLists.reps = parseInt(value);
        //                 await this.plugin.saveSettings();
        //             }),
        //     )
        // .addDropdown((target) =>
        //     target
        //         .addOptions({
        //             Chest: 'Chest',
        //             Back: 'Back',
        //             Shoulders: 'Shoulders',
        //             Biceps: 'Biceps',
        //             Tricep: 'Triceps',
        //             Quadriceps: 'Quadriceps',
        //             Hamstrings: 'Hamstrings',
        //             Glutes: 'Glutes',
        //             Calves: 'Calves',
        //         })
        //         // .setValue(String(this.plugin.settings.tempWorkoutLists.workoutTarget))
        //         .onChange(async (value: workoutTarget) => {
        //             const tempContainer: workoutTarget[] = [];
        //             //멀티플로  선택 할 수 있도록 설정
        //             tempContainer.push(value);
        //             this.plugin.settings.tempWorkoutLists.workoutTarget = [...tempContainer];
        //             await this.plugin.saveSettings();
        //         }),
        // )

        /////////////////////////////////////////////////////////////////////////////////
        // 버튼
        // /////////////////////////////////////////////

        // .addButton((bt) => {
        //     bt.setButtonText('Apply').onClick(async () => {
        //         if (
        //             !this.plugin.settings.workoutLists.some(
        //                 (value) => value.workoutName === this.plugin.settings.tempWorkoutLists.workoutName,
        //             )
        //         ) {
        //             this.plugin.settings.workoutLists.push(this.plugin.settings.tempWorkoutLists);
        //             this.plugin.settings.tempWorkoutLists = {
        //                 workoutName: '',
        //                 trainingWeight: 0,
        //                 weight: 0,
        //                 reps: 0,
        //                 workoutTarget: [''],
        //             };
        //             console.log(workoutAdd);

        //             await this.plugin.saveSettings();
        //             this.display();
        //         } else {
        //             new Notice('Exist Workout');
        //         }
        //     });
        // });

        ////////////////////////////////////////

        new Setting(containerEl)
            .setName('Day Changer')
            .setDesc('You can change your Workout Startday')
            .addText((text) =>
                text
                    .setPlaceholder(this.plugin.settings.startday)
                    .setValue(this.plugin.settings.startday)
                    .onChange(async (val) => {
                        this.plugin.settings.startday = val;
                        //ROutine Planner 동작
                        await this.plugin.saveSettings();
                        new RoutineUpdate(this.plugin).routinePlanner();
                    }),
            );
        //Select from list of suggestions 제안 모드 적용
        const routineInput = new Setting(containerEl)
            .setName('RoutineTemplate')
            // .setDesc('Please enter your RoutineTemplate')
            .setDesc(`now your Template is ${this.plugin.settings.routineTemplate.name}`);

        //세션이 json이 잘 작성된 json인지 확인하는 코드 추가
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
                                //Workoutlist를 등록하는 부분
                                for (const val of this.plugin.settings.routineTemplate.workoutList) {
                                    if (
                                        !this.plugin.settings.workoutLists.some(
                                            (value) => value.workoutName === val.workoutName,
                                        )
                                    ) {
                                        this.plugin.settings.workoutLists.push(val);
                                        await this.plugin.saveSettings();
                                    }
                                }
                                await this.plugin.saveSettings();
                            }
                        };
                        reader.readAsText(file);
                        new Notice('Import Complete');
                        // this.display();
                    } else {
                        new Notice('Add a JSON file.');
                    }
                    //날짜 및 루틴 데이터 초기화 코드 추가 예정
                });
        });

        // const TemplateWeightandreps = new Setting(containerEl).setName('name');
        // for (const totalvalue of this.plugin.settings.workoutLists) {
        //     TemplateWeightandreps.setName(totalvalue.workoutName).addText((text) =>
        //         text
        //             .setPlaceholder(`${totalvalue.workoutName} weight`)
        //             // .setValue(this.plugin.settings.tempWorkoutLists.workoutName)
        //             .onChange(async (val) => {
        //                 totalvalue.weight = parseInt(val);
        //                 await this.plugin.saveSettings();
        //             }),
        //     );
        //     TemplateWeightandreps.setName(totalvalue.workoutName);
        // }
        for (const workout of this.plugin.settings.workoutLists) {
            //실시간으로 추가 될 수 있도록 조정

            new Setting(containerEl)
                .setName(`${workout.workoutName} Weight`)
                .setDesc(`Please enter your maximum ${workout.workoutName} Weight`)
                .addText((text) =>
                    text
                        .setPlaceholder(`${workout.workoutName} Weight`)
                        .setValue(String(workout.weight))
                        .onChange(async (val) => {
                            workout.weight = parseInt(val);
                            await this.plugin.saveSettings();
                        }),
                );
            new Setting(containerEl)
                .setName(`${workout.workoutName} Reps`)
                .setDesc(
                    `Enter the maximum number of times you can lift the weight entered above ${workout.workoutName}`,
                )
                .addText((text) =>
                    text
                        .setPlaceholder(`${workout.workoutName} Reps`)
                        .setValue(String(workout.reps))
                        .onChange(async (val) => {
                            workout.reps = parseInt(val);
                            await this.plugin.saveSettings();
                        }),
                );
            new Setting(containerEl)
                .setName(`${workout.workoutName} Training Weight`)
                .setDesc("Enter a weight to start your workout If you don't, it will be calculated automatically.")
                .addText((text) =>
                    text
                        .setPlaceholder(`${workout.workoutName} Training Weight`)
                        .setValue(String(workout.trainingWeight))
                        .onChange(async (val) => {
                            workout.trainingWeight = parseInt(val);
                            await this.plugin.saveSettings();
                        }),
                );
        }
        // new Setting(containerEl)
        //     .setName('SquatWeight')
        //     .setDesc('Please enter your maximum Squat weight')
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('Squat Weight')
        //             .setValue(this.plugin.settings.mySquatWeight)
        //             .onChange(async (value) => {
        //                 this.plugin.settings.mySquatWeight = value;
        //                 await this.plugin.saveSettings();
        //             }),
        //     );
        // new Setting(containerEl)
        //     .setName('SquatReps')
        //     .setDesc('Enter the maximum number of times you can lift the weight entered above. (Squat)')
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('Squat Reps')
        //             .setValue(this.plugin.settings.mySquatReps)
        //             .onChange(async (value) => {
        //                 this.plugin.settings.mySquatReps = value;
        //                 await this.plugin.saveSettings();
        //             }),
        //     );
        // new Setting(containerEl)
        //     .setName('Benchpress Weight')
        //     .setDesc('Please enter your maximum Benchpress Weight')
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('Benchpress Weight')
        //             .setValue(this.plugin.settings.myBenchpressWeight)
        //             .onChange(async (value) => {
        //                 this.plugin.settings.myBenchpressWeight = value;
        //                 await this.plugin.saveSettings();
        //             }),
        //     );
        // new Setting(containerEl)
        //     .setName('Benchpress Reps')
        //     .setDesc('Enter the maximum number of times you can lift the weight entered above. (Benchpress)')
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('Benchpress Reps')
        //             .setValue(this.plugin.settings.myBenchpressReps)
        //             .onChange(async (value) => {
        //                 this.plugin.settings.myBenchpressReps = value;
        //                 await this.plugin.saveSettings();
        //             }),
        //     );

        // new Setting(containerEl)
        //     .setName('Deadlift Weight')
        //     .setDesc('Please enter your maximum Deadlift Weight')
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('Deadlift Weight')
        //             .setValue(this.plugin.settings.myDeadliftWeight)
        //             .onChange(async (value) => {
        //                 this.plugin.settings.myDeadliftWeight = value;
        //                 await this.plugin.saveSettings();
        //             }),
        //     );
        // new Setting(containerEl)
        //     .setName('Deadlift Reps')
        //     .setDesc('Enter the maximum number of times you can lift the weight entered above. (Deadlift)')
        //     .addText((text) =>
        //         text
        //             .setPlaceholder('Deadlift Reps')
        //             .setValue(this.plugin.settings.myDeadliftReps)
        //             .onChange(async (value) => {
        //                 this.plugin.settings.myDeadliftReps = value;
        //                 await this.plugin.saveSettings();
        //             }),
        //     );

        //설정값 초기화 버튼
        new Setting(containerEl)
            .setName('RESET Setting')
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

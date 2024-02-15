import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import WorkoutPlugin from 'main';
import { gender, routineTemplate, todayRoutine, todayRoutineCheck } from 'src/Workout/Routine/RoutineModel';
import { workout } from 'src/Workout/Workout';
import { RoutineUpdate } from 'src/Workout/Routine/RoutineUpdate';
import { ParseWorkout } from 'src/Renderer/Parser';
import { FolderSuggest } from './Suggester/FolderSuggest';
// import { RoutineMakeModal } from 'src/Modal/RoutineMakeModal';

//pound kg 버튼 생성
//날짜 형식 변경 탭 생성

export interface WorkoutPluginSettings {
    bodyWeight: number;
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
}

export const DEFAULT_SETTINGS: WorkoutPluginSettings = {
    bodyWeight: 0,
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
                //[10,20] -> 10.20  ,  'MAX' -> 1000000
                //100 같은 3자리수 케이스 확인 및 1RM 10개 미만으로 입력하는 것으로 세팅
                reps: [3, 10.2, 1000000],
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
                text
                    .setPlaceholder('Body Weight')
                    .setValue(String(this.plugin.settings.bodyWeight))
                    .onChange(async (value) => {
                        this.plugin.settings.bodyWeight = ParseWorkout.numberChecker(value);
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
            .addSearch((text) => {
                new FolderSuggest(this.app, text.inputEl);
                text.setPlaceholder(DEFAULT_SETTINGS.workoutFolder)
                    .setValue(this.plugin.settings.workoutFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.workoutFolder = value;
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('MainPage name')
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
        //Template Maker
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

        const routineInput = new Setting(containerEl)
            .setName('RoutineTemplate')
            // .setDesc('Please enter your RoutineTemplate')
            .setDesc(`now your Template is ${this.plugin.settings.routineTemplate.name}`);

        //Json Checker 추가
        const inputDataFile = routineInput.controlEl.createEl('input', {
            attr: {
                type: 'file',
                multiple: false,
                accept: '.json',
            },
        });

        routineInput.addButton((button) => {
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
                                //Workoutlist Register
                                //초기화 하고 넣을지 고민
                                for (const val of this.plugin.settings.routineTemplate.workoutList) {
                                    if (
                                        !this.plugin.settings.workoutLists.some(
                                            (value) => value.workoutName === val.workoutName,
                                        )
                                    ) {
                                        //대문자로 변환해서 입력?
                                        this.plugin.settings.workoutLists.push(val);
                                        await this.plugin.saveSettings();
                                    }
                                }
                                await this.plugin.saveSettings();
                                if (this.plugin.settings.startday !== 'None') {
                                    new RoutineUpdate(this.plugin).routinePlanner();
                                }
                                this.display();
                            }
                        };
                        reader.readAsText(file);
                        this.display();
                        new Notice('Import Complete');
                    } else {
                        new Notice('Add a JSON file.');
                    }
                });
        });

        new Setting(containerEl)
            .setName('Routine Day Changer')
            .setDesc('You can change your Workout Startday')
            .addText((text) =>
                text
                    .setPlaceholder(this.plugin.settings.startday)
                    .setValue(this.plugin.settings.startday)
                    .onChange(async (val) => {
                        this.plugin.settings.startday = val;
                        //day 형식 확인
                        await this.plugin.saveSettings();
                        new RoutineUpdate(this.plugin).routinePlanner();
                    }),
            );

        for (const workout of this.plugin.settings.workoutLists) {
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
                            //reps 최대 10보다 작은값
                            if (parseInt(val) > 10){
                                new Notice('input lower than 10')
                                workout.reps = 0
                            }
                            else{
                                workout.reps = parseInt(val);
                            }
                            await this.plugin.saveSettings();
                        }),
                );
            if (!(workout.trainingWeight === undefined)) {
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
        }

        //Reset Button

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
                        await this.plugin.loadSettings();
                        this.display();
                    }),
            );
    }
}

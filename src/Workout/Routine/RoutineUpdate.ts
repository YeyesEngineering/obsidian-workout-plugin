import WorkoutPlugin from 'main';
import { Notice, moment } from 'obsidian';
import { WorkoutPluginSettings, routineTemplate } from 'src/Setting/SettingTab';

export class RoutineUpdate {
    plugin: WorkoutPlugin;
    settings: WorkoutPluginSettings;
    Routine: routineTemplate;
    Gender: string;
    bigthree: number[];

    constructor(plugin: WorkoutPlugin) {
        this.plugin = plugin;
        this.Routine = this.plugin.settings.routineTemplate;
        this.Gender = this.plugin.settings.gender;
        this.bigthree = this.plugin.settings.bigThree;
        this.settings = this.plugin.settings;
    }

    async todayRoutineUpdater(): Promise<number[]> {
        const today = moment().format('YYYY-MM-DD');
        //이전 데이터 초기화
        this.settings.todayRoutine.workout = [];
        this.settings.todayRoutine.weight = [];
        this.settings.todayRoutine.reps = [];
        this.settings.todayRoutine.sets = [];
        //데이터 설정
        const todaydata = this.settings.routinePlan.find((value) => value.date === today);
        console.log(todaydata);
        if (todaydata) {
            this.settings.todayRoutine.date = today;
            this.settings.todayRoutine.sessionname = todaydata.sessionname;
            this.settings.todayRoutine.workout = todaydata.workout;
            this.settings.todayRoutine.weight = todaydata.weight;
            this.settings.todayRoutine.reps = todaydata.reps;
            this.settings.todayRoutine.sets = todaydata.sets;
            await this.plugin.saveSettings();
        } else {
            //연장 하는 옵션 추가
            new Notice('초기화 후 다시 시도해주세요');
        }

        return [];
    }

    async workoutContextMaker(): Promise<string> {
        const todayRoutine = this.plugin.settings.todayRoutine;
        let contextdata = '# Today Workout  List\n\n';
        // console.log(contextdata);
        for (let i = 0; i < todayRoutine.workout.length; i++) {
            for (let j = 0; j < todayRoutine.sets[i]; j++) {
                //실제 무게를 가져오는 부분 추가
                contextdata += ` - [ ] ${todayRoutine.workout[i]} : ${todayRoutine.weight[i]} X ${todayRoutine.reps[i]} ${(j+1)}Set \n`;
            }
        }
        console.log('istensentsnet', contextdata);
        return contextdata;
    }

    async routinePlanner(): Promise<void> {
        this.plugin.settings.routinePlan = [];
        const routinePlanArray = [];
        for (let i = 0; i < this.Routine.week.length; i++) {
            const basedate = moment(this.settings.startday).add(i, 'days').format('YYYY-MM-DD');
            for (let j = 0; j < this.Routine.week[i].length; j++) {
                const sessionNumber = parseInt(this.Routine.week[i][j].split('_')[1]) - 1;
                const plan = {
                    date: moment(basedate)
                        .add(j * 7, 'days')
                        .format('YYYY-MM-DD'),
                    sessionname: this.Routine.session[sessionNumber].sessionname,
                    progress: [0, 0],
                    workout: this.Routine.session[sessionNumber].workoutname,
                    weight: this.Routine.session[sessionNumber].weight,
                    reps: this.Routine.session[sessionNumber].reps,
                    sets: this.Routine.session[sessionNumber].sets,
                };
                // this.plugin.settings.routinePlan.push(plan);
                routinePlanArray.push(plan);
            }
        }
        this.plugin.settings.routinePlan = routinePlanArray;
        await this.plugin.saveSettings();
    }
}

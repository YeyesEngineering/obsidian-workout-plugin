import WorkoutPlugin from 'main';
import { App, Notice, moment, stringifyYaml } from 'obsidian';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';
import { routineTemplate, RoutineModel, todayRoutine } from './RoutineModel';
import { Calculator } from '../Calculator';
import { Markdown } from 'src/Markdown/Markdown';

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

    async todayRoutineUpdater(date: string): Promise<number[]> {
        const today = date;
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
            this.settings.todayRoutine.progress = todaydata.progress;
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
    async nextdayRoutineUpdater(date: string): Promise<number[]> {
        const nextday = date;
        //이전 데이터 초기화
        this.settings.nextdayRoutine.workout = [];
        this.settings.nextdayRoutine.weight = [];
        this.settings.nextdayRoutine.reps = [];
        this.settings.nextdayRoutine.sets = [];
        //데이터 설정
        const nextdaydata = this.settings.routinePlan.find((value) => value.date === nextday);
        console.log('nextday', nextdaydata);
        if (nextdaydata) {
            this.settings.nextdayRoutine.date = nextday;
            this.settings.nextdayRoutine.progress = nextdaydata.progress;
            this.settings.nextdayRoutine.sessionname = nextdaydata.sessionname;
            this.settings.nextdayRoutine.workout = nextdaydata.workout;
            this.settings.nextdayRoutine.weight = nextdaydata.weight;
            this.settings.nextdayRoutine.reps = nextdaydata.reps;
            this.settings.nextdayRoutine.sets = nextdaydata.sets;
            await this.plugin.saveSettings();
        } else {
            //연장 하는 옵션 추가
            new Notice('초기화 후 다시 시도해주세요');
        }

        return [];
    }

    async workoutContextMaker(boolean: boolean, testdata?: todayRoutine): Promise<string> {
        let contextdata = '# Today Workout  List\n\n';
        if (boolean && testdata) {
            // const todayRoutine = this.plugin.settings.todayRoutine;
            const todayRoutine = testdata;
            for (let i = 0; i < todayRoutine.workout.length; i++) {
                for (let j = 0; j < todayRoutine.sets[i]; j++) {
                    //NOTE 부분 추가
                    contextdata += ` - [ ] ${todayRoutine.workout[i]} : ${await new Calculator(
                        this.plugin,
                    ).weightCaculator(todayRoutine.workout[i], todayRoutine.weight[i])} X ${todayRoutine.reps[i]} ${
                        j + 1
                    }Set \n`;
                }
            }
            return contextdata;
        } else {
            for (let i = 0; i < 6; i++) {
                contextdata += ` - [ ] \n`;
            }
            return contextdata;
        }
    }

    async routinePlanner(): Promise<void> {
        //아까 이부분에서 왜 에러가 났을까?

        //에러 체크 해보기
        this.plugin.settings.routinePlan = [];
        await this.plugin.saveSettings();

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
                    progress: '0',
                    workout: this.Routine.session[sessionNumber].workoutname,
                    weight: this.Routine.session[sessionNumber].weight,
                    reps: this.Routine.session[sessionNumber].reps,
                    sets: this.Routine.session[sessionNumber].sets,
                };
                // this.plugin.settings.routinePlan.push(plan);
                routinePlanArray.push(plan);
            }
        }
        //Data Sort
        routinePlanArray.sort(
            (a, b) =>
                parseInt(a['date'].replace('-', '').replace('-', '')) -
                parseInt(b['date'].replace('-', '').replace('-', '')),
        );
        const allSession = routinePlanArray.length;
        let sessionCount = 1;
        for (let i = 0; i < allSession; i++) {
            const percent = ((sessionCount / allSession) * 100).toFixed(1);
            routinePlanArray[i].progress = `${percent}%`;
            sessionCount++;
        }

        this.plugin.settings.routinePlan = routinePlanArray;
        await this.plugin.saveSettings();
    }
}

export class RoutineModelApp extends RoutineUpdate {
    app: App;
    constructor(plugin: WorkoutPlugin, app: App) {
        super(plugin);
        this.app = app;
    }
    async workoutNoteMaker(day: string, next?: boolean): Promise<void> {
        // const today = moment().format('YYYY-MM-DD');
        if (!next) {
            await new RoutineUpdate(this.plugin).todayRoutineUpdater(day);
            //Propreties make
            const workoutProperites: RoutineModel = {
                Today: moment().format(),
                Workout: true,
                Program: this.plugin.settings.routineTemplate.name,
                Session: this.plugin.settings.todayRoutine.sessionname,
                Progress: this.plugin.settings.todayRoutine.progress,
                Workoutvolumn: 0,
                Bodyweight: parseFloat(this.plugin.settings.bodyWeight),
                Bigthree: this.plugin.settings.bigThree[3],
                Squat1rm: this.plugin.settings.bigThree[0],
                Benchpress1rm: this.plugin.settings.bigThree[1],
                Deadlift1rm: this.plugin.settings.bigThree[2],
            };
            //오늘 할 워크아웃 목록 가져오기
            const contextData = await new RoutineUpdate(this.plugin).workoutContextMaker(
                true,
                this.settings.todayRoutine,
            );
            console.log(contextData);

            const tempdata = `---\n${stringifyYaml(workoutProperites)}---\n` + contextData;
            try {
                //main폴더가 존재하는지 확인후 생성하도록 수정 예정
                new Markdown(this.plugin, this.app).createNote(`Workout ${day}`, tempdata);
            } catch (error) {
                new Notice(error);
            }
        } else {
            await new RoutineUpdate(this.plugin).nextdayRoutineUpdater(day);
            //Propreties make
            const workoutProperites: RoutineModel = {
                Today: day,
                Workout: true,
                Program: this.plugin.settings.routineTemplate.name,
                Session: this.plugin.settings.nextdayRoutine.sessionname,
                Progress: this.plugin.settings.nextdayRoutine.progress,
                Workoutvolumn: 0,
                Bodyweight: parseFloat(this.plugin.settings.bodyWeight),
                Bigthree: this.plugin.settings.bigThree[3],
                Squat1rm: this.plugin.settings.bigThree[0],
                Benchpress1rm: this.plugin.settings.bigThree[1],
                Deadlift1rm: this.plugin.settings.bigThree[2],
            };
            //오늘 할 워크아웃 목록 가져오기
            const contextData = await new RoutineUpdate(this.plugin).workoutContextMaker(
                true,
                this.settings.nextdayRoutine,
            );
            console.log(contextData);

            const tempdata = `---\n${stringifyYaml(workoutProperites)}---\n` + contextData;
            try {
                //main폴더가 존재하는지 확인후 생성하도록 수정 예정
                new Markdown(this.plugin, this.app).createNote(`Workout ${day}`, tempdata);
            } catch (error) {
                new Notice(error);
            }
        }
    }
}

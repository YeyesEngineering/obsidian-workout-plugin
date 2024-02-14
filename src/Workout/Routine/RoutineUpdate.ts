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

    async todayRoutineUpdater(date: string): Promise<void> {
        const today = date;
        //Wipe previous data
        this.settings.todayRoutine.workout = [];
        this.settings.todayRoutine.weight = [];
        this.settings.todayRoutine.reps = [];
        this.settings.todayRoutine.sets = [];
        this.settings.todayRoutine.add = [];
        this.settings.todayRoutine.check = [];
        await this.plugin.saveSettings();
        //data settings
        const todaydata = this.settings.routinePlan.find((value) => value.date === today);
        if (todaydata) {
            this.settings.todayRoutine.date = today;
            this.settings.todayRoutine.progress = todaydata.progress;
            this.settings.todayRoutine.sessionname = todaydata.sessionname;
            this.settings.todayRoutine.workout = todaydata.workout;
            this.settings.todayRoutine.weight = todaydata.weight;
            this.settings.todayRoutine.reps = todaydata.reps;
            this.settings.todayRoutine.sets = todaydata.sets;
            this.settings.todayRoutine.add = todaydata.add;
            this.settings.todayRoutine.check = todaydata.sets.map((i) => Array(i).fill(0))
            await this.plugin.saveSettings();
        } else {
            //연장 하는 옵션 추가
            new Notice('초기화 후 다시 시도해주세요');
        }
    }
    async nextdayRoutineUpdater(date: string): Promise<number[]> {
        const nextday = date;
        //이전 데이터 초기화
        this.settings.nextdayRoutine.workout = [];
        this.settings.nextdayRoutine.weight = [];
        this.settings.nextdayRoutine.reps = [];
        this.settings.nextdayRoutine.sets = [];
        this.settings.nextdayRoutine.add = [];
        await this.plugin.saveSettings();
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
            this.settings.nextdayRoutine.add = nextdaydata.add;
            this.settings.nextdayRoutine.check = nextdaydata.sets.map((i) => Array(i).fill(0));
            await this.plugin.saveSettings();
        } else {
            //연장 하는 옵션 추가
            new Notice('초기화 후 다시 시도해주세요');
        }

        return [];
    }

    async workoutContextMaker(boolean: boolean, todayRoutineData?: todayRoutine): Promise<string> {
        let contextdata = '# Today Workout List\n\n';
        if (boolean && todayRoutineData) {
            const todayRoutine = todayRoutineData;
            for (let i = 0; i < todayRoutine.workout.length; i++) {
                for (let j = 0; j < todayRoutine.sets[i]; j++) {
                    contextdata += ` - [ ] ${todayRoutine.workout[i]} : ${await new Calculator(
                        this.plugin,
                    ).weightCalculator(todayRoutine.workout[i], todayRoutine.weight[i])} X ${
                        todayRoutine.reps[i]
                    } - ${j + 1}Set \n    - Note : \n`;
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
        const routinePlanArray = [];
        this.plugin.settings.routinePlan = [];
        await this.plugin.saveSettings();
        for (let i = 0; i < this.Routine.week.length; i++) {
            const basedate = moment(this.settings.startday).add(i, 'days').format('YYYY-MM-DD');
            for (let j = 0; j < this.Routine.week[i].length; j++) {
                const sessionNumber = parseInt(this.Routine.week[i][j].replace(/\D/g, "")) - 1;
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
                    add: this.Routine.session[sessionNumber].add,
                };
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
                Bodyweight: this.plugin.settings.bodyWeight,
                Bigthree: this.plugin.settings.bigThree[3],
                Squat1rm: this.plugin.settings.bigThree[0],
                Benchpress1rm: this.plugin.settings.bigThree[1],
                Deadlift1rm: this.plugin.settings.bigThree[2],
            };
            //Today Workout Lists
            const contextData = await new RoutineUpdate(this.plugin).workoutContextMaker(
                true,
                this.settings.todayRoutine,
            );

            const filedata = `---\n${stringifyYaml(workoutProperites)}---\n` + contextData;
            try {
                new Markdown(this.plugin, this.app).createNote(`Workout ${day}`, filedata, true);
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
                Bodyweight: this.plugin.settings.bodyWeight,
                Bigthree: this.plugin.settings.bigThree[3],
                Squat1rm: this.plugin.settings.bigThree[0],
                Benchpress1rm: this.plugin.settings.bigThree[1],
                Deadlift1rm: this.plugin.settings.bigThree[2],
            };
            //nextday workoutLists
            const contextData = await new RoutineUpdate(this.plugin).workoutContextMaker(
                true,
                this.settings.nextdayRoutine,
            );

            const filedata = `---\n${stringifyYaml(workoutProperites)}---\n` + contextData;
            try {
                new Markdown(this.plugin, this.app).createNote(`Workout ${day}`, filedata);
            } catch (error) {
                new Notice(error);
            }
        }
    }
}

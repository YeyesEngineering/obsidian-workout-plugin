import { Modal, App, Setting, Notice, moment, stringifyYaml } from 'obsidian';
import WorkoutPlugin from 'main';
import { Markdown } from 'src/Markdown/Markdown';
import { RoutineModel } from 'src/Workout/Routine/RoutineModel';
import { RoutineUpdate } from 'src/Workout/Routine/RoutineUpdate';

//this is workout day using modal

export class WorkoutButtonModal extends Modal {
    plugin: WorkoutPlugin;
    startday: string;

    constructor(app: App, plugin: WorkoutPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h1', { text: 'Want to start working out?' });

        new Setting(contentEl)
            .addButton((btn) =>
                btn.setButtonText('OK').onClick(async () => {
                    //이부분에 데이터 파싱후 오늘의 계획 표 생성
                    // this.close();
                    // await new RoutineUpdate(this.plugin).todayRoutineMaker();
                    new Notice('test!');

                    // 스타팅 데이와 일치하는 부분이 있는지 확인
                    // 아니라면 며칠 뒤 운동이 시작되는지 가져오는 기능

                    //아직 루틴이 설정되지 않았습니다.
                    const today = moment().format('YYYY-MM-DD');
                    // 수정
                    if (this.plugin.settings.startday !== today){
                        new Notice('아직 루틴이 설정되지 않았습니다');
                    }

                    await new RoutineUpdate(this.plugin).todayRoutineUpdater();
                    const workoutProperites: RoutineModel = {
                        Today: moment().format(),
                        Workout: true,
                        Program: this.plugin.settings.routineTemplate.name,
                        Session: this.plugin.settings.todayRoutine.sessionname,
                        Workoutvolumn: 2000,
                        Bodyweight: parseFloat(this.plugin.settings.bodyWeight),
                        Bigthree: this.plugin.settings.bigThree[3],
                        Squat1rm: this.plugin.settings.bigThree[0],
                        Benchpress1rm: this.plugin.settings.bigThree[1],
                        Deadlift1rm: this.plugin.settings.bigThree[2],
                    };
                    //오늘 할 워크아웃 목록 가져오기
                    const contextData = await new RoutineUpdate(this.plugin).workoutContextMaker();
                    console.log(contextData);

                    const tempdata = `---\n${stringifyYaml(workoutProperites)}---\n` + contextData;
                    try {
                        new Markdown(this.plugin, this.app).createNote(`Workout ${today}`, tempdata);
                        
                    } catch (error) {
                        new Notice(error);
                    }

                    this.close();
                }),
            )
            .addButton((btn) =>
                btn.setButtonText('Cancel').onClick(async () => {
                    console.log('tt');
                    this.close();
                }),
            );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

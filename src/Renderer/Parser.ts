import WorkoutPlugin from 'main';
import { Notice, moment } from 'obsidian';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';
import { parseModel, routineTemplate } from 'src/Workout/Routine/RoutineModel';
// import { WeightUpdate } from 'src/Workout/Routine/WeightUpdate';

export class ParseWorkout {
    plugin: WorkoutPlugin;
    settings: WorkoutPluginSettings;

    constructor(plugin: WorkoutPlugin) {
        this.plugin = plugin;
        this.settings = this.plugin.settings;
    }

    public static jsonChecker(file: routineTemplate) {
        console.log('file', file);
        for (const workoutlist of file.workoutList) {
            if (typeof workoutlist.workoutName !== 'string') {
                new Notice('Check Json file workout name');
                return false;
            }
            if (
                !(
                    workoutlist.workoutName === 'WEIGHT' ||
                    workoutlist.workoutName === 'BODYWEIGHT' ||
                    workoutlist.workoutName === 'CARDIO'
                )
            ) {
                new Notice('Check Json File type');
                return false;
            }
            if (
                typeof workoutlist.trainingWeight !== 'number' ||
                typeof workoutlist.reps !== 'number' ||
                typeof workoutlist.weight !== 'number'
            ) {
                new Notice('Check Json file weight series');
                return false;
            }

            for (const target of workoutlist.workoutTarget) {
                if (
                    !(
                        target === '' ||
                        target === 'Cardio' ||
                        target === 'Chest' ||
                        target === 'Back' ||
                        target === 'Biceps' ||
                        target === 'Calves' ||
                        target === 'Glutes' ||
                        target === 'Hamstrings' ||
                        target === 'Quadriceps' ||
                        target === 'Shoulders' ||
                        target === 'Triceps'
                    )
                ) {
                    new Notice('Check Json file workout Target');
                    return false;
                }
            }
        }


        for (const session of file.session) {
            //개수 비교
            if (!(session.workoutname.length === session.reps.length && session.reps.length === session.sets.length  && session.sets.length === session.weight.length && session.weight.length === session.add.length)){
                new Notice('Check Session Number');
                return false
            }
            if (typeof session.sessionname !== 'string') {
                new Notice('Check Session Name');
                return false;
            }
            for (const name of session.workoutname) {
                if (
                    !file.workoutList.some(
                        (value) => value.workoutName.toUpperCase().trim() === name.toUpperCase().trim(),
                    )
                ) {
                    new Notice('Check Session Workout Name');
                    return false;
                }
            }
            for (const rep of session.reps){
                if (typeof rep !== "number"){
                    new Notice('Check Session reps')
                    return false;
                }
            }
            for (const set of session.sets){
                if (typeof set !== "number"){
                    new Notice('Check Session sets')
                    return false;
                }
            }
            for (const weight of session.weight){
                const upperWeight = weight.toUpperCase().trim().replaceAll(' ', '');

                if (upperWeight === 'BODYWEIGHT'){
                    continue
                }
                else if (upperWeight.includes('X')) {
                    //  X 를 * 로 변경할 까 고민중
                    const divide = upperWeight.split('X');
                    console.log('divide',divide)
                    //이 부분은 달라질 수 도 있겠다
                    if (typeof divide === undefined){
                        new Notice('Check Session weight')
                        return false
                    }
                    if (upperWeight.includes('RM')) {
                        const rm = parseInt(divide[0].replace('rm', ''));
                        if (typeof rm !== "number" || rm > 10){
                            new Notice('Check Session weight')
                            return false
                        }
                    }
                    else{
                        new Notice('Check Session weight')
                            return false
                    }
                    const pvalue = parseInt(divide[1].replace('%', '')) / 100;
                    if (typeof pvalue !== 'number' || pvalue === 0){
                        new Notice('Check Session weight')
                        return false
                    }
                } else {
                    if (upperWeight.includes('%')){
                        const pvalue = parseInt(upperWeight.replace('%', '')) / 100;
                    if (typeof pvalue !== 'number' || pvalue === 0){
                        new Notice('Check Session weight')
                        return false
                    }
                    }
                    else{
                        new Notice('Check Session weight')
                        return false
                    }
                }
            }

            for (const add of session.add){
                //테스트 확인
                if (add.length !== 2){
                    new Notice('Check Session add')
                    return false
                }else{
                    //만약 존재한다면
                    if (typeof add[0] !== 'number' || typeof add[1] !== 'number'){
                        new Notice('Check Session add')
                        return false
                    }
                }

            }

        }

        if (file.week.length !== 7){
            console.log('file week length = ',file.week.length)
            new Notice('Check Week number')
            return false
        }
        for (const week of file.week){
            if (week.length !== 0){
                for (const sessionCheck of week){
                    const sessionParse = (parseInt(sessionCheck.replace(/\D/g, "")) - 1)
                    if (typeof sessionParse !== 'number' || sessionParse < 0){
                        console.log('sessionParse = ',sessionParse)
                        new Notice('Check Week session')
                        return false
                    }
                }
            }
        }

        return true;
    }

    public static numberChecker(string: string) {
        const num = parseFloat(string);
        if (isNaN(num)) {
            new Notice('enter only number');
            return 0;
        } else {
            return num;
        }
    }

    public static dayChecker(string: string) {
        return moment(string, moment.ISO_8601, true).isValid();
    }

    public static titleParser(string: string) {
        const date = string.match(/\d{4}-\d{2}-\d{2}/);
        if (date) {
            return date[0];
        }
    }

    public static parser(string: string): parseModel {
        const zerowidth = string.replace(/\u200B/g, '');
        const workoutName = zerowidth.split(':');
        const weight = workoutName[1].split('X');
        const reps = weight[1].split('-');
        const set = reps[1].replace(/[^0-9]/g, '');
        const data = {
            workout: workoutName[0].trim(),
            weight: parseFloat(weight[0].trim()),
            reps: parseInt(reps[0].trim()),
            set: parseInt(set.trim()),
        };
        return data;
    }
}

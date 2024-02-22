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

    public static async jsonChecker(file: routineTemplate) {
        for (const workoutlist of file.workoutList) {
            if (typeof workoutlist.workoutName !== 'string') {
                new Notice('Check the "workoutName" that belongs to the workoutList');
                return false;
            }
            if (
                !(
                    workoutlist.type.replace(/\s+/g, '').toUpperCase().trim() === 'WEIGHT' ||
                    workoutlist.type.replace(/\s+/g, '').toUpperCase().trim() === 'BODYWEIGHT' ||
                    workoutlist.type.replace(/\s+/g, '').toUpperCase().trim() === 'CARDIO'
                )
            ) {
                new Notice('Check the "type" that belongs to the workoutList');
                return false;
            }
            if (typeof workoutlist.weight !== 'number') {
                new Notice('Check the "weight" that belongs to the workoutList');
                return false;
            }
            if (typeof workoutlist.trainingWeight !== 'number') {
                new Notice('Check the "trainingWeight" that belongs to the workoutList');
                return false;
            }
            if (typeof workoutlist.reps !== 'number') {
                new Notice('Check the "reps" that belongs to the workoutList');
                return false;
            }

            // wokroutTarget Checker 추후 수정 예정
            // for (const target of workoutlist.workoutTarget) {
            //     if (
            //         !(
            //             target === '' ||
            //             target === 'Cardio' ||
            //             target === 'Chest' ||
            //             target === 'Back' ||
            //             target === 'Biceps' ||
            //             target === 'Calves' ||
            //             target === 'Glutes' ||
            //             target === 'Hamstrings' ||
            //             target === 'Quadriceps' ||
            //             target === 'Shoulders' ||
            //             target === 'Triceps'
            //         )
            //     ) {
            //         new Notice('Check the "workoutTarget" that belongs to the workoutList');
            //         return false;
            //     }
            // }
        }

        for (const session of file.session) {
            if (session.add) {
                if (
                    !(
                        session.workoutname.length === session.reps.length &&
                        session.reps.length === session.sets.length &&
                        session.sets.length === session.weight.length &&
                        session.weight.length === session.add.length
                    )
                ) {
                    new Notice('Check the number of elements in the Session part');
                    return false;
                }
            } else {
                if (
                    !(
                        session.workoutname.length === session.reps.length &&
                        session.reps.length === session.sets.length &&
                        session.sets.length === session.weight.length
                    )
                ) {
                    new Notice('Check the number of elements in the Session part');
                    return false;
                }
            }

            if (typeof session.sessionname !== 'string') {
                new Notice('Check the "sessionname" that belongs to the session');
                return false;
            }
            for (const name of session.workoutname) {
                if (typeof name !== 'string') {
                    new Notice('Check the "workoutname type" that belongs to the session');
                    return false;
                }
                if (
                    !file.workoutList.some(
                        (value) => value.workoutName.toUpperCase().trim() === name.toUpperCase().trim(),
                    )
                ) {
                    new Notice('Check the "workoutname" that belongs to the session');
                    return false;
                }
            }
            for (const rep of session.reps) {
                if (typeof rep !== 'number') {
                    new Notice('Check the "reps" that belongs to the session');
                    return false;
                }
            }
            for (const set of session.sets) {
                if (typeof set !== 'number') {
                    new Notice('Check the "sets" that belongs to the session');
                    return false;
                }
            }
            for (const weight of session.weight) {
                const upperWeight = weight.replace(/\s+/g, '').toUpperCase().trim();
                //*의 위치를 고려하는 코드 작성
                if (typeof weight !== 'string') {
                    new Notice('Check the "weight" that belongs to the session');
                    return false;
                }
                if (upperWeight === 'BODYWEIGHT') {
                    continue;
                } else if (upperWeight.includes('*')) {
                    const divide = upperWeight.split('*');
                    if (divide.length > 2) {
                        new Notice('Check the "weight" that belongs to the session');
                        return false;
                    }
                    if (upperWeight.includes('RM')) {
                        // 체크
                        if (/\D/.test(divide[0].replaceAll('RM', ''))) {
                            new Notice('Check the "weight" that belongs to the session');
                            return false;
                        }

                        const rm = parseInt(divide[0].replaceAll('RM', ''));
                        if (isNaN(rm) || rm > 10) {
                            new Notice('Check the "weight - RM" that belongs to the session');
                            return false;
                        }
                    } else {
                        new Notice('Check the "weight" that belongs to the session3');
                        return false;
                    }
                    if (/\D/.test(divide[1].replaceAll('%', ''))) {
                        new Notice('Check the "weight" that belongs to the session');
                        return false;
                    }
                    const pvalue = parseInt(divide[1].replaceAll('%', '')) / 100;
                    if (isNaN(pvalue) || pvalue === 0) {
                        new Notice('Check the "weight" that belongs to the session');
                        return false;
                    }
                } else {
                    if (!upperWeight.includes('RM')) {
                        if (weight.replace('%', '').trim().includes(' ')) {
                            new Notice('Check the "weight" that belongs to the session');
                            return false;
                        }
                        if (/\D/.test(upperWeight.replaceAll('%', ''))) {
                            new Notice('Check the "weight" that belongs to the session');
                            return false;
                        }
                        const pvalue = parseInt(upperWeight.replaceAll('%', '')) / 100;
                        if (isNaN(pvalue) || pvalue === 0) {
                            new Notice('Check the "weight" that belongs to the session');
                            return false;
                        }
                    } else {
                        new Notice('Check the "weight" that belongs to the session');
                        return false;
                    }
                }
            }
            ///테스트 진행
            if (session.add) {
                for (const add of session.add) {
                    if (!(add.length === 0 || add.length === 2)) {
                        new Notice('Check the "add" that belongs to the session', add.length);
                        return false;
                    } else if (add.length === 2) {
                        if (typeof add[0] !== 'number' || typeof add[1] !== 'number') {
                            new Notice('Check the "add" that belongs to the session');
                            return false;
                        }
                    }
                }
            }
        }

        if (file.week.length !== 7) {
            new Notice('The number of week elements should be 7');
            return false;
        }
        for (const week of file.week) {
            if (week.length !== 0) {
                for (const sessionCheck of week) {
                    const sessionParse = parseInt(sessionCheck.replace(/\D/g, '')) - 1;
                    if (isNaN(sessionParse) || sessionParse < 0) {
                        new Notice('Check Week session');
                        return false;
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

    public static parser(string: string, bodyWeight: number): parseModel {
        const zerowidth = string.replace(/\u200B/g, '');
        const workoutName = zerowidth.split(':');
        const weight = workoutName[1].split('X');
        
        // Body Weight Parser
        let fweight = 0;
        if (weight[0].trim().includes('Body Weight')) {
            const convert = weight[0].replace('Body Weight', String(bodyWeight));
            const spliter = convert.split('+');
            console.log(spliter);
            if (spliter.length === 1){
                fweight = parseFloat(spliter[0]);
            }
            else{
                fweight = parseFloat(spliter[0]) + parseFloat(spliter[1]);
            }
        }
        const reps = weight[1].split('-');
        const set = reps[1].replace(/[^0-9]/g, '');
        const data = {
            workout: workoutName[0].trim(),
            weight: weight[0].trim().includes('Body Weight') ? fweight : parseFloat(weight[0].trim()),
            // weight: parseFloat(weight[0].trim()),
            reps: parseInt(reps[0].trim()),
            set: parseInt(set.trim()),
        };
        return data;
    }
}

import WorkoutPlugin from 'main';
import { Notice } from 'obsidian';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';

export class Calculator {
    plugin: WorkoutPlugin;
    settings: WorkoutPluginSettings;
    BodyWeight: string;
    Gender: string;
    SquatWeight: number;
    SquatReps: number;
    BenchWeight: number;
    BenchReps: number;
    DeadWeight: number;
    DeadReps: number;

    constructor(plugin: WorkoutPlugin) {
        this.plugin = plugin;
        this.settings = this.plugin.settings;
        this.BodyWeight = this.plugin.settings.bodyWeight;
        this.Gender = this.plugin.settings.gender;
        this.SquatWeight = this.plugin.settings.workoutLists[0].weight;
        this.SquatReps = this.plugin.settings.workoutLists[0].reps;
        this.BenchWeight = this.plugin.settings.workoutLists[1].weight;
        this.BenchReps = this.plugin.settings.workoutLists[1].reps;
        this.DeadWeight = this.plugin.settings.workoutLists[2].weight;
        this.DeadReps = this.plugin.settings.workoutLists[2].reps;
    }

    async oneRmCalculator(): Promise<void> {
        const squatonerm = Math.round(this.SquatWeight / (1.0278 - 0.0278 * this.SquatReps));
        const benchonerm = Math.round(this.BenchWeight / (1.0278 - 0.0278 * this.BenchReps));
        const deadliftonerm = Math.round(this.DeadWeight / (1.0278 - 0.0278 * this.DeadReps));

        console.log([squatonerm, benchonerm, deadliftonerm, squatonerm + benchonerm + deadliftonerm]);

        //전 무게와 비교하는 코드 작성 (갱신한 기록이 더 크다면 갱신)
        //현재 페이지 조작하면서 함께 디자인 예정

        this.plugin.settings.bigThree = [
            squatonerm,
            benchonerm,
            deadliftonerm,
            squatonerm + benchonerm + deadliftonerm,
        ];
        await this.plugin.saveSettings();
    }

    async wilks2Caculator(): Promise<void> {
        const bd = parseFloat(this.BodyWeight);
        if (this.Gender === 'Male') {
            const wilkspoint =
                this.plugin.settings.bigThree[3] *
                (600 /
                    (-0.0000000120804336482315 * Math.pow(bd, 5) +
                        0.00000707665973070743 * Math.pow(bd, 4) +
                        -0.00139583381094385 * Math.pow(bd, 3) +
                        0.073694103462609 * Math.pow(bd, 2) +
                        8.47206137941125 * bd +
                        47.4617885411949));
            console.log('wilkspoint', parseFloat(wilkspoint.toFixed(2)));
            this.plugin.settings.wilks2point = parseFloat(wilkspoint.toFixed(2));
            await this.plugin.saveSettings();
        } else if (this.Gender === 'Female') {
            const wilkspoint =
                (this.plugin.settings.bigThree[3] * 600) /
                (-0.000000023334613884954 * Math.pow(bd, 5) +
                    0.00000938773881462799 * Math.pow(bd, 4) +
                    -0.0010504000506583 * Math.pow(bd, 3) +
                    -0.0330725063103405 * Math.pow(bd, 2) +
                    13.7121941940668 * bd -
                    125.425539779509);
            console.log('wilkspoint', parseFloat(wilkspoint.toFixed(2)));
            this.plugin.settings.wilks2point = parseFloat(wilkspoint.toFixed(2));
            await this.plugin.saveSettings();
        } else {
            new Notice('Please Setting First');
        }
    }

    async dotsCaculator(): Promise<void> {
        const bd = parseFloat(this.BodyWeight);
        if (this.Gender === 'Male') {
            const dotspoint =
                (this.plugin.settings.bigThree[3] * 500) /
                (-0.000001093 * Math.pow(bd, 4) +
                    0.0007391293 * Math.pow(bd, 3) +
                    -0.1918759221 * Math.pow(bd, 2) +
                    24.0900756 * bd +
                    -307.75076);
            console.log('dotspoint', parseFloat(dotspoint.toFixed(2)));
            this.plugin.settings.dotspoint = parseFloat(dotspoint.toFixed(2));
            await this.plugin.saveSettings();
        } else if (this.Gender === 'Female') {
            const dotspoint =
                (this.plugin.settings.bigThree[3] * 500) /
                (-0.0000010706 * Math.pow(bd, 4) +
                    0.0005158568 * Math.pow(bd, 3) +
                    -0.1126655495 * Math.pow(bd, 2) +
                    13.6175032 * bd -
                    57.96288);
            console.log('dotspoint', parseFloat(dotspoint.toFixed(2)));
            this.plugin.settings.dotspoint = parseFloat(dotspoint.toFixed(2));
            await this.plugin.saveSettings();
        } else {
            // new Notice('Please Choose Your Gender!');
        }
    }

    // async weightCaculator(workout: string, percent: string): Promise<number | string> {
    //     //조금 더 수정이 필요해 보임.
    //     //만약 데이터가 0이라면 퍼센트로 표기해주는 것이 좋아보인다.
    //     let wvalue = 0;
    //     let pvalue = 0;
    //     if (percent === undefined || percent === 'bodyweight') {
    //         console.log('percent', percent);
    //         pvalue = parseFloat(this.settings.bodyWeight);
    //         return 'body weight';
    //     } else {
    //         pvalue = parseInt(percent.replace('%', '')) / 100;
    //     }

    //     for (const value of this.settings.workoutLists) {
    //         if (value.workoutName === workout) {
    //             wvalue = await Calculator.onerm(value.weight, value.reps);
    //             break;
    //         }
    //     }
    //     console.log(wvalue, pvalue);
    //     return parseFloat((wvalue * pvalue).toFixed(1));
    // }

    async weightCalculatorDetail(workout: string, percent: string, add?: number[]): Promise<number | string> {
        //조금 더 수정이 필요해 보임.
        //만약 데이터가 0이라면 퍼센트로 표기해주는 것이 좋아보인다.

        /// ADD  부분 수정 필요

        let wvalue = 0;
        let pvalue = 0;
        let rm = 0;

        if (percent === undefined || percent === 'bodyweight') {
            console.log('percent', percent);
            pvalue = parseFloat(this.settings.bodyWeight);
            if (add) {
                //처음의 경우는 어떻게 하지?
                //다른 방식으로 구현
                return `Body Weight + ${add[0]}`;
            }
            return 'Body Weight';
        } else {
            //Parser
            if (percent.includes('rm' || 'X')) {
                const divide = percent.replaceAll(' ', '').split('X');
                rm = parseInt(divide[0].replace('rm', ''));
                pvalue = parseInt(divide[1].replace('%', '')) / 100;
            } else {
                pvalue = parseInt(percent.replace('%', '')) / 100;
            }
        }

        for (const value of this.settings.workoutLists) {
            if (value.workoutName === workout) {
                const onerm = await Calculator.onerm(value.weight, value.reps);
                wvalue = await Calculator.whatrm(onerm, rm);
                console.log('w,rm,one', wvalue, rm, onerm);
                break;
            }
        }
        console.log(wvalue, pvalue);
        if (add) {
            return parseFloat((wvalue * pvalue + add[0]).toFixed(1));
        }
        return parseFloat((wvalue * pvalue).toFixed(1));
    }

    async basicSetup() {
        this.oneRmCalculator();
        this.wilks2Caculator();
        this.dotsCaculator();
    }

    static async onerm(weight: number, reps: number): Promise<number> {
        const onerm = Math.round(weight / (1.0278 - 0.0278 * reps));
        return onerm;
    }

    static async whatrm(onerm: number, reps: number): Promise<number> {
        const rm = Math.round((1.0278 - 0.0278 * reps) * onerm);
        return rm;
    }
}

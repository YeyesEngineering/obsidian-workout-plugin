import WorkoutPlugin from 'main';
import { Notice } from 'obsidian';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';

export class Calculator {
    plugin: WorkoutPlugin;
    settings: WorkoutPluginSettings;
    BodyWeight: number;
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

    async bigThreeSetup(): Promise<void> {
        const squatonerm = Math.round(this.SquatWeight / (1.0278 - 0.0278 * this.SquatReps));
        const benchonerm = Math.round(this.BenchWeight / (1.0278 - 0.0278 * this.BenchReps));
        const deadliftonerm = Math.round(this.DeadWeight / (1.0278 - 0.0278 * this.DeadReps));

        this.plugin.settings.bigThree = [
            squatonerm,
            benchonerm,
            deadliftonerm,
            squatonerm + benchonerm + deadliftonerm,
        ];
        await this.plugin.saveSettings();
    }

    async wilks2Calculator(): Promise<void> {
        const bd = this.BodyWeight;
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
            this.plugin.settings.wilks2point = parseFloat(wilkspoint.toFixed(2));
            await this.plugin.saveSettings();
        } else {
            new Notice('Please Setting First');
        }
    }

    async dotsCalculator(): Promise<void> {
        const bd = this.BodyWeight;
        if (this.Gender === 'Male') {
            const dotspoint =
                (this.plugin.settings.bigThree[3] * 500) /
                (-0.000001093 * Math.pow(bd, 4) +
                    0.0007391293 * Math.pow(bd, 3) +
                    -0.1918759221 * Math.pow(bd, 2) +
                    24.0900756 * bd +
                    -307.75076);
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
            this.plugin.settings.dotspoint = parseFloat(dotspoint.toFixed(2));
            await this.plugin.saveSettings();
        } else {
            new Notice('Please Setting First');
        }
    }

    async trainingWeightCalculator(): Promise<void> {
        for (const workout of this.settings.workoutLists) {
            if (
                workout.type === 'WEIGHT' &&
                (workout.trainingWeight === 0 || isNaN(workout.trainingWeight) || workout.trainingWeight === null)
            ) {
                const onerm = await Calculator.onerm(workout.weight, workout.reps);
                workout.trainingWeight = onerm;
            } else if (
                workout.type === 'BODYWEIGHT' &&
                (isNaN(workout.trainingWeight) || workout.trainingWeight === null)
            ) {
                workout.trainingWeight = 0;
            }
        }
        await this.plugin.saveSettings();
    }

    async weightCalculator(workout: string, weight: string): Promise<number | string> {
        const upperWorkout = workout.toUpperCase();
        const upperWeight = weight.toUpperCase().trim().replaceAll(' ', '');
        let wvalue = 0;
        let pvalue = 0;
        let rm = 0;

        if (upperWeight === undefined || upperWeight === 'BODYWEIGHT') {
            let plus = 0;
            for (const value of this.settings.workoutLists) {
                if (value.workoutName === upperWorkout) {
                    plus = value.trainingWeight;
                    break;
                }
            }
            if (plus === 0 || isNaN(plus) || plus === null) {
                return 'Body Weight';
            }
            return `Body Weight + ${plus}KG`;
        } else {
            //Percent Parser
            if (weight.includes('*')) {
                //순서가 바뀌어도 parsing 할 수 있도록 수정 예정
                const divide = upperWeight.split('*');
                if (upperWeight.includes('RM')) {
                    rm = parseInt(divide[0].replaceAll('RM', ''));
                }
                pvalue = parseInt(divide[1].replaceAll('%', '')) / 100;
            } else {
                pvalue = parseInt(upperWeight.replaceAll('%', '')) / 100;
            }
        }
        for (const value of this.settings.workoutLists) {
            if (value.workoutName === upperWorkout) {
                const weight = value.trainingWeight;
                if (rm === 0) {
                    wvalue = weight;
                    break;
                }
                wvalue = await Calculator.whatrm(weight, rm);
                break;
            }
        }
        return parseFloat((wvalue * pvalue).toFixed(1));
    }

    async Setup() {
        await this.bigThreeSetup();
        this.wilks2Calculator();
        this.dotsCalculator();
        await this.trainingWeightCalculator();
    }

    static async onerm(weight: number, reps: number): Promise<number> {
        const onerm = Math.round(weight / (1.0278 - 0.0278 * reps));
        return onerm;
    }

    static async whatrm(onerm: number, reps: number): Promise<number> {
        const rm = Math.round((1.0278 - 0.0278 * reps) * onerm);
        return rm;
    }
    static async tenrm(weight: number, reps: number): Promise<number[]> {
        const rm: number[] = [];
        const onerm = await this.onerm(weight, reps);
        for (let i = 0; i < 10; i++) {
            rm.push(await this.whatrm(onerm, i));
        }
        return rm;
    }
}

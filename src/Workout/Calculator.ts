import WorkoutPlugin from 'main';
import { Notice } from 'obsidian';
import { WorkoutPluginSettings } from 'src/Setting/SettingTab';

export class Calculator {
    plugin: WorkoutPlugin;
    settings: WorkoutPluginSettings;
    BodyWeight: string;
    Gender: string;
    SquatWeight: string;
    SquatReps: string;
    BenchWeight: string;
    BenchReps: string;
    DeadWeight: string;
    DeadReps: string;

    constructor(plugin: WorkoutPlugin) {
        this.plugin = plugin;
        this.BodyWeight = this.plugin.settings.bodyWeight;
        this.Gender = this.plugin.settings.gender;
        this.SquatWeight = this.plugin.settings.mySquatWeight;
        this.SquatReps = this.plugin.settings.mySquatReps;
        this.BenchWeight = this.plugin.settings.myBenchpressWeight;
        this.BenchReps = this.plugin.settings.myBenchpressReps;
        this.DeadWeight = this.plugin.settings.myDeadliftWeight;
        this.DeadReps = this.plugin.settings.myDeadliftReps;
    }

    async oneRmCalculator(): Promise<void> {
        const squatonerm = Math.round(parseInt(this.SquatWeight) / (1.0278 - 0.0278 * parseInt(this.SquatReps)));
        const benchonerm = Math.round(parseInt(this.BenchWeight) / (1.0278 - 0.0278 * parseInt(this.BenchReps)));
        const deadliftonerm = Math.round(parseInt(this.DeadWeight) / (1.0278 - 0.0278 * parseInt(this.DeadReps)));

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
            new Notice('Please Choose Your Gender!');
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
            new Notice('Please Choose Your Gender!');
        }
    }

    async basicSetup(){
        this.oneRmCalculator();
        this.wilks2Caculator();
        this.dotsCaculator();
    }
}

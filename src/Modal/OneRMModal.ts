import { Modal, App, Setting, Notice } from 'obsidian';
import { Calculator } from 'src/Workout/Calculator';

//CSS

export class OneRMModal extends Modal {
    startday: string;

    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        let weight = 0;
        let reps = 0;
        contentEl.createEl('h1', { text: '1RM Calculator' });
        new Setting(contentEl)
            .setName('Weight')
            .setDesc('Please enter numbers only')
            .addText((text) =>
                text.setPlaceholder('Weight').onChange(async (val) => {
                    weight = parseFloat(val);
                }),
            );
        new Setting(contentEl)
            .setName('Reps')
            .setDesc('Please enter less than 10')
            .addText((text) =>
                text.setPlaceholder('Reps').onChange(async (val) => {
                    reps = parseInt(val);
                }),
            );
        const answerEl = new Setting(contentEl);
        new Setting(contentEl)
            .addButton((btn) =>
                btn.setButtonText('Calculate').onClick(async () => {
                    if (isNaN(weight) || isNaN(reps)) {
                        new Notice('Please enter numbers only');
                        return;
                    }
                    if (reps > 10) {
                        new Notice('Enter a value of 10 or less for reps');
                        return;
                    }
                    const tenrm = await Calculator.tenrm(weight, reps);
                    const text = `1RM = ${tenrm[0]}kg\n, 2RM = ${tenrm[1]}kg\n, 3RM = ${tenrm[2]}kg\n, 4RM = ${tenrm[3]}kg\n, 5RM = ${tenrm[4]}kg\n, 6RM = ${tenrm[5]}kg\n, 7RM = ${tenrm[6]}kg\n, 8RM = ${tenrm[7]}kg\n, 9RM = ${tenrm[8]}kg\n, 10RM = ${tenrm[9]}kg\n`;
                    answerEl.setDesc(text);
                }),
            )
            .addButton((btn) =>
                btn.setButtonText('Cancel').onClick(async () => {
                    this.close();
                }),
            );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

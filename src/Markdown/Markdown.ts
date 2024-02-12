import { App,Notice } from 'obsidian';
import WorkoutPlugin from 'main';

export class Markdown {
    plugin: WorkoutPlugin;
    app: App;

    constructor(plugin: WorkoutPlugin, app: App) {
        this.plugin = plugin;
        this.app = app;
    }

    async createNote(fileName: string, fileContent: string, open?: boolean): Promise<void> {
        const filePath = `${this.plugin.settings.workoutFolder}/${fileName}.md`;

        if (open){
            try {
                const targetFile = await this.app.vault.create(filePath, fileContent);
                await this.app.workspace.getUnpinnedLeaf().openFile(targetFile, { state: { mode: 'source' } });
            } catch (error) {
                new Notice (error);
            }
        }
        else{
            try {
                await this.app.vault.create(filePath, fileContent);
            } catch (error) {
                new Notice (error);
            }
        }
    }
}

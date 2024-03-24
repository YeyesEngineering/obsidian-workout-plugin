import { App, Notice, normalizePath } from 'obsidian';
import WorkoutPlugin from 'main';

export class Markdown {
    plugin: WorkoutPlugin;
    app: App;

    constructor(plugin: WorkoutPlugin, app: App) {
        this.plugin = plugin;
        this.app = app;
    }

    async createNote(filePath: string, fileName: string, fileContent: string, open?: boolean): Promise<void> {
        const file_path = normalizePath(`${filePath}/${fileName}.md`);

        if (open) {
            try {
                const targetFile = await this.app.vault.create(file_path, fileContent);
                await this.app.workspace.getLeaf().openFile(targetFile, { state: { mode: 'source' } });
            } catch (error) {
                new Notice(error);
            }
        } else {
            try {
                await this.app.vault.create(file_path, fileContent);
            } catch (error) {
                new Notice(error);
            }
        }
    }
}

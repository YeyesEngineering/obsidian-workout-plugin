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
        // find and possibly create the folder set in settings or passed in folder
        // const folder = options.folder ?? this.app.vault.getAbstractFileByPath('/');
        const filePath = `${this.plugin.settings.workoutFolder}/${fileName}.md`;

        // find and delete file with the same name
        // const file = this.app.vault.getAbstractFileByPath(filePath);
        // if (file) {
        //     await this.app.vault.delete(file);
        // }

        if (open){
            try {
                const targetFile = await this.app.vault.create(filePath, fileContent);
                console.log(targetFile);
                await this.app.workspace.getUnpinnedLeaf().openFile(targetFile, { state: { mode: 'source' } });
            } catch (error) {
                new Notice (error);
            }
        }
        else{
            try {
                const targetFile = await this.app.vault.create(filePath, fileContent);
                console.log(targetFile);
            } catch (error) {
                new Notice (error);
            }
        }

        // if (options.openNote) {
        //     const activeLeaf = this.app.workspace.getUnpinnedLeaf();
        //     if (!activeLeaf) {
        //         console.warn('MDB | no active leaf, not opening newly created note');
        //         return;
        //     }
        //     await activeLeaf.openFile(targetFile, { state: { mode: 'source' } });
        // }
    }
}

// export interface CreateNoteOptions {
//     attachTemplate?: boolean;
//     attachFile?: TFile;
//     openNote?: boolean;
//     folder?: TFolder;
// }

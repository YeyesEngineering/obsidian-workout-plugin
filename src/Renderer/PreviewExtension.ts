import { EditorView, ViewPlugin } from '@codemirror/view';
import type { PluginValue } from '@codemirror/view';
import WorkoutPlugin from 'main';
import { Notice } from 'obsidian';
// import { ParseWorkout } from './Parser';

///TASK 충돌 해결 예정

export const PreviewExtension = () => {
    return ViewPlugin.fromClass(newPreviewExtension);
};

class newPreviewExtension implements PluginValue {
    private readonly view: EditorView;
    plugin: WorkoutPlugin;

    constructor(view: EditorView) {
        this.view = view;
        this.handleClickEvent = this.handleClickEvent.bind(this);
        this.view.dom.addEventListener('click', this.handleClickEvent);
    }

    public destroy(): void {
        this.view.dom.removeEventListener('click', this.handleClickEvent);
    }

    public handleClickEvent(event: MouseEvent): boolean {
        const { target } = event;

        // Only handle checkbox clicks.
        if (!target || !(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
            return false;
        }

        /* Right now Obsidian API does not give us a way to handle checkbox clicks inside rendered-widgets-in-LP such as
         * callouts, tables, and transclusions because `this.view.posAtDOM` will return the beginning of the widget
         * as the position for any click inside the widget.
         * For callouts, this means that the task will never be found, since the `lineAt` will be the beginning of the callout.
         * Therefore, produce an error message pop-up using Obsidian's "Notice" feature, log a console warning, then return.
         */

        // Tasks from "task" query codeblocks handle themselves thanks to `toLi`, so be specific about error messaging, but still return.
        const ancestor = target.closest('ul.plugin-tasks-query-result, div.callout-content');
        if (ancestor) {
            if (ancestor.matches('div.callout-content')) {
                // Error message for now.
                const msg =
                    'obsidian-tasks-plugin warning: Tasks cannot add or remove completion dates or make the next copy of a recurring task for tasks written inside a callout when you click their checkboxes in Live Preview. \n' +
                    'If you wanted Tasks to do these things, please undo your change, then either click the line of the task and use the "Toggle Task Done" command, or switch to Reading View to click the checkbox.';
                console.warn(msg);
                new Notice(msg, 45000);
            }
            return false;
        }

        const { state } = this.view;
        const position = this.view.posAtDOM(target);
        const line = state.doc.lineAt(position);
        //workout Main 부분도 추가 예정

        if (
            state.doc.line(2).text.startsWith('Today') &&
            state.doc.line(3).text.startsWith('Workout') &&
            state.doc.line(14).text === '# Today Workout List' &&
            line.text.endsWith('Set ')
        ) {
            console.log('okokookk');

            //체크
            event.preventDefault();
            const toggled = line.text.includes('- [ ]')
                ? line.text.replace('- [ ]', '- [x]')
                : line.text.replace('- [x]', '- [ ]');
            const transaction = state.update({
                changes: {
                    from: line.from,
                    to: line.to,
                    insert: toggled,
                },
            });
            this.view.dispatch(transaction);
            const desiredCheckedStatus = target.checked;
            setTimeout(() => {
                target.checked = desiredCheckedStatus;
            }, 1);

            return true;
        }

        return false;
    }
}

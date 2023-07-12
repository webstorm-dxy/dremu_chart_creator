import { IEditorContext } from "@/context/editor/editor";
import { TimelineAction, TimelineRow } from "@xzdarcy/react-timeline-editor";
import { cloneDeep } from "lodash";

export function getSelectedData(editorContext: IEditorContext, clone: boolean = true): TimelineRow[] {
    const data = clone ? cloneDeep(editorContext.timeline.data) : editorContext.timeline.data;
    return data.filter(row => {
        row.actions = row.actions.filter(action => action.selected);

        return row.actions.length > 0;
    });
}

export function getActionById(data: TimelineRow[], id: string, clone: boolean = true): TimelineAction {
    for (const row of data) {
        const action = row.actions.find(action => action.id === id);
        if (action) return clone ? cloneDeep(action) : action;
    }
}
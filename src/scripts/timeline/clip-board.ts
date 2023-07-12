import { IEditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { ISetAction } from "@/hooks/use-state-context";
import { TimelineRow } from "@xzdarcy/react-timeline-editor";
import { createMd5 } from "../utils/crypto/md5";


export function deleteByActionId(setAction: ISetAction<IEditorContext>, ids: string[]) {
    setRecordState(setAction, prev => {
        const data = prev.timeline.data;
        
        data.forEach(row => {
            row.actions = row.actions.filter(act => !ids.includes(act.id));
        });
    });
}

export function deleteSelected(setAction: ISetAction<IEditorContext>) {
    setRecordState(setAction, prev => {
        const data = prev.timeline.data;
        const selected = prev.editing.selected;
        
        data.forEach(row => {
            row.actions = row.actions.filter(act => !selected.has(act.id));
        });
    });
}

export function deleteActions(setAction: ISetAction<IEditorContext>, deleteData: TimelineRow[]) {
    setRecordState(setAction, prev => {
        const data = prev.timeline.data;
        
        deleteData.forEach(deleteRow => {
            const row = data.find(row => row.id === deleteRow.id);

            const deleteActionIds = deleteRow.actions.map(action => action.id);
            row.actions = row.actions.filter(action => !deleteActionIds.includes(action.id));   
        });
    });
}

export function copy(setAction: ISetAction<IEditorContext>, data: TimelineRow[]) {
    let startTime = Infinity;
    data.forEach(row => {
        row.actions = row.actions.sort((a, b) => a.start - b.start);
        startTime = Math.min(startTime, row.actions[0]?.start);
    });

    data.forEach(row => {
        row.actions.forEach(action => {
            action.start -= startTime;
            action.end -= startTime;
            action.id = createMd5();
            action.selected = false;
        });
    });

    setRecordState(setAction, prev => prev.clipBoard = data);
}

export function paste(setAction: ISetAction<IEditorContext>, startTime: number) {
    setRecordState(setAction, prev => {
        const data = prev.timeline.data;
        const pasteData = prev.clipBoard;
        pasteData.forEach(pasteRow => {
            const row = data.find(row => row.id === pasteRow.id);

            if(!row) return data.push(pasteRow);

            row.actions.push(...pasteRow.actions.map(action => {
                action.start += startTime;
                action.end += startTime;
                return action;
            }));
            // row.actions.sort()
        });
    });
}
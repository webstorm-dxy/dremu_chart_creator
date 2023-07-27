import { IEditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { ISetAction } from "@/hooks/use-state-context";
import { TimelineRow } from "@xzdarcy/react-timeline-editor";
import { createMd5 } from "../utils/crypto/md5";
import { cloneDeep } from "lodash";
import ChartData, { EventCreator } from "../chart-data/chart-data";
import { IChartAlphaEvent, IChartDotEvent, IChartLine, IChartMoveEvent, IChartNoteEvent, IChartRotateEvent, IChartTimingEvent } from "@/interfaces/chart-data/chart-data";
import Fraction from "fraction.js";
import { getSelectedData } from "./get-data";


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
        selected.clear();
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
            action.selected = false;
        });
    });

    setRecordState(setAction, prev => prev.clipBoard = data);
}

export function paste(setAction: ISetAction<IEditorContext>, startTime: number, targetLine?: IChartLine) {
    setRecordState(setAction, prev => {
        const data = prev.timeline.data;
        const pasteData = cloneDeep(prev.clipBoard);
        const chart = prev.chart;
        if (!chart) return;
        pasteData.forEach(pasteRow => {
            const row = data.find(row => row.id === pasteRow.id);

            if (!row) return data.push(pasteRow);

            pasteRow.actions.map(action => {
                const { event, type } = chart.getEventById(action.id);
                const line = targetLine || chart.data.lines.find(line => line[type].includes(event as any));
                let newEv;
                switch (type) {
                    case 'notes':
                        newEv = EventCreator.createNoteEvent(event as IChartNoteEvent);
                        break;
                    case 'alphas':
                        newEv = EventCreator.createAlphaEvent(event as IChartAlphaEvent);
                        break;
                    case 'dots':
                        newEv = EventCreator.createDotEvent(event as IChartDotEvent);
                        break;
                    case 'moves':
                        newEv = EventCreator.createMoveEvent(event as IChartMoveEvent);
                        break;
                    case 'rotates':
                        newEv = EventCreator.createRotateEvent(event as IChartRotateEvent);
                        break;
                    case 'timings':
                        newEv = EventCreator.createTimingEvent(event as IChartTimingEvent);
                        break;
                }
                newEv.id = createMd5();
                newEv.time = new Fraction(action.start + startTime);
                newEv.endTime &&= new Fraction(action.end + startTime);
                line[type].push(newEv);
            });
        });
        prev.editing.update = {};
    });
}
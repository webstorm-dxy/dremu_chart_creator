import { IEditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { ISetAction } from "@/hooks/use-state-context";
import { IChartAlphaEvent, IChartDotEvent, IChartEvent, IChartMoveEvent, IChartRotateEvent, IChartTimingEvent } from "@/interfaces/chart-data/chart-data";
import { clone } from "lodash";

export function glueEvent(setAction: ISetAction<IEditorContext>, eventId: string) {
    setRecordState(setAction, prev => {
        const { event, type, line } = prev.chart.getEventById(eventId);
        if (type === 'notes') return;
        if (!event || !type || !line) return;
        const lastEvent = (line[type].sort((a, b) => (a as IChartEvent).time.compare((b as IChartEvent).time)) as IChartEvent[])
            .findLast(ev => ev.time.compare(event.time) < 0);

        if(!lastEvent) return;

        prev.editing.update = {};

        switch (type) {
            case 'dots':
                return (event as IChartDotEvent).position = (lastEvent as IChartDotEvent).position
                    || (event as IChartDotEvent).position;
            case 'alphas':
                return (event as IChartAlphaEvent).from = (lastEvent as IChartAlphaEvent).to
                    || (event as IChartAlphaEvent).from;
            case 'moves':
                return (event as IChartMoveEvent).from = clone((lastEvent as IChartMoveEvent).to
                    || (event as IChartMoveEvent).from);
            case 'rotates':
                return (event as IChartRotateEvent).from = (lastEvent as IChartRotateEvent).to
                    || (event as IChartRotateEvent).from;
            case 'timings':
                return (event as IChartTimingEvent).speedRatio = (lastEvent as IChartTimingEvent).speedRatio
                    || (event as IChartTimingEvent).speedRatio;
        }

    });
}
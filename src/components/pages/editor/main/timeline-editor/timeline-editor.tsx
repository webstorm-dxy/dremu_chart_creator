import styles from './timeline-editor.module.scss';

import { EditorContext } from "@/context/editor/editor";
import { setRecordState } from "@/hooks/set-record-state";
import { useStateContext } from "@/hooks/use-state-context";
import { Timeline, TimelineAction, TimelineEditor as TimelineEditorProps, TimelineRow, TimelineState } from "@xzdarcy/react-timeline-editor";
import { throttle } from "lodash";
import { UserConfigContext } from "@/context/user-config";
import { useContext, useEffect, useMemo, useRef } from "react";
import useClassName from "@/hooks/use-class-name";
import { timelineEffectRenders } from '@/components/timeline-effect/effects';
import { MusicContext } from '@/context/editor/music';
import Fraction from 'fraction.js';
import { useDeepCompareEffect, useKeyPress, useMount, useRafInterval } from 'ahooks';
import { ChartNoteEventType, IChartEvent, IChartSustainEvent } from '@/interfaces/chart-data/chart-data.d';
import Tools from './tools';
import { createMd5 } from '@/scripts/utils/crypto/md5';
import { EventCreator } from '@/scripts/chart-data/chart-data';
import SelectedEffect from '@/components/timeline-effect/effects/selected-effect/selected-effect';
import { copy, deleteSelected, paste } from '@/scripts/timeline/clip-board';
import { getSelectedData } from '@/scripts/timeline/get-data';
import range from '@/scripts/utils/range';
import { glueEvent } from '@/scripts/timeline/edit-data';
import { NoteTypes } from '@/interfaces/chart-data/event/note/note.d';

function actionRender(action: TimelineAction, row: TimelineRow) {
    const effectRender = timelineEffectRenders[action.effectId]?.(action, row);
    if (action.selected) return <SelectedEffect action={action} row={row}>{effectRender}</SelectedEffect>;
    return effectRender;
}

export default function TimelineEditor() {
    const [editorContext, setEditorContext] = useStateContext(EditorContext);
    const [userConfigContext,] = useStateContext(UserConfigContext);
    const musicContext = useContext(MusicContext);

    const { editorConfigs, timeline } = editorContext;

    const timeOffset = editorContext.chart?.meta.offset / 1000 || 0;

    const timelineRef = useRef<TimelineState>(null);
    const rowListRef = useRef<HTMLDivElement>(null);

    const timelineScaleLength = useMemo(
        () => (editorContext.chart?.meta.bpm.toBeat(musicContext.state.duration).valueOf() || 0) + 20,
        [editorContext.chart?.meta.bpm, musicContext.state.duration]
    );

    function setBeat(beat: number | Fraction) {
        musicContext?.controls?.seek(editorContext.chart?.meta.bpm?.toTime(new Fraction(beat)) - timeOffset || 0);
    }

    function setScrollLeft(beat: number | Fraction) {
        const offset = Math.max(0, (beat instanceof Fraction ? beat.valueOf() : beat) * timeline.scaleWidth - 40);
        timelineRef.current?.setScrollLeft(offset);
    }

    const onChangeHandler = function <K extends 'notes' | 'dots' | 'moves' | 'alphas' | 'rotates' | 'timings'>(data: TimelineRow[]) {
        if (!editorContext.chart) return;
        setRecordState(setEditorContext, prev => {
            // prev.timeline.data = data;

            const line = prev.chart?.getLine(editorContext.editing.line);
            const newEvents: string[] = [];

            data.forEach(row => {
                const actions = row.actions;
                const keyName: K = row.id as K;

                function updateEvents<T extends IChartEvent>(events: T[], createFn: (attr?: Record<string, unknown>) => T): T[] {
                    return actions.sort((a, b) => a.start - b.start).map(action => {
                        let ev = events.find(ev => ev.id === action.id);

                        if (!ev) {
                            const attrs: Record<string | number | symbol, unknown> = { id: action.id };
                            switch (action.effectId) {
                                case 'note-0': attrs.type = ChartNoteEventType.Tap; break;
                                case 'note-1': attrs.type = ChartNoteEventType.Hold; break;
                                case 'note-2': attrs.type = ChartNoteEventType.Darg; break;
                                case 'note-3': attrs.type = ChartNoteEventType.Flick; break;
                            }
                            ev = createFn(attrs);
                            newEvents.push(ev.id);
                        }

                        ev.time = new Fraction(action.start);
                        if ((ev as unknown as IChartSustainEvent).endTime) (ev as unknown as IChartSustainEvent).endTime = new Fraction(action.end);
                        return ev;
                    });
                }

                if (keyName === 'notes')
                    line.notes = updateEvents(line.notes, EventCreator.createUnknownNoteEvent);
                else if (keyName === 'dots')
                    line.dots = updateEvents(line.dots, EventCreator.createDotEvent);
                else if (keyName === 'alphas')
                    line.alphas = updateEvents(line.alphas, EventCreator.createAlphaEvent);
                else if (keyName === 'moves')
                    line.moves = updateEvents(line.moves, EventCreator.createMoveEvent);
                else if (keyName === 'timings')
                    line.timings = updateEvents(line.timings, EventCreator.createTimingEvent);
                else if (keyName === 'rotates')
                    line.rotates = updateEvents(line.rotates, EventCreator.createRotateEvent);

            });

            prev.chart?.setLine(line.id, line);
            newEvents.forEach(id => {
                if (editorConfigs.createActionGlue) glueEvent(setEditorContext, id);
            });
            timeline.engine.reSetData(prev.timeline.data);
        });
    };

    const onClickActionHandler = (ev: React.MouseEvent<HTMLElement, MouseEvent>, { action }: { action: TimelineAction, row: TimelineRow }) => {
        setRecordState(setEditorContext, prev => {
            if (ev.shiftKey) {
                prev.editing.selected.add(action.id);
            } else {
                prev.editing.selected.clear();
                prev.editing.selected.add(action.id);
            }
            prev.timeline.data.forEach(row => {
                row.actions.forEach(act => prev.editing.selected.has(act.id) || (act.selected = false));
            });
            action.selected = true;
        });
    };

    const onDoubleClickRowHandler = (ev: React.MouseEvent<HTMLElement, MouseEvent>, { row, time }: { row: TimelineRow, time: number }) => {
        const { id: rowId } = row;
        const barLength = 1 / timeline.beatBar;
        time = editorConfigs.createActionSnip ? Math.round(time / barLength) * barLength : time;
        const id = createMd5();

        if (rowId === 'notes') {
            const isHold = editorConfigs.addNoteType === NoteTypes.Hold;
            return setRecordState(setEditorContext, prev => prev.timeline.data.find(r => r.id === rowId).actions.push({
                id,
                start: time,
                end: isHold ? time + barLength : time + 0.05,
                flexible: isHold,
                effectId: 'note-' + range(editorConfigs.addNoteType || 0, 0, 3),
            }));
        } if (rowId === 'dots')
            return setRecordState(setEditorContext, prev => prev.timeline.data.find(r => r.id === rowId).actions.push({
                id,
                start: time,
                end: time,
                flexible: false,
                effectId: 'dot',
            }));
        if (rowId === 'alphas')
            return setRecordState(setEditorContext, prev => prev.timeline.data.find(r => r.id === rowId).actions.push({
                id,
                start: time,
                end: time + barLength,
                effectId: 'alpha',
            }));
        if (rowId === 'moves')
            return setRecordState(setEditorContext, prev => prev.timeline.data.find(r => r.id === rowId).actions.push({
                id,
                start: time,
                end: time + barLength,
                effectId: 'move',
            }));
        if (rowId === 'rotates')
            return setRecordState(setEditorContext, prev => prev.timeline.data.find(r => r.id === rowId).actions.push({
                id,
                start: time,
                end: time + barLength,
                effectId: 'rotate',
            }));
        if (rowId === 'timings')
            return setRecordState(setEditorContext, prev => prev.timeline.data.find(r => r.id === rowId).actions.push({
                id,
                start: time,
                end: time,
                flexible: false,
                effectId: 'timing',
            }));
    };

    const onScrollHandler: TimelineEditorProps['onScroll'] = (ev) => {
        if (!rowListRef.current) return;
        rowListRef.current.style.marginTop = `-${ev.scrollTop}px`;
    };

    const updateTime = () => {
        const tLine = timelineRef.current;
        const musicRef = musicContext.ref.current;
        if (tLine && musicRef) {
            const bpm = editorContext.chart?.meta.bpm;
            editorContext.timeline.engine.setBeat(bpm?.toBeat(musicRef.currentTime + timeOffset) || 0, true, musicContext.state.paused);
            setScrollLeft(tLine.getTime());
        }
    };

    useMount(() => {
        editorContext.timeline.engine.on('beforeSetTime', ev => {
            setBeat(ev.time);
        });
    });

    useEffect(() => {
        const tLine = timelineRef.current;
        if (tLine) {
            const timeArea = tLine.target.firstChild;

            const wheelEvent = throttle((ev: WheelEvent) => {
                const offset = (ev.deltaY > 0 ? 0.5 : -0.5)
                    * (ev.altKey ? 2 : 1) // 转为方向
                    * (userConfigContext.editor.wheelInversion ? -1 : 1) // 反转方向
                    * (ev.shiftKey ? 2 : 1); // 加速
                ev.altKey
                    ? setRecordState(setEditorContext, prev => prev.timeline.scaleWidth = range(timeline.scaleWidth + -40 * offset, 40, 640))
                    : setBeat(Math.max(tLine.getTime() + offset, 0));
            }, 100);

            timeArea.addEventListener('wheel', wheelEvent);

            return () => {
                timeArea.removeEventListener('wheel', wheelEvent);
            };
        }
    }, [timelineRef.current]);

    useEffect(updateTime, [timelineRef.current]);

    useRafInterval(updateTime, 16.667);

    useEffect(() => {
        const line = editorContext.chart?.getLine(editorContext.editing.line);

        if (!line) return setRecordState(setEditorContext, prev => prev.timeline.data = []);

        setRecordState(setEditorContext, prev => {
            // prev.editing.selected.clear();
            prev.timeline.data = [
                {
                    id: 'notes',
                    classNames: [styles['timeline-notes-row']],
                    actions: line.notes.map((note) => {
                        const isHold = note.type === ChartNoteEventType.Hold;
                        return {
                            id: note.id,
                            start: isHold ? note.time.valueOf() : note.time.valueOf(),
                            end: isHold && note.endTime ? note.endTime.valueOf() : note.time.valueOf() + 0.05,
                            effectId: 'note-' + note.type,
                            selected: editorContext.editing.selected.has(note.id),
                            flexible: note.type === ChartNoteEventType.Hold
                        };
                    }),
                },
                {
                    id: 'dots',
                    actions: line.dots.map((dot) => {
                        const time = dot.time.valueOf();
                        return {
                            id: dot.id,
                            start: time,
                            end: time,
                            effectId: 'dot',
                            selected: editorContext.editing.selected.has(dot.id),
                            flexible: false
                        };
                    }),
                },
                {
                    id: 'moves',
                    actions: line.moves.map((move) => {
                        return {
                            id: move.id,
                            start: move.time.valueOf(),
                            end: move.endTime.valueOf(),
                            effectId: 'move',
                            selected: editorContext.editing.selected.has(move.id),
                        };
                    }),
                },
                {
                    id: 'alphas',
                    actions: line.alphas.map((alpha) => {
                        return {
                            id: alpha.id,
                            start: alpha.time.valueOf(),
                            end: alpha.endTime.valueOf(),
                            effectId: 'alpha',
                            selected: editorContext.editing.selected.has(alpha.id),
                        };
                    }),
                },
                {
                    id: 'rotates',
                    actions: line.rotates.map((rotate) => {
                        return {
                            id: rotate.id,
                            start: rotate.time.valueOf(),
                            end: rotate.endTime.valueOf(),
                            effectId: 'rotate',
                            selected: editorContext.editing.selected.has(rotate.id),
                        };
                    }),
                },
                {
                    id: 'timings',
                    actions: line.timings.map((timing) => {
                        const time = timing.time.valueOf();
                        return {
                            id: timing.id,
                            start: time,
                            end: time,
                            effectId: 'timing',
                            selected: editorContext.editing.selected.has(timing.id),
                            flexible: false,
                        };
                    }),
                }
            ];
        });
    }, [editorContext.editing.line, editorContext.editing.update]);

    useDeepCompareEffect(
        () => onChangeHandler(editorContext.timeline.data),
        [editorContext.timeline.data.map(row => row.actions.length)]
    );

    useKeyPress('ctrl.g', throttle(ev => {
        editorContext.editing.selected.forEach(val => glueEvent(setEditorContext, val));
        ev.preventDefault();
    }, 500), { exactMatch: true });

    useKeyPress('ctrl.x', throttle(() => {
        const data = getSelectedData(editorContext);
        copy(setEditorContext, data);
        deleteSelected(setEditorContext);
    }, 1000), { exactMatch: true });

    useKeyPress('delete', throttle(() => {
        deleteSelected(setEditorContext);
    }, 500), { exactMatch: true });

    useKeyPress('ctrl.c', throttle(() => {
        copy(setEditorContext, getSelectedData(editorContext));
    }, 1000), { exactMatch: true });

    useKeyPress('ctrl.v', throttle(() => {
        paste(
            setEditorContext,
            editorContext.timeline.engine.getTime(),
            editorContext.chart.getLine(editorContext.editing.line)
        );
    }, 1000), { exactMatch: true });

    useKeyPress('ctrl.d', throttle(ev => { setRecordState(setEditorContext, prev => { prev?.editing.selected.clear(); prev.editing.update = {}; }); ev.preventDefault(); }, 1000), { exactMatch: true });

    // // todo h-1/2 border-t-2
    return <div className="w-full h-1/2 relative border-t-2 border-gray-300 overflow-hidden">
        <Tools />
        <div className={useClassName("flex bg-gray-100", styles['timeline-box'])}>
            <div className='w-24 shadow'>
                <div className='h-8 mb-2 text-center leading-8 shadow'>轨道</div>
                <div className='h-full overflow-hidden relative'>
                    <div ref={rowListRef} className={useClassName('h-full', styles['row-list'])}>
                        {timeline.data.map(row => <div key={row.id} className="flex text-clip justify-end items-center pl-2 pr-2 transition-colors rounded-sm shadow-sm hover:bg-gray-200" style={{ height: row.rowHeight || timeline.rowHeight }}>{row.id}</div>)}
                    </div>
                </div>
            </div>
            <Timeline
                key={timeline.beatBar + timeline.rowHeight}
                ref={timelineRef}
                startLeft={32}
                editorData={editorContext.timeline.data}
                effects={editorContext.timeline.effects}
                onChange={onChangeHandler}
                style={{ width: '100%', height: '100%' }}
                engine={editorContext.timeline.engine}
                rowHeight={timeline.rowHeight}
                getActionRender={actionRender}
                autoScroll={true}
                scale={1}
                scaleSplitCount={timeline.beatBar}
                scaleWidth={timeline.scaleWidth}
                minScaleCount={timelineScaleLength}
                maxScaleCount={Number.MAX_SAFE_INTEGER}
                gridSnap={timeline.snip.gird}
                dragLine={timeline.snip.dragline}
                onDoubleClickRow={onDoubleClickRowHandler}
                onClickAction={onClickActionHandler}
                onScroll={onScrollHandler}
            />
        </div>
    </div>;
}
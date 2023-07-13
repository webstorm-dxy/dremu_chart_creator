import { TimelineAction, TimelineRow } from "@xzdarcy/react-timeline-editor";
import Image from "next/image";
import EventEffect from "./event/event";

export const NoteTap = (action: TimelineAction, row: TimelineRow) => {
    return <EventEffect>{
        (width, height) => <Image style={{ width: height + 'px' }} src="/image/note/tap.png" alt="note-tap" width={119} height={119} />
    }</EventEffect>;
};

export const NoteDarg = (action: TimelineAction, row: TimelineRow) => {
    return <EventEffect>{
        (width, height) => <Image style={{ width: height + 'px' }} src="/image/note/darg.png" alt="note-darg" width={82} height={82} />
    }</EventEffect>;
};

export const NoteFlick = (action: TimelineAction, row: TimelineRow) => {
    return <EventEffect>{
        (width, height) => <Image style={{ width: height + 'px' }} src="/image/note/flick.png" alt="note-flick" width={170} height={218} />
    }</EventEffect>;
};
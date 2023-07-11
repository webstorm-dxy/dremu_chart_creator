import { TimelineAction, TimelineRow } from "@xzdarcy/react-timeline-editor";
import Image from "next/image";

export const NoteTap = (action: TimelineAction, row: TimelineRow) => {
    
    
    return 
        <Image src="/image/note/tap.png" alt="note-tap" width={row.rowHeight || 0} height={row.rowHeight || 0}/>;
};

export const NoteDarg = (action: TimelineAction, row: TimelineRow) => {
    
    
    return <Image src="/image/note/darg.png" alt="note-darg" width={row.rowHeight || 0} height={row.rowHeight || 0}/>;
};

export const NoteFlick = (action: TimelineAction, row: TimelineRow) => {
    
    
    return <Image src="/image/note/flick.png" alt="note-flick" width={row.rowHeight || 0} height={row.rowHeight || 0}/>;
};
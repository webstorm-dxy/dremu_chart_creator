import { PLATES } from "@/pages/file-manager";
import { getRecent } from "@/scripts/utils/fs/recent-chart";
import type { FileEntry } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import FileList from "../../file-list/file-list";
import Filter from "../../filter/filter";
import Tools from "../../tools/tools";

export default function RecentlyFiles() {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [showFiles, setShowFiles] = useState(files);

    useEffect(() => {
        getRecent().then(setFiles);
    }, []);

    return <>
        <Filter set={setShowFiles} contents={files} filter={(contents: FileEntry[], v) => {
            return contents.filter(info => info.name.toLowerCase().includes(v.toLowerCase()));
        }} />
        <Tools plate={PLATES.RECENTLY}></Tools>
        <FileList showFiles={showFiles} sort={(a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1}></FileList>
    </>;
}
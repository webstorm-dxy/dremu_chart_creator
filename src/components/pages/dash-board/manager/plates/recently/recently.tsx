import { PLATES } from "@/pages/dash-board";
import { addRecent, deleteRecent, getRecent } from "@/scripts/utils/fs/recent-chart";
import { type FileEntry } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import FileList from "../../file-list/file-list";
import Filter from "../../filter/filter";
import Tools from "../../tools/tools";
import turnTo, { Pages } from "@/scripts/manager/page";
import Icon from "@/components/icon/icon";
import { Tooltip, Button } from "antd";
import dayjs from 'dayjs';

async function openChart(path: string, name: string) {
    await addRecent({ path, name });
    turnTo(Pages.EDITOR, { path });
}

export default function RecentlyFiles() {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [showFiles, setShowFiles] = useState(files);

    function readRecent() {
        getRecent().then(setFiles);
    }

    useEffect(() => {
        readRecent();
    }, []);

    const editBtnOnClickHandler = (item: FileEntry) => {
        openChart(item.path, item.name);
    };

    const deleteBtnOnClickHandler = async (item: FileEntry) => {
        await deleteRecent(item.path);
        readRecent();
    };

    return <>
        <Filter set={setShowFiles} contents={files} filter={(contents: FileEntry[], v) => {
            return contents.filter(info => info.name.toLowerCase().includes(v.toLowerCase()));
        }} />
        <Tools plate={PLATES.RECENTLY}></Tools>
        <FileList showFiles={showFiles} sort={(a, b) => dayjs(a.date).isAfter(b.date) ? -1 : 1}
            actions={(item, index) => [
                <Tooltip key={index} title='编辑'><Button size='small' onClick={() => editBtnOnClickHandler(item)}><Icon icon='pen' /></Button></Tooltip>,
                <Tooltip key={index} title='删除'><Button size='small' onClick={() => deleteBtnOnClickHandler(item)}><Icon icon='trash' /></Button></Tooltip>
            ]} />
    </>;
}
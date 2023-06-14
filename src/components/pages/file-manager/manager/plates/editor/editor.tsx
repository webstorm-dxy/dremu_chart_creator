import { BaseDirectory, createDir, FileEntry, readDir, removeFile, renameFile } from "@tauri-apps/api/fs";
import FileList from "../../file-list/file-list";
import { PLATES } from "@/pages/file-manager";
import EditorTools from "./tools/editor-tools";
import { useEffect, useMemo, useState } from "react";
import Filter from "../../filter/filter";
import Tools from "../../tools/tools";
import { Button, Input, Modal, Tooltip } from "antd";
import getPath from "@/scripts/utils/fs/get-path";
import Icon from "@/components/icon/icon";
import turnTo, { Pages } from "@/scripts/manager/page";
import { addRecent, deleteRecent } from "@/scripts/utils/fs/recent-chart";
import { removeDir } from "@/scripts/utils/fs/remove";


async function openChart(path: string, name: string) {
    await addRecent({ path, name });
    turnTo(Pages.EDITOR, { path });
}

export default function EditorFiles() {
    const [files, justSetFiles] = useState<FileEntry[]>([]);
    const [showFiles, setShowFiles] = useState<FileEntry[]>(files);
    const [path, justSetPath] = useState<string[]>([]);


    const pathStr = useMemo(() => path.join('/'), [path]);

    function setFiles(files: FileEntry[]) {
        justSetFiles(files);
        setShowFiles(files);
    }

    function setPath(path: string[] | ((prev: string[]) => string[])) {
        justSetPath(path);
        setShowFiles([]);
    }

    function readCharts() {
        readDir('chart/' + path.join('/'), { dir: BaseDirectory.Resource })
            .then(v => {
                v = v.filter(info => info.children || /^.*\.aec$/.test(info.name));

                setFiles(v);
            }).catch(() => { if (!path?.length) { createDir('chart/', { dir: BaseDirectory.Resource }); } });
    }

    function openPath(target: string) {
        setPath((prev: string[]): string[] => {
            target.trim();
            while (target.indexOf('../') !== -1) {
                target = target.replace('../', '');
                prev.pop();
            }

            const res = prev.concat(target.split('/')).filter(v => v && v !== '');
            return res;
        });
    }


    useEffect(() => {
        readCharts();
    }, [path]);

    const editBtnOnClickHandler = (item: FileEntry) => {
        openChart(getPath('chart', pathStr, item.name), item.name);
    };

    const renameBtnOnClickHandler = (item: FileEntry) => {
        let newName: string | null = null;
        Modal.confirm({
            title: '重命名',
            content: <Input onChange={(ev) => newName = ev.target.value} defaultValue={item.name} />,
            onOk: () => {
                if (newName && newName !== item.name)
                    renameFile(getPath('chart', pathStr, item.name), getPath('chart', pathStr, newName), { dir: BaseDirectory.Resource })
                        .then(() => readCharts());
            }
        });
    };

    const deleteBtnOnClickHandler = (item: FileEntry) => {
        Modal.confirm({
            title: '删除',
            content: `确定删除 ${item.name} 吗？`,
            onOk: async () => {
                const path = getPath('chart', pathStr, item.name);
                await deleteRecent(path);
                await (item.children 
                    ? removeDir(path, { dir: BaseDirectory.Resource }) 
                    : removeFile(path, { dir: BaseDirectory.Resource }));
                readCharts();
            }
        });
    };

    return <>
        <Filter set={setShowFiles} contents={files} filter={(contents: FileEntry[], v) => {
            return contents.filter(info => info.name.toLowerCase().includes(v.toLowerCase()));
        }} />
        <Tools plate={PLATES.EDITOR} path={path} setPath={setPath}
            tools={<EditorTools readCharts={readCharts} path={path} />} />
        <FileList openDir={openPath} showFiles={showFiles} path={path}
            actions={(item, index) => [
                !item.children && <Tooltip key={index} title='编辑'><Button size='small' onClick={() => editBtnOnClickHandler(item)}><Icon icon='pen' /></Button></Tooltip>,
                <Tooltip key={index} title='重命名'><Button size='small' onClick={() => renameBtnOnClickHandler(item)}><Icon icon='pen-to-square' type='solid' /></Button></Tooltip>,
                <Tooltip key={index} title='删除'><Button size='small' onClick={() => deleteBtnOnClickHandler(item)}><Icon icon='trash' /></Button></Tooltip>
            ]} />
    </>;
}
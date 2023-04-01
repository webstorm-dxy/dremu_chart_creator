import { BaseDirectory, createDir, FileEntry, readDir } from "@tauri-apps/api/fs";
import FileList from "../../file-list/file-list";
import { PLATES } from "@/pages/file-manager";
import EditorTools from "./tools/editor-tools";
import { useEffect, useState } from "react";
import Filter from "../../filter/filter";
import Tools from "../../tools/tools";



export default function EditorFiles() {
    const [files, justSetFiles] = useState<FileEntry[]>([]);
    const [showFiles, setShowFiles] = useState<FileEntry[]>(files);
    const [path, setPath] = useState<string[]>([]);


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

    function setFiles(files) {
        justSetFiles(files);
        setShowFiles(files);
    }

    useEffect(() => {
        readCharts();
    }, [path]);

    return <>
        <Filter set={setShowFiles} contents={files} filter={(contents: FileEntry[], v) => {
            return contents.filter(info => info.name.toLowerCase().includes(v.toLowerCase()));
        }} />
        <Tools plate={PLATES.EDITOR} path={path} setPath={setPath}
            tools={<EditorTools readCharts={readCharts} path={path} />}/>
        <FileList openDir={openPath} showFiles={showFiles} path={path}></FileList>
    </>;
}
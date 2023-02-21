import { BaseDirectory, readDir } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import Filter from "./filter/filter";
import styles from "./manager.module.scss";

export default function Manager() {
    const [files, setFiles] = useState([]);
    const [showFiles, setShowFiles] = useState(files);
    
    useEffect(() => {
        readDir('chart/', {dir: BaseDirectory.Resource})
            .then(v => { setFiles(v); });
    }, []);

    return <div className={styles.manager}>
        <Filter set={setShowFiles} contents={files} filter={(v, i, arr) => { return arr; }}></Filter>
    </div>;
}
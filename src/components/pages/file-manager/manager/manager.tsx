import styles from "./manager.module.scss";
import { ManagerProps } from './manager.d';
import EditorFiles from "./plates/editor/editor";
import RecentlyFiles from "./plates/recently/recently";
import Toolbox from "./plates/toolbox/toolbox";


const Plates = {
    recently: RecentlyFiles,
    editor: EditorFiles,
    toolbox: Toolbox,
};



export default function Manager({ plate }: ManagerProps) {
    const Manager = Plates[plate];

    return <div className={styles.manager}>
        {<Manager />}
    </div>;
}
import styles from "./manager.module.scss";
import { ManagerProps } from './manager.d';
import EditorFiles from "./plates/editor/editor";
import RecentlyFiles from "./plates/recently/recently";
import Toolbox from "./plates/toolbox/toolbox";
import FileSystem from "./plates/file-system/file-system";
import Doc from "@/pages/doc";
import Settings from "@/components/settings/settings";

/** 模块对应的组件 */
const Plates = {
    recently: RecentlyFiles,
    editor: EditorFiles,
    fileSystem: FileSystem,
    toolbox: Toolbox,
    doc: () => <Doc disabledOpenInNewWindow />,
    settings: Settings
};

/** 加载模块的组件 */
export default function Manager({ plate }: ManagerProps) {
    // 获取当前模块
    const Manager = Plates[plate];

    return <div className={styles.manager}>
        {<Manager />}
    </div>;
}
import { RecentChart } from "@/scripts/utils/fs/recent-chart";
import { FileInfo } from "@interfaces/file/file-info";

export interface FileListProps {
    showFiles: FileInfo[];
    openDir?: Function;
    path?: string[];
    sort?: (a: RecentChart, b: RecentChart) => number;
}
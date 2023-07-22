import { ReactNode } from "react";

export interface ToolsProps {
    tools?: ReactNode;
    setPath?: Function;
    path?: string[];
    plate: string;
}
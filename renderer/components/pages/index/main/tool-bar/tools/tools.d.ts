import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";

export type Tools = ToolInfo[];

export interface ToolInfo {
    name: Tool;
    icon?: IconProp
    onClick: React.MouseEventHandler;
}
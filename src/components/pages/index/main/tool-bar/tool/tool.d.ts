import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import {Tool} from '../tool-bar';


export type ToolProps = React.PropsWithChildren<{
    onClickHandler?: React.MouseEventHandler;
    name: Tool;
    icon?: IconProp;
}>;
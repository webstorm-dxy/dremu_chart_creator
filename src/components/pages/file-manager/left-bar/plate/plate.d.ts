import { MouseEventHandler, PropsWithChildren } from "react";
import type Icon from '@components/icon';
import FCState from "@interfaces/function-component-state";

export type PlateProps = PropsWithChildren<{
    children?: string;
    name: string;
    icon?: Icon;
    cls?: string;
    active?: boolean;
    info?: string|number;
    setPlate: Function;
    activePlate?: string;
}>

export interface PlateState {
    active: boolean;
}
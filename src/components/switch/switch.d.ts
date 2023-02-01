import React, { Dispatch } from "react";

export interface SwitchProps{
    checked: boolean;
    disabled?: boolean;
    onChangeHandler?: React.MouseEventHandler & ((ev: React.MouseEvent, setDisabled: Dispatch<React.SetStateAction<SwitchState['disabled']>>)=>void);
}

export interface SwitchState{
    checked: boolean;
    disabled: boolean;
}
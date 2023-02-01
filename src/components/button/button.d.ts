import React from 'react';


export type ButtonProps = React.PropsWithChildren<{
    noShadow?: boolean;
    onClickHandler?: (ev: React.MouseEvent, showed?: boolean)=>void;
    menu?: JSX.Element;
    showMenu?: boolean;
    cls?: string;
}>;

export interface ButtonState{
    showMenu: boolean;
    menu?: JSX.Element; 
}
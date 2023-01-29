import './switch.module.scss';

import React, { useState } from 'react';
import { SwitchProps } from './switch.d';


export default function Switch(props: SwitchProps) {
    const [checked, setChecked] = useState(props.checked || false);
    const [disabled, setDisabled] = useState(props.disabled || false);

    function onClickHandler(ev: React.MouseEvent) {
        if (disabled) { return; }
        const { onChangeHandler } = props;

        setChecked(!checked);

        if (onChangeHandler) {
            onChangeHandler(ev, setDisabled);
        }
    }

    return <span className={"switch" + (checked ? ' checked' : '') + (disabled ? ' disabled' : '')} data-checked={checked} onClick={onClickHandler}><span className="switch-thumb"></span></span>;
}
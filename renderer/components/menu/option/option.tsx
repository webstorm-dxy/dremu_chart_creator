import './option.module.scss';

import React, { useState } from 'react';
import { OptionProps } from './option.d';
import Switch from '@components/switch/switch';


export default function Option(props: OptionProps) {
    const { children } = props;
    const [checked, setChecked] = useState(props.checked);
    const [disabled, setDisabled] = useState(props.disabled || false);
    const onClickHandler = disabled ? () => { }
        : typeof checked === 'boolean'
            ? (ev: React.MouseEvent) => {
                setChecked(!checked);
                props.onClickHandler ? props.onClickHandler(ev, !checked) : null;
            }
            : props.onClickHandler;

    return <div className={"option" + (disabled ? ' disabled' : '')} onClick={onClickHandler}><span className="option-content">{children}</span>{typeof checked === 'boolean' && <Switch key={`${checked}`} checked={checked}></Switch>}</div>;
}
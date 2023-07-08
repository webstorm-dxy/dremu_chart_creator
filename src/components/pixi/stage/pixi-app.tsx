import styles from './pixi-app.module.scss';

import { Stage, useApp } from "@pixi/react";
import useClassName from '@hooks/use-class-name';
import { useEffect } from 'react';
import { PropsWithChildren } from "react";
import { _ReactPixi } from "@pixi/react";
import { omit } from 'lodash';

export type PixiAppProps = PropsWithChildren<_ReactPixi.IStage & { paused?: boolean}>

interface IPauserProps {
    paused: boolean;
}

function AppManager({ paused = false }: IPauserProps) {
    const app = useApp();

    useEffect(() => { app.view.removeAttribute('style'); }, [app.view.style]);

    useEffect(() => {
        if (paused) app.stop();
        else app.start();
    }, [paused]);

    return null;
}

export default function PixiApp(props: PixiAppProps) {
    const className = useClassName(styles['pixi-app'], props.className);

    return <Stage {...omit(props, 'paused')} className={className}>
        <AppManager paused={props.paused}/>
        {props.children}
    </Stage>;
}
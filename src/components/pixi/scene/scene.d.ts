import type { _ReactPixi } from "@pixi/react";


export type SceneProps = React.PropsWithChildren<{
    name: string;
    viewWidth: number;
    viewHeight: number;
}> & _ReactPixi.IContainer;
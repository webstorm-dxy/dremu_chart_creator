import type { _ReactPixi } from "@inlet/react-pixi";


export type SceneProps = React.PropsWithChildren<{
    name: string;
    viewWidth: number;
    viewHeight: number;
}> & _ReactPixi.IContainer;
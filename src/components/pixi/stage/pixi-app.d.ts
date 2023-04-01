import { PropsWithChildren } from "react";
import { _ReactPixi } from "@pixi/react";

export type PixiAppProps = PropsWithChildren<_ReactPixi.IStage & {cls?: string}>
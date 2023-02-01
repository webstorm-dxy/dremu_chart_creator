import { PropsWithChildren } from "react";
import { _ReactPixi } from "@inlet/react-pixi";

export type PixiAppProps = PropsWithChildren<_ReactPixi.IStage & {cls?: string}>
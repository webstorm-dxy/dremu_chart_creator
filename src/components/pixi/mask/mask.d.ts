import { PropsWithChildren } from "react";
import {GraphicsMaskProps} from './graphics-mask/graphics-mask.d';
import {TextureMaskProps} from './texture-mask/texture-mask.d';


export type MaskProps = PropsWithChildren<{
    draw?: GraphicsMaskProps['draw'];
    texture?: TextureMaskProps['texture'];
}>
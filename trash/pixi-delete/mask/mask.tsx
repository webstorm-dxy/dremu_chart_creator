import GraphicsMask from './graphics-mask/graphics-msak';
import TextureMask from './texture-mask/texture-mask';
import { MaskProps } from './mask.d';
import { useMemo } from 'react';

export default function Mask({ draw, texture, children }: MaskProps) {
    const mask = useMemo(() => {
        if (draw) {
            return <GraphicsMask draw={draw}>{children}</GraphicsMask>;
        } else if (texture) {
            return <TextureMask texture={texture}>{children}</TextureMask>;
        }

        return children;
    }, [draw, texture, children]);

    return mask as JSX.Element;
}

export {GraphicsMask, TextureMask};
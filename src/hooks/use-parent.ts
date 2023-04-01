import { cloneElement, ReactElement, useMemo } from "react";

export default function useParent(parent: ReactElement, ...children: ReactElement[]) :ReactElement {
    if (children.length === 0) return parent;
    return useMemo(() => cloneElement(parent, {}, ...children), [parent, children]);
}
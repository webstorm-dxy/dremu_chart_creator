import useClassName from "@/hooks/use-class-name";
import { PropsWithChildren } from "react";

export type IEventProps = PropsWithChildren<{
    className?: string;
}>;

export default function Event({children, className}: IEventProps) {
    
    return <div className={useClassName('absolute left-1/2 -translate-x-1/2', className)}>{children}</div>;
}
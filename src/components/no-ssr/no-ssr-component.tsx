import { PropsWithChildren } from "react";

export default function NoSsrComponent(props: PropsWithChildren) {
    
    
    return <>{props.children}</>;
}
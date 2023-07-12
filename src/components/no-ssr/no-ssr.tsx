import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const NoSsrComponent = dynamic(async() => (await import('./no-ssr-component')).default, {ssr: false});

export default function NoSsr(props: PropsWithChildren) {
    
    
    return <NoSsrComponent>{props.children}</NoSsrComponent>;
}
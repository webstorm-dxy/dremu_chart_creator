"use client";

import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";


const DisableSSR = dynamic(
    () => import('./disable-ssr'),
    {ssr: false,}
);



export default function NoSSR({children}: PropsWithChildren) {
    /**
     * @description 用于关闭 ssr 渲染，保证开发时需要浏览器运行时的库可以获取到正确运行时
     */
    
    return <DisableSSR>{children}</DisableSSR>;
}
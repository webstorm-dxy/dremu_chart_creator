import useClassName from "@/hooks/use-class-name";
import { Tabs, TabsProps } from "antd";
import { omit } from "lodash";

export interface ITabsWindowProps extends TabsProps {
    divClassName: string;
}

export default function TabsWindow(props: ITabsWindowProps) {
    return <div className={useClassName('pl-2 pr-2', props.divClassName)}>
        <Tabs {...omit(props, 'divClassName')} className={useClassName('h-full w-full overflow-hidden', props.className)}/>
    </div>;
}
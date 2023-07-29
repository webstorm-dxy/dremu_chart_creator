import { Button } from "antd";
import { ToolProps } from './tool.d';


export default function Tool(props: ToolProps) {


    return <Button size="small" type="text" {...props}></Button>;
}
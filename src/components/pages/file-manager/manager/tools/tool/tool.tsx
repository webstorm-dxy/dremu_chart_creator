import styles from './tool.module.scss';

import Button from "@components/button/button";
import {ToolProps} from './tool.d';


export default function Tool(props: ToolProps) {
    
    
    return <Button cls={styles.tool} {...props}></Button>;
}
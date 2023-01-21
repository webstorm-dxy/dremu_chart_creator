import styles from './tool.module.scss';

import { useContext } from 'react';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { ToolProps } from './tool.d';
import Button from '@components/button/button';
import { GlobalContext } from '../../main';


export default function Tool(props: ToolProps) {
    const { icon, name, children } = props;
    const { tool, setTool } = useContext(GlobalContext);

    const onClickHandler = (e) => {
        const { onClickHandler } = props;
        setTool(name);

        onClickHandler ? onClickHandler(e) : null;
    };

    return <Button className={styles.tool + (tool === name ? ' ' + styles.active : '')} onClickHandler={onClickHandler}>
        {/* {icon && <FontAwesomeIcon icon={icon} />} */}
        {children}
    </Button>;
}
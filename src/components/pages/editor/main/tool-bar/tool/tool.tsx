import styles from './tool.module.scss';

import { useContext } from 'react';
import { ToolProps } from './tool.d';
import Button from '@components/button/button';
import { mainContext } from '../../main';
import useClassName from '@hooks/use-class-name';
import Icon from '@components/icon/icon';


export default function Tool(props: ToolProps) {
    const { icon, name, children } = props;
    const { tool, setTool } = useContext(mainContext);

    const onClickHandler = (e) => {
        const { onClickHandler } = props;
        setTool(name);

        onClickHandler ? onClickHandler(e) : null;
    };

    return <Button cls={useClassName(styles.tool, tool === name ? styles.active : '')} onClick={onClickHandler}>
        {icon && <Icon icon={icon} />}
        {children}
    </Button>;
}
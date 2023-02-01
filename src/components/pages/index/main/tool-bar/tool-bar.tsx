import styles from './tool-bar.module.scss';

import React from 'react';
import {ToolBarProps, ToolBarState, Tool as ToolType} from './tool-bar.d';
import Tool from './tool/tool';
import tools from './tools/tools';



export default class ToolBar extends React.Component {
    props: Readonly<ToolBarProps>;
    state: Readonly<ToolBarState>;
    
    private constructor(props: ToolBarProps){
        super(props);
        this.state = {tool: props.tool || 'mouse'};
    }
    getTool(): ToolType{
        return this.state.tool;
    }
    render() {
        return <div className={styles['tool-bar']}>
            {tools.map(tool => <Tool key={tool.name} name={tool.name} icon={tool.icon} onClickHandler={tool.onClick}>{tool.name}</Tool>)}
        </div>;
    }
}
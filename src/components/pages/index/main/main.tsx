import styles from './main.module.scss';

import React, { SetStateAction, useState } from 'react';
import Toolbar from './tool-bar/tool-bar';
import { Tool } from './tool-bar/tool-bar.d';
import {Context} from '@interfaces/hooks/context/context';


export const GlobalContext = React.createContext({
    tool: 'mouse',
    setTool: (()=>{}) as React.Dispatch<SetStateAction<Tool>>,
});

export default function Main() {
    const [tool, setTool]: [Tool, React.Dispatch<React.SetStateAction<Tool>>] = useState('mouse');

    return <div className={styles.main}>
        <GlobalContext.Provider value={{tool, setTool}}>
            <Toolbar tool={tool}></Toolbar>
        </GlobalContext.Provider>
    </div>;
}
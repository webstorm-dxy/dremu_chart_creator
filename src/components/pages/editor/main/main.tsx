import styles from './main.module.scss';

import { Context, createContext, useState } from 'react';
// import Toolbar from './tool-bar/tool-bar';
import { Tool } from './tool-bar/tool-bar.d';
import FCState from '@interfaces/function-component-state';
import {MainContext} from './main.d';
import ContentBar from './content-bar/content-bar';
import PreviewView from './preview/preview-view';


export const mainContext: Context<MainContext> = createContext({
    tool: 'mouse',
    setTool: ()=>{},
});

export default function Main() {
    const [tool, setTool]: FCState<Tool> = useState('mouse');

    return <div className={styles.main}>
        <mainContext.Provider value={{tool, setTool}}>
            {/* <Toolbar tool={tool}></Toolbar> */}
            <ContentBar />
            <div className={styles['main-view']}>
                <PreviewView />
            </div>
        </mainContext.Provider>
    </div>;
}
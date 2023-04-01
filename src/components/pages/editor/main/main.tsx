import styles from './main.module.scss';

import { Context, createContext, createRef, RefObject, useContext, useState } from 'react';
import Toolbar from './tool-bar/tool-bar';
import { Tool } from './tool-bar/tool-bar.d';
import { Slider } from 'antd';
import FCState from '@interfaces/function-component-state';
import {MainContext} from './main.d';
import { editorContext } from 'pages/editor';


export const mainContext: Context<MainContext> = createContext({
    tool: 'mouse',
    setTool: ()=>{},
});

export default function Main() {
    const [tool, setTool]: FCState<Tool> = useState('mouse');
    const {musicUrl} = useContext(editorContext);
    const musicRef: RefObject<HTMLAudioElement> = createRef();

    return <div className={styles.main}>
        <mainContext.Provider value={{tool, setTool}}>
            <audio ref={musicRef} src={musicUrl} controls></audio>
            <Toolbar tool={tool}></Toolbar>
            <div className={styles['main-view']}>
                <div className={styles['music-slide']}>
                    <Slider value={musicRef.current?.currentTime} min={0} max={musicRef.current?.duration} className={styles.slider} onChange={(value) => {
                        if(musicRef.current) musicRef.current.currentTime = value;
                        console.log(musicRef);
                        
                    }}/>
                    <span></span>
                </div>
            </div>
        </mainContext.Provider>
    </div>;
}
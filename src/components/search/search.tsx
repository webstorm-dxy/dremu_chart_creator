import styles from './search.module.scss';

import useClassName from '@hooks/use-class-name';
import { SearchProps } from './search.d';
import { createRef, RefObject, useEffect } from 'react';


export default function Search(props: SearchProps) {
    const { contents, filter } = props;
    const ref: RefObject<HTMLInputElement> = createRef();

    function search(params: string[]) {
        let res = contents;

        params.forEach((v, i, arr) => {
            res = filter(contents, v, i, arr);
        });

        props.set(res);
    }

    function onInputHandler(ev: React.FormEvent<HTMLInputElement>) {
        const target = ev.target as HTMLInputElement;
        const value = target.value.replace(/[ \n\r]{2,}/g, ' ');
        const params = value.trim().split(' ').filter(v => v !== '' && v);
        search(params);
    }

    useEffect(()=>{
        const params = ref.current?.value.trim().split(' ') || [];
        
        search(params);
    }, [contents]);

    return <input ref={ref} className={useClassName(styles.input, props.className)} type="text" onInput={onInputHandler}></input>;
}
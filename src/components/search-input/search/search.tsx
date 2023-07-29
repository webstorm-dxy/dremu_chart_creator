import styles from './search.module.scss';

import useClassName from '@hooks/use-class-name';
import { SearchProps } from './search.d';
import { ChangeEvent, useEffect, useState } from 'react';
import { Input } from 'antd';


export default function Search(props: SearchProps) {
    const { contents, filter } = props;
    const [value, setValue] = useState<string>('');

    function search(params: string[]) {
        let res = contents;

        params.forEach((v, i, arr) => {
            res = filter(contents, v, i, arr);
        });

        props.set(res);
    }

    const onChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.currentTarget.value.replace(/[ \n\r]{2,}/g, ' '));
    };

    useEffect(()=>{
        const params = value.trim().split(' ') || [];
        
        search(params);
    }, [contents, value]);

    return <Input className={useClassName(styles.input, props.className)} type="text" onChange={onChangeHandler}></Input>;
}
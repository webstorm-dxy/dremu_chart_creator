import styles from './search.module.scss';

import useClassName from '@hooks/use-class-name';
import {SearchProps} from './search.d';


export default function Search(props: SearchProps) {
    const {contents} = props;

    function onInputHandler(ev: React.FormEvent<HTMLInputElement>) {
        const target = ev.target as HTMLInputElement;
        const value = target.value.replace(/[ \n\r]{2,}/g, ' ');
        const params = value.trim().split(' ').filter(v => v !== '' && v);

        let res = contents;

        // function includes(value: string|number, has: string|number) {
        //     value = value.toString();
        //     has = has.toString();

        //     return value.includes(has);
        // }

        params.forEach((v, i, arr) => {
            res = props.filter(v, i, arr);
        });
        props.set(res);
    }

    return <input className={useClassName(styles.input, props.className)} type="text" onInput={onInputHandler}></input>;
}
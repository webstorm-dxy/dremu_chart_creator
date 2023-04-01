import styles from './search-input.module.scss';

import Icon from "@components/icon/icon";
import { SearchInputProps, SearchInputState } from './search-input.d';
import { FormEvent, useState } from 'react';
import FCState from '@interfaces/function-component-state';
import Button from '@components/button/button';
import Search from '@components/search/search';

export default function SearchInput(props: SearchInputProps) {
    const { defaultValue, placeHolder, max, min, onInput, onSearch, set, contents, filter } = props;
    const [value, setValue]: FCState<SearchInputState['value']> = useState(props.value) as FCState<SearchInputState['value']>;

    const onInputHandler = (e: FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;

        setValue(input.value);
        onInput && onInput(e);
    };
    const onSearchHandler = (e, value) => {
        onSearch && onSearch(e, value);
    };

    return <div className={styles['search-input']}>
        <Search
            set={set}
            contents={contents}
            filter={filter}
            defaultValue={defaultValue}
            value={value}
            placeholder={placeHolder}
            max={max}
            min={min}
            onInput={onInputHandler}
            onKeyDown={(e) => { e.key === 'Enter' && onSearchHandler(e, value); }}/>
        <Button cls={styles.search} onClick={(e) => { onSearchHandler(e, value); }}>
            <Icon icon='magnifying-glass' type="solid"></Icon>
        </Button>
    </div>;
}
import styles from './filter.module.scss';

import SearchInput from "@components/search-input/search-input";
import {FilterProps} from './filter.d';

export default function Filter(props: FilterProps) {
    const {set, contents, filter} = props;
    
    return <div className={styles.filter}>
        <SearchInput placeHolder='搜索文件' set={set} contents={contents} filter={filter}></SearchInput>
    </div>;
}
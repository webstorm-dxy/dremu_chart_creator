import styles from './filter.module.scss';

import SearchInput from "@components/search-input/search-input";

export default function Filter() {
    
    
    return <div className={styles.filter}>
        <SearchInput placeHolder='搜索文件'></SearchInput>
    </div>;
}
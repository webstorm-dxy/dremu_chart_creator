import styles from './header.module.scss';

import HeaderMenu from '@components/header-menu/header-menu';


export default function Header() {

    return <div className={styles.header}>
        <HeaderMenu></HeaderMenu>
    </div>;
}
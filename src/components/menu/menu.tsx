import styles from './menu.module.scss';

import React from 'react';
import { MenuProps } from './menu.d';
import Option from './option/option';
import MenuHr from './hr/menu-hr';


export default function Menu({ onBlurHandler, children }: MenuProps) {


    return <div className={styles.menu} onBlur={onBlurHandler || (() => { })}> <div className={styles["menu-box"]}>{children}</div></div >;
}

export { Option, MenuHr };

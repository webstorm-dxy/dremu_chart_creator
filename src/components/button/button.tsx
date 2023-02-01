import styles from './button.module.scss';

import React from 'react';
import { ButtonProps, ButtonState } from './button.d';
import useClassName from '@hooks/use-class-name';



export default class Button extends React.Component {
    props: Readonly<ButtonProps>;
    state: Readonly<ButtonState>;

    constructor(props: ButtonProps) {
        super(props);
        const { menu, showMenu } = props;
        this.state = {
            menu,
            showMenu: showMenu || false,
        };
    }
    onClickHandler = (ev: React.MouseEvent) => {
        if (ev.currentTarget !== ev.target) { return; }
        const { showMenu } = this.state;
        const { onClickHandler } = this.props;

        this.setState({ showMenu: !showMenu });
        onClickHandler ? onClickHandler(ev, !showMenu) : null;
    };
    onMenuBlur = () => {
        this.setState({ showMenu: false });
    };
    render() {
        const {noShadow, cls} = this.props;
        const { showMenu, menu } = this.state;

        return (<span {...this.props} className={useClassName(styles.button, noShadow ? styles['no-shadow'] : '', cls)} onClick={this.onClickHandler}>
            <span className={styles.content}>{this.props.children}</span>
            {showMenu && menu}
        </span>);
    }
}
import styles from './icon.module.scss';

import useClassName from "@hooks/use-class-name";
import { IconProps } from './icon.d';

export default function Icon({ icon, type, fillType, sty }: IconProps) {
    /**
     * @param icon 图标库内图标名
     * @param type 图标样式 只能用brands和solid
     * @param fillType 填充还是不填充 classic 或 sharp
     */
    return <span className={styles['icon-box']} style={sty}>
            <i className={useClassName(styles.icon, 'fa', 'fa-' + icon, type ? 'fa-' + type : '', fillType === 'sharp' ? 'fa-sharp' : '')}></i>
        </span>;
}
import styles from './plate.module.scss';

import useClassName from "@hooks/use-class-name";
import { PlateProps, PlateState } from './plate.d';

export default function Plate({ cls, name, icon, active, activePlate, children, info, setPlate }: PlateProps) {
    if(activePlate === name) { active = true; }

    return <div className={useClassName(styles.plate, active ? styles.active : '', cls)}
        onClick={() => { setPlate(name); }}>
        <span className={styles.icon}>
            {icon}
        </span>
        <span className={styles.name}>{children}</span>
        <span className={styles.info}>{info}</span>
    </div>;
}
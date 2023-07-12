import Icon from '@components/icon/icon';
import Image from 'next/image';
import styles from './left-bar.module.scss';
import Plate from './plate/plate';
import { LeftBarProps } from './left-bar.d';
import Link from 'next/link';
import { createWindow } from '@scripts/manager/window-manager';
import { PLATES } from '@/pages/file-manager';
import useClassName from '@/hooks/use-class-name';



export default function LeftBar({ plate, setPlate }: LeftBarProps) {


    return <div className={useClassName(styles['left-bar'], 'shadow-lg z-10')}>
        <div className={styles.icon} onClick={() => {
            createWindow('about', {
                url: '/about',
                width: 720,
                height: 520,
                center: true,
                resizable: false,
            });
        }}>
            <Image className={styles['icon-img']} src="/icon-light.svg" alt='图标' width={2.5 * 16} height={2.5 * 16}></Image>
            <h5 className={styles.title}> Re: AstEdit </h5>
        </div>

        <div className={styles['plate-list']}>
            <Plate name={PLATES.RECENTLY} icon={<Icon icon='clock-rotate-left'></Icon>} activePlate={plate} setPlate={setPlate}>最近</Plate>
            <Plate name={PLATES.EDITOR} icon={<Icon icon='folder'></Icon>} activePlate={plate} setPlate={setPlate}>制谱器</Plate>
            <Plate name={PLATES.FILE_SYSTEM} icon={<Icon icon='cloud'></Icon>} activePlate={plate} setPlate={setPlate}>文件系统</Plate>
            <Plate name={PLATES.TOOLBOX} icon={<Icon icon='toolbox'></Icon>} activePlate={plate} setPlate={setPlate}>工具</Plate>
            {/* <Plate name='college' icon={<Icon icon='star' type='solid'></Icon>} activePlate={plate} setPlate={setPlate}>收藏</Plate> */}
            {/* <Link href='/editor'>editor</Link>
            <Link href='preview'>preview</Link> */}
        </div>
    </div>;
}
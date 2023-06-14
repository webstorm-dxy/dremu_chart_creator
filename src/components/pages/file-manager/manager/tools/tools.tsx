import styles from './tools.module.scss';
import { ToolsProps } from './tools.d';
import { Breadcrumb } from 'antd';
import { usePartial } from '@/hooks/use-partial';


enum PlateChinese {
    editor = '制谱器',
    recently = '最近'
}


export default function Tools({ path, setPath, tools, plate }: ToolsProps) {
    // 处理空值
    [setPath, path] = usePartial([setPath, path], [() => {}, []]);

    return <div className={styles.tools}>
        <div>
            <Breadcrumb>
            <Breadcrumb.Item onClick={() => { setPath([]); }}>{PlateChinese[plate] || plate}</Breadcrumb.Item>
                {path.map((dir, i, arr) => <Breadcrumb.Item key={dir}
                    onClick={i === path.length - 1 ? () => { } : () => { setPath(arr.slice(0, i + 1)); }}>
                    {dir}
                </Breadcrumb.Item>)}
            </Breadcrumb>
        </div>
        <div>{tools}</div>
    </div>;
}
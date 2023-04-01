import { useEffect, useState } from "react";
import { getVersion } from '@tauri-apps/api/app';

export default function Version() {
    const [version, setVersion] = useState<string>('获取中');

    useEffect(() => {
        getVersion()
            .then(setVersion)
            .catch(() => { setVersion('获取错误'); });
    }, []);

    return <span>{version}</span>;
}
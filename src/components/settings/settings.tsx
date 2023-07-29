import { IUserConfigContext, UserConfigContext, defaultUserConfigContext } from "@/context/user-config";
import { setRecordState } from "@/hooks/set-record-state";
import { ISetAction, useStateContext } from "@/hooks/use-state-context";
import { Form, Input, InputNumber, Switch } from "antd";
import { ReactElement } from "react";
import mapKeyDeep from "@/scripts/utils/map-key-deep";

export interface IConfigTemplateInfo<T = unknown> {
    key: string;
    index: number;
    value: T;
    path: string[];
    parent: Record<string, any>;
    setAction: ISetAction<IUserConfigContext>;
}

export interface IConfigTemplate<T = unknown> {
    match: (infos: IConfigTemplateInfo<T>) => boolean;
    content: (infos: IConfigTemplateInfo<T>) => ReactElement;
}

export interface IConfigTemplateProps {
    infos: IConfigTemplateInfo;
    templates: IConfigTemplate[];
}

export function getTargetFromPath(obj: object, pathList: string[]): any {
    let target = obj;
    for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i];
        target = target[path];

        if (!target || typeof target !== 'object') return i + 1 === pathList.length ? target : undefined;
    }
    return target;
}

export const configTemplates: IConfigTemplate[] = [
    // todo 模式匹配生成配置项
    {
        match: (infos) => infos.path[0] === 'hotkeys',
        content: (infos: IConfigTemplateInfo<string>) => <Form.Item>
            {infos.key}:{infos.value}
        </Form.Item>
    },
    {
        match: (infos) => infos.path[1] === 'keySound',
        content: (infos: IConfigTemplateInfo<string>) => <Form.Item>
            {infos.key}:{infos.value}
        </Form.Item>
    },
    {
        match: (infos) => typeof infos.value === 'boolean',
        content: (infos: IConfigTemplateInfo<boolean>) => <Form.Item label={infos.key}>
            <Switch checked={infos.value}
                onChange={checked => setRecordState(
                    infos.setAction,
                    prev => getTargetFromPath(prev, infos.path)[infos.key] = checked
                )}
            />
        </Form.Item>
    },
    {
        match: (infos) => typeof infos.value === 'number',
        content: (infos: IConfigTemplateInfo<number>) => <Form.Item label={infos.key}>
            <InputNumber value={infos.value as number}
                onChange={val => setRecordState(
                    infos.setAction,
                    prev => getTargetFromPath(prev, infos.path)[infos.key] = val
                )} />
        </Form.Item>
    },
    {
        match: (infos) => typeof infos.value === 'string',
        content: (infos: IConfigTemplateInfo<string>) => <Form.Item>
            <Input value={infos.value as string} />
        </Form.Item>
    }
];

export function ConfigTemplate({ templates, infos }: IConfigTemplateProps) {
    if (getTargetFromPath(defaultUserConfigContext, [...infos.path, infos.key]) === undefined) return null;
    for (const template of templates) {
        if (template.match(infos)) return template.content(infos);
    }
}

export default function Settings() {
    // 直接设置状态就行，会自动保存
    const [userConfig, setUserConfig] = useStateContext(UserConfigContext);

    return <div className="relative">
        <div className="h-12 p-4 border-b-2">设置</div>
        <div className="h-full overflow-auto p-4">
            <Form layout="vertical">
                {mapKeyDeep<ReactElement>(userConfig as unknown as Record<string, unknown>, (info) => {
                    const { key } = info;
                    const infos = {
                        ...info,
                        setAction: (prev: IUserConfigContext) => setRecordState(setUserConfig, prev),
                    };

                    return <ConfigTemplate key={key} templates={configTemplates} infos={infos} />;
                })}
            </Form>
        </div>
    </div>;
}
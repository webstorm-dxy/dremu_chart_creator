import { IUserConfigContext, UserConfigContext } from "@/context/user-config";
import { setRecordState } from "@/hooks/set-record-state";
import { ISetAction, useStateContext } from "@/hooks/use-state-context";
import { Form, Input } from "antd";
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

export interface IConfigTemplate {
    match: (infos: IConfigTemplateInfo) => boolean;
    content: (infos: IConfigTemplateInfo) => ReactElement;
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
}

export const configTemplates: IConfigTemplate[] = [
    // todo 模式匹配生成配置项
    {
        match: (infos: IConfigTemplateInfo) => typeof infos.value === 'string',
        content: (infos: IConfigTemplateInfo) => <Form.Item>
            <Input value={infos.value as string} />
        </Form.Item>
    }
];

export function ConfigTemplate({ templates, infos }: IConfigTemplateProps) {
    for (const template of templates) {
        if (template.match(infos)) return template.content(infos);
    }
}

export default function Settings() {
    // 直接设置状态就行，会自动保存
    const [userConfig, setUserConfig] = useStateContext(UserConfigContext);

    return <Form>
        {mapKeyDeep<ReactElement>(userConfig as unknown as Record<string, unknown>, (info) => {
            const { key } = info;
            const infos = {
                ...info,
                setAction: (prev: IUserConfigContext) => setRecordState(setUserConfig, prev),
            };

            return <ConfigTemplate key={key} templates={configTemplates} infos={infos} />;
        })}
    </Form>;
}
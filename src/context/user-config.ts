import { createStateContext } from "@/hooks/use-state-context";

export interface IUserConfigContext {
    editor: {
        autoSaveDelay: number;
        wheelInversion: boolean;
    }
}

export const defaultUserConfigContext: IUserConfigContext = {
    editor: {
        autoSaveDelay: 60000,
        wheelInversion: false,
    }
};

export const UserConfigContext = createStateContext<IUserConfigContext>(defaultUserConfigContext);
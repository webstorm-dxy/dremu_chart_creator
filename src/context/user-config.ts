import { createStateContext } from "@/hooks/use-state-context";

export interface IUserConfigContext {
    editor: {
        wheelInversion: boolean;
    }
}

export const defaultUserConfigContext: IUserConfigContext = {editor: {wheelInversion: false,}};

export const UserConfigContext = createStateContext<IUserConfigContext>(defaultUserConfigContext);
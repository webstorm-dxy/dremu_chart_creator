import { createStateContext } from "@/hooks/use-state-context";



export interface IAppContext {
}

export const defaultAppContext: IAppContext = {};

export const AppContext = createStateContext<IAppContext>(defaultAppContext);
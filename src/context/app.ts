import { createContext } from "react";

export interface IAppContext {
    setAppContext: Readonly<Function>;
}

export const defaultAppContext: IAppContext = {setAppContext: () => {}};

const AppContext = createContext<IAppContext>(defaultAppContext);
export default AppContext;
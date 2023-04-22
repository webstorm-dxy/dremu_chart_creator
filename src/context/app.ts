import { IMacAddress } from "@/scripts/utils/get-macaddress";
import { createContext } from "react";

export interface IAppContext {
    token: string|undefined;
    macAddress: IMacAddress;
    setAppContext: Readonly<Function>;
}

export const defaultAppContext: IAppContext = {
    token: undefined,
    macAddress: null,
    setAppContext: () => {}
};

const AppContext = createContext<IAppContext>(defaultAppContext);
export default AppContext;
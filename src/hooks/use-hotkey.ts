import useKeyPress, { Options, EventHandler, KeyFilter } from "ahooks/lib/useKeyPress";
import { useStateContext } from "./use-state-context";
import { UserConfigContext } from "@/context/user-config";

export default function useHotkey(key: KeyFilter, fn: EventHandler, options?: Options) {
    const [userConfigContext,] = useStateContext(UserConfigContext);
    
    useKeyPress(typeof key === "string" ? userConfigContext.hotkeys[key] || key : key, fn, options || { exactMatch: true });
}
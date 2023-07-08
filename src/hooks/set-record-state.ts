import { Dispatch, SetStateAction } from "react";

export function setRecordState<T>(setAction: Dispatch<SetStateAction<T>>, set: T | ((prevState: T) => void)) {
    return setAction(prev => {
        if (set instanceof Function) {
            set(prev);
            return prev;
        }
        return set;
    });
}
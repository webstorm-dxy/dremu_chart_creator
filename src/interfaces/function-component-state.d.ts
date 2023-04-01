import { Dispatch, SetStateAction } from "react";

export type FunctionComponentState<T> = [T, Dispatch<SetStateAction<T>>];
export type FCState<T> = FunctionComponentState<T>;
export default FCState;
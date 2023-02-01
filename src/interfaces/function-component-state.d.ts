import { Dispatch, SetStateAction } from "react";

export type FunctionComponentState<T> = [T, Dispatch<SetStateAction<T>>];
export type FCState<T> = Function<T>;
export default FCState;
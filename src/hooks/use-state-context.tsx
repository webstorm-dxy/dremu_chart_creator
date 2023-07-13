import { readTextFile } from '@/scripts/utils/fs/readFile';
import { BaseDirectory, createDir, writeTextFile } from '@tauri-apps/api/fs';
import { useMount, useReactive, useSetState } from 'ahooks';
import { debounce, defaultsDeep } from 'lodash';
import {
  Component,
  Context,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useAudio } from 'react-use';
import { HTMLMediaControls, HTMLMediaProps, HTMLMediaState } from 'react-use/lib/factory/createHTMLMediaHook';

export enum SetStateContextType {
  Set,
  LocalSet,
  Reactive
}

export type StateContext<T> = Context<IStateContext<T>>;
export type ISetAction<T> = Dispatch<SetStateAction<T>>;

export interface IStateContext<T> {
  state: T;
  setAction: ISetAction<T>;
}

export type IStateContextProviderProps<T> = PropsWithChildren<{
  Context: StateContext<T>;
  initValue: T;
}>;

export interface IUseStateContextValueOptions {
  type: SetStateContextType;
  filePath?: string;
}

export function createStateContext<T>(defaultValue: T): StateContext<T> {
  return createContext<IStateContext<T>>({
    state: defaultValue,
    setAction: () => { },
  });
}

export function StateContextProvider<T>({
  Context,
  initValue,
  children
}: IStateContextProviderProps<T>) {
  const [state, setState] = useState<T>(initValue);

  const value: IStateContext<T> = useMemo(() => {
    return { state, setAction: setState };
  }, [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

const useStateContextValueOptions = new WeakMap<object, IUseStateContextValueOptions>();

const defaultUseStateContextValueOptions = { type: SetStateContextType.Set };

const saveLocalState = debounce(function <T>(path: string, state: T) {
  writeTextFile(path, JSON.stringify(state), { dir: BaseDirectory.Resource });
}, 3000);

export function useSetStateContextValue<T extends Record<string | number | symbol, unknown> | {}>(
  initValue: T,
  _options: IUseStateContextValueOptions = defaultUseStateContextValueOptions
): IStateContext<T> {
  if (!useStateContextValueOptions.has(initValue)) useStateContextValueOptions.set(initValue, _options);
  const options = useStateContextValueOptions.get(initValue);
  const { type = SetStateContextType.Set, filePath } = options;

  let state: T, setState: ISetAction<T>;

  if (type === SetStateContextType.Reactive) {
    state = useReactive<T>(initValue);
    setState = (prevState: T) => { };
  } else {
    [state, setState] = useSetState<T>(initValue);

    if (type === SetStateContextType.LocalSet && filePath) {
      const setStateAction = setState;
      setState = (set: T|((prevState: T) => T)) => {
        const value = set instanceof Function ? set(state) : set;
        setStateAction(value);
        saveLocalState(filePath, value);
      };
      useMount(() => {
        readTextFile(filePath, { dir: BaseDirectory.Resource })
          .then(val => {
            const data = JSON.parse(val);
            setState(defaultsDeep(data, initValue));
          })
          .catch(async () => {
            await createDir(filePath.slice(0, filePath.lastIndexOf('/')), { dir: BaseDirectory.Resource });
            setState(initValue);
          });
      });
    }
  }

  return { state, setAction: setState };
}

export function useStateContextValue<T>(initValue: T) {
  return useState<T>(initValue);
}

export function useAudioStateContextValue(initValue: HTMLMediaProps
  | ReactElement<HTMLMediaProps, string
    | ((props: any) => ReactElement<any, any>)
    | (new (props: any) => Component<any, any, any>)>): [HTMLMediaElement, IStateContext<HTMLMediaState>] {
  const [audio, state, controls] = useAudio(initValue);

  const setAction = ((type: keyof HTMLMediaControls) => controls[type]) as unknown as ISetAction<HTMLMediaState>;

  return [audio as unknown as HTMLMediaElement, { state, setAction }];
}

export function useStateContext<T>(context: StateContext<T>): [T, ISetAction<T>] {
  const { state, setAction } = useContext(context);

  return [state, setAction];
}
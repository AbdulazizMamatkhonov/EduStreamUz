declare module 'react' {
  export type ReactNode = any;
  export type Dispatch<T> = (value: T) => void;
  export type SetStateAction<T> = T | ((prevState: T) => T);

  export interface FC<P = {}> {
    (props: P): ReactNode;
  }

  export interface SyntheticEvent<T = Element> {
    currentTarget: T;
    target: T;
    preventDefault(): void;
    stopPropagation(): void;
  }

  export interface MouseEvent<T = Element> extends SyntheticEvent<T> {}
  export interface FormEvent<T = Element> extends SyntheticEvent<T> {}
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {}

  export function useState<T>(initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps?: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T;
  export function useRef<T>(initial: T): { current: T };

  const React: {
    createElement: any;
    StrictMode: any;
  };
  export default React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render: (node: any) => void;
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

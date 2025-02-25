import { Atomico, AtomicoThis, DOMProps, JSXElements, JSXProps } from "./dom";

import {
    EventInit,
    FillObject,
    SchemaProps,
    ConstructorType,
    SchemaInfer,
} from "./schema";
import { Sheets } from "./css";
import { VNodeKeyTypes, VNode } from "./vnode";
export { DOMEvent } from "./dom";
export { css, Sheet, Sheets } from "./css";
export { html } from "./html";

/**
 * Base callback for useState
 */
type SetState<Return> = (value: Return | ((value: Return) => Return)) => Return;
/**
 * Base callback for useReducer
 */
type Reducer<T, A = object> = (state: T, action: A) => T;

/**
 *
 */
type Callback<Return> = (...args: any[]) => Return;
/**
 * Identify whether a node in the list belongs to a fragment marker instance
 * ```ts
 * [...element.childNodes].filter(child=>child instanceof Mark);
 * ```
 */
export interface Mark extends Text {}
/**
 * Current will take its value immediately after rendering
 * The whole object is persistent between renders and mutable
 */
export interface Ref<CurrentTarget = any> extends FillObject {
    current?: CurrentTarget extends Atomico<any, any>
        ? InstanceType<CurrentTarget>
        : CurrentTarget;
}

export type Meta<M> = VNode<any> & { meta?: M };

/**
 * Infer the types from `component.props`.
 
 * ```tsx
 * function component({value}: Props<typeof component.props >){
 *      return <host/>
 * }
 *
 * component.props = {value:Number}
 * ```
 */

type GetProps<P> = P extends { props: SchemaProps }
    ? GetProps<P["props"]>
    : P extends {
          readonly "##props"?: infer P;
      }
    ? P
    : {
          [K in keyof P]?: P[K] extends {
              value: infer V;
          }
              ? V extends () => infer T
                  ? T
                  : V
              : P[K] extends { type: infer T }
              ? ConstructorType<T>
              : ConstructorType<P[K]>;
      };

type ReplaceProps<P, Types> = {
    [I in keyof P]?: I extends keyof Types ? Types[I] : P;
};

/**
 * Infers the props from the component's props object, example:
 * ### Syntax
 * ```tsx
 * const myProps = { message: String }
 * Props<typeof MyProps>;
 * // {message: string}
 * ```
 * ### Usage
 * You can use the `Prop` type on components, objects or constructors, example:
 * ```tsx
 * function component({message}: Props<typeof component>){
 *  return <host></host>
 * }
 *
 * component.props = {message: String}
 * ```
 *
 * ### Advanced use
 *
 * It also allows to replace types of those already inferred, example:
 * ```tsx
 * Props<typeof MyProps, {message: "hello"|"bye bye"}>;
 * // {message?: "hello"|"bye bye"}
 *
 * ```
 */
export type Props<P, Types = null> = Types extends null
    ? GetProps<P>
    : ReplaceProps<GetProps<P>, Types>;

/**
 * Functional component validation
 */
export type Component<props = null> = props extends null
    ? {
          (props: FillObject): any;
          props?: SchemaProps;
          styles?: Sheets;
      }
    : props extends SchemaProps
    ? Component<Props<props>>
    : {
          (props: DOMProps<props>): any;
          props: SchemaInfer<props> & {
              readonly "##props"?: Partial<props>;
          };
          styles?: Sheets;
      };

export type CreateElement<C, Base, CheckMeta = true> = CheckMeta extends true
    ? C extends (props: any) => Meta<infer M>
        ? CreateElement<C & { props: M }, Base, false>
        : CreateElement<C, Base, false>
    : C extends { props: infer P }
    ? Atomico<Props<P>, Base>
    : Atomico<{}, Base>;
/**
 * Create the customElement to be declared in the document.
 * ### Usage
 * ```js
 * import {c} from "atomico";
 *
 * function myComponent(){
 *     return <host></host>
 * }
 *
 * customElements.define("my-component", c(myComponent));
 * ```
 * @todo Add a type setting that doesn't crash between JS and template-string.
 */

export function c<
    T extends typeof HTMLElement,
    C extends Component | Component<FillObject>
>(component: C, BaseElement?: T): CreateElement<C, T>;

export namespace h.JSX {
    interface IntrinsicElements extends JSXElements {
        [tagName: string]: any;
    }
}
/**
 * function-pragma, create the vnode
 */
export function h<Type extends VNodeKeyTypes>(
    type: Type,
    props?: JSXProps<Type> | null | undefined,
    ...children: any[]
): VNode<Type, any, any[]>;
/**
 * VirtualDOM rendering function
 * ```jsx
 * render(h("host"),document.querySelector("#app"))
 * render(<host/>,document.querySelector("#app"))
 * render(html`<host/>`,document.querySelector("#app"))
 * ```
 */
export function render<T = Element>(
    VNode: VNode<"host", any, any>,
    node: T,
    id?: string | symbol
): T;

/**
 * dispatch an event from the custom Element.
 * ###  Usage
 * ```js
 * const dispatchChangeValue = useEvent("changeValue")
 * const dispatchChangeValueToParent = useEvent("changeValue", {bubbles:true})
 * ```
 *
 * By using typescript you can define the type as a parameter for the dispatch to be created by useEvent, example::
 *
 * ```tsx
 * const dispatch = useEvent<{id: string}>("changeValue", {bubbles:true});
 *
 * function handler(){
 *      dispatch({id:10}) // Typescript will check the dispatch parameter
 * }
 * ```
 */
export function useEvent<T = any>(
    type: String,
    eventInit?: Omit<EventInit, "type">
): UseEvent<T>;

/**
 * Similar to useState, but with the difference that useProp reflects the effect as component property
 * ```js
 * function component(){
 *     const [ myProp, setMyProp ] = useProp<string>("myProp");
 *     return <host>{ myProp }</host>;
 * }
 *
 * component.props = { myProp : String }
 * ```
 */
export function useProp<T = any>(prop: string): UseProp<T>;
/**
 * create a private state in the customElement
 * ```js
 * function component(){
 *     const [ count, setCount ] = useState(0);
 *     return <host>{ count }</host>;
 * }
 * ```
 */
export function useState<T>(initialState: T | (() => T)): UseState<T>;
export function useState<T>(): UseState<T>;
/**
 * Create or recover a persistent reference between renders.
 * ```js
 * const ref = useRef();
 * ```
 */
export function useRef<T = any>(current?: T): Ref<T>;
/**
 * Memorize the return of a callback based on a group of arguments,
 * the callback will be executed only if the arguments change between renders
 * ```js
 * const value = useMemo(expensiveProcessesCallback)
 * ```
 */
export function useMemo<T = any, Args = any[]>(
    callback: (args: Args) => T,
    args?: Args
): T;
/**
 * Memorize the creation of a callback to a group of arguments,
 * The callback will preserve the scope of the observed arguments
 * ```js
 * const callback = useCallback((user)=>addUser(users, user),[users]);
 * ```
 */
export function useCallback<T = any, Args = any[]>(
    callback: Callback<T>,
    args?: Args
): Callback<T>;
/**
 * Evaluate the execution of a callback after each render cycle,
 * if the arguments between render do not change the callback
 * will not be executed, If the callback returns a function
 * it will be executed as an effect collector
 */
export function useEffect<Args = any[]>(
    callback: (args: Args) => void | (() => any),
    args?: Args
): void;
/**
 * Evaluate the execution of a callback after each render cycle,
 * if the arguments between render do not change the callback
 * will not be executed, If the callback returns a function
 * it will be executed as an effect collector
 */
export function useLayoutEffect<Args = any[]>(
    callback: (args: Args) => void | (() => any),
    args?: Args
): void;
/**
 * Lets you use the redux pattern as Hook
 */
export function useReducer<T = any, A = object>(
    reducer: Reducer<T, A>,
    initialState?: T
): UseReducer<T, A>;
/**
 * return to the webcomponent instance for reference
 * ```jsx
 * const ref = useHost();
 * useEffect(()=>{
 *    const {current} = ref;
 *    current.addEventListener("click",console.log);
 * });
 * ```
 */
export function useHost<Base = HTMLElement>(): UseHost<Base>;

/**
 * Generate an update request to the webcomponent.
 */
export function useUpdate(): () => void;

export interface options {
    sheet: boolean;
    ssr?: (element: AtomicoThis) => void;
}

export type UseProp<T> = [T, SetState<T>];

export type UseState<T> = [T, SetState<T>];

export type UseReducer<T, A> = [T, (action: A) => void];

export type UseEvent<T> = (detail?: T) => boolean;

export type UseHost<T> = Required<Ref<T & AtomicoThis>>;

/**
 * Create a template to reuse as a RAW node, example:
 * ```tsx
 * const StaticNode = template(<svg>...</svg>);
 *
 * function component(){
 *      return <host>
 *          <StaticNode cloneNode></StaticNode>
 *      </host>
 * }
 * ```
 */
export function template<T = Element>(vnode: any): T;

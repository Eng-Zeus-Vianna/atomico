import { ObjectFill } from "./schema";
import { SVGProperties } from "./svg-properties";
/**
 * Generic properties not registered by TS for the DOM
 * @example
 * ```jsx
 * <host shadowDom/>
 * <h1 is="my-componentn"/>
 * <button part="button"/>
 * <img width="100px"/>
 * ```
 */
interface DOMGenericProperties {
    style?: string | Partial<CSSStyleDeclaration> | object;
    class?: string;
    id?: string;
    slot?: string;
    part?: string;
    is?: string;
    tabindex?: string | number;
    role?: string;
    shadowDom?: boolean;
    renderOnce?: boolean;
    width?: string | number;
    height?: string | number;
    key?: any;
    children?: any;
}
/**
 * Fill in the unknown properties
 */
interface DOMUnknownProperties {
    [property: string]: any;
}
/**
 * Fill in the target for a Tag
 */
type DOMEventTarget<T> = {
    target: T & Element;
    currentTarget: T & Element;
};

type DOMEventCallback<T, E = Event> = (event: DOMEventTarget<T> & E) => void;
/**
 * Register an event to make use of it and fill in the target
 */
type DOMEvent<T, P> = P extends (ev: infer E) => any
    ? DOMEventCallback<T, E>
    : any;

/**
 * Maps all properties with event pattern
 */
type DOMEventsMap<T> = {
    [K in keyof T]?: K extends `on${string}`
        ? DOMEvent<T, NonNullable<T[K]>>
        : T[K];
};

/**
 * Process an Element to work its properties
 */
export type Tag<T, P = {}> = P &
    DOMGenericProperties &
    DOMEventsMap<Omit<Omit<T, keyof DOMGenericProperties>, keyof P>> &
    DOMUnknownProperties;

/**
 * Map all the tags to work the properties
 */
export type Tags<T, P = {}> = {
    [K in keyof T]?: Tag<T[K], P>;
};

/**
 * Maps the HTML tags already registered by TS and completes them with the generics
 * @todo omit generic properties according to constructor
 */
type HTMLElements = Tags<HTMLElementTagNameMap>;
type SVGElements = Tags<Omit<SVGElementTagNameMap, "a">, SVGProperties>;

export type AtomicoElements = Tags<{
    host: HTMLElement;
    slot: HTMLSlotElement & {
        onslotchange?: DOMEventCallback<HTMLSlotElement>;
    };
}>;

export type JSXElements = AtomicoElements & HTMLElements & SVGElements;

// /**
//  * Tag context for TS
//  */
// export type TagMaps = SVGElementsTagMap &
//     HTMLElementTagMap &
//     HTMLElementTagAtomico;
/**
 * Omit the predefined properties by TS in favor of the generic ones
 */
// export type Tag<BaseElement, Properties> = Partial<
//     Omit<Omit<BaseElement, keyof Properties>, keyof DOMGenericProperties>
// > &
//     Properties &
//     DOMUnknownProperties;

export type PropsBase<Props, Base> = Omit<
    Base extends new (...args: any[]) => any ? InstanceType<Base> : {},
    keyof Props
> &
    Props;

export interface AtomBase<Props = ObjectFill> {
    update(props?: Props & ObjectFill): Promise<void>;
    updated: Promise<void>;
    mounted: Promise<void>;
    unmounted: Promise<void>;
    readonly symbolId: unique symbol;
}

export interface AtomElement<Props> extends HTMLElement {
    styles: CSSStyleSheet[];
    /**
     * Meta property, allows associating the component's
     * props in typescript to external environments.
     * @example
     * ```ts
     * declare namespace JSX {
     *     interface IntrinsicElements {
     *         foo: any;
     *     }
     * }
     * ```
     */
    Props: Props;
}

export interface Atom<Props, Base> extends AtomElement<Props> {
    new (
        props?: Partial<DOMGenericProperties & PropsBase<Props, Base>> &
            ObjectFill
    ): PropsBase<Props, Base> & AtomBase<Props>;
}

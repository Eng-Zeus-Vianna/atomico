import { expect } from "@esm-bundle/chai";
import { h, $$ } from "../render.js";

describe("src/render#h", () => {
    it("pragma#type", () => {
        expect(h("span")).to.deep.equal({
            $$,
            type: "span",
            props: {},
            children: [],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: false,
            is: undefined,
        });

        const img = new Image();
        expect(h(img)).to.deep.equal({
            $$,
            type: img,
            props: {},
            children: [],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: 1,
            is: undefined,
        });

        expect(h(Image)).to.deep.equal({
            $$,
            type: Image,
            props: {},
            children: [],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: 2,
            is: undefined,
        });
    });
    it("pragma#props", () => {
        let children = 10;
        expect(h("span", { children })).to.deep.equal({
            $$,
            type: "span",
            props: { children },
            children: children,
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: false,
            is: undefined,
        });

        expect(h("span", {}, children)).to.deep.equal({
            $$,
            type: "span",
            props: {},
            children: [children],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: false,
            is: undefined,
        });
    });
    it("pragma#props.staticNode", () => {
        expect(h("span", { staticNode: true })).to.deep.equal({
            $$,
            type: "span",
            props: { staticNode: true },
            children: [],
            key: undefined,
            shadow: undefined,
            static: true,
            clone: undefined,
            raw: false,
            is: undefined,
        });
    });
    it("pragma#props.cloneNode", () => {
        expect(h("span", { cloneNode: true })).to.deep.equal({
            $$,
            type: "span",
            props: { cloneNode: true },
            children: [],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: true,
            raw: false,
            is: undefined,
        });
    });
});

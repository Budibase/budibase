import { load } from "./testAppDef";

describe("initialiseApp", () => {

    it("should populate simple div with initial props", async () => {

        const {dom} = await load({
            _component: "testlib/div",
            className: "my-test-class"
        });

        expect(dom.window.document.body.children.length).toBe(1);
        const child = dom.window.document.body.children[0];
        expect(child.className).toBe("my-test-class");

    });

    it("should populate child component with props", async () => {
        const {dom} = await load({
            _component: "testlib/div",
            _children: [
                {
                    _component: "testlib/h1",
                    text: "header one"
                },
                {
                    _component: "testlib/h1",
                    text: "header two"
                }
            ]
        });

        const rootDiv = dom.window.document.body.children[0];

        expect(rootDiv.children.length).toBe(2);
        expect(rootDiv.children[0].tagName).toBe("H1");
        expect(rootDiv.children[0].innerText).toBe("header one");
        expect(rootDiv.children[1].tagName).toBe("H1");
        expect(rootDiv.children[1].innerText).toBe("header two");

    });

    it("should append children when told to do so", async () => {
        const {dom} = await load({
            _component: "testlib/div",
            _children: [
                {
                    _component: "testlib/h1",
                    text: "header one"
                },
                {
                    _component: "testlib/h1",
                    text: "header two"
                }
            ],
            append: true
        });

        const rootDiv = dom.window.document.body.children[0];

        expect(rootDiv.children.length).toBe(3);
        expect(rootDiv.children[0].tagName).toBe("DIV");
        expect(rootDiv.children[0].className).toBe("default-child");
        expect(rootDiv.children[1].tagName).toBe("H1");
        expect(rootDiv.children[1].innerText).toBe("header one");
        expect(rootDiv.children[2].tagName).toBe("H1");
        expect(rootDiv.children[2].innerText).toBe("header two");
    });

});


    

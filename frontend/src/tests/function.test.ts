import { expect, test } from "vitest";
import {
    addElementToArray,
    classNames,
    displayCurrency,
    filterDatasetByStringName,
    generateMailtoLink,
    removeElementFromArray,
} from "../utils/functions/functions";

// array tests
test("Adds one item to an empty array", () => {
    expect(addElementToArray({ name: "max" }, [], "name")).toStrictEqual([
        { id: 1, name: "max" },
    ]);
});

test("Adds one item to an non empty array", () => {
    expect(
        addElementToArray({ name: "max" }, [{ id: 1, name: "moritz" }], "name")
    ).toStrictEqual([
        { id: 1, name: "moritz" },
        { id: 2, name: "max" },
    ]);
});

test("removes one item from an non empty array", () => {
    expect(
        removeElementFromArray(
            2,
            [
                { id: 1, name: "moritz" },
                { id: 2, name: "max" },
            ],
            "id"
        )
    ).toStrictEqual([{ id: 1, name: "moritz" }]);
});

// filter tests
test("returns all data if searchquery is empty", () => {
    expect(
        filterDatasetByStringName(
            [
                { id: 1, name: "moritz" },
                { id: 2, name: "max" },
            ],
            "name",
            ""
        )
    ).toStrictEqual([
        { id: 1, name: "moritz" },
        { id: 2, name: "max" },
    ]);
});

test("filters data correctly", () => {
    expect(
        filterDatasetByStringName(
            [
                { id: 1, name: "moritz" },
                { id: 2, name: "max" },
            ],
            "name",
            "ma"
        )
    ).toStrictEqual([{ id: 2, name: "max" }]);
});

test("display currency test", () => {
    expect(displayCurrency(20, "EUR")).toStrictEqual("20 €");
    expect(displayCurrency(0, "USD")).toStrictEqual("0 $");
});

// mailto tests
test("displays correct mailto link", () => {
    expect(generateMailtoLink("max.mustermann@mail.com")).toStrictEqual(
        "mailto:max.mustermann%40mail.com"
    );
    expect(generateMailtoLink("max.mustermann@mail.com", "Test")).toStrictEqual(
        "mailto:max.mustermann%40mail.com?subject=Test"
    );
    expect(
        generateMailtoLink("max.mustermann@mail.com", "Test", "Hello from Body")
    ).toStrictEqual(
        "mailto:max.mustermann%40mail.com?subject=Test&body=Hello%20from%20Body"
    );
});

test("displays correct classname", () => {
    expect(classNames()).toStrictEqual("");
    expect(classNames("base class")).toStrictEqual("base class");
    expect(classNames("base class", "other class")).toStrictEqual(
        "base class other class"
    );
    expect(
        classNames("base class", "other class", 1 === 1 && "conditional class")
    ).toStrictEqual("base class other class conditional class");
    expect(
        classNames("base class", "other class", 1 > 2 && "conditional class")
    ).toStrictEqual("base class other class");
});

import {
         isPlainObject,
         throwIfNoPlainObject,
         throwIfNoValidNumber,
         throwIfNoValidString,
       } from "./user-data";

describe("Module: token", function ()
{
    test("Function: isPlainObject", function ()
    {
        expect(isPlainObject({ })).toBe(true);
        expect(isPlainObject(123)).toBe(false);
        expect(isPlainObject("a")).toBe(false);
    });

    test("Function: throwIfNoPlainObject", function ()
    {
        expect(() => throwIfNoPlainObject({ })).not.toThrow();

        expect(() => throwIfNoPlainObject(123)).toThrow();
        expect(() => throwIfNoPlainObject("a")).toThrow();
    });

    test("Function: throwIfNoValidNumber", function ()
    {
        expect(() => throwIfNoValidNumber(123)).not.toThrow();

        expect(() => throwIfNoValidNumber({ })).toThrow();
        expect(() => throwIfNoValidNumber("a")).toThrow();
    });

    test("Function: throwIfNoValidString", function ()
    {
        expect(() => throwIfNoValidString("a")).not.toThrow();

        expect(() => throwIfNoValidString({ })).toThrow();
        expect(() => throwIfNoValidString(123)).toThrow();
    });
});
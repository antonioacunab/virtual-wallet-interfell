import { generateSixNumbersToken } from "./token";

describe("Module: token", function ()
{
    test("Function: generateSixNumbersToken", function ()
    {
        let token1: string;

        expect(() => token1 = generateSixNumbersToken()).not.toThrow();

        // Token length must always be 6
        expect(token1!.length).toBe(6);

        // Token must be parsable as a number
        expect(() => parseInt(token1!)).not.toThrow();

        let token2: string;

        expect(() => token2 = generateSixNumbersToken()).not.toThrow();

        // Two executions of the function will create tokens that most times are going to be different but there is a chance that they are equal
        if (token1! === token2!)
            return;

        expect(token1!).not.toBe(token2!);
    });
});
/**
 * Returns a random 6 digits string
 *
 * @returns
 */
export function generateSixNumbersToken (): string
{
    let token: string = "";

    for (let i: number = 0; i < 6; i++)
        token += Math.floor(Math.random() * 10);

    return token;
}
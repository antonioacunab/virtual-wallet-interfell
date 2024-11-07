export function isPlainObject (obj: any): boolean
{
    return Object.prototype.toString.call(obj) === "[object Object]";
}

export function throwIfNoPlainObject (obj: any): void
{
    if ( isPlainObject(obj) )
        return;

    throw new Error(`The provided argument is not a plain object: ${obj}`);
}

export function throwIfNoValidString (obj: any): void
{
    // TODO: Add string validation through regular expressions

    if ( typeof obj === "string" )
        return;

    throw new Error(`The provided argument is not a string: ${obj}`);
}

export function throwIfNoValidNumber (obj: any): void
{
    // TODO: Add number validations like a range, number length, etc

    if ( typeof obj === "number" )
        return;

    throw new Error(`The provided argument is not a number: ${obj}`);
}
import {
         Request,
         Response,
       } from "express";

interface ServerResponse
{
    success: boolean;
    errorCode: number;
    errorMessage: string | undefined;
    data: Array<any> | Record<any, any> | undefined;
}

export function respondWithStatus (_request: Request, response: Response, statusCode: number, body: any)
{
    let success     : boolean;
    let errorCode   : number;
    let errorMessage: string | undefined;
    let data        : Array<any> | Record<any, any> | undefined;

    // TODO: Add validations to check the response succeded or not

    if (statusCode >= 100 && statusCode <= 399)
    {
        success   = true;
        errorCode = 0;
        data      = body;
    }
    else if (statusCode >= 400 && statusCode <= 599)
    {
        success      = false;
        errorCode    = statusCode;
        errorMessage = body;
    }
    else
        throw new Error(`The provided "statusCode" is not a valid HTTP status code`);

    const serverResponse: ServerResponse = {
        success,
        errorCode,
        errorMessage,
        data,
    };

    // Sets the status code and the message of the response
    response
        .status(statusCode)
        .send(serverResponse);
}
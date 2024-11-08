import {
         Request,
         Response,
       } from "express";

export interface CustomServerResponse
{
    success: boolean;
    code   : number;
    message: string;
}

export function respondWithStatus (_request: Request, response: Response, statusCode: number, body: any)
{
    let success: boolean;
    let code   : number;
    let message: string;

    // TODO: Verify validations to check if the response is a success or a failure

    if (statusCode >= 100 && statusCode <= 399)
    {
        success = true;
        code    = 0;
        message = body;
    }
    else if (statusCode >= 400 && statusCode <= 599)
    {
        success = false;
        code    = statusCode;
        message = body;
    }
    else
        throw new Error(`The provided "statusCode" is not a valid HTTP status code`);

    const serverResponse: CustomServerResponse = {
        success,
        code,
        message,
    };

    // Sets the status code and the message of the response
    response
        .status(statusCode)
        .send(serverResponse);
}
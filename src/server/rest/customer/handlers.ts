import type {
              Request,
              Response,
            } from "express";

import {
         CustomServerResponse,
         respondWithStatus,
       } from "../../../helpers/response";

import {
         throwIfNoPlainObject,
         throwIfNoValidString,
       } from "../../../helpers/user-data";

import { sendRequestToCustomersSOAPServer } from "../helpers/soap";

/**
 * Communicate with the SOAP service to create a customer
 *
 * @param request  - A Request Object
 * @param response - A Response Object
 */
export async function createCustomer (request: Request, response: Response): Promise<void>
{
    const body: any = request.body;

    try
    {
        throwIfNoPlainObject(body);

        throwIfNoValidString(body.document);
        throwIfNoValidString(body.name);
        throwIfNoValidString(body.email);
        throwIfNoValidString(body.phone);
    }
    catch (error: any)
    {
        respondWithStatus(request, response, 400, `An error occurred while trying to create a customer: ${(error as Error).message}`)
    }

    const args: Record<string, any> = {
        document: body.document,
        name: body.name,
        email: body.email,
        phone: body.phone,
    }

    const result: CustomServerResponse = await sendRequestToCustomersSOAPServer("createCustomer", args);

    response.statusCode = result.code;

    response.end(JSON.stringify(result));
}
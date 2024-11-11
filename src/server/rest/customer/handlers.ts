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
         throwIfNoValidNumber,
         throwIfNoValidString,
       } from "../../../helpers/user-data";

import { sendRequestToCustomersSOAPServer } from "../helpers/soap";

interface CustomerData
{
    document: string;
    name    : string;
    email   : string;
    phone   : number;
}

export async function createCustomer (request: Request, response: Response)
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

    const customerData: CustomerData = {
        document: body.document,
        name: body.name,
        email: body.email,
        phone: body.phone,
    }

    const result: CustomServerResponse = await sendRequestToCustomersSOAPServer("createCustomer", customerData);

    response.end(JSON.stringify(result));
}
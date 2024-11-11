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
         throwIfNoValidNumber,
       } from "../../../helpers/user-data";

import { sendRequestToWalletSOAPServer } from "../helpers/soap";

/**
 * Communicate with the SOAP service to get the wallet balance
 *
 * @param request  - A Request Object
 * @param response - A Response Object
 */
export async function getBalance (request: Request, response: Response): Promise<void>
{
    const body: any = request.body;

    try
    {
        throwIfNoPlainObject(body);

        throwIfNoValidString(body.document);
        throwIfNoValidString(body.phone);
    }
    catch (error: any)
    {
        respondWithStatus(request, response, 400, `An error occurred while trying to get the balance of the wallet: ${(error as Error).message}`);
    }

    const args: Record<string, any> = {
        document: body.document,
        phone   : body.phone,
    };

    const result: CustomServerResponse = await sendRequestToWalletSOAPServer("getBalance", args);

    response.statusCode = result.code;

    response.end(JSON.stringify(result));
}

/**
 * Communicate with the SOAP service to add funds to the wallet
 *
 * @param request  - A Request Object
 * @param response - A Response Object
 */
export async function addFunds (request: Request, response: Response): Promise<void>
{
    const body: any = request.body;

    try
    {
        throwIfNoPlainObject(body);

        throwIfNoValidString(body.document);
        throwIfNoValidString(body.phone);
        throwIfNoValidNumber(body.amount);
    }
    catch (error: any)
    {
        respondWithStatus(request, response, 400, `An error occurred while trying to deposit money on the wallet: ${(error as Error).message}`);
    }

    const args: Record<string, any> = {
        document: body.document,
        phone   : body.phone,
        amount  : body.amount,
    };

    const result: CustomServerResponse = await sendRequestToWalletSOAPServer("addFunds", args);

    response.statusCode = result.code;

    response.end(JSON.stringify(result));
}

/**
 * Communicate with the SOAP service to pay a purchase
 *
 * @param request  - A Request Object
 * @param response - A Response Object
 */
export async function payPurchase (request: Request, response: Response): Promise<void>
{
    const body: any = request.body;

    try
    {
        throwIfNoPlainObject(body);

        throwIfNoValidString(body.document);
        throwIfNoValidString(body.phone);
        throwIfNoValidNumber(body.purchaseValue);
    }
    catch (error: any)
    {
        respondWithStatus(request, response, 400, `An error occurred while trying to pay a purchase: ${(error as Error).message}`);
    }

    const args: Record<string, any> = {
        document     : body.document,
        phone        : body.phone,
        purchaseValue: body.purchaseValue,
    };

    const result: CustomServerResponse = await sendRequestToWalletSOAPServer("pay", args);

    response.statusCode = result.code;

    response.end(JSON.stringify(result));
}

/**
 * Communicate with the SOAP service to confirm a purchase pay
 *
 * @param request  - A Request Object
 * @param response - A Response Object
 */
export async function confirmPayment (request: Request, response: Response): Promise<void>
{
    const body: any = request.body;

    try
    {
        throwIfNoPlainObject(body);

        throwIfNoValidString(body.sessionId);
        throwIfNoValidString(body.userToken);
    }
    catch (error: any)
    {
        respondWithStatus(request, response, 400, `An error occurred while trying to confirm a payment: ${(error as Error).message}`);
    }

    const args: Record<string, any> = {
        sessionId: body.sessionId,
        userToken: body.userToken,
    };

    const result: CustomServerResponse = await sendRequestToWalletSOAPServer("confirmPay", args);

    response.statusCode = result.code;

    response.end(JSON.stringify(result));
}
import type {
              Request,
              Response,
            } from "express";

import { respondWithStatus } from "../../../helpers/http";

import {
         throwIfNoPlainObject,
         throwIfNoValidString,
         throwIfNoValidNumber,
       } from "../../../helpers/user-data";

export function getBalance (request: Request, response: Response): void
{
    const body: any = request.body;

    try
    {
        throwIfNoPlainObject(body);

        throwIfNoValidString(body.document);
        throwIfNoValidNumber(body.phone);
    }
    catch (error: any)
    {
        respondWithStatus(request, response, 400, `An error occurred while trying to deposit money on the wallet: ${(error as Error).message}`);
    }

    const userData: Record<string, any> = {
        document: body.document,
        phone   : body.phone,
    }

    checkBalance(userData);
}

export function addFunds (request: Request, response: Response): void
{
    const body: any = request.body;

    try
    {
        throwIfNoPlainObject(body);

        throwIfNoValidString(body.document);
        throwIfNoValidNumber(body.phone);
        throwIfNoValidNumber(body.amount);
    }
    catch (error: any)
    {
        respondWithStatus(request, response, 400, `An error occurred while trying to deposit money on the wallet: ${(error as Error).message}`);
    }

    const depositData: Record<string, any> = {
        document: body.document,
        phone   : body.phone,
        amount  : body.amount,
    }

    addFunds(depositData);
}

export function payPurchase (request: Request, response: Response): void
{

}

export function confirmPayment (request: Request, response: Response): void
{

}
import type { Client } from "soap";

import type { CUSTOMER_SERVICE } from "../../soap/customer";
import type { WALLET_SERVICE   } from "../../soap/wallet";

import { CustomServerResponse } from "../../../helpers/response";

import { createClient } from "soap";

process.loadEnvFile()

/**
 * Registered operations in customer service
 */
type CustomerOperationName = keyof typeof CUSTOMER_SERVICE.CustomerService.CustomerPort;

/**
 * Registered operations in wallet service
 */
type WalletOperationName = keyof typeof WALLET_SERVICE.WalletService.WalletPort;

/**
 * Customers SOAP server URL
 */
const SOAP_CUSTOMERS_SERVER_URL = process.env.SOAP_CUSTOMERS_SERVER_LOCATION || "http://localhost:8000/customers?wsdl";

/**
 * Wallet SOAP server URL
 */
const SOAP_WALLET_SERVER_URL = process.env.SOAP_WALLET_SERVER_LOCATION || "http://localhost:8000/wallet?wsdl";

/**
 * Customers SOAP client
 */
let customersClient: Client;

/**
 * Wallet SOAP client
 */
let walletClient: Client;

createClient(SOAP_CUSTOMERS_SERVER_URL, (error: any, client: Client) => {
    if (error)
        throw error;

    customersClient = client;
});

createClient(SOAP_WALLET_SERVER_URL, (error: any, client: Client) => {
    if (error)
        throw error;

    walletClient = client;
});

/**
 * Sends a SOAP request using the provided client and sanitizes its output for HTTP
 *
 * @param client        - A SOAP client
 * @param operationName - The name of an operation in the provided client
 * @param args          - Arguments required by the operation
 */
function sendRequestToSOAPServer (client: Client, operationName: string, args: Record<string, any>): Promise<CustomServerResponse>
{
    return new Promise((resolve, _reject) => {
        client[operationName](args, (error: any, result: any) => {
            if (error)
                resolve ({
                    success: false,
                    code: 500,
                    message: error,
                });

            result.code = parseInt(result.code)

            // TODO: Se debe hacer más robusta la selección de los códigos de error para que expresen correctamente el tipo de error que se presentó
            // TODO: Se deben revisar los mensajes de error dado que pueden ocasionar fuga de información
            // TODO: Se debe implementar una estrategia para hacer rollback de la base de datos cuando sucedan errores en esta etapa

            resolve(result);
        });
    });
}

/**
 * Sends a request to the customers SOAP server and returns its sanitized response
 *
 * @param operationName - The name of an operation in the customers SOAP server
 * @param args          - Arguments required by the operation
 */
export function sendRequestToCustomersSOAPServer (operationName: CustomerOperationName, args: Record<string, any>): Promise<CustomServerResponse>
{
    return sendRequestToSOAPServer(customersClient, operationName, args);
}

/**
 * Sends a request to the wallet SOAP server and returns its sanitized response
 *
 * @param operationName - The name of an operation in the wallet SOAP server
 * @param args          - Arguments required by the operation
 */
export function sendRequestToWalletSOAPServer (operationName: WalletOperationName, args: Record<string, any>): Promise<CustomServerResponse>
{
    return sendRequestToSOAPServer(walletClient, operationName, args);
}
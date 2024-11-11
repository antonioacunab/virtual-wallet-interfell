import { CustomServerResponse    } from "../../../helpers/response";
import { generateSixNumbersToken } from "../../../helpers/token";
import { throwIfNoValidString    } from "../../../helpers/user-data";
import { MY_SQL_SERVICE          } from "../../../services/mysql";

/**
 * Defines a purchase from a user
 */
interface PurchaseInProcess
{
    document : string;
    phone    : string;
    sessionId: string;
    token    : string;
    value    : string;
}

/**
 * List of purchases in progress
 *
 * @remarks A purchase in progress is a purchase that is waiting for confirmation through a token
 */
const PURCHASES_IN_PROCESS: Record<string, PurchaseInProcess> = { }; // TODO: Este almacenamiento debería ir en una base de datos, no en una tabla

/**
 * Token expiration time
 */
const TOKEN_DURATION: number = process.env.TOKEN_EXPIRATION != null ? parseInt(process.env.TOKEN_EXPIRATION) : 60000;

/**
 * Returns the current balance of the wallet of a specific document and phone pair
 *
 * @param args - An object containing the properties "document" and "phone"
 */
async function getBalance (args: any): Promise<CustomServerResponse>
{
    const { document, phone } = args;

    try
    {
        throwIfNoValidString(document);
        throwIfNoValidString(phone);
    }
    catch (error: any)
    {
        return Promise.resolve({
            success: false,
            code: 400,
            message: `The balance could not be obtained: ${error.message}`,
        });
    }

    const output: Promise<CustomServerResponse> = MY_SQL_SERVICE.query(
        `SELECT funds FROM ${process.env.MYSQL_TABLE_NAME} WHERE document = "${document}" AND phone = "${phone}"`
    )
        .then((result: any) => {
            // Throw an error when the document+phone pair does not match any user
            if (result[0] == null)
                throw new Error("Either one or both of the document and phone provided are invalid");

            const funds: number = result[0].funds;

            return {
                success: true,
                code: 0,
                message: `${funds}`,
            };
        })
        .catch((error: any) => {
            return {
                success: false,
                code: 500,
                message: `The balance could not be obtained`,
            };
        });

    return output;
}

/**
 * Adds funds to the wallet of a specific document and phone pair
 *
 * @param args - An object containing the properties "document", "phone" and "amount"
 */
async function addFunds (args: any): Promise<CustomServerResponse>
{
    const { document, phone, amount } = args;

    try
    {
        throwIfNoValidString(document);
        throwIfNoValidString(phone);
        throwIfNoValidString(amount);
    }
    catch (error: any)
    {
        return Promise.resolve({
            success: false,
            code: 400,
            message: `Funds could not be added: ${error.message}`,
        });
    }

    // Get the current balance to add the incoming amount to it
    const currentFunds: string = (await (getBalance({document, phone}))).message;

    // Calculating the new balance
    const newBalance: number = parseInt(currentFunds) + parseInt(amount);

    const output: Promise<CustomServerResponse> = MY_SQL_SERVICE.query(
        `UPDATE ${process.env.MYSQL_TABLE_NAME} SET funds = ${newBalance} WHERE document = "${document}" AND phone = "${phone}"`
    )
        .then((_result: any) => {
            return {
                success: true,
                code: 0,
                message: `Funds added successfully`,
            };
        })
        .catch((_error: any) => {
            return {
                success: false,
                code: 500,
                message: `Funds could not be added`,
            };
        });

    return output;
}

/**
 * Creates a purchase in progress for a specific document and phone pair
 *
 * @param args - An object containing the properties "document", "phone" and "purchaseValue"
 */
async function pay (args: any): Promise<CustomServerResponse>
{
    const { document, phone, purchaseValue } = args;

    try
    {
        throwIfNoValidString(document);
        throwIfNoValidString(phone);
        throwIfNoValidString(purchaseValue);
    }
    catch (error: any)
    {
        return Promise.resolve({
            success: false,
            code: 400,
            message: `Purchase could not be done: ${error.message}`,
        });
    }

    // Get the current balance to check if the purchase can be done
    const currentFunds: string = (await (getBalance({document, phone}))).message;

    // Return if the wallet balance is lower than the purchase value
    if (parseInt(currentFunds) < parseInt(purchaseValue))
        return Promise.resolve({
            success: false,
            code: 400,
            message: `Purchase value exceeds your wallet balance`,
        });

    const sessionID: string = `${document}${(new Date()).getDate()}`; // TODO: Escoger una forma más robusta de crear este valor
    const token: string = generateSixNumbersToken();

    const purchaseData: PurchaseInProcess = {
        document,
        phone,
        sessionId: sessionID,
        token,
        value: purchaseValue,
    };

    // Add the purchase to a database
    PURCHASES_IN_PROCESS[sessionID] = purchaseData;

    // Delete the token from the storage after the expiration time
    setTimeout(() => {
        delete PURCHASES_IN_PROCESS[sessionID];
    }, TOKEN_DURATION);

    const outputData: Record<string, any> = {
        sessionID,
        token,
    };

    return {
        success: true,
        code: 0,
        message: JSON.stringify(outputData), // TODO: El token no se debería enviar en la respuesta, si no al correo. Se hace para facilidad de testeo. Corregir
    };
}

/**
 * Confirms a purchase in progress based on a session ID and a user token
 *
 * @param args - An object containing the properties "sessionId" and "userToken"
 */
async function confirmPay (args: any): Promise<CustomServerResponse>
{
    const { sessionId, userToken } = args;

    try
    {
        throwIfNoValidString(sessionId);
        throwIfNoValidString(userToken);
    }
    catch (error: any)
    {
        return Promise.resolve({
            success: false,
            code: 400,
            message: `Payment could not be confirmed: ${error.message}`,
        });
    }

    // Return if the session ID does not exist
    if (PURCHASES_IN_PROCESS[sessionId] == null)
        return Promise.resolve({
            success: false,
            code: 400,
            message: `The provided session ID is invalid or has expired already`,
        });

    // Get the user info from the session ID for further tests
    const { document, phone, sessionId: storedSessionId, token: storedToken, value } = PURCHASES_IN_PROCESS[sessionId];

    const areValidCredentials: boolean = sessionId === storedSessionId && userToken === storedToken;

    if ( !areValidCredentials )
        return Promise.resolve({
            success: false,
            code: 400,
            message: `Any of the provided session ID or user token is invalid`,
        });

    // Get the current balance to substract the value of the purchase from it
    const currentFunds: string = (await (getBalance({document, phone}))).message;

    if (parseInt(currentFunds) < parseInt(value))
        return Promise.resolve({
            success: false,
            code: 400,
            message: `Payment cannot be confirmed. The purchase amount exceeds your wallet balance`,
        });

    // Calculating the new balance
    const newBalance: number = parseInt(currentFunds) - parseInt(value);

    const output: Promise<CustomServerResponse> = MY_SQL_SERVICE.query(
        `UPDATE ${process.env.MYSQL_TABLE_NAME} SET funds = ${newBalance} WHERE document = "${document}" AND phone = "${phone}"`
    )
        .then((_result: any) => {
            // Delete the purchase from the list after updating the funds
            delete PURCHASES_IN_PROCESS[sessionId];

            return {
                success: true,
                code: 0,
                message: `Payment confirmed. New balance: ${newBalance}`,
            };
        })
        .catch((_error: any) => {
            return {
                success: false,
                code: 500,
                message: `An unexpected error ocurred while trying to confirm the payment`,
            };
        });

    return output;
}

/**
 * Service definition for SOAP server
 */
export const SERVICE = {
    WalletService: {
        WalletPort: {
            getBalance,
            addFunds,
            pay,
            confirmPay,
        },
    },
};
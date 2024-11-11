import { CustomServerResponse } from "../../../helpers/response";
import { generateSixNumbersToken } from "../../../helpers/token";
import { throwIfNoValidString } from "../../../helpers/user-data";
import { MY_SQL_SERVICE       } from "../../../services/mysql";

interface PurchaseInProcess
{
    document : string;
    phone    : string;
    sessionId: string;
    token    : string;
    value    : string;
}

const PURCHASES_IN_PROCESS: Record<string, PurchaseInProcess> = { };

const TOKEN_DURATION: number = 60000;

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

    // Get the current balance to add the adding amount to it
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

    if (parseInt(currentFunds) < parseInt(purchaseValue))
        return Promise.resolve({
            success: false,
            code: 400,
            message: `Purchase value exceeds your wallet balance`,
        });

    const sessionID: string = `${document}${(new Date()).getDate()}`; // TODO: Escoger una forma de crear este valor
    const token: string = generateSixNumbersToken();

    const outputData: Record<string, any> = {
        sessionID,
        token,
    };

    const purchaseData: PurchaseInProcess = {
        document,
        phone,
        sessionId: sessionID,
        token,
        value: purchaseValue,
    };

    PURCHASES_IN_PROCESS[sessionID] = purchaseData;

    // Delete the token from the storage after the expiration time
    setTimeout(() => {
        delete PURCHASES_IN_PROCESS[sessionID];
    }, TOKEN_DURATION);

    return {
        success: true,
        code: 0,
        message: JSON.stringify(outputData), // TODO: El token no se debería enviar en la respuesta. Se hace para facilidad de testeo. Corregir
    };
}
export const SERVICE = {
    WalletService: {
        WalletPort: {
            getBalance,
            addFunds,
            pay,
            },
        }
    }
}
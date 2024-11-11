import { CustomServerResponse } from "../../../helpers/response";
import { throwIfNoValidString } from "../../../helpers/user-data";
import { MY_SQL_SERVICE       } from "../../../services/mysql";

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

                return {
                    success: true,
                    code: 0,
                    message: "Funds added successfully",
                };
export const SERVICE = {
    WalletService: {
        WalletPort: {
            getBalance,
            pay (args: any): CustomServerResponse
            {
                console.log("Datos recibidos para pagar:", args);

                // TODO: Aquí se debe implementar la lógica de negocio

                return {
                    success: true,
                    code: 0,
                    message: "A verification token has been sent to your email. Use the following session ID: cmn34c04390c43cm4309",
                };
            },
            confirmPay (args: any): CustomServerResponse
            {
                console.log("Datos recibidos para confirmar pago:", args);

                // TODO: Aquí se debe implementar la lógica de negocio

                return {
                    success: true,
                    code: 0,
                    message: "Payment confirmed",
                };
            },
        }
    }
}
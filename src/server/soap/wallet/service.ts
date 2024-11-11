import { CustomServerResponse } from "../../rest/helpers/response";

export const SERVICE = {
    WalletService: {
        WalletPort: {
            getBalance (args: any): CustomServerResponse
            {
                console.log("Datos recibidos para ver el balance:", args);

                // TODO: Aquí se debe implementar la lógica de negocio

                return {
                    success: true,
                    code: 0,
                    message: "Your balance is: ",
                };
            },
            addFunds (args: any): CustomServerResponse
            {
                console.log("Datos recibidos para agregar fondos:", args);

                // TODO: Aquí se debe implementar la lógica de negocio

                return {
                    success: true,
                    code: 0,
                    message: "Funds added successfully",
                };
            },
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
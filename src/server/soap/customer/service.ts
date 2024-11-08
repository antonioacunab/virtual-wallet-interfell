import { CustomServerResponse } from "../../rest/helpers/response";

export const SERVICE = {
    CustomerService: {
        CustomerPort: {
            createCustomer (args: any): CustomServerResponse
            {
                console.log('Datos recibidos para crear cliente:', args);

                // TODO: Aquí se debe implementar la lógica de negocio

                return {
                    success: true,
                    code: 0,
                    message: 'Funds added successfully',
                };
            },
        }
    }
}
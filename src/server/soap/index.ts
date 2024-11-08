import type {
              IncomingMessage,
              Server,
              ServerResponse,
            } from "http";

import fs   from "fs";
import http from "http";
import path from "path";

import { listen } from "soap";

import { CustomServerResponse } from "../rest/helpers/response";

const PATH_TO_WSDL: string = path.join(__dirname, "service.wsdl");

const WSDL_CONTENT: string = fs.readFileSync(PATH_TO_WSDL, "utf-8");

const CUSTOMER_SERVICE = {
    CustomerService: {
        CustomerPort: {
            createCustomer (args: any)
            {
                console.log('Datos recibidos para crear cliente:', args);

                // Aquí iría tu lógica de negocio, como guardar el cliente en una base de datos
                // Para este ejemplo, vamos a simular una respuesta de éxito

                return {
                    success: true,
                    code: 0,
                    message: 'Funds added successfully',
                };
            },
        }
    }
}

const WALLET_SERVICE = {
    WalletService: {
        WalletPort: {
            AddFunds (args: any): CustomServerResponse
            {
                console.log('Datos recibidos para agregar fondos:', args);

                // Lógica para agregar fondos
                // Ejemplo de respuesta simulada

                return {
                    success: true,
                    code: 0,
                    message: 'Client created successfully',
                };
            },
        }
    }
}

const SERVER: Server = http.createServer(
    (_request: IncomingMessage, response: ServerResponse) => response.end("Server is running")
);

const PORT: string | number = process.env.SOAP_PORT || 8000;

SERVER.listen(PORT, () => {
    const soapServerUrl = `http://localhost:${PORT}/`;

    console.log(`SOAP server listening on: ${soapServerUrl}`);

    listen(SERVER, '/customers', CUSTOMER_SERVICE, WSDL_CONTENT);
    listen(SERVER, '/wallet', WALLET_SERVICE, WSDL_CONTENT);
});
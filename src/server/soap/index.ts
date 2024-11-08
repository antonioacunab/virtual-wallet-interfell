import fs   from "fs";
import http from "http";
import path from "path";

import { listen } from "soap";

import { CustomServerResponse } from "../rest/helpers/response";

const PATH_TO_WSDL: string = path.join(__dirname, "service.wsdl");

const WSDL_CONTENT: string = fs.readFileSync(PATH_TO_WSDL, "utf-8");

const CUSTOMER_SERVICE = {
    CustomerService: {
        CustomerPortType: {
            createCustomer (args: any): CustomServerResponse
            {
                console.log('Datos recibidos para crear cliente:', args);

                // Aquí iría tu lógica de negocio, como guardar el cliente en una base de datos
                // Para este ejemplo, vamos a simular una respuesta de éxito

                return {
                    success: true,
                    code: 0,
                    message: 'Client created successfully',
                };
            },
        }
    }
}

const WALLET_SERVICE = {
    WalletService: {
        WalletServicePort: {
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

const server = http.createServer();

const PORT: number = 8000;

const soapServerUrl = `http://localhost:${PORT}/wsdl`;

listen(server, '/customers', CUSTOMER_SERVICE, WSDL_CONTENT);
listen(server, '/wallet', WALLET_SERVICE, WSDL_CONTENT);

server.listen(PORT, () => {
  console.log(`Servidor SOAP escuchando en ${soapServerUrl}`);
});
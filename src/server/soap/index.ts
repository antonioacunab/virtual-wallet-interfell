import type {
              IncomingMessage,
              Server,
              ServerResponse,
            } from "http";

import fs   from "fs";
import http from "http";
import path from "path";

import { listen } from "soap";

import { CUSTOMER_SERVICE } from "./customer";
import { WALLET_SERVICE   } from "./wallet";

/**
 * Path to the file containing the WSDL for the customer service
 */
const PATH_TO_CUSTOMER_WSDL: string = path.join(__dirname, "./customer/service.wsdl");

/**
 * Path to the file containing the WSDL for the wallet service
 */
const PATH_TO_WALLET_WSDL: string = path.join(__dirname, "./wallet/service.wsdl");

/**
 * Content of the customer WSDL file
 */
const CUSTOMER_WSDL_CONTENT: string = fs.readFileSync(PATH_TO_CUSTOMER_WSDL, "utf-8");

/**
 * Content of the wallet WSDL file
 */
const WALLET_WSDL_CONTENT: string = fs.readFileSync(PATH_TO_WALLET_WSDL, "utf-8");

/**
 * Port where the server will be listening
 */
const PORT: string | number = process.env.SOAP_PORT || 8000;

/**
 * HTTP Server that will receive the requests
 */
const SERVER: Server = http.createServer(
    (_request: IncomingMessage, response: ServerResponse) => response.end("Server is running")
);

SERVER.listen(PORT, () => {
    const soapServerUrl = `http://localhost:${PORT}/`;

    console.log(`SOAP server listening on: ${soapServerUrl}`);

    // Start the SOAP servers to listen at the paths /customers and /wallet
    listen(SERVER, '/customers', CUSTOMER_SERVICE, CUSTOMER_WSDL_CONTENT);
    listen(SERVER, '/wallet', WALLET_SERVICE, WALLET_WSDL_CONTENT);
});
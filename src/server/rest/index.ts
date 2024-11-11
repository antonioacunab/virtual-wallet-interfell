import type { Express } from "express";

import express from "express";

import { CUSTOMER_ROUTER } from "./customer";
import { WALLET_ROUTER   } from "./wallet";

const app: Express = express();

app.use(express.json());
app.use(express.text());

app.use("/customers", CUSTOMER_ROUTER);
app.use("/wallet"   , WALLET_ROUTER);

/**
 * Port where the server will be listening
 */
const PORT: string | number = process.env.REST_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on: http://localhost:${PORT}`)
});
import type { Express } from "express";

import express from "express";

import { CUSTOMER_ROUTER } from "./customer";
import { WALLET_ROUTER   } from "./wallet";

const app: Express = express();

app.use(express.json());
app.use(express.text());

app.use("/customers", CUSTOMER_ROUTER);
app.use("/wallet"   , WALLET_ROUTER);

app.listen("3000");
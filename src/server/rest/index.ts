import type { Express } from "express";

import express from "express";

import { CUSTOMERS_ROUTER } from "./routers/customer";

const app: Express = express();

app.use(express.json());
app.use(express.text());

app.use("/customers", CUSTOMERS_ROUTER);

app.listen("3000");
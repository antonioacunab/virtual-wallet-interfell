import type { Router } from "express";

import express from "express";

import {
         depositOnWallet,
         getBalance,
         payPurchase,
         confirmPayment,
       } from "./handler";

export const ROUTER: Router = express.Router();

ROUTER.get("/balance", getBalance);

ROUTER.post("/deposit"    , depositOnWallet);
ROUTER.post("/pay"        , payPurchase);
ROUTER.post("/pay/confirm", confirmPayment);

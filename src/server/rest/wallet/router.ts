import type { Router } from "express";

import express from "express";

import {
         addFunds,
         confirmPayment,
         getBalance,
         payPurchase,
       } from "./handlers";

export const ROUTER: Router = express.Router();

ROUTER.get("/balance", getBalance);

ROUTER.post("/addFunds"   , addFunds);
ROUTER.post("/pay"        , payPurchase);
ROUTER.post("/pay/confirm", confirmPayment);
